const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.PostCadastro = (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) };
        conn.query('SELECT * FROM usuarios WHERE email= ?', [req.body.email], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) };
            if (results.length > 0) {
                res.status(409).send({ mensagem: 'Usuário existente' })
            } else {
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) };
                    conn.query(
                        `INSERT INTO usuarios (email, password) values (?,?)`,
                        [req.body.email, hash],
                        (error, results) => {
                            conn.release();
                            if (error) { return res.status(500).send({ error: error }) };
                            response = {
                                mensagem: 'Usuário criado com sucesso',
                                usuarioCriado: {
                                    user_id: results.insertId,
                                    email: req.body.email
                                }
                            }
                            return res.status(201).send(response);
                        }
                    );
                });
            };
        });
    });
};

exports.PostLogin = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        const query = `SELECT * FROM usuarios WHERE email =?`;
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) };
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Unauthorized' });
            };
            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: 'Unauthorized' });
                }
                if (result) {
                    let token = jwt.sign({
                        id_user: results[0].id_user,
                        email: results[0].email
                    },
                        `${process.env.JWT_KEY}`,
                        {
                            expiresIn: "1h"
                        });
                    return res.status(200).send({
                        mensagem: 'Authorized',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Unauthorized' });
            });
        });
    });
};

exports.GetUsuarios = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM usuarios',
            (error, result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) };
                const response = {
                    usuarios: result.map(usuario => {
                        return {
                            user_id: usuario.user_id,
                            email: usuario.email,
                            request: {
                                tipo: 'POST',
                                descricao: 'Adiciona um novo usario',
                                url: 'http://localhost:3000/usuarios/cadastro'
                            }
                        }
                    })

                };
                res.status(201).send(response);
            }
        )
    });
};