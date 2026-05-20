// Importa o Express para criar as rotas
const express = require('express');

// Importa o bcrypt para criptografar e comparar senhas
const bcrypt = require('bcryptjs');

// Importa o jsonwebtoken para criar o token de login
const jwt = require('jsonwebtoken');

// Importa a conexão com o banco PostgreSQL
const pool = require('../database/connection');

const router = express.Router();

// Rota de cadastro de usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se todos os campos foram enviados
    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: 'Nome, e-mail e senha são obrigatórios.'
      });
    }

    // Verifica se o e-mail já está cadastrado
    const usuarioExiste = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({
        mensagem: 'Este e-mail já está cadastrado.'
      });
    }

    // Criptografa a senha antes de salvar no banco
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Insere o usuário no banco de dados
    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, email, senha)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email, perfil`,
      [nome, email, senhaCriptografada]
    );

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: resultado.rows[0]
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao cadastrar usuário.',
      erro: erro.message
    });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se e-mail e senha foram enviados
    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'E-mail e senha são obrigatórios.'
      });
    }

    // Busca o usuário pelo e-mail
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado.'
      });
    }

    const usuario = resultado.rows[0];

    // Compara a senha digitada com a senha criptografada
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: 'Senha incorreta.'
      });
    }

    // Cria o token de autenticação
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao realizar login.',
      erro: erro.message
    });
  }
});

module.exports = router;