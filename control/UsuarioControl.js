const Usuario = require('../model/Usuario');
const MeuTokenJWT = require('../model/MeuTokenJWT');

module.exports = class UsuarioControl {

  // Login do usuário (usa email e senha)
    async login(request, response) {
    const usuario = new Usuario();

    usuario.email = request.body.usuario.email;
    usuario.senhaUsuario = request.body.usuario.senha_usuario;

    const logado = await usuario.autenticar();

    if (logado) {
        // Buscar dados completos do usuário pelo email
        const dadosUsuario = await usuario.readByGmail();

        const payloadToken = {
        email: usuario.email,
        };
        const jwt = new MeuTokenJWT();
        const token_string = jwt.gerarToken(payloadToken);

        response.status(200).send({
        cod: 1,
        status: true,
        msg: "Login efetuado com sucesso",
        token: token_string,
        usuario: dadosUsuario  // envia todos os dados do usuário
        });
    } else {
        response.status(401).send({
        cod: 2,
        status: false,
        msg: "Login inválido"
        });
    }
    }

  // Buscar todos os usuários
  async readAll(request, response) {
    const usuario = new Usuario();
    const dadosUsuarios = await usuario.readAll();

    if (dadosUsuarios && dadosUsuarios.length > 0) {
      response.status(200).send({
        cod: 1,
        status: true,
        usuarios: dadosUsuarios
      });
    } else {
      response.status(404).send({
        cod: 2,
        status: false,
        msg: "Nenhum usuário encontrado"
      });
    }
  }

  // Buscar usuário pelo ID (id_usuario)
  async readById(request, response) {
    const usuario = new Usuario();
    usuario.idUsuario = request.params.id_usuario;

    const dadosUsuario = await usuario.readById();

    if (dadosUsuario) {
      response.status(200).send({
        cod: 1,
        status: true,
        usuario: dadosUsuario
      });
    } else {
      response.status(404).send({
        cod: 2,
        status: false,
        msg: "Usuário não encontrado"
      });
    }
  }

  // Criar novo usuário
  async create(request, response) {
    const usuario = new Usuario();

    usuario.email = request.body.usuario.email;
    usuario.nomeUsuario = request.body.usuario.nome_usuario;
    usuario.senhaUsuario = request.body.usuario.senha_usuario;

    const criado = await usuario.create();

    if (criado) {
      response.status(201).send({
        cod: 1,
        status: true,
        usuario: {
          id_usuario: usuario.idUsuario,
          email: usuario.email,
          nome_usuario: usuario.nomeUsuario,
          senha_usuario: usuario.senhaUsuario
        }
      });
    } else {
      response.status(400).send({
        cod: 2,
        status: false,
        msg: "Falha ao cadastrar usuário"
      });
    }
  }

  // Atualizar dados do usuário por id_usuario
  async update(request, response) {
    const usuario = new Usuario();

    usuario.idUsuario = request.params.id_usuario;
    usuario.email = request.body.usuario.email;
    usuario.nomeUsuario = request.body.usuario.nome_usuario;
    usuario.senhaUsuario = request.body.usuario.senha_usuario;

    const atualizado = await usuario.update();

    if (atualizado) {
      response.status(200).send({
        cod: 1,
        status: true,
        usuario: {
          id_usuario: usuario.idUsuario,
          email: usuario.email,
          nome_usuario: usuario.nomeUsuario,
          senha_usuario: usuario.senhaUsuario
        }
      });
    } else {
      response.status(400).send({
        cod: 2,
        status: false,
        msg: "Falha ao atualizar usuário"
      });
    }
  }

  // Deletar usuário por id_usuario
  async delete(request, response) {
    const usuario = new Usuario();
    usuario.idUsuario = request.params.id_usuario;

    const deletado = await usuario.delete();

    if (deletado) {
      response.status(200).send({
        cod: 1,
        status: true,
        msg: "Usuário deletado com sucesso"
      });
    } else {
      response.status(400).send({
        cod: 2,
        status: false,
        msg: "Falha ao deletar usuário"
      });
    }
  }
};
