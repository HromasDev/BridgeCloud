const express = require("express");
const session = require("express-session");
const fs = require("fs-extra");
const crypto = require("crypto");
const { VK } = require("vk-io");
const { Upload } = require("vk-io");
const path = require("path");
const chokidar = require("chokidar");
var multer = require("multer");
const async = require("async");
var mysql = require('mysql');
const generatePassword = require("password-generator");
const bodyParser = require('body-parser');
const useragent = require('useragent');
require('dotenv').config();

var db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

const target_id = process.env.TARGET_ID;

const MD5 = function (d) { var r = M(V(Y(X(d), 8 * d.length))); return r.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0; for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ }

db.connect((err) => {
  if (err) throw err;
  console.log('Подключено к базе данных');
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = path.join(
      "userdata",
      "uploads",
      String(req.session.authData.user_id)
    );
    fs.mkdirSync(dir, { recursive: true }); // создает директорию, если она не существует
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, file.originalname); // сохраняет файл с оригинальным именем
  },
});

var uploadFile = multer({ storage: storage });

async function getFiles(user_id) {
  const results = await new Promise((resolve, reject) => {
    db.query('SELECT * FROM files WHERE user_id = ?', [user_id], function (error, results) {
      if (error) reject(error);
      else resolve(results);
    });
  });

  const docs = [];
  for (let result of results) {
    const { items } = await vk.api.messages.getByConversationMessageId({
      peer_id: target_id,
      conversation_message_ids: result.file_id,
    });

    const botAttachments = items.filter((item) => item.from_id < 0);

    botAttachments.forEach((attachment, index) => {
      const doc = attachment.attachments[index].doc;
      doc["msgId"] = attachment.conversation_message_id;
      doc["path"] = result.path;

      docs.push(doc);
    });
  }

  console.log(`Пользователь ${user_id} получил файлы: ${docs}`);
  return docs;

}

async function saveFiles(id, w, filePath) {
  const chatInfo = await getFiles(id);
  if (chatInfo) { // проверка, что chatInfo не undefined или null
    const chatInfoStr = JSON.stringify(chatInfo, null, 2);
    if (w) {
      fs.writeFileSync(filePath, chatInfoStr, {
        flag: "w",
      });
    } else {
      fs.writeFileSync(filePath, chatInfoStr);
    }
  } else {
    console.error(`getFiles returned undefined or null for user_id: ${id}`);
  }
}


function tempClear(folderPath) {
  // Проверяем, существует ли каталог
  if (!fs.existsSync(folderPath)) {
    // Если каталог не существует, создаем его
    fs.mkdirSync(folderPath, { recursive: true });
    return;
  }

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
    process.env.TOKEN,
});

// настрйка сессий приложения
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

// включение парсинга JSON
app.use(express.json());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// найстройка ejs в качестве движка
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(3000, () => {
  console.log("Сервер Express запущен на порту 3000");
  startBot();
});

// создаем экземпляр Upload
const upload = new Upload({
  api: vk.api,
  uploadTimeout: 1800000,
})

async function startBot() {
  console.log("Бот запущен!");

  tempClear("./userdata/unloads/");
  tempClear("./userdata/sessions/");
  tempClear("./userdata/uploads/");

  app.get("/", (req, res) => {
    const data = req.session.authData;

    if (data) {
      if (data.accepted) {
        res.redirect("/my-drive");
      } else res.render("2fa");
    } else res.render("auth");

  });

  app.get("/register", (req, res) => {
    const data = req.session.authData;

    if (data && data.accepted) {
      res.redirect("/my-drive");
    } else res.render("register");
  });

  app.post("/check-verification", async (req, res) => {
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT verified FROM users WHERE id = ?', [req.session.authData.user_id], function (error, results) {
        if (error) reject(error);
        else resolve(results);
      });
    });

    req.session.authData.verified = results[0].verified
    res.redirect("/settings");
  })

  app.post("/update-password", async (req, res) => {
    if (!req.body || !req.body.old_password || !req.body.new_password) {
      res.json({ success: false, error: 'Нет данных для обновления пароля' });
      return;
    }

    if (req.body.new_password.length < 6) {
      res.json({ success: false, error: 'Пароль должен содержать не менее 6 символов' });
      return;
    }

    try {
      const results = await new Promise((resolve, reject) => {
        db.query('SELECT login, password FROM users WHERE id = ? AND login = ? LIMIT 1', [req.session.authData.user_id, req.body.login], function (error, results) {
          if (error) reject(error);
          else resolve(results);
        });
      });

      if (results.length > 0) {
        if (results[0].password !== MD5(req.body.old_password)) {
          res.json({ success: false, error: 'Неверный пароль' });
          return;
        }
        else {
          db.query('UPDATE users SET password = ? WHERE id = ?', [MD5(req.body.new_password), req.session.authData.user_id]);
          res.json({ success: true, message: 'Пароль обновлен' });
          return;
        }
      } else {
        res.json({ success: false, error: 'Неверный логин' });
        return;
      }
    } catch (error) {
      console.error(error);
      res.json({ success: false, error: 'Ошибка обновления пароля' });
    }
  })

  app.post('/update-username', async (req, res) => {
    if (!req.body || !req.session.authData) {
      return res.status(400).json({ error: 'No username or userId provided' });
    }

    const { username } = req.body;
    req.session.authData.name = username;

    db.query('UPDATE users SET name = ? WHERE id = ?', [username, req.session.authData.user_id]);
    db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [req.session.authData.user_id, 'Пользователь изменил имя', username]);

    return res.status(200).json({ success: true });
  })

  // Обработчик POST запроса
  app.post('/update-photo', async (req, res) => {
    if (!req.body || !req.body.photo || !req.session.authData || !req.session.authData.user_id) {
      return res.status(400).json({ error: 'No photo or userId provided' });
    }

    const { photo } = req.body;
    const userId = req.session.authData.user_id;

    // Извлекаем данные файла из Data URL
    const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Buffer.from(base64Data, 'base64');

    // Путь для сохранения файла
    const filePath = `userdata/photos/${userId}.jpg`;

    const photosDir = path.dirname(filePath);
    fs.mkdir(photosDir, { recursive: true }, (err) => {
      if (err && err.code !== 'EEXIST') {
        console.error('Error creating photos directory:', err);
        return res.status(500).json({ error: 'Error creating photos directory' });
      }

      // Сохраняем файл на сервере
      fs.writeFile(filePath, binaryData, async (err) => {
        if (err) {
          console.error('Error saving photo:', err);
          return res.status(500).json({ error: 'Error saving photo' });
        }

        // Загружаем файл на сервер VK
        const document = await upload.messageDocument({
          source: {
            value: fs.createReadStream(filePath),
            filename: path.basename(filePath),
          },
          peer_id: target_id,
        });

        // Отправляем файл пользователю
        let sendFile = await vk.api.messages.send({
          user_id: target_id,
          attachment: `doc${document.ownerId}_${document.id}`,
          random_id: Math.random(),
        });

        let messageInfo = await vk.api.messages.getById({ message_ids: sendFile });
        const photo_url = messageInfo.items[0].attachments[0].doc.url;

        // Обновляем фото в базе данных
        db.query('UPDATE users SET photo = ? WHERE id = ?', [photo_url, userId]);
        db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [userId, 'Пользователь изменил фото', photo_url]);

        req.session.authData.photo = photo_url;

        // Удаляем файл после отправки
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting photo file:', err);
          }
        });

        res.json({ message: 'Photo saved successfully', photo: photo_url });
      });
    });
  });

  const sendAuthNotification = async (vk_id, userId, sourceIp, sourseAgent) => {
    const resultAgent = await new Promise((resolve, reject) => {
      db.query('SELECT result FROM `logs` WHERE user_id = ? AND activity = "Пользователь авторизовался" ORDER BY id DESC LIMIT 1', [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]?.result);
      });
    });

    if (resultAgent == sourseAgent) return;
    else {
      const agent = useragent.parse(sourseAgent);
      const os = agent.os.toString();
      const browser = agent.toAgent();
      const userAgent = `${os}, ${browser}`

      vk.api.messages.send({
        user_id: vk_id,
        message: `
        Ваша учетная запись авторизована с нового устройства.

        Если вы этого не делали:
        1.	Войдите в аккаунт.
        2.	Измените пароль, чтобы обезопасить аккаунт.

        Устройство: ${userAgent}\n IP: ${sourceIp}`,
        random_id: Math.random()
      });
    };
  }

  app.post("/send-code", async (req, res) => {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;

    if (req.body.code === req.session.authData.code) {
      req.session.authData.accepted = true;

      if (req.session.authData.settings[0].auth_notify == 1) {
        await sendAuthNotification(req.session.authData.vk_id, req.session.authData.user_id, ipAddress, userAgent);
        req.session.authData.accepted = true;
      }
      db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [req.session.authData.user_id, 'Пользователь авторизовался', userAgent]);

      res.json({ success: true });
    } else {
      res.json({ error: "Неверный код" });
    }
  })

app.post("/vk-auth", async (req, res) => {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;

    const getSettings = async () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user_settings WHERE user_id = ?', [req.session.authData.user_id], function (error, results) {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    }

    const addSessionData = async (data) => {
      req.session.authData = {
        user_id: data.id,
        vk_id: data.vk_id,
        login: data.login,
        name: data.name,
        photo: data.photo,
        verified: data.verified,
        isAdmin: data.isAdmin,
        accepted: true
      };
    }

    req.body.login = generatePassword(24, false);
    req.body.password = generatePassword(6, false);

    const results = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE vk_id = ?', [req.body.id], function (error, results) {
        if (error) reject(error);
        else resolve(results);
      });
    });

    if (results.length > 0) {
      await addSessionData(results[0]);

      const settings = await getSettings();
      console.log(settings)
      if (settings.length > 0) {
        if (settings[0].auth_notify == 1) {
          await sendAuthNotification(results[0].vk_id, results[0].id, ipAddress, userAgent);
        }
        req.session.authData.settings = settings;
      }
      db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [results[0].id, 'Пользователь авторизовался', userAgent]);
    }

    else {
      const user = await vk.api.users.get({
        user_ids: req.body.id,
        fields: 'photo_100'
      })
      const name = req.body.first_name + ' ' + req.body.last_name;
      await new Promise((resolve, reject) => {
        db.query('INSERT INTO users (login, password, name, photo, vk_id) VALUES (?, ?, ?, ?, ?)', [req.body.login, MD5(req.body.password), name, user[0].photo_100, req.body.id], function (error, results) {
          if (error) {
            console.error("Произошла ошибка при выполнении запроса INSERT INTO:", error);
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      const results = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE vk_id = ?', [req.body.id], function (error, results) {
          if (error) reject(error);
          else resolve(results);
        });
      });

      console.log(`Пользователь ${results[0].id} успешно зарегистрирован по VK ID.`);

      const userAgent = req.headers['user-agent'];
      db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [results[0].id, 'Пользователь зарегистрировался', userAgent]);
      addSessionData(results[0]);
      req.session.authData.settings = await getSettings();
    }
    res.redirect('/')

  })

  app.post("/auth", async (req, res) => {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;

      const getSettings = async () => {
        return new Promise((resolve, reject) => {
          db.query('SELECT * FROM user_settings WHERE user_id = ?', [req.session.authData.user_id], function (error, results) {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        });
      }

      const addSessionData = (data) => {
        req.session.authData = {
          user_id: data.id,
          login: data.login,
          name: data.name,
          photo: data.photo,
          verified: data.verified,
          isAdmin: data.isAdmin
        };
      }

      const settingsHandler = async (data) => {
        const settings = await getSettings();
        req.session.authData.settings = settings;
        req.session.authData.vk_id = data.vk_id;
        if (settings.length > 0) {
          if (settings[0]['2fa'] === 1) {
            const code = generatePassword(6, false).toUpperCase();

            vk.api.messages.send({
              user_id: data.vk_id,
              message: `Ваш код 2FA: ${code}\n\nПожалуйста, введите его в приложении.`,
              random_id: Math.random()
            })

            req.session.authData.code = code
          } else {
            if (settings[0].auth_notify == 1) {
              await sendAuthNotification(data.vk_id, data.id, ipAddress, userAgent);
            }
            db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [results[0].id, 'Пользователь авторизовался', userAgent]);
            req.session.authData.accepted = true;
          }
        } else {
          db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [results[0].id, 'Пользователь авторизовался', userAgent]);
          req.session.authData.accepted = true;
        }
      }

      const results = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE login = ? AND password = ?', [req.body.login, MD5(req.body.password)], function (error, results) {
          if (error) reject(error);
          else resolve(results);
        });
      });
      if (results.length > 0) {

        addSessionData(results[0]);
        await settingsHandler(results[0]);

        res.json({ success: true });
      } else {
        res.json({ error: "Неверный логин или пароль" });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  app.post("/vk-add", async (req, res) => {
    const data = req.session.authData;

    if (!data) {
      res.send({ error: 'Ошибка аутентификации' });
      return;
    }

    const userFind = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id = ?', [data.user_id], function (error, results) {
        if (error) reject(error);
        else resolve(results);
      });
    })

    if (userFind.length === 0) {
      res.send({ error: 'Пользователь не найден' });
      return;
    }

    if (userFind[0].vk_id !== null) {
      res.send({ error: 'VK ID уже связан с этим аккаунтом' });
      return;
    }

    const result = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE vk_id = ?', [req.body.id], function (error, results) {
        if (error) reject(error);
        else resolve(results);
      });
    })

    if (result.length > 0) {
      res.send({ error: 'Этот VK ID уже зарегистрирован' });
      return;
    }

    const info = await vk.api.users.get({
      user_ids: req.body.id,
      fields: 'photo_100'
    })

    const name = req.body.first_name + ' ' + req.body.last_name;

    db.query('UPDATE users SET vk_id = ?, photo = ?, name = ? WHERE id = ?', [req.body.id, info[0].photo_100, name, data.user_id]);
    db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [data.user_id, 'Пользователь привязал VK ID', req.body.id]);

    req.session.authData.name = name;
    req.session.authData.vk_id = req.body.id;
    req.session.authData.photo = info[0].photo_100;

    res.send({ success: true });
  })


  app.post("/reg", async (req, res) => {
    try {
      const checkIfExists = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE login = ?', [req.body.login], function (error, results) {
          if (error) reject(error);
          else resolve(results);
        });
      });

      if (checkIfExists.length > 0) {
        res.json({ error: `Логин уже существует!` });
      } else {
        const results = await new Promise((resolve, reject) => {
          db.query('INSERT INTO users (login, password, name, photo) VALUES (?, ?, ?, ?)', [req.body.login, MD5(req.body.password), req.body.login, "./assets/userlogo.png"], function (error, results) {
            if (error) reject(error);
            else resolve(results);
          });
        });
        console.log(`Пользователь успешно зарегистрирован.`);

        const userAgent = req.headers['user-agent'];
        db.query(
          `INSERT INTO logs (user_id, activity, result)
          SELECT id, ?, ? FROM users WHERE login = ?;`,
          ['Пользователь зарегистрировался', userAgent, req.body.login]);
        res.json({ success: true });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/my-drive", async (req, res) => {
    const data = req.session.authData;

    if (data && data.accepted) {
      res.render("drive", { name: data.name, photo: data.photo, dir: req.query, isAdmin: data.isAdmin });
    } else res.redirect("/");
  });

  app.post("/get-users", async (req, res) => {
    const data = req.session.authData;
    if (data && data.isAdmin) {
      const users = await new Promise((resolve, reject) => {
        db.query('SELECT id, vk_id, login, isAdmin FROM users', function (error, results) {
          if (error) reject(error);
          else resolve(results);
        });
      });

      if (users.length > 0) {
        const files = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM files', function (error, results) {
            if (error) reject(error);
            else resolve(results);
          });
        })

        users.forEach((user) => {
          const userfiles = files.filter((file) => file.user_id === user.id);
          user["files"] = userfiles.length;
        });
      }

      res.json(users);
    }
  });

  app.post("/get-logs", async (req, res) => {
    const data = req.session.authData;
    if (data && data.isAdmin) {
      const logs = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM logs', function (error, results) {
          if (error) reject(error);
          else resolve(results);
        });
      });

      if (logs.length > 0) {
        let formattedLogs = await Promise.all(logs.map(async log => {
          const formattedDate = new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).format(new Date(log.date));

          let new_value = "";
          let last_value = "";

          if (log.activity === "Пользователь изменил имя") {
            const lastName_q = await new Promise((resolve, reject) => {
              db.query(`SELECT result FROM logs WHERE user_id = ${log.user_id} AND activity = "Пользователь изменил имя" AND id < ${log.id} ORDER BY id DESC LIMIT 1`, function (error, results) {
                if (error) reject(error);
                else resolve(results);
              });
            });

            if (lastName_q.length > 0) {
              last_value = lastName_q[0].result;
            }

            new_value = log.result;
          }
          else if (log.activity === "Пользователь изменил фото") {
            const lastPhoto_q = await new Promise((resolve, reject) => {
              db.query(`SELECT result FROM logs WHERE user_id = ${log.user_id} AND activity = "Пользователь изменил фото" AND id < ${log.id} ORDER BY id DESC LIMIT 1`, function (error, results) {
                if (error) reject(error);
                else resolve(results);
              });
            });

            if (lastPhoto_q.length > 0) {
              last_value = lastPhoto_q[0].result;
            }

            new_value = log.result;
          }

          return {
            ...log,
            date: formattedDate,
            result: log.activity === "Пользователь изменил имя" || log.activity === "Пользователь изменил фото" ? { last: last_value, new: new_value } : log.result,
          };
        }));

        res.json(formattedLogs);
      }
    }
  });

  app.post("/update-users", async (req, res) => {
    const data = req.session.authData;
    if (data && data.isAdmin) {
      const users = req.body;
      try {
        await Promise.all(users.map(user => {
          return new Promise((resolve, reject) => {
            db.query(
              'UPDATE users SET vk_id = ?, login = ?, isAdmin = ? WHERE id = ?',
              [user.vk_id, user.login, user.isAdmin, user.id],
              (error, results) => {
                if (error) reject(error);
                else resolve(results);
              }
            );
          });
        }));

        res.status(200).json({ message: 'Users updated successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update users' });
      }
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  });

  app.post("/change-permission", async (req, res) => {
    const data = req.session.authData;
    if (data && data.isAdmin) {
      const { id, isAdmin } = req.body;

      try {
        await new Promise((resolve, reject) => {
          db.query(
            'UPDATE users SET isAdmin = ? WHERE id = ?',
            [isAdmin, id],
            (error, results) => {
              if (error) reject(error);
              else resolve(results);
            }
          );
        });

        res.status(200).json({ message: 'User permission updated successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update user permission' });
      }
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  });

  app.get("/admin", async (req, res) => {
    const data = req.session.authData;

    if (data && data.isAdmin) {
      res.render("admin", { name: data.name, photo: data.photo, isAdmin: data.isAdmin });
    } else res.redirect("/");
  });

  app.post("/create-file", async (req, res) => {
    const data = req.session.authData;

    if (data && data.accepted) {
      res.render("create-file", { name: data.name, photo: data.photo, isAdmin: data.isAdmin, file_name: req.body.file_name });
    } else res.redirect("/");
  });

  app.post("/save-file", async (req, res) => {
    const file_name = req.body.file_name;
    const file_content = req.body.file_content;
    const id = req.session.authData.user_id;

    const dir_path = `./userdata/uploads/${id}`;
    const file_path = path.join(dir_path, file_name);

    // Получаем путь к директории файла
    const file_dir_path = path.dirname(file_path);

    try {
      // Проверяем, существует ли директория файла
      if (!fs.existsSync(file_dir_path)) {
        // Если нет, создаем ее
        fs.mkdirSync(file_dir_path, { recursive: true });
      }

      fs.writeFileSync(file_path, file_content);
      await sendFile(id, file_path, file_name);

      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/settings", async (req, res) => {
    const data = req.session.authData;

    if (data && data.accepted) {
      if (data.verified === 1) {
        res.render("full_settings", { name: data.name, photo: data.photo, isAdmin: data.isAdmin });
      } else if (data.vk_id == null) {
        res.render("settings", { name: data.name, photo: data.photo, isAdmin: data.isAdmin });
      } else {
        res.render("notverifed_settings", { name: data.name, photo: data.photo, isAdmin: data.isAdmin });
      }
    } else res.redirect("/");
  });

  app.get("/get-settings", async (req, res) => {
    const settings = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM user_settings WHERE user_id = ?', [req.session.authData.user_id], function (error, results) {
        if (error) reject(error);
        else resolve(results);
      });
    })

    if (settings.length > 0) {
      res.json({ settings: settings[0] });
    } else {
      res.json({ settings: null });
    }
  })

  app.post("/change-settings", async (req, res) => {
    db.query('UPDATE user_settings SET 2fa = ?, remote_control = ?, auth_notify = ? WHERE user_id = ?', [req.body.fa, req.body.remote_control, req.body.auth_notify, req.session.authData.user_id]);
    res.json({ success: true });
  })

  app.get("/logout", async (req, res) => {

    req.session.authData = null;
    res.redirect("/my-drive");
  });

  async function updateData(req) {
    try {
      async function createDirectories() {
        const id = req.authData.user_id;
        const unloadsFile = `./userdata/unloads/${id}.json`;
        if (!fs.existsSync(unloadsFile)) {
          await saveFiles(id, false, unloadsFile);
        } else {
          await saveFiles(id, true, unloadsFile);
        }
      }
      await createDirectories();

      const jsonData = await fs.readFile(`./userdata/unloads/${id}.json`, 'utf-8');
      const data = JSON.parse(jsonData);

    } catch (error) { }
  }

  // Внешняя функция, в которой находится очередь
  const queue = async.queue(async (task, callback) => {
    const { session, authData, file_path, save_path } = task;

    session.files[file_path] = {
      status: "processing",
    };

    try {
      await sendFile(authData.user_id, file_path, save_path);
      await updateData(session);

      session.files[file_path].status = "sent";
    } catch (err) {
      console.error(err);
    } finally {
      delete session.files[file_path];
      callback();
    }
  }, 1);

  app.post("/send-files", uploadFile.array("file"), async (req, res) => {
    req.session.files = {};
    const authData = req.session.authData;
    let save_path = req.body.dir.slice(6);

    if (authData) {
      var watcher = chokidar.watch("userdata/uploads/" + authData.user_id, {
        ignored: /^\./,
        persistent: true,
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          pollInterval: 100,
        },
      });
      watcher.on("add", async (path) => {
        const file = req.files.find(file => file.path === path);
        if (!file) return;

        req.session.files[path] = {
          status: "pending",
        };

        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (req.session.files[path].status !== "pending") return;
        const currentAuthData = req.session.authData;

        if (save_path == "") {
          save_path = file.originalname
        } else {
          save_path = save_path + file.originalname
        }

        queue.push({
          session: req.session,
          authData: currentAuthData,
          file_path: path,
          save_path: save_path
        });
      });
    }
  });


  app.get('/get-data', async (req, res) => {
    try {
      const token = crypto.randomBytes(64).toString('hex');
      async function createDirectories() {
        const id = req.session.authData.user_id;

        const uploadsDir = `./userdata/uploads/${id}`;
        const sessionsFile = `./userdata/sessions/${id}.json`;
        const unloadsFile = `./userdata/unloads/${id}.json`;

        try {
          // Создаем директорию, если она не существует
          await fs.mkdir(path.dirname(uploadsDir), { recursive: true });

          // Пишем/перезаписываем файл
          await fs.writeFile(sessionsFile, JSON.stringify({ ...id, token }, null, 2));

          // Пишем/перезаписываем файл, удаляем старый файл, если он существует
          await fs.unlink(unloadsFile).catch(err => {
            if (err.code !== 'ENOENT') throw err; // Пропускаем ошибку, если файл не существует
          });
          await saveFiles(id, true, unloadsFile);
        } catch (error) {
          console.error('Ошибка при создании директории и записи файла:', error);
        }
      }
      await createDirectories();

      const jsonData = await fs.promises.readFile(`./userdata/unloads/${req.session.authData.user_id}.json`, 'utf-8');
      const data = JSON.parse(jsonData);
      res.json(data);

    } catch (error) {
      console.error('Ошибка чтения файла:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  async function sendFile(user_id, file_path, file_name) {
    try {
      // Проверяем существование файла
      if (!fs.existsSync(file_path)) {
        console.error(`Файл ${file_path} не существует`);
        return;
      }

      // Загружаем файл на сервер VK
      const document = await upload.messageDocument({
        source: {
          value: fs.createReadStream(file_path),
          filename: path.basename(file_path),
        },
        peer_id: target_id,
      });

      // Отправляем файл пользователю
      let sendFile = await vk.api.messages.send({
        user_id: target_id,
        attachment: `doc${document.ownerId}_${document.id}`,
        random_id: Math.random(),
      });

      let messageInfo = await vk.api.messages.getById({ message_ids: sendFile });
      let conversation_id = messageInfo.items[0].conversation_message_id;

      console.log(`Файл ${file_path} успешно отправлен!`);

      db.query('INSERT INTO files (user_id, file_id, path) VALUES (?, ?, ?)', [user_id, conversation_id, file_name], function (error, results) {
        if (error) {
          console.error("Ошибка при сохранении файла в базу данных:", error);
          return;
        }
        db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [user_id, "Пользователь отправил файл", conversation_id]);

        console.log(`Информация о файле ${file_path} успешно сохранена в базу данных!`);
      });

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

  app.post("/delete-file", async (req, res) => {
    await deleteFile(req.session.authData.user_id, req.body.file);
    res.status(200).send({ message: 'File deleted successfully' });
  })

  app.post("/delete-account", async (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.session.authData.user_id]);
    res.redirect('/logout');
  })

  app.post("/delete-user", async (req, res) => {
    const data = req.session.authData;
    if (data && data.isAdmin) {
      const { id } = req.body;

      db.query('DELETE FROM users WHERE id = ?', [id]);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(403).json({ success: false, error: 'Unauthorized' });
    }
  });


  async function deleteFile(user_id, message_ids) {
    try {
      // удаляем файл
      await vk.api.messages.delete({
        peer_id: target_id,
        cmids: message_ids,
        delete_for_all: 1,
      });

      db.query('DELETE FROM files WHERE file_id = ? AND user_id = ?', [message_ids, user_id], function (error, results) {
        if (error) {
          console.error("Ошибка при удалении файла из базы данных:", error);
          return;
        }
        db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [user_id, "Пользователь удалил файл", message_ids]);

        console.log(`Сообщение ${message_ids} успешно удалено!`);
      });
    } catch (error) {
      await vk.api.messages.delete({
        peer_id: target_id,
        cmids: message_ids,
        delete_for_all: 0,
      });

      db.query('DELETE FROM files WHERE file_id = ? AND user_id = ?', [message_ids, user_id], function (error, results) {
        if (error) {
          console.error("Ошибка при удалении файла из базы данных:", error);
          return;
        }
        db.query('INSERT INTO logs (user_id, activity, result) VALUES (?, ?, ?)', [user_id, "Пользователь удалил файл", message_ids]);

        console.log(`Сообщение ${message_ids} было загружено позже лимита, успешно удалено только у бота.`);
      });
    }
  }


  app.get('/your-route', async (req, res) => {
    const watchd = chokidar.watch(`userdata/unloads/${req.session.authData.user_id}.json`);

    watchd.on('change', async (path) => {
      const fileContent = await fs.promises.readFile(`userdata/unloads/${req.session.authData.user_id}.json`, 'utf8');
      const files = JSON.parse(fileContent);
      const newFile = files[files.length - 1]; // предполагая, что новый файл всегда добавляется в конец
      res.json({ message: `File has been changed`, consoleMessage: 'Your console message', content: JSON.stringify(newFile) });
      watchd.close();
    });
  });

  const answers = {
    СБРОС: "Вы вышли со всех устройств ✅.\nНеобходимо авторизоватся заново.",
  };
  vk.updates.on("message", async (msg) => {
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE vk_id = ?', [msg.senderId], function (error, results) {
        if (error) reject(error);
        else resolve(results);
      });
    });

    if (results.length > 0 && results[0].verified === null) {
      db.query('UPDATE users SET verified = 1 WHERE vk_id = ?', [msg.senderId]);
      try {
        db.query(`INSERT INTO user_settings (user_id, 2fa, remote_control, auth_notify) VALUES (${results[0].id}, 0, 0, 1)`);
        msg.send("Здравствуйте! Вы успешно подтвердили аккаунт. \n\nТеперь вам доступны все функции нашего сервиса! 🎉");
      } catch (error) {
        console.error("Ошибка при подтверждении аккаунта:", error);
        msg.send("Ошибка при подтверждении аккаунта. Пожалуйста, попробуйте еще раз.");
      }
    }

    if (msg.text === "СБРОС") {
      try {
        fs.unlink(`./userdata/sessions/${results[0].id}.json`);
      } catch { }
    }

    if (answers[msg.text]) {
      msg.send(answers[msg.text]);
    }
  });
  vk.updates.start().catch(console.error);
}