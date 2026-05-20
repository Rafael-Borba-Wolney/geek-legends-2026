const express = require('express');
const pool = require('../database/connection');
const { autenticarUsuario } = require('../middlewares/auth');

const router = express.Router();

// Lista os itens do carrinho do usuário logado
router.get('/', autenticarUsuario, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const resultado = await pool.query(
      `SELECT 
        itens_carrinho.id,
        itens_carrinho.quantidade,
        itens_carrinho.subtotal,
        produtos.id AS produto_id,
        produtos.nome,
        produtos.preco,
        produtos.imagem
       FROM itens_carrinho
       INNER JOIN carrinhos ON carrinhos.id = itens_carrinho.carrinho_id
       INNER JOIN produtos ON produtos.id = itens_carrinho.produto_id
       WHERE carrinhos.usuario_id = $1`,
      [usuarioId]
    );

    return res.json(resultado.rows);
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao buscar carrinho.',
      erro: erro.message
    });
  }
});

// Adiciona produto ao carrinho
router.post('/add', autenticarUsuario, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { produto_id, quantidade } = req.body;

    if (!produto_id || !quantidade || quantidade <= 0) {
      return res.status(400).json({
        mensagem: 'Produto e quantidade são obrigatórios.'
      });
    }

    const produtoResultado = await pool.query(
      'SELECT * FROM produtos WHERE id = $1 AND status = true',
      [produto_id]
    );

    if (produtoResultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado.'
      });
    }

    const produto = produtoResultado.rows[0];

    if (produto.estoque < quantidade) {
      return res.status(400).json({
        mensagem: 'Estoque insuficiente.'
      });
    }

    let carrinhoResultado = await pool.query(
      'SELECT * FROM carrinhos WHERE usuario_id = $1',
      [usuarioId]
    );

    let carrinhoId;

    if (carrinhoResultado.rows.length === 0) {
      const novoCarrinho = await pool.query(
        'INSERT INTO carrinhos (usuario_id) VALUES ($1) RETURNING id',
        [usuarioId]
      );

      carrinhoId = novoCarrinho.rows[0].id;
    } else {
      carrinhoId = carrinhoResultado.rows[0].id;
    }

    const itemExiste = await pool.query(
      `SELECT * FROM itens_carrinho
       WHERE carrinho_id = $1 AND produto_id = $2`,
      [carrinhoId, produto_id]
    );

    if (itemExiste.rows.length > 0) {
      const itemAtual = itemExiste.rows[0];
      const novaQuantidade = itemAtual.quantidade + quantidade;
      const novoSubtotal = Number(produto.preco) * novaQuantidade;

      const itemAtualizado = await pool.query(
        `UPDATE itens_carrinho
         SET quantidade = $1, subtotal = $2
         WHERE id = $3
         RETURNING *`,
        [novaQuantidade, novoSubtotal, itemAtual.id]
      );

      return res.json({
        mensagem: 'Quantidade atualizada no carrinho.',
        item: itemAtualizado.rows[0]
      });
    }

    const subtotal = Number(produto.preco) * quantidade;

    const itemResultado = await pool.query(
      `INSERT INTO itens_carrinho (carrinho_id, produto_id, quantidade, subtotal)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [carrinhoId, produto_id, quantidade, subtotal]
    );

    return res.status(201).json({
      mensagem: 'Produto adicionado ao carrinho.',
      item: itemResultado.rows[0]
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao adicionar produto ao carrinho.',
      erro: erro.message
    });
  }
});

// Atualiza a quantidade de um item do carrinho
router.put('/item/:id', autenticarUsuario, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade } = req.body;

    if (!quantidade || quantidade <= 0) {
      return res.status(400).json({
        mensagem: 'Quantidade inválida.'
      });
    }

    const itemResultado = await pool.query(
      `SELECT itens_carrinho.*, produtos.preco
       FROM itens_carrinho
       INNER JOIN produtos ON produtos.id = itens_carrinho.produto_id
       WHERE itens_carrinho.id = $1`,
      [id]
    );

    if (itemResultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Item não encontrado.'
      });
    }

    const item = itemResultado.rows[0];
    const subtotal = Number(item.preco) * quantidade;

    const resultado = await pool.query(
      `UPDATE itens_carrinho
       SET quantidade = $1, subtotal = $2
       WHERE id = $3
       RETURNING *`,
      [quantidade, subtotal, id]
    );

    return res.json({
      mensagem: 'Item atualizado com sucesso.',
      item: resultado.rows[0]
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao atualizar item.',
      erro: erro.message
    });
  }
});

// Remove um item do carrinho
router.delete('/item/:id', autenticarUsuario, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM itens_carrinho WHERE id = $1',
      [id]
    );

    return res.json({
      mensagem: 'Item removido do carrinho.'
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao remover item.',
      erro: erro.message
    });
  }
});

module.exports = router;