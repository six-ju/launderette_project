const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();

router.post('/signup', usersController.signup);
router.post('/login', usersController.login);
router.get('/me', authMiddleware, usersController.me);
router.get('/', authMiddleware, usersController.getUser);
router.put('/', authMiddleware, usersController.updateUser);
router.put('/point', authMiddleware, usersController.updatePoint);
router.delete('/', authMiddleware, usersController.deleteUser);

module.exports = router;
