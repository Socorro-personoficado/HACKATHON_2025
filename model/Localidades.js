const Banco = require('./Banco');

class Localidade {
  constructor() {
    this._idLocal = null;
    this._nomeLocal = null;
  }

  // Getters e Setters
  get idLocal() { return this._idLocal; }
  set idLocal(value) { this._idLocal = value; return this; }

  get nomeLocal() { return this._nomeLocal; }
  set nomeLocal(value) { this._nomeLocal = value; return this; }

  // Criar nova localidade
  async create() {
    const con = await Banco.getConexao();
    const sql = `
      INSERT INTO Localidades (Nome_local)
      VALUES (?)`;
    try {
      const [res] = await con.execute(sql, [this._nomeLocal]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao criar localidade:", err);
      return false;
    }
  }

  // Atualizar localidade
  async update() {
    const con = await Banco.getConexao();
    const sql = `
      UPDATE Localidades 
      SET Nome_local = ?
      WHERE ID_local = ?`;
    try {
      const [res] = await con.execute(sql, [
        this._nomeLocal,
        this._idLocal
      ]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao atualizar localidade:", err);
      return false;
    }
  }

  // Buscar localidade pelo ID
  async readByID() {
    const con = await Banco.getConexao();
    const sql = `SELECT * FROM Localidades WHERE ID_local = ?`;
    try {
      const [rows] = await con.execute(sql, [this._idLocal]);
      return rows[0] || null;
    } catch (err) {
      console.error("Erro ao buscar localidade:", err);
      return null;
    }
  }

  // Buscar todas as localidades
  async readAll() {
    const con = await Banco.getConexao();
    try {
      const [rows] = await con.execute(`SELECT * FROM Localidades`);
      return rows;
    } catch (err) {
      console.error("Erro ao listar localidades:", err);
      return [];
    }
  }

  // Deletar localidade
  async delete() {
    const con = await Banco.getConexao();
    const sql = `DELETE FROM Localidades WHERE ID_local = ?`;
    try {
      const [res] = await con.execute(sql, [this._idLocal]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao deletar localidade:", err);
      return false;
    }
  }
}

module.exports = Localidade;