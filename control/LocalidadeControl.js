const express = require('express');
const Localidade = require('../model/Localidade');

module.exports = class LocalidadeControl {

    // Criar nova localidade
    async create(request, response) {
        const localidade = new Localidade();
        localidade.nomeLocal = request.body.localidade.nome_local;

        const cadastrou = await localidade.create();

        if (cadastrou) {
            response.status(201).send({
                cod: 1,
                status: true,
                localidade: {
                    nome_local: localidade.nomeLocal
                }
            });
        } else {
            response.status(400).send({
                cod: 2,
                status: false,
                msg: "Falha ao cadastrar localidade"
            });
        }
    }

    // Atualizar localidade
    async update(request, response) {
        const localidade = new Localidade();
        localidade.idLocal = request.params.id_local;
        localidade.nomeLocal = request.body.localidade.nome_local;

        const atualizou = await localidade.update();

        if (atualizou) {
            response.status(200).send({
                cod: 1,
                status: true,
                localidade: {
                    id_local: localidade.idLocal,
                    nome_local: localidade.nomeLocal
                }
            });
        } else {
            response.status(400).send({
                cod: 2,
                status: false,
                msg: "Falha ao atualizar localidade"
            });
        }
    }

    // Buscar todas as localidades
    async readAll(request, response) {
        const localidade = new Localidade();
        const dados = await localidade.readAll();

        if (dados){
            response.status(200).send({
                cod: 1,
                status: true,
                localidades: dados
            });
        } else {
            response.status(401).send({
                cod: 2,
                status: false,
                msg: "Nenhuma localidade encontrada"
            });
        }
    }

    // Buscar localidade por ID
    async readByID(request, response) {
        const localidade = new Localidade();
        localidade.idLocal = request.params.id_local;

        const dados = await localidade.readByID();

        if (dados) {
            response.status(200).send({
                cod: 1,
                status: true,
                localidade: dados
            });
        } else {
            response.status(404).send({
                cod: 2,
                status: false,
                msg: "Localidade não encontrada"
            });
        }
    }

    // Deletar localidade
    async delete(request, response) {
        const localidade = new Localidade();
        localidade.idLocal = request.params.id_local;

        const deletou = await localidade.delete();

        if (deletou) {
            response.status(200).send({
                cod: 1,
                status: true,
                msg: "Localidade deletada com sucesso"
            });
        } else {
            response.status(400).send({
                cod: 2,
                status: false,
                msg: "Falha ao deletar localidade"
            });
        }
    }
};