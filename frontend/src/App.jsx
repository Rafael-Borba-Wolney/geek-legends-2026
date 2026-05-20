import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import About from './pages/About';

function App() {
  function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    alert('Você saiu do sistema.');
  }

  return (
    <BrowserRouter>
      <header className="header">
        <Link to="/" className="logo">
          <strong>GL</strong>
          <div>
            <span>Geek Legends</span>
            <small>Produtos Dignos de Lenda</small>
          </div>
        </Link>

        <nav>
          <Link to="/">Início</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/login">Login</Link>
          <Link to="/carrinho">Carrinho</Link>
          <button className="logout-button" onClick={sair}>Sair</button>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/sobre" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;