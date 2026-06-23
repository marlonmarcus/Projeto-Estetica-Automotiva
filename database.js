// INICIANDO BANCO DE DADOS
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db");

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            telefone TEXT,
            email TEXT,
            servico TEXT,
            data TEXT,
            horario TEXT
        )
    `);
});

module.exports = db;