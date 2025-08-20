const express = require('express');
const AlertaControl = require('../control/AlertaControl'); // Supondo que exista esse controller
const AlertaMiddleware = require('../middleware/AlertaMiddleware');
const JWTMiddleware = require('../middleware/JWTMiddleware');

module.exports = class AlertaRouter {
  constructor() {
    this._router = express.Router();
    this._alertaControl = new AlertaControl();
    this._alertaMiddleware = new AlertaMiddleware();
    this._jwtMiddleware = new JWTMiddleware();
  }

  createRoutes() {
    // Criar novo alerta - protegido por JWT
    this._router.post('/',
      this._jwtMiddleware.validate,
      this._alertaMiddleware.validar_tipoClima_vazio,
      this._alertaMiddleware.validar_nivelPreocupacao,
      (req, res) => this._alertaControl.create(req, res)
    );

    // Listar todos os alertas - protegido por JWT
    this._router.get('/',
      this._jwtMiddleware.validate,
      (req, res) => this._alertaControl.readAll(req, res)
    );

    // Buscar alerta por ID - pública, mas valida existência
    this._router.get('/:id_alerta',
      this._alertaMiddleware.validar_idAlerta_vazio,
      this._alertaMiddleware.validar_idAlerta_existente,
      (req, res) => this._alertaControl.readById(req, res)
    );

    // Atualizar alerta por ID - protegido por JWT
    this._router.put('/:id_alerta',
      this._jwtMiddleware.validate,
      this._alertaMiddleware.validar_idAlerta_vazio,
      this._alertaMiddleware.validar_idAlerta_existente,
      this._alertaMiddleware.validar_tipoClima_vazio,
      this._alertaMiddleware.validar_nivelPreocupacao,
      (req, res) => this._alertaControl.update(req, res)
    );

    // Deletar alerta por ID - protegido por JWT
    this._router.delete('/:id_alerta',
      this._jwtMiddleware.validate,
      this._alertaMiddleware.validar_idAlerta_vazio,
      this._alertaMiddleware.validar_idAlerta_existente,
      (req, res) => this._alertaControl.delete(req, res)
    );

    return this._router;
  }

  get router() {
    return this._router;
  }

  set router(newRouter) {
    this._router = newRouter;
  }

  get alertaControl() {
    return this._alertaControl;
  }

  set alertaControl(newAlertaControl) {
    this._alertaControl = newAlertaControl;
  }

  get alertaMiddleware() {
    return this._alertaMiddleware;
  }

  set alertaMiddleware(newAlertaMiddleware) {
    this._alertaMiddleware = newAlertaMiddleware;
  }

  get jwtMiddleware() {
    return this._jwtMiddleware;
  }

  set jwtMiddleware(newJwtMiddleware) {
    this._jwtMiddleware = newJwtMiddleware;
  }
};