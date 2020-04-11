const express = require('express');

const app = express();

//Rutas de cada controlador
app.use(require('./login'));
app.use(require('./usuario'));
app.use(require('./categoria'));
app.use(require('./producto'));

module.exports = app;