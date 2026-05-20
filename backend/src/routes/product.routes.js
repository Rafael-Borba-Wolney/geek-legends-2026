const express = require('express');
const pool = require('../database/connection');
const { autenticarUsuario, autenticarAdmin } = require('../middlewares/auth');

const router = express.Router();

// Lista produtos.
// Permite busca por nome e filtro por categoria.
router.get('/', async (req, res) => {
  try {
    const { busca, categoria } = req.query;

    let sql = `
      SELECT 
        produtos.id,
        produtos.nome,
        produtos.descricao,
        produtos.preco,
        produtos.estoque,
        produtos.imagem,
        produtos.status,
        produtos.categoria_id,
        categorias.nome AS categoria_nome
      FROM produtos
      LEFT JOIN categorias ON categorias.id = produtos.categoria_id
      WHERE produtos.status = true
    `;

    const valores = [];

    if (busca) {
      valores.push(`%${busca}%`);
      sql += ` AND produtos.nome ILIKE $${valores.length}`;
    }

    if (categoria) {
      valores.push(categoria);
      sql += ` AND produtos.categoria_id = $${valores.length}`;
    }

    sql += ' ORDER BY produtos.id DESC';

    const resultado = await pool.query(sql, valores);

    return res.json(resultado.rows);
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao listar produtos.',
      erro: erro.message
    });
  }
});

// Busca um produto pelo ID.
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `SELECT 
        produtos.*,
        categorias.nome AS categoria_nome
       FROM produtos
       LEFT JOIN categorias ON categorias.id = produtos.categoria_id
       WHERE produtos.id = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado.'
      });
    }

    return res.json(resultado.rows[0]);
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao buscar produto.',
      erro: erro.message
    });
  }
});

// Cria produto.
// Apenas administrador pode acessar.
router.post('/', autenticarUsuario, autenticarAdmin, async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, imagem, categoria_id } = req.body;

    if (!nome || !preco || estoque === undefined) {
      return res.status(400).json({
        mensagem: 'Nome, preço e estoque são obrigatórios.'
      });
    }

    const resultado = await pool.query(
      `INSERT INTO produtos (nome, descricao, preco, estoque, imagem, categoria_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nome, descricao, preco, estoque, imagem, categoria_id]
    );

    return res.status(201).json({
      mensagem: 'Produto criado com sucesso.',
      produto: resultado.rows[0]
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao criar produto.',
      erro: erro.message
    });
  }
});

// Atualiza produto.
// Apenas administrador pode acessar.
router.put('/:id', autenticarUsuario, autenticarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, imagem, categoria_id, status } = req.body;

    const resultado = await pool.query(
      `UPDATE produtos
       SET nome = $1,
           descricao = $2,
           preco = $3,
           estoque = $4,
           imagem = $5,
           categoria_id = $6,
           status = $7
       WHERE id = $8
       RETURNING *`,
      [nome, descricao, preco, estoque, imagem, categoria_id, status, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado.'
      });
    }

    return res.json({
      mensagem: 'Produto atualizado com sucesso.',
      produto: resultado.rows[0]
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao atualizar produto.',
      erro: erro.message
    });
  }
});

// Exclui produto.
// Apenas administrador pode acessar.
router.delete('/:id', autenticarUsuario, autenticarAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM produtos WHERE id = $1',
      [id]
    );

    return res.json({
      mensagem: 'Produto excluído com sucesso.'
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao excluir produto.',
      erro: erro.message
    });
  }
});

module.exports = router;