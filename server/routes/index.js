const Router = require('express')
const router = new Router()
const profileRouter = require('./profile.routes')

const authRouter = require('./auth.routes')
const fileRouter = require('./file.routes')
const userRouter = require('./user.routes')

// Статус сервера
router.use('/status', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is online' });
});

// Оснвные маршруты
router.use('/auth', authRouter)
router.use('/file', fileRouter)
router.use('/user', userRouter)
router.use('/profile', profileRouter)

module.exports = router
