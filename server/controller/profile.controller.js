require('dotenv').config();
const User = require('../models/User');
const vk = require('../bot')
const { upload } = require('../bot')
const fs = require('fs')
const path = require("path");

class ProfileController {
    async changeName(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: `Пользователь с ID ${id} не найден` });
            }
            const updatedUser = await User.findByIdAndUpdate(id, { name: data.name }, { new: true });
            res.status(200).json({
                user: {
                    id: updatedUser.id,
                    login: updatedUser.login,
                    name: updatedUser.name,
                    photo: updatedUser.photo,
                    vk_id: updatedUser.vk_id,
                    role: updatedUser.role
                }
            });
        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' });
        }
    }

    async changePhoto(req, res) {
        try {
            if (!req.file) {
                return res.status(400).send({ message: 'No file uploaded' });
            }

            const fileData = req.file;

            // Загружаем фото
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
                random_id: Date.now(),
            });

            let messageInfo = await vk.api.messages.getById({ message_ids: sendFile });
            const photo_url = messageInfo.items[0].attachments[0].doc.url;

            // Удаляем временный файл
            fs.unlinkSync(fileData.path);

            // Обновляем фото пользователя в базе данных
            const user_id = req.user.id;
            const user = await User.findById(user_id);

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            user.photo = photo_url; // Сохраняем URL фото

            await user.save();

            res.send({ message: 'Profile photo updated successfully', user: {
                id: user.id,
                login: user.login,
                name: user.name,
                photo: user.photo,
                vk_id: user.vk_id,
                role: user.role
            } });
        } catch (error) {
            console.log('Error updating profile photo:', error);
            res.status(500).send({ message: 'Server error' });
        }
    }

}

module.exports = new ProfileController();