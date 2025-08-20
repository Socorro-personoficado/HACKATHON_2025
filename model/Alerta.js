const Banco = require('./Banco');

class Alerta {
  constructor() {
    this._idAlerta = null;
    this._tipoClima = null;
    this._nivelPreocupacao = null;
  }

  // Getters e Setters
  get idAlerta() { return this._idAlerta; }
  set idAlerta(value) { this._idAlerta = value; return this; }

  get tipoClima() { return this._tipoClima; }
  set tipoClima(value) { this._tipoClima = value; return this; }

  get nivelPreocupacao() { return this._nivelPreocupacao; }
  set nivelPreocupacao(value) { this._nivelPreocupacao = value; return this; }

  // Criar novo alerta
  async create() {
    const con = await Banco.getConexao();
    const sql = `
      INSERT INTO Alertas (Tipo_clima, Nivel_preocupacao)
      VALUES (?, ?)`;
    try {
      const [res] = await con.execute(sql, [
        this._tipoClima,
        this._nivelPreocupacao
      ]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao criar alerta:", err);
      return false;
    }
  }

  // Atualizar alerta
  async update() {
    const con = await Banco.getConexao();
    const sql = `
      UPDATE Alertas 
      SET Tipo_clima = ?, Nivel_preocupacao = ?
      WHERE ID_alerta = ?`;
    try {
      const [res] = await con.execute(sql, [
        this._tipoClima,
        this._nivelPreocupacao,
        this._idAlerta
      ]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao atualizar alerta:", err);
      return false;
    }
  }

  // Buscar alerta por ID
  async readByID() {
    const con = await Banco.getConexao();
    const sql = `SELECT * FROM Alertas WHERE ID_alerta = ?`;
    try {
      const [rows] = await con.execute(sql, [this._idAlerta]);
      return rows[0] || null;
    } catch (err) {
      console.error("Erro ao buscar alerta:", err);
      return null;
    }
  }

  // Buscar todos os alertas
  async readAll() {
    const con = await Banco.getConexao();
    try {
      const [rows] = await con.execute(`SELECT * FROM Alertas`);
      return rows;
    } catch (err) {
      console.error("Erro ao listar alertas:", err);
      return [];
    }
  }

  // Deletar alerta
  async delete() {
    const con = await Banco.getConexao();
    const sql = `DELETE FROM Alertas WHERE ID_alerta = ?`;
    try {
      const [res] = await con.execute(sql, [this._idAlerta]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao deletar alerta:", err);
      return false;
    }
  }
}

module.exports = Alerta;