const Router = require('express');
const router = new Router();
const profileController = require('../controller/profile.controller');
const authMiddleware = require('../middleware/auth.middleware')
const uploadFile = require('../middleware/upload.middleware');

router.post('/:id/change-name', authMiddleware, profileController.changeName);
router.post('/:id/change-photo', authMiddleware, uploadFile.single('avatar'), profileController.changePhoto);
router.post('/:id/change-settings', authMiddleware, profileController.changePhoto);

module.exports = router