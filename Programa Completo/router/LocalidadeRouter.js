const express = require('express');
const LocalidadeControl = require('../control/LocalidadeControl'); 
const LocalidadeMiddleware = require('../middleware/LocalidadeMiddleware');
const JWTMiddleware = require('../middleware/JWTMiddleware');

module.exports = class LocalidadeRouter {
  constructor() {
    this._router = express.Router();
    this._localidadeControl = new LocalidadeControl();
    this._localidadeMiddleware = new LocalidadeMiddleware();
    this._jwtMiddleware = new JWTMiddleware();
  }

  createRoutes() {
    // Criar nova localidade (protegido por JWT)
    this._router.post('/',
      this._jwtMiddleware.validate,
      this._localidadeMiddleware.validar_nomeLocalidade_vazio,
      (req, res) => this._localidadeControl.create(req, res)
    );

    // Listar todas as localidades (protegido por JWT)
    this._router.get('/',
      this._jwtMiddleware.validate,
      (req, res) => this._localidadeControl.readAll(req, res)
    );

    // Buscar localidade por ID (protegido por JWT)
    this._router.get('/:id_localidade',
      this._jwtMiddleware.validate,
      this._localidadeMiddleware.validar_idLocalidade_vazio,
      this._localidadeMiddleware.validar_idLocalidade_existente,
      (req, res) => this._localidadeControl.readById(req, res)
    );

    // Atualizar localidade por ID (protegido por JWT)
    this._router.put('/:id_localidade',
      this._jwtMiddleware.validate,
      this._localidadeMiddleware.validar_idLocalidade_vazio,
      this._localidadeMiddleware.validar_idLocalidade_existente,
      this._localidadeMiddleware.validar_nomeLocalidade_vazio,
      (req, res) => this._localidadeControl.update(req, res)
    );

    // Deletar localidade por ID (protegido por JWT)
    this._router.delete('/:id_localidade',
      this._jwtMiddleware.validate,
      this._localidadeMiddleware.validar_idLocalidade_vazio,
      this._localidadeMiddleware.validar_idLocalidade_existente,
      (req, res) => this._localidadeControl.delete(req, res)
    );

    return this._router;
  }

  get router() {
    return this._router;
  }

  set router(newRouter) {
    this._router = newRouter;
  }

  get localidadeControl() {
    return this._localidadeControl;
  }

  set localidadeControl(newLocalidadeControl) {
    this._localidadeControl = newLocalidadeControl;
  }

  get localidadeMiddleware() {
    return this._localidadeMiddleware;
  }

  set localidadeMiddleware(newLocalidadeMiddleware) {
    this._localidadeMiddleware = newLocalidadeMiddleware;
  }

  get jwtMiddleware() {
    return this._jwtMiddleware;
  }

  set jwtMiddleware(newJwtMiddleware) {
    this._jwtMiddleware = newJwtMiddleware;
  }
};