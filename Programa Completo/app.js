const express = require('express');
const path = require('path');  // Módulo para manipular caminhos de arquivo
const AlertaRouter = require('./router/AlertaRouter.js');
const UsuarioRouter = require('./router/UsuarioRouter.js');

const app = express();

const portaServico = 8080;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'view'))); // Configura a pasta 'view' como estática

const alertaRoteador = new AlertaRouter();
const usuarioRouter = new UsuarioRouter();

app.use('/alertas',
    alertaRoteador.createRoutes()
);

app.use('/usuarios',
    usuarioRouter.createRoutes()
);

// Inicia o servidor, escutando na porta definida, e exibe uma mensagem no console com a URL onde o servidor está rodando.
app.listen(portaServico, () => {
    console.log(`API rodando no endereço: http://localhost:${portaServico}/`);
});