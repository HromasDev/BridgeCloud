const User = require('../models/User');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const vk = require('../bot')
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;


class AuthController {
    async register(req, res) {
        try {
            const { login, password } = req.body;

            const existingUser = await User.findOne({ login });

            if (existingUser) {
                return res.status(409).json({ message: `Пользователь с логином ${login} уже существует` });
            }

            if (!password || password.length < 3 || password.length > 12) {
                return res.status(400).json({ message: 'Пароль должен быть не меньше 3 и не больше 12 символов' });
            }

            const hashPassword = await bcrypt.hash(password, 8);
            const user = new User({
                login,
                name: login,
                password: hashPassword,
                role: "user",
                created_at: new Date().toISOString()
            });

            await user.save();
            res.status(201).json({ message: 'Пользователь был создан' });

        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' });
        }
    }

    async login(req, res) {
        try {
            const { login, password } = req.body;

            const user = await User.findOne({ login });

            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(404).json({ message: "Неверный логин или пароль" });
            }

            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });

            res.json({
                token,
                user: {
                    id: user.id,
                    login: user.login,
                    name: user.name,
                    photo: user.photo,
                    vk_id: user.vk_id,
                    role: user.role
                }
            });

        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' });
        }
    }

    async vk_auth(req, res) {
        try {
            const code = req.query.code;

            if (!code) {
                return res.status(400).send({ message: 'Authorization code not provided' });
            }

            const clientId = process.env.VK_CLIENT_ID;
            const clientSecret = process.env.VK_CLIENT_SECRET;
            const redirectUri = `${process.env.SERVER_URL}/api/auth/vk-auth`;

            const tokenResponse = await fetch(`https://oauth.vk.com/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`);
            const tokenData = await tokenResponse.json();

            if (tokenData.error) {
                return res.status(400).send({ message: 'Error exchanging code for access token', error: tokenData.error });
            }

            const { access_token, user_id } = tokenData;

            const userData = await vk.api.users.get({
                user_ids: user_id,
                fields: ['first_name', 'last_name', 'photo_100'],
                access_token
            });

            const { first_name, last_name, photo_100 } = userData[0];

            let existingUser = await User.findOne({ login: user_id });

            let token;

            if (existingUser) {
                token = jwt.sign({ id: existingUser.id }, secretKey, { expiresIn: "1h" });
            } else {
                // Генерация случайного пароля
                const randomPassword = crypto.randomBytes(8).toString('hex'); // Генерация 16-символьного пароля
                const hashPassword = await bcrypt.hash(randomPassword, 8); // Хеширование пароля

                const newUser = new User({
                    login: user_id,
                    name: `${first_name} ${last_name}`,
                    photo: photo_100,
                    vk_id: user_id,
                    role: 'user',
                    password: hashPassword, // Сохраняем хешированный пароль
                    created_at: new Date().toISOString()
                });

                await newUser.save();

                // Генерация токена для нового пользователя
                token = jwt.sign({ id: newUser.id }, secretKey, { expiresIn: "1h" });
            }

            const redirectUrl = `${process.env.CLIENT_URL}?token=${token}`;
            res.redirect(redirectUrl); // Перенаправление на фронтенд
        } catch (error) {
            console.log('Ошибка при авторизации через VK:', error);
            res.status(500).send({ message: 'Server error' });
        }
    }


    async auth(req, res) {
        try {
            const user = await User.findOne({ _id: req.user.id });
            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });

            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    login: user.login,
                    photo: user.photo,
                    vk_id: user.vk_id,
                    role: user.role
                }
            });
        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' });
        }
    }
}

module.exports = new AuthController();
