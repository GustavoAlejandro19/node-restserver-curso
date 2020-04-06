const express = require('express');

const app = express();

//Rutas de cada controlador
app.use(require('./login'));
app.use(require('./usuario'));

module.exports = app;