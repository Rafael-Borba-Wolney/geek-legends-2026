const express = require('express');
const pool = require('../database/connection');
const { autenticarUsuario } = require('../middlewares/auth');

const router = express.Router();

// Finaliza o pedido com base nos itens do carrinho
router.post('/checkout', autenticarUsuario, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // Busca o carrinho do usuário logado
    const carrinhoResultado = await pool.query(
      'SELECT * FROM carrinhos WHERE usuario_id = $1',
      [usuarioId]
    );

    if (carrinhoResultado.rows.length === 0) {
      return res.status(400).json({
        mensagem: 'Carrinho vazio.'
      });
    }

    const carrinhoId = carrinhoResultado.rows[0].id;

    // Busca os itens do carrinho
    const itensResultado = await pool.query(
      `SELECT 
        itens_carrinho.*,
        produtos.preco,
        produtos.estoque
       FROM itens_carrinho
       INNER JOIN produtos ON produtos.id = itens_carrinho.produto_id
       WHERE carrinho_id = $1`,
      [carrinhoId]
    );

    const itens = itensResultado.rows;

    if (itens.length === 0) {
      return res.status(400).json({
        mensagem: 'Carrinho vazio.'
      });
    }

    // Calcula o valor total do pedido
    const valorTotal = itens.reduce((total, item) => {
      return total + Number(item.subtotal);
    }, 0);

    // Cria o pedido
    const pedidoResultado = await pool.query(
      `INSERT INTO pedidos (usuario_id, valor_total)
       VALUES ($1, $2)
       RETURNING *`,
      [usuarioId, valorTotal]
    );

    const pedido = pedidoResultado.rows[0];

    // Cria os itens do pedido e diminui o estoque
    for (const item of itens) {
      await pool.query(
        `INSERT INTO itens_pedido
         (pedido_id, produto_id, quantidade, preco_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          pedido.id,
          item.produto_id,
          item.quantidade,
          item.preco,
          item.subtotal
        ]
      );

      await pool.query(
        `UPDATE produtos
         SET estoque = estoque - $1
         WHERE id = $2`,
        [item.quantidade, item.produto_id]
      );
    }

    // Limpa o carrinho depois de finalizar o pedido
    await pool.query(
      'DELETE FROM itens_carrinho WHERE carrinho_id = $1',
      [carrinhoId]
    );

    return res.status(201).json({
      mensagem: 'Pedido finalizado com sucesso.',
      pedido
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao finalizar pedido.',
      erro: erro.message
    });
  }
});

// Lista os pedidos do usuário logado
router.get('/my-orders', autenticarUsuario, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const resultado = await pool.query(
      `SELECT * FROM pedidos
       WHERE usuario_id = $1
       ORDER BY data_pedido DESC`,
      [usuarioId]
    );

    return res.json(resultado.rows);
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao listar pedidos.',
      erro: erro.message
    });
  }
});

module.exports = router;