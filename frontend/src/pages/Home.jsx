import { Link } from 'react-router-dom';

function Home() {
  return (
    <main>
      <section className="hero">
        <h1>
          Produtos <span>Dignos de Lenda</span>
        </h1>

        <p>
          Descubra os melhores produtos geek, tecnologia e cultura nerd.
        </p>

        <div className="hero-buttons">
          <Link to="/produtos" className="button">
            Explorar Produtos
          </Link>

          <Link to="/sobre" className="button secondary">
            Saiba Mais
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Explore por Categoria</h2>
        <p>Encontre produtos das suas franquias e temas favoritos.</p>

        <div className="category-grid">
          <div className="category-card">🎬 <span>Filmes</span></div>
          <div className="category-card">📺 <span>Séries</span></div>
          <div className="category-card">🎮 <span>Jogos</span></div>
          <div className="category-card">⚡ <span>Animes</span></div>
          <div className="category-card">💻 <span>Tecnologia</span></div>
        </div>
      </section>
    </main>
  );
}

export default Home;