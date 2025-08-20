const Alerta = require('../model/Alerta');

module.exports = class AlertaMiddleware {

  // Valida se o tipoClima foi informado e não está vazio
  async validar_tipoClima_vazio(request, response, next) {
    const tipoClima = request.body.alerta.tipoClima;
    if (!tipoClima || tipoClima.trim().length === 0) {
      return response.status(400).send({
        cod: 1,
        status: false,
        msg: "O tipo do clima não pode ser vazio"
      });
    }
    next();
  }

  // Valida se o nível de preocupação foi informado e é um número válido
  async validar_nivelPreocupacao(request, response, next) {
    const nivelPreocupacao = request.body.alerta.nivelPreocupacao;

    if (nivelPreocupacao === undefined || nivelPreocupacao === null || nivelPreocupacao === '') {
      return response.status(400).send({
        cod: 2,
        status: false,
        msg: "O nível de preocupação não pode ser vazio"
      });
    }

    // Valide se o nível de preocupação está entre 1 e 10 (obs.: "Number" serve para converter o valor para o tipo númérico)
    if (isNaN(nivelPreocupacao) || Number(nivelPreocupacao) < 0 || Number(nivelPreocupacao) > 10) {
      return response.status(400).send({
        cod: 3,
        status: false,
        msg: "O nível de preocupação deve ser um número válido entre 0 e 1"
      });
    }
    next();
  }

  // Valida se o idAlerta foi informado para operações que precisam do ID (update, delete, getById, etc.)
  async validar_idAlerta_vazio(request, response, next) {
    const idAlerta = request.params.id_alerta || request.body.alerta?.idAlerta; // o "?" verifica se o alerta existe, se existe retorna o valor de idAlerta, se não, retorna undefined e não lança erro
    if (!idAlerta || idAlerta.toString().trim().length === 0) {
      return response.status(400).send({
        cod: 4,
        status: false,
        msg: "O id do alerta não pode ser vazio"
      });
    }
    next();
  }

  // Verifica se o alerta com o id informado existe (para update, delete, getById)
  async validar_idAlerta_existente(request, response, next) {
    const alerta = new Alerta();
    alerta.idAlerta = request.params.id_alerta || request.body.alerta?.idAlerta;

    const alertaEncontrado = await alerta.readByID();
    if (!alertaEncontrado) {
      return response.status(404).send({
        cod: 5,
        status: false,
        msg: `Alerta com id ${alerta.idAlerta} não encontrado`
      });
    }
    next();
  }
};
