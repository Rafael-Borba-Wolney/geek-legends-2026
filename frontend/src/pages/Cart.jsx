import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Cart() {
  const [itens, setItens] = useState([]);

  async function carregarCarrinho() {
    try {
      const resposta = await api.get('/cart');
      setItens(resposta.data);
    } catch (erro) {
      setItens([]);
    }
  }

  async function atualizarQuantidade(id, quantidade) {
    try {
      await api.put(`/cart/item/${id}`, {
        quantidade: Number(quantidade)
      });

      carregarCarrinho();
    } catch (erro) {
      alert('Erro ao atualizar quantidade.');
    }
  }

  async function removerItem(id) {
    try {
      await api.delete(`/cart/item/${id}`);
      carregarCarrinho();
    } catch (erro) {
      alert('Erro ao remover item.');
    }
  }

  async function finalizarPedido() {
    try {
      await api.post('/orders/checkout');

      alert('Pedido finalizado com sucesso!');
      carregarCarrinho();
    } catch (erro) {
      alert('Erro ao finalizar pedido. Faça login ou adicione produtos.');
    }
  }

  useEffect(() => {
    carregarCarrinho();
  }, []);

  const total = itens.reduce((soma, item) => {
    return soma + Number(item.subtotal);
  }, 0);

  return (
    <main className="container">
      <h1>Seu Carrinho</h1>

      {itens.length === 0 ? (
        <div className="empty-cart">
          <div className="cart-icon">🛒</div>

          <h2>Seu carrinho está vazio</h2>

          <p>Adicione produtos ao carrinho para finalizar sua compra.</p>

          <Link to="/produtos" className="button">
            Explorar Produtos
          </Link>
        </div>
      ) : (
        <>
          {itens.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.imagem} alt={item.nome} />

              <div>
                <h3>{item.nome}</h3>
                <p>Preço: R$ {Number(item.preco).toFixed(2)}</p>

                <label>Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantidade}
                  onChange={(e) => atualizarQuantidade(item.id, e.target.value)}
                />

                <p>Subtotal: R$ {Number(item.subtotal).toFixed(2)}</p>
              </div>

              <button onClick={() => removerItem(item.id)}>
                Remover
              </button>
            </div>
          ))}

          <div className="cart-total">
            <h2>Total: R$ {total.toFixed(2)}</h2>

            <button onClick={finalizarPedido}>
              Finalizar Pedido
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default Cart;