const express = require('express');
const UsuarioControl = require('../control/UsuarioControl');
const UsuarioMiddleware = require('../middleware/UsuarioMiddleware');
const JWTMiddleware = require('../middleware/JWTMiddleware');

module.exports = class UsuarioRouter {
  constructor() {
    this._router = express.Router();
    this._usuarioControl = new UsuarioControl();
    this._usuarioMiddleware = new UsuarioMiddleware();
    this._jwtMiddleware = new JWTMiddleware();
  }

  createRoutes() {
    // Criar usuário (geralmente não precisa de JWT)
    this._router.post('/',
      this._usuarioMiddleware.validar_nome_vazio,
      this._usuarioMiddleware.validar_email_vazio,
      this._usuarioMiddleware.validar_email_formato,
      this._usuarioMiddleware.validar_senha_vazia,
      (req, res) => this._usuarioControl.create(req, res)
    );

    // Listar todos os usuários - protegido por JWT
    this._router.get('/',
      this._jwtMiddleware.validate,
      (req, res) => this._usuarioControl.readAll(req, res)
    );

    // Buscar usuário por id - protegido por JWT
    this._router.get('/:id_usuario',
      this._jwtMiddleware.validate,
      this._usuarioMiddleware.validar_idUsuario_vazio,
      this._usuarioMiddleware.validar_idUsuario_existente,
      (req, res) => this._usuarioControl.readById(req, res)
    );

    // Atualizar usuário por id - protegido por JWT
    this._router.put('/:id_usuario',
      this._jwtMiddleware.validate,
      this._usuarioMiddleware.validar_idUsuario_vazio,
      this._usuarioMiddleware.validar_idUsuario_existente,
      this._usuarioMiddleware.validar_nome_vazio,
      this._usuarioMiddleware.validar_email_vazio,
      this._usuarioMiddleware.validar_email_formato,
      this._usuarioMiddleware.validar_senha_vazia,
      (req, res) => this._usuarioControl.update(req, res)
    );

    // Deletar usuário por id - protegido por JWT
    this._router.delete('/:id_usuario',
      this._jwtMiddleware.validate,
      this._usuarioMiddleware.validar_idUsuario_vazio,
      this._usuarioMiddleware.validar_idUsuario_existente,
      (req, res) => this._usuarioControl.delete(req, res)
    );

    // Rota de login (não precisa JWT)
    this._router.post('/login',
      this._usuarioMiddleware.validar_email_vazio,
      this._usuarioMiddleware.validar_email_formato,
      this._usuarioMiddleware.validar_senha_vazia,
      (req, res) => this._usuarioControl.login(req, res)
    );

    return this._router;
  }

  get router() {
    return this._router;
  }
};
