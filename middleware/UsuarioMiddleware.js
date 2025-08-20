const Usuario = require('../model/Usuario');

module.exports = class UsuarioMiddleware {
  // Valida se o e-mail foi informado
  async validar_email_vazio(req, res, next) {
    const email = req.body.usuario?.email;
    if (!email || email.trim().length === 0) {
      return res.status(400).send({
        cod: 1,
        status: false,
        msg: "O e-mail não pode ser vazio"
      });
    }
    next();
  }

  // Valida o formato básico do e-mail
  async validar_email_formato(req, res, next) {
    const email = req.body.usuario?.email;
    if (!email) {
      return res.status(400).send({
        cod: 2,
        status: false,
        msg: "E-mail não informado para validação de formato"
      });
    }

    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');

    if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex + 2 >= email.length) {
      return res.status(400).send({
        cod: 3,
        status: false,
        msg: "E-mail inválido. Por favor, insira um e-mail válido."
      });
    }

    next();
  }

  // Valida se o nome do usuário foi informado
  async validar_nome_vazio(req, res, next) {
    const nome = req.body.usuario?.nome_usuario;
    if (!nome || nome.trim().length === 0) {
      return res.status(400).send({
        cod: 4,
        status: false,
        msg: "O nome do usuário não pode ser vazio"
      });
    }
    next();
  }

  // Valida se a senha do usuário foi informada
  async validar_senha_vazia(req, res, next) {
    const senha = req.body.usuario?.senha_usuario;
    if (!senha || senha.trim().length === 0) {
      return res.status(400).send({
        cod: 5,
        status: false,
        msg: "A senha do usuário não pode ser vazia"
      });
    }
    next();
  }

  // Valida se o IdUsuario foi informado e é válido (numérico e positivo)
  async validar_idUsuario_vazio(req, res, next) {
    const idUsuario = req.params.id_usuario;
    if (!idUsuario || isNaN(idUsuario) || parseInt(idUsuario) <= 0) {
      return res.status(400).send({
        cod: 6,
        status: false,
        msg: "IdUsuario inválido ou não informado"
      });
    }
    next();
  }

  // Verifica se o usuário existe pelo IdUsuario
  async validar_idUsuario_existente(req, res, next) {
    const idUsuario = req.params.id_usuario;

    const usuario = new Usuario();
    usuario.idUsuario = parseInt(idUsuario);

    try {
      const usuarioExistente = await usuario.readById();
      if (!usuarioExistente) {
        return res.status(404).send({
          cod: 7,
          status: false,
          msg: "Usuário não encontrado"
        });
      }
      next();
    } catch (err) {
      console.error("Erro ao verificar usuário existente:", err);
      return res.status(500).send({
        cod: 8,
        status: false,
        msg: "Erro interno ao verificar usuário"
      });
    }
  }

  // Verifica se já existe um usuário com o mesmo e-mail (para criação)
  async isUsuarioExistente(req, res, next) {
    const email = req.body.usuario?.email;
    if (!email) {
      return res.status(400).send({
        cod: 9,
        status: false,
        msg: "O e-mail é necessário para verificar existência"
      });
    }

    const usuario = new Usuario();
    usuario.email = email;

    try {
      const usuarioExistente = await usuario.readByGmail();
      if (usuarioExistente) {
        return res.status(400).send({
          cod: 10,
          status: false,
          msg: "Já existe um usuário com esse e-mail"
        });
      }
      next();
    } catch (err) {
      console.error("Erro ao verificar usuário existente:", err);
      return res.status(500).send({
        cod: 11,
        status: false,
        msg: "Erro interno ao verificar usuário"
      });
    }
  }
};
