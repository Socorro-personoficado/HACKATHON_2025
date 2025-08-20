// Usuario.js
const Banco = require('./Banco');
const { encryptText, decryptText } = require('./CryptoUtils');

class Usuario {
  constructor() {
    this._gmail = null;
    this._nomeUsuario = null;
    this._senhaUsuario = null; // manter em texto puro APENAS enquanto em memória; ao salvar, criptografa
  }

  // Getters e Setters
  get gmail() { return this._gmail; }
  set gmail(value) { this._gmail = value; return this; }

  get nomeUsuario() { return this._nomeUsuario; }
  set nomeUsuario(value) { this._nomeUsuario = value; return this; }

  get senhaUsuario() { return this._senhaUsuario; }
  set senhaUsuario(value) { this._senhaUsuario = value; return this; }

  // Criar novo usuário (salva senha criptografada)
  async create() {
    const con = await Banco.getConexao();
    const sql = `
      INSERT INTO Usuario (gmail, Nome_usuario, Senha_usuario)
      VALUES (?, ?, ?)`;

    try {
      const senhaCifrada = encryptText(this._senhaUsuario);
      const [res] = await con.execute(sql, [
        this._gmail,
        this._nomeUsuario,
        senhaCifrada
      ]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return false;
    }
  }

  // Atualizar dados do usuário (criptografa se senha estiver setada)
  async update() {
    const con = await Banco.getConexao();
    const sql = `
      UPDATE Usuario 
      SET Nome_usuario = ?, Senha_usuario = ?
      WHERE gmail = ?`;
    try {
      const senhaCifrada = encryptText(this._senhaUsuario);
      const [res] = await con.execute(sql, [
        this._nomeUsuario,
        senhaCifrada,
        this._gmail
      ]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return false;
    }
  }

  // Atualizar somente a senha (criptografada)
  async updateSenha() {
    const con = await Banco.getConexao();
    const sql = `
      UPDATE Usuario 
      SET Senha_usuario = ?
      WHERE gmail = ?`;
    try {
      const senhaCifrada = encryptText(this._senhaUsuario);
      const [res] = await con.execute(sql, [
        senhaCifrada,
        this._gmail
      ]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao atualizar senha:", err);
      return false;
    }
  }

  // Autenticar login do usuário:
  // Em vez de comparar a senha no SQL, buscamos a senha criptografada, descriptografamos e comparamos.
  async autenticar() {
    const con = await Banco.getConexao();
    const sql = `
      SELECT Senha_usuario 
      FROM Usuario 
      WHERE gmail = ?`;
    try {
      const [rows] = await con.execute(sql, [this._gmail]);
      if (!rows || rows.length === 0) return false;

      const senhaCifrada = rows[0].Senha_usuario;
      if (!senhaCifrada) return false;

      const senhaClaraBanco = decryptText(senhaCifrada);
      return senhaClaraBanco === this._senhaUsuario;
    } catch (err) {
      console.error("Erro na autenticação:", err);
      return false;
    }
  }

  // Buscar usuário pelo email
  async readByGmail() {
    const con = await Banco.getConexao();
    const sql = `SELECT * FROM Usuario WHERE gmail = ?`;
    try {
      const [rows] = await con.execute(sql, [this._gmail]);
      return rows[0] || null;
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
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

  // Deletar usuário
  async delete() {
    const con = await Banco.getConexao();
    const sql = `DELETE FROM Usuario WHERE gmail = ?`;
    try {
      const [res] = await con.execute(sql, [this._gmail]);
      return res.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      return false;
    }
  }
}

module.exports = Usuario;
