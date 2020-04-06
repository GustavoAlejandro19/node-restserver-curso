//Crear servidor express
const express = require('express');
const app = express();

//Importar mongoose
const mongoose = require('mongoose');

//Importar variables de configuración
require('./config/config');

//Habilitar express.json (para parsear requests a json)
app.use(express.json({ extended: true }));


//Importar rutas
app.use(require('./routes/index'));


//Crear conexión a la bd
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, //eliminar warnings al compilar
    (err, res) => {

        if (err) throw err;

        console.log('Conectado a BD');
    });

app.listen(process.env.PORT, () => console.log('Escuchando en puerto', process.env.PORT));