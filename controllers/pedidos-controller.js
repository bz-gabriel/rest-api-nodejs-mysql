const mysql = require('../mysql').pool;

exports.GetPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(`SELECT pedidos.id_pedido,
                            pedidos.quantidade,
                            produtos.id_produto,
                            produtos.nome,
                            produtos.preco
                       FROM pedidos
                 INNER JOIN produtos
                         ON produtos.id_produto = pedidos.id_produto;`,
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) };
                const response = {
                    produtos: result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido especifico',
                                url: process.env.URL_API + 'produtos/' + pedido.id_pedido
                            }
                        }
                    })
                };
                res.status(200).send(response);
            }

        );
    });
};

exports.PostPedidos = (req, res, next) => {
    console.log(req.file);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) };
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado'
                    });
                };
                conn.query(
                    'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
                    [req.body.id_produto, req.body.quantidade],
                    (error, result, field) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: error }) };
                        const response = {
                            mensagem: 'Pedido feito com sucesso',
                            produtoCriado: {
                                id_pedido: result.id_pedido,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.quantidade,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos os pedidos',
                                    url: process.env.URL_API + 'pedidos'
                                }
                            }
                        };
                        res.status(201).send(response);
                    }
                );
            }
        );
    });
}

exports.GetUmPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?;',
            [req.params.id_pedido],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) };
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Pedido não encontrado'
                    })
                };
                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: process.env.URL_API + 'pedidos'
                        }
                    }
                };
                res.status(200).send(response);
            }

        );
    });
};

exports.deletePedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            `DELETE FROM pedidos WHERE id_pedido = ?`,
            [req.body.id_pedido],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) };
                const response = {
                    mensagem: 'Pedido removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um novo pedido',
                        url: process.env.URL_API + 'pedidos',
                        body: {
                            "id_produto": "number",
                            "quantidade": "number"
                        }

                    }
                }
                res.status(202).send(response);
            }

        );
    });
};