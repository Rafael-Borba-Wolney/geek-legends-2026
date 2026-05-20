import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const navigate = useNavigate();

  async function cadastrar(event) {
    event.preventDefault();

    try {
      await api.post('/auth/register', {
        nome,
        email,
        senha
      });

      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (erro) {
      alert('Erro ao cadastrar. Talvez esse e-mail já exista.');
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={cadastrar}>
        <div className="auth-logo">GL</div>

        <h1>Criar Conta</h1>
        <p>Cadastre-se para comprar produtos lendários.</p>

        <label>Nome</label>
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

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
          placeholder="Crie sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Cadastrar</button>

        <p>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;