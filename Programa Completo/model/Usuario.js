const Banco = require('./Banco');

class Usuario {
  constructor() {
    this._idUsuario = null;
    this._email = null;
    this._nomeUsuario = null;
    this._senhaUsuario = null;
  }

  // Getters e Setters
  get idUsuario() { return this._idUsuario; }
  set idUsuario(value) { this._idUsuario = value; return this; }

  get email() { return this._email; }
  set email(value) { this._email = value; return this; }

  get nomeUsuario() { return this._nomeUsuario; }
  set nomeUsuario(value) { this._nomeUsuario = value; return this; }

  get senhaUsuario() { return this._senhaUsuario; }
  set senhaUsuario(value) { this._senhaUsuario = value; return this; }

  // Criar novo usuário
  async create() {
    const con = await Banco.getConexao();
    const sql = `
      INSERT INTO Usuario (Email, Nome_usuario, Senha_usuario)
      VALUES (?, ?, ?)`;
    try {
      const [res] = await con.execute(sql, [
        this._email,
        this._nomeUsuario,
        this._senhaUsuario
      ]);
      if (res.affectedRows > 0) {
        this._idUsuario = res.insertId; // capturar id gerado
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return false;
    }
  }

  // Atualizar dados do usuário pelo IdUsuario
  async update() {
    if (!this._idUsuario) {
      throw new Error("IdUsuario é obrigatório para atualizar usuário.");
    }
    const con = await Banco.getConexao();
    const sql = `
      UPDATE Usuario 
      SET Nome_usuario = ?, Senha_usuario = ?, Email = ?
      WHERE IdUsuario = ?`;
    try {
      const [res] = await con.execute(sql, [
        this._nomeUsuario,
        this._senhaUsuario,
        this._email,
        this._idUsuario
      ]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return false;
    }
  }

  // Atualizar somente a senha pelo IdUsuario
  async updateSenha() {
    if (!this._idUsuario) {
      throw new Error("IdUsuario é obrigatório para atualizar senha.");
    }
    const con = await Banco.getConexao();
    const sql = `
      UPDATE Usuario 
      SET Senha_usuario = ?
      WHERE IdUsuario = ?`;
    try {
      const [res] = await con.execute(sql, [
        this._senhaUsuario,
        this._idUsuario
      ]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao atualizar senha:", err);
      return false;
    }
  }

  // Autenticar login do usuário (pode usar email e senha)
  async autenticar() {
    const con = await Banco.getConexao();
    const sql = `
      SELECT COUNT(*) AS qtd 
      FROM Usuario 
      WHERE Email = ? AND Senha_usuario = ?`;
    try {
      const [rows] = await con.execute(sql, [
        this._email,
        this._senhaUsuario
      ]);
      return rows[0].qtd > 0;
    } catch (err) {
      console.error("Erro na autenticação:", err);
      return false;
    }
  }

  // Buscar usuário pelo IdUsuario
  async readById() {
    if (!this._idUsuario) {
      throw new Error("IdUsuario é obrigatório para buscar usuário.");
    }
    const con = await Banco.getConexao();
    const sql = `SELECT * FROM Usuario WHERE IdUsuario = ?`;
    try {
      const [rows] = await con.execute(sql, [this._idUsuario]);
      return rows[0] || null;
    } catch (err) {
      console.error("Erro ao buscar usuário por ID:", err);
      return null;
    }
  }

  // Buscar usuário pelo email
  async readByGmail() {
    const con = await Banco.getConexao();
    const sql = `SELECT * FROM Usuario WHERE Email = ?`;
    try {
      const [rows] = await con.execute(sql, [this._email]);
      return rows[0] || null;
    } catch (err) {
      console.error("Erro ao buscar usuário por email:", err);
      return null;
    }
  }

  // Buscar todos os usuários
  async readAll() {
    const con = await Banco.getConexao();
    try {
      const [rows] = await con.execute(`SELECT * FROM Usuario`);
      return rows;
    } catch (err) {
      console.error("Erro ao listar usuários:", err);
      return [];
    }
  }

  // Deletar usuário pelo IdUsuario
  async delete() {
    if (!this._idUsuario) {
      throw new Error("IdUsuario é obrigatório para deletar usuário.");
    }
    const con = await Banco.getConexao();
    const sql = `DELETE FROM Usuario WHERE IdUsuario = ?`;
    try {
      const [res] = await con.execute(sql, [this._idUsuario]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      return false;
    }
  }
}

module.exports = Usuario;
