// Importa o JWT para validar o token enviado pelo usuário.
const jwt = require('jsonwebtoken');

require('dotenv').config();

// Middleware para verificar se o usuário está logado.
function autenticarUsuario(req, res, next) {
  // O token vem no cabeçalho Authorization.
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensagem: 'Acesso negado. Token não informado.'
    });
  }

  // O formato correto é: Bearer TOKEN
  const token = authHeader.split(' ')[1];

  try {
    // Verifica se o token é válido.
    const usuario = jwt.verify(token, process.env.JWT_SECRET);

    // Guarda os dados do usuário dentro da requisição.
    req.usuario = usuario;

    next();
  } catch (erro) {
    return res.status(401).json({
      mensagem: 'Token inválido ou expirado.'
    });
  }
}

// Middleware para permitir acesso somente para administrador.
function autenticarAdmin(req, res, next) {
  if (req.usuario.perfil !== 'admin') {
    return res.status(403).json({
      mensagem: 'Acesso permitido apenas para administrador.'
    });
  }

  next();
}

module.exports = {
  autenticarUsuario,
  autenticarAdmin
};