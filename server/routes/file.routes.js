const Router = require('express');
const router = new Router();
const fileController = require('../controller/file.controller');
const uploadFile = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');

// Определение маршрутов
router.get('/', authMiddleware, fileController.getFiles);
router.get('/:id', authMiddleware, fileController.getFile);
router.put('/', authMiddleware, fileController.saveFile);
router.post('/', authMiddleware, uploadFile.array("files"), fileController.uploadFiles);
router.delete('/', authMiddleware, fileController.deleteFiles);
router.post('/move', authMiddleware, fileController.moveFiles);
router.post('/rename', authMiddleware, fileController.renameFile);
router.post('/new', authMiddleware, fileController.createFile);

// Экспорт маршрутов
module.exports = router