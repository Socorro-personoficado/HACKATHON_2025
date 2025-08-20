const Localidade = require('../model/Localidade');

module.exports = class LocalidadeMiddleware {
  // Valida se o ID da localidade foi informado (em params)
  async validar_idLocalidade_vazio(req, res, next) {
    const id = req.params.id_localidade;
    if (!id || id.trim().length === 0) {
      return res.status(400).json({
        cod: 1,
        status: false,
        msg: "O id da localidade não pode ser vazio"
      });
    }
    next();
  }

  // Verifica se a localidade com esse ID existe no banco
  async validar_idLocalidade_existente(req, res, next) {
    const id = req.params.id_localidade;
    const localidade = new Localidade();
    localidade.idLocalidade = id;

    try {
      const existente = await localidade.readById();
      if (!existente) {
        return res.status(404).json({
          cod: 2,
          status: false,
          msg: "Localidade não encontrada"
        });
      }
      next();
    } catch (err) {
      console.error("Erro ao validar localidade existente:", err);
      return res.status(500).json({
        cod: 99,
        status: false,
        msg: "Erro interno no servidor"
      });
    }
  }

  // Valida se o nome da localidade foi informado (em body)
  async validar_nomeLocalidade_vazio(req, res, next) {
    const nome = req.body.localidade?.nome_localidade;
    if (!nome || nome.trim().length === 0) {
      return res.status(400).json({
        cod: 3,
        status: false,
        msg: "O nome da localidade não pode ser vazio"
      });
    }
    next();
  }
};
