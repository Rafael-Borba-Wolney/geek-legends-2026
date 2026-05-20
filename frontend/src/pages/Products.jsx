import { useEffect, useState } from 'react';
import api from '../services/api';

function Products() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');

  async function carregarProdutos() {
    try {
      let url = `/products?busca=${busca}`;

      if (categoria) {
        url += `&categoria=${categoria}`;
      }

      const resposta = await api.get(url);
      setProdutos(resposta.data);
    } catch (erro) {
      alert('Erro ao carregar produtos.');
    }
  }

  async function carregarCategorias() {
    try {
      const resposta = await api.get('/categories');
      setCategorias(resposta.data);
    } catch (erro) {
      alert('Erro ao carregar categorias.');
    }
  }

  async function adicionarCarrinho(produtoId) {
    try {
      await api.post('/cart/add', {
        produto_id: produtoId,
        quantidade: 1
      });

      alert('Produto adicionado ao carrinho!');
    } catch (erro) {
      alert('Faça login para adicionar produtos ao carrinho.');
    }
  }

  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
  }, []);

  return (
    <main className="container">
      <h1>Nossos Produtos</h1>
      <p>Explore nossa coleção completa de produtos geek.</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Todas as categorias</option>

          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>

        <button onClick={carregarProdutos}>Buscar</button>
      </div>

      <div className="product-grid">
        {produtos.map((produto) => (
          <div className="product-card" key={produto.id}>
            <img src={produto.imagem} alt={produto.nome} />

            <div className="product-info">
              <small>{produto.categoria_nome}</small>

              <h3>{produto.nome}</h3>

              <p>{produto.descricao}</p>

              <strong>
                R$ {Number(produto.preco).toFixed(2)}
              </strong>

              <button onClick={() => adicionarCarrinho(produto.id)}>
                🛒 Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Products;