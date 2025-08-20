const mysql = require('mysql2/promise');

class Banco {
    static HOST = '127.0.0.1';
    static USER = 'root';
    static PWD = '';
    static DB = 'Hackathon';
    static PORT = 3306;

    // Sempre retorna uma nova conexão (simples e funcional)
    static async getConexao() {
        try {
            const conexao = await mysql.createConnection({
                host: this.HOST,
                user: this.USER,
                password: this.PWD,
                database: this.DB,
                port: this.PORT
            });
            return conexao;
        } catch (err) {
            console.error("Erro ao conectar no banco:", err.message);
            throw err;
        }
    }
}

module.exports = Banco;
