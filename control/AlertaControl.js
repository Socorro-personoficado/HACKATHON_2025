const express = require('express');
const Alerta = require('../model/Alerta');

module.exports = class AlertaControl {
    // Criar novo alerta
    async create(request, response) {
        const alerta = new Alerta();
        alerta.tipoClima = request.body.alerta.tipo_clima;
        alerta.nivelPreocupacao = request.body.alerta.nivel_preocupacao;

        const cadastrado = await alerta.create();

        if (cadastrado) {
            response.status(201).send({
                cod: 1,
                status: true,
                alerta: {
                    tipo_clima: alerta.tipoClima,
                    nivel_preocupacao: alerta.nivelPreocupacao
                }
            });
        } else {
            response.status(400).send({
                cod: 2,
                status: false,
                msg: "Falha ao cadastrar alerta"
            });
        }
    }

    // Atualizar alerta
    async update(request, response) {
        const alerta = new Alerta();
        alerta.idAlerta = request.params.id_alerta;
        alerta.tipoClima = request.body.alerta.tipo_clima;
        alerta.nivelPreocupacao = request.body.alerta.nivel_preocupacao;

        const atualizado = await alerta.update();

        if (atualizado) {
            response.status(200).send({
                cod: 1,
                status: true,
                alerta: {
                    id_alerta: alerta.idAlerta,
                    tipo_clima: alerta.tipoClima,
                    nivel_preocupacao: alerta.nivelPreocupacao
                }
            });
        } else {
            response.status(400).send({
                cod: 2,
                status: false,
                msg: "Falha ao atualizar alerta"
            });
        }
    }

    // Buscar todos os alertas
    async readAll(request, response) {
        const alerta = new Alerta();
        const dados = await alerta.readAll();
        if (dados){
            response.status(200).send({
                cod: 1,
                status: true,
                alertas: dados
            });
        } else {
            response.status(401).send({
                cod: 2,
                status: false,
                msg: "Nenhum alerta encontrado"
            });            
        }
    }

    // Buscar alerta por ID
    async readByID(request, response) {
        const alerta = new Alerta();
        alerta.idAlerta = request.params.id_alerta;

        const dados = await alerta.readByID();

        if (dados) {
            response.status(200).send({
                cod: 1,
                status: true,
                alerta: dados
            });
        } else {
            response.status(404).send({
                cod: 2,
                status: false,
                msg: "Alerta não encontrado"
            });
        }
    }

    // Deletar alerta
    async delete(request, response) {
        const alerta = new Alerta();
        alerta.idAlerta = request.params.id_alerta;

        const deletado = await alerta.delete();

        if (deletado) {
            response.status(200).send({
                cod: 1,
                status: true,
                msg: "Alerta deletado com sucesso"
            });
        } else {
            response.status(400).send({
                cod: 2,
                status: false,
                msg: "Falha ao deletar alerta"
            });
        }
    }
};
