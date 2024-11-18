require('dotenv').config();
const File = require('../models/File');
const vk = require('../bot')
const { upload } = require('../bot')
const fs = require('fs')
const path = require("path");

class FileController {
    async getFiles(req, res) {
        try {
            const user_id = req.user.id;
            const data = await File.find({ user: user_id })

            const files = data.filter(item => item.type === 'file');
            const folders = data.filter(item => item.type === 'folder');

            res.send({ files, folders });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Server error' });
        }

    }

    async getFile(req, res) {
        try {
            const user_id = req.user.id;
            const { id } = req.params;
            const data = await File.findOne({ user: user_id, document_id: id, type: 'file' });

            const { items } = await vk.api.messages.getByConversationMessageId({
                peer_id: process.env.VK_ALT_USERID,
                conversation_message_ids: data.document_id,
            });

            const { url } = items[0].attachments[0].doc;

            try {
                const response = await fetch(url);
                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('text/html')) {
                    return res.status(400).send({ message: 'Invalid file type (HTML)' });
                }

                const text = await response.text();

                const obj = {
                    id: items[0].conversation_message_id,
                    data: text
                };

                res.send(obj);

            } catch (error) {
                console.log('Ошибка при запросе:', error);
                res.status(500).send({ message: 'Error fetching document' });
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Server error' });
        }
    }

    async saveFile(req, res) {
        try {
            const user_id = req.user.id;
            const { document_id, data } = req.body;

            const existingFile = await File.findOne({ user: user_id, document_id });
            if (!existingFile) {
                console.log('Error existingFile file from VK:', existingFile);
                return res.status(404).send({ message: 'File not found' });
            }

            const file_name = existingFile.ext ? existingFile.name : existingFile.name + '.noext';
            const dir_path = path.join('userdata', 'downloads');
            const file_path = path.join(dir_path, file_name);
            if (!fs.existsSync(dir_path)) {
                fs.mkdirSync(dir_path, { recursive: true });
            }

            fs.writeFileSync(file_path, data);

            const newDocument = await upload.messageDocument({
                source: {
                    value: fs.createReadStream(file_path),
                    filename: file_name,
                },
                peer_id: process.env.VK_ALT_USERID,
            });

            const sendFileResponse = await vk.api.messages.send({
                user_id: process.env.VK_ALT_USERID,
                attachment: `doc${newDocument.ownerId}_${newDocument.id}`,
                random_id: Math.random(),
            });

            if (document_id) {
                const deleteResponse = await vk.api.messages.delete({
                    peer_id: process.env.VK_ALT_USERID,
                    cmids: document_id,
                    delete_for_all: 1,
                });

                if (!deleteResponse || deleteResponse.error) {
                    console.log('Error deleting file from VK:', deleteResponse.error);
                    return res.status(500).send({ message: 'Failed to delete the file from VK' });
                }
            }

            let messageInfo = await vk.api.messages.getById({ message_ids: sendFileResponse });
            let newConversationId = messageInfo.items[0].conversation_message_id;

            existingFile.document_id = newConversationId;
            existingFile.url = newDocument.url;
            existingFile.size = data.length;
            await existingFile.save();

            fs.unlinkSync(file_path);

            res.send({ message: 'File updated successfully', file: existingFile });
        } catch (error) {
            console.log('Error updating file:', error);
            res.status(500).send({ message: 'Error updating file' });
        }
    }

    async deleteFiles(req, res) {
        try {
            const user_id = req.user.id;
            const { files } = req.body;

            const fileIdsToDelete = [];
            const documentIdsToDelete = [];

            // Функция для сбора всех файлов и вложенных файлов
            const collectFiles = async (fileId) => {
                const file = await File.findOne({ _id: fileId, user: user_id });
                if (!file) return;

                fileIdsToDelete.push(file._id);

                if (file.type === 'file' && file.document_id) {
                    documentIdsToDelete.push(file.document_id);
                }

                if (file.type === 'folder') {
                    const nestedFiles = await File.find({ folder: fileId, user: user_id });
                    await Promise.all(nestedFiles.map(nestedFile => collectFiles(nestedFile._id)));
                }
            };

            await Promise.all(files.map(fileId => collectFiles(fileId)));

            if (fileIdsToDelete.length === 0) {
                return res.status(400).send({ message: 'Нет файлов для удаления' });
            }

            await File.deleteMany({ _id: { $in: fileIdsToDelete }, user: user_id });

            const deleteVKMessages = async (deleteForAll) => {
                try {
                    await vk.api.messages.delete({
                        peer_id: process.env.VK_ALT_USERID,
                        cmids: documentIdsToDelete.join(','),
                        delete_for_all: deleteForAll,
                    });
                    return true;
                } catch (error) {
                    return false;
                }
            };

            const deletedForAll = await deleteVKMessages(1);

            if (!deletedForAll) {
                const deletedWithoutFlag = await deleteVKMessages(0);
                if (!deletedWithoutFlag) {
                    console.log('Некоторые из файлов не были найдены в VK, но были удалены из базы данных');
                }
            }

            res.send({ message: 'Файлы успешно удалены' });
        } catch (error) {
            console.error('Ошибка при удалении файлов:', error);
            res.status(500).send({ message: 'Внутренняя ошибка сервера' });
        }
    }

    async moveFiles(req, res) {
        try {
            const user_id = req.user.id;
            const { files, folder } = req.body;

            const fileIdsToMove = [];
            const documentIdsToMove = [];

            // Функция для сбора всех файлов и вложенных файлов
            const collectFiles = async (fileId) => {
                const file = await File.findOne({ _id: fileId, user: user_id });
                if (!file) return;

                fileIdsToMove.push(file._id);

                if (file.type === 'file' && file.document_id) {
                    documentIdsToMove.push(file.document_id);
                }

                if (file.type === 'folder') {
                    const nestedFiles = await File.find({ folder: fileId, user: user_id });
                    await Promise.all(nestedFiles.map(nestedFile => collectFiles(nestedFile._id)));
                }
            };

            // Сбор всех файлов для перемещения
            await Promise.all(files.map(fileId => collectFiles(fileId)));

            if (fileIdsToMove.length === 0) {
                return res.status(400).send({ message: 'Нет файлов для перемещения' });
            }

            await File.updateMany({ _id: { $in: fileIdsToMove }, user: user_id }, { folder });

            res.send({ message: 'Файлы успешно перемещены' });
        } catch (error) {
            console.error('Ошибка при перемещении файлов:', error);
            res.status(500).send({ message: 'Внутренняя ошибка сервера' });
        }
    }


    async uploadFiles(req, res) {
        try {
            const user_id = req.user.id;

            const folder = req.body.folder
            // const { vk_id } = await User.findOne({ id });

            const files = req.files;
            const result = [];

            await Promise.all(files.map(async (fileData) => {
                const document = await upload.messageDocument({
                    source: {
                        value: fs.createReadStream(fileData.path),
                        filename: path.basename(fileData.path),
                    },
                    peer_id: process.env.VK_ALT_USERID,
                });

                const sendFile = await vk.api.messages.send({
                    user_id: process.env.VK_ALT_USERID,
                    attachment: `doc${document.ownerId}_${document.id}`,
                    random_id: Math.random(),
                });

                let messageInfo = await vk.api.messages.getById({ message_ids: sendFile });
                let conversation_id = messageInfo.items[0].conversation_message_id;

                fs.unlinkSync(fileData.path);

                const file = new File({
                    user: user_id,
                    name: fileData.originalname,
                    type: 'file',
                    folder: folder,
                    ext: path.extname(fileData.originalname),
                    size: fileData.size,
                    document_id: conversation_id,
                    url: document.url
                })

                const savedFile = await file.save()
                result.push(savedFile)
            }));

            res.send({ message: 'Files upload successfully', files: result });


        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Server error' });
        }
    }



    async createFile(req, res) {
        try {
            const user_id = req.user.id;
            const { name, type, folder } = req.body;

            if (!name || !type) {
                return res.status(400).send({ message: 'Name and type are required' });
            }

            const newFile = new File({
                user: user_id,
                name,
                type,
                folder,
                ext: type === 'folder' ? null : path.extname(name), // Устанавливаем расширение только для файлов
            });

            const savedFile = await newFile.save();

            res.send({ message: 'File created successfully', file: savedFile });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Server error' });
        }
    }

    async renameFile(req, res) {
        try {
            const user_id = req.user.id;
            const { file_id, file_name } = req.body;

            if (!file_id || !file_name) {
                return res.status(400).send({ message: 'file_id and file_name are required' });
            }

            const updatedFile = await File.findOneAndUpdate(
                { _id: file_id, user: user_id },
                { name: file_name, ext: path.extname(file_name) },
                { new: true }
            );

            if (!updatedFile) {
                return res.status(404).send({ message: 'File not found' });
            }

            res.send({ message: 'File renamed successfully', file: updatedFile });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Server error' });
        }
    }

}

module.exports = new FileController();
