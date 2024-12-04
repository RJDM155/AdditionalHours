const { Pool } = require('pg');
require('dotenv').config();

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
console.log('Conectado a la base exitosamente :)');

module.exports = pool;
