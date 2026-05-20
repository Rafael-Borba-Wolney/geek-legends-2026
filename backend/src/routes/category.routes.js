const express = require('express');
const pool = require('../database/connection');
const { autenticarUsuario, autenticarAdmin } = require('../middlewares/auth');

const router = express.Router();

// Lista todas as categorias ativas.
// Essa rota é pública.
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM categorias WHERE status = true ORDER BY nome'
    );

    return res.json(resultado.rows);
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao listar categorias.',
      erro: erro.message
    });
  }
});

// Cria uma nova categoria.
// Apenas administrador pode acessar.
router.post('/', autenticarUsuario, autenticarAdmin, async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        mensagem: 'Nome da categoria é obrigatório.'
      });
    }

    const resultado = await pool.query(
      `INSERT INTO categorias (nome, descricao)
       VALUES ($1, $2)
       RETURNING *`,
      [nome, descricao]
    );

    return res.status(201).json({
      mensagem: 'Categoria criada com sucesso.',
      categoria: resultado.rows[0]
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao criar categoria.',
      erro: erro.message
    });
  }
});

// Atualiza uma categoria.
// Apenas administrador pode acessar.
router.put('/:id', autenticarUsuario, autenticarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, status } = req.body;

    const resultado = await pool.query(
      `UPDATE categorias
       SET nome = $1, descricao = $2, status = $3
       WHERE id = $4
       RETURNING *`,
      [nome, descricao, status, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Categoria não encontrada.'
      });
    }

    return res.json({
      mensagem: 'Categoria atualizada com sucesso.',
      categoria: resultado.rows[0]
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao atualizar categoria.',
      erro: erro.message
    });
  }
});

// Exclui uma categoria.
// Apenas administrador pode acessar.
router.delete('/:id', autenticarUsuario, autenticarAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM categorias WHERE id = $1',
      [id]
    );

    return res.json({
      mensagem: 'Categoria excluída com sucesso.'
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao excluir categoria.',
      erro: erro.message
    });
  }
});

module.exports = router;