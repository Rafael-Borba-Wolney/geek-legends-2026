import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const navigate = useNavigate();

  async function fazerLogin(event) {
    event.preventDefault();

    try {
      const resposta = await api.post('/auth/login', {
        email,
        senha
      });

      localStorage.setItem('token', resposta.data.token);
      localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));

      alert('Login realizado com sucesso!');
      navigate('/produtos');
    } catch (erro) {
      alert('E-mail ou senha inválidos.');
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={fazerLogin}>
        <div className="auth-logo">GL</div>

        <h1>Bem-vindo de Volta!</h1>
        <p>Entre na sua conta para continuar.</p>

        <label>E-mail</label>
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>

        <p>
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;