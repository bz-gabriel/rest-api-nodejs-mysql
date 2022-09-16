const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos-controller');

router.get('/', pedidosController.GetPedidos);
router.post('/', pedidosController.PostPedidos);
router.get('/:id_pedido', pedidosController.GetUmPedido);
router.delete('/', pedidosController.deletePedido);

module.exports = router;