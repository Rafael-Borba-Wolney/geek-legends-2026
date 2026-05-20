// Importa o Pool do PostgreSQL.
// O Pool permite criar e reutilizar conexões com o banco.
const { Pool } = require('pg');

// Carrega as variáveis do arquivo .env.
require('dotenv').config();

// Cria a conexão com o banco de dados PostgreSQL.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Exporta a conexão para ser usada nas rotas.
module.exports = pool;