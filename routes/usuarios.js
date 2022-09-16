const express = require('express');
const multer = require('multer');
const router = express.Router();

const usuariosController = require('../controllers/usuarios-controller');

router.post('/cadastro', usuariosController.PostCadastro);
router.post('/login', usuariosController.PostLogin);
router.get('/', usuariosController.GetUsuarios);

module.exports = router;