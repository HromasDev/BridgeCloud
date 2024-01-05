const express = require("express");
const session = require("express-session");
const fs = require("fs-extra");
const crypto = require("crypto");
const { VK } = require("vk-io");
const { Upload } = require("vk-io");
const path = require("path");
const chokidar = require("chokidar");
const rimraf = require("rimraf");
var multer = require("multer");
const async = require("async");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = path.join(
      "userdata",
      "uploads",
      String(req.session.authData.uid)
    );
    fs.mkdirSync(dir, { recursive: true }); // создает директорию, если она не существует
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // сохраняет файл с оригинальным именем
  },
});

var uploadFile = multer({ storage: storage });

async function getChats() {
  const { items } = await vk.api.messages.getConversations({
    group_id: 222835476,
    extended: 1,
  });
  return await vk.api.users.get({
    user_ids: items.map((item) => item.conversation.peer.id),
    fields: "photo_200",
  });
}

async function getChatInfo(userId) {
  try {
    const { items } = await vk.api.messages.getHistoryAttachments({
      peer_id: userId,
      media_type: "doc",
    });

    const botAttachments = items.filter((item) => item.from_id < 0);
    const docs = [];

    botAttachments.forEach((attachment) => {
      const doc = attachment.attachment.doc;
      doc["msgId"] = attachment.cmid;
      docs.push(doc);
    });

    return docs;
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

async function writeChatInfoToFile(id, w, filePath) {
  const chatInfo = await getChatInfo(id);
  if (w) {
    fs.writeFileSync(filePath, JSON.stringify(chatInfo, null, 2), {
      flag: "w",
    });
  } else {
    fs.writeFileSync(filePath, JSON.stringify(chatInfo, null, 2));
  }
}

function tempClear(folderPath) {
  // Получаем список файлов и папок внутри указанной папки
  const files = fs.readdirSync(folderPath);

  // Проходимся по каждому файлу и папке
  for (const file of files) {
    const filePath = path.join(folderPath, file);

    // Проверяем, является ли текущий элемент файлом
    const isFile = fs.statSync(filePath).isFile();

    if (isFile) {
      // Если это файл, удаляем его
      fs.unlinkSync(filePath);
    } else {
      // Если это папка, рекурсивно вызываем функцию для удаления ее содержимого
      tempClear(filePath);
      // Затем удаляем саму папку
      fs.rmdirSync(filePath, { recursive: true });
    }
  }
}

const app = express();

// токен
const vk = new VK({
  token:
    "vk1.a.uMiMgEUYhk_iKe5Ru7bdUb8lX_BgOyp67DEkjJjVM4-L44GFj7T0kMYoAQR2dEaIqgXuLM-xSEzBkJwy6ZDFwj7RgQpHaJh5GeTlx7A0L2wOoj0hPKcAQoT6iaJ7JLO25eQpiZX8e6Q1Kamc1Z7tNvfpzSltxr0co8NsKbYQk0pSGpb2fq4vrQFpO09DChD1RM8qdxyu1NGtMTRV_ua9PQ",
});

// настрйка сессий приложения
app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

// включение парсинга JSON
app.use(express.json());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// найстройка ejs в качестве движка
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(80, () => {
  console.log("Сервер Express запущен на порту 80");
  startBot();
});

// создаем экземпляр Upload
const upload = new Upload(vk);

async function startBot() {
  console.log("Бот запущен!");

  tempClear("./userdata/unloads/");
  tempClear("./userdata/sessions/");
  tempClear("./userdata/uploads/");

  app.get("/", (req, res) => {
    const data = req.session.authData;

    if (data) {
      res.redirect("/my-drive");
    } else res.render("auth");
  });

  app.post("/auth", async (req, res) => {
    req.session.authData = req.body;

    console.log(
      `Пользователь ${req.session.authData.uid} успешно авторизовался.`
    );

    res.redirect("/my-drive");
  });

  app.get("/my-drive", async (req, res) => {
    const data = req.session.authData;

    if (data) {
      res.render("drive");
    } else res.redirect("/");
  });

  var watcher = chokidar.watch("userdata/uploads", {
    ignored: /^\./,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
  });

  const files = {}; // храним состояние файлов

  app.post("/get-files", uploadFile.array("file"), async (req, res) => {
    // обработка загрузки

    const authData = req.session.authData;

    if (authData) {
      const q = async.queue(async (task, callback) => {
        const { user_id, file_path } = task;

        // блокировка файла
        files[file_path] = {
          status: "processing",
        };

        try {
          await sendFile(user_id, file_path);

          // успешно отправлен
          files[file_path].status = "sent";
        } catch (err) {
          // обработка ошибки
        } finally {
          // очистка статуса
          delete files[file_path];

          callback();
        }
      }, 1);

      watcher.on("add", async (path) => {
        if (files[path]) return; // пропуск если обрабатывается

        files[path] = {
          status: "pending",
        };

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (files[path].status !== "pending") return;

        q.push({
          user_id: authData.uid,
          file_path: path,
        });
      });
    }
  });

  async function sendFile(user_id, file_path, callback) {
    try {
      // Загружаем файл на сервер VK
      const document = await upload.messageDocument({
        source: {
          value: fs.createReadStream(file_path),
          filename: path.basename(file_path),
        },
        peer_id: user_id,
      });

      // Отправляем файл пользователю
      let sendFile = await vk.api.messages.send({
        user_id: user_id,
        attachment: `doc${document.ownerId}_${document.id}`,
        random_id: Math.random(),
      });

      console.log(`Файл ${file_path} успешно отправлен!`);

      // Удаляем файл после отправки
      fs.unlink(file_path, (err) => {
        if (err) {
          console.error("Ошибка при удалении файла:", err);
          return;
        }

        console.log(`Файл ${file_path} успешно удален!`);
      });
    } catch (error) {
      console.error("Ошибка при отправке файла:", error);
    }
  }

  async function deleteFile(user_id, message_ids) {
    try {
      // удаляем файл
      await vk.api.messages.delete({
        peer_id: user_id,
        cmids: message_ids,
        delete_for_all: 0,
      });

      console.log(`Сообщение ${message_ids} успешно удалено!`);
    } catch (error) {
      console.error(`Ошибка при удалении ${message_ids}: `, error);
    }
  }

  //   chokidar
  //     .watch("userdata/unloads/", { ignored: /(^|[\/\\])\../ })
  //     .on("change", (filePath) => {
  //       let data = JSON.parse(fs.readFileSync(filePath));

  //       data.forEach((file, index) => {
  //         if (file.deleted) {
  //           deleteFile(file.owner_id, file.msgId);
  //           data.splice(index, 1);
  //         }
  //       });

  //       fs.writeFileSync(filePath, JSON.stringify(data));
  //     });

  const answers = {
    Начать: "Здравствуйте!",
    СБРОС: "Вы вышли со всех устройств ✅.\nНеобходимо авторизоватся заново.",
  };
  vk.updates.on("message", async (msg) => {
    if (msg.text === "СБРОС") {
      try {
        rimraf.sync(`./userdata/uploads/${msg.senderId}`);
        fs.unlink(`./userdata/unloads/${msg.senderId}.json`);
        fs.unlink(`./userdata/sessions/${msg.senderId}.json`);
      } catch {}
    }

    if (answers[msg.text]) {
      msg.send(answers[msg.text]);
    }
  });
  vk.updates.start().catch(console.error);
}

/* 
Вот некоторые вещи, которые, как я вижу, можно было бы улучшить в этом коде:

1. Обработка ошибок могла бы быть лучше. Существует некоторая обработка ошибок, но она не очень надежна. Любые ошибки должны быть отловлены и должным образом зарегистрированы.
2. Код выполняет большую работу - обрабатывает экспресс-сервер, вызовы VK API, загрузку файлов. Было бы лучше разбить это на отдельные модули / классы, чтобы сделать его более организованным и удобочитаемым.
3. Пути к файлам жестко заданы - было бы лучше сделать их настраиваемыми с помощью переменных окружения или конфигурационных файлов. 
4. Загрузка файлов выполняется синхронно, что может привести к блокировке сервера. Они должны быть перенесены в асинхронные функции.
5. Безопасность - токен доступа VK доступен публично в коде. Этот токен должен храниться в секрете, как и в переменных окружения.
6. Дублирующийся код - существует дублирующийся код для просмотра каталогов на предмет изменений файлов. Это может быть извлечено в функцию повторного использования.
7. Обработка ошибок при файловых операциях отсутствует или ненадежна. Любые ошибки во время чтения/записи/удаления файлов должны быть надлежащим образом обработаны.
8. Сообщения об ошибках могли бы предоставить больше контекста. Вместо того чтобы просто регистрировать ошибку, в сообщениях должно указываться, где произошла ошибка.
9. Проверка типа отсутствует для параметров функции и возвращаемых значений. Это может привести к обнаружению ошибок.
10. Тесты отсутствуют. Модульные / интеграционные тесты помогли бы предотвратить регрессии, если бы код был реорганизован.

Чтобы решить эти проблемы, вот как я бы перестроил его:
1. Создайте отдельные модули для экспресс-сервера, VK API wrapper, утилиты загрузки файлов
2. Добавьте конфигурацию с помощью переменных окружения 
3. Добавьте промежуточное программное обеспечение для обработки ошибок в Express
4. Используйте async/await для неблокирующих файловых операций
5. Абстрагируйте дублирующийся код в утилиты многократного использования
6. Добавьте TypeScript для обеспечения безопасности ввода
7. Добавьте тесты
8. Реорганизовывайте классы там, где это имеет смысл
9. Добавьте проверку, очистку ненадежных входных данных 
10. Добавьте подробное ведение журнала ошибок
*/
