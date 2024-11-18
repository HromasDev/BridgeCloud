const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller');
const passwordController = require('../controller/password.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, userController.getUsers)
router.put('/', authMiddleware, userController.setUsers)
router.delete('/', authMiddleware, userController.deleteUser)
router.get('/:id', authMiddleware, userController.getUser)
router.post('/:id/change-password', authMiddleware, passwordController.changePassword);

module.exports = router
