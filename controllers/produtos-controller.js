const mysql = require('../mysql').pool;

exports.GetProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM produtos',
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) };
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto especifico',
                                url: process.env.URL_API + 'produtos/' + prod.id_produto
                            }
                        }
                    })
                };
                res.status(200).send(response);
            }

        );
    });
};

exports.PostProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'INSERT INTO produtos (nome, preco, produto_imagem) VALUES (?,?,?)',
            [
                req.body.nome,
                req.body.preco,
                req.file.path
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) };
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: process.env.URL_API + 'produtos'
                        }
                    }
                };
                res.status(201).send(response);
            }
        );
    });
};

exports.PatchProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            `UPDATE produtos
                SET nome            = ?,
                    preco           = ?
                WHERE id_produto    = ?`,
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) };
                if (resultado.length == 0) {
                    res.status(404).send({
                        mensagem: "Produto n??o encontrado"
                    });
                };
                const response = {
                    mensagem: 'Produto alterado com sucesso',
                    produtoAtualizado: {
                        id_produto: req.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produto espec??fico',
                            url: process.env.URL_API + 'produtos/' + req.body.id_produto
                        }
                    }
                }
                res.status(202).send(response);
            }

        );
    });
};

exports.GetUmProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) };
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Produto n??o encontrado'
                    })
                };
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: process.env.URL_API + 'produtos'
                        }
                    }
                };
                res.status(200).send(response);
            }

        );
    });
};

exports.DeleteProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?`,
            [req.body.id_produto],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) };
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: process.env.URL_API + 'produtos',
                        body: {
                            "nome": "String",
                            "preco": "number"
                        }

                    }
                }
                res.status(202).send(response);
            }

        );
    });

}