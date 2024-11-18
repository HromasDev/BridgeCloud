const Router = require('express');
const router = new Router();
const authController = require('../controller/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/vk-auth', authController.vk_auth);
router.get('/auth', authMiddleware, authController.auth);

module.exports = router