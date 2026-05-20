function About() {
  return (
    <main className="container about-page">
      <h1>
        Sobre a <span>Geek Legends</span>
      </h1>

      <p className="subtitle">
        Sua loja especializada em produtos geek, tecnologia e cultura nerd.
      </p>

      <section className="mission-card">
        <h2>Nossa Missão</h2>

        <p>
          Conectar fãs da cultura geek com os melhores produtos do universo nerd.
          Nossa loja oferece itens inspirados em filmes, séries, jogos, animes e tecnologia.
        </p>
      </section>

      <div className="values-grid">
        <div>
          <h3>⚡ Inovação</h3>
          <p>Produtos criativos e atualizados com as tendências geek.</p>
        </div>

        <div>
          <h3>🛡️ Qualidade</h3>
          <p>Garantia de produtos escolhidos com cuidado.</p>
        </div>

        <div>
          <h3>🚚 Entrega Rápida</h3>
          <p>Processo de compra simples, direto e eficiente.</p>
        </div>

        <div>
          <h3>💜 Paixão</h3>
          <p>Feito por geeks, para geeks.</p>
        </div>
      </div>
    </main>
  );
}

export default About;