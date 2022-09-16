const express = require('express');
const multer = require('multer');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const produtosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname);
    },
});
const upload = multer({ storage: storage });

router.get('/', produtosController.GetProdutos);
router.post('/', login.obrigatorio, upload.single('produto_imagem'), produtosController.PostProduto);
router.get('/:id_produto', produtosController.GetUmProduto);
router.patch('/', login.obrigatorio, produtosController.PatchProduto);
router.delete('/', login.obrigatorio, produtosController.DeleteProduto);

module.exports = router;
