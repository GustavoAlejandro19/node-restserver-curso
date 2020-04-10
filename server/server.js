//Crear servidor express
const express = require('express');
const app = express();

//Importar mongoose
const mongoose = require('mongoose');

//Importar variables de configuración
require('./config/config');

//Habilitar express.json (para parsear requests a json)
app.use(express.json({ extended: true }));


//Habilitar carpeta public
//ESTO SOLO SE HACE EN ESTE CASO PORQUE HAY UN ARCHIVO DE HTML
//EN UN API NORMAL QUE SERVIRÁ SOLO DE BACKEND NO ES NECESARIO
const path = require('path');
app.use(express.static(path.resolve(__dirname, '../public')));


//Importar rutas
app.use(require('./routes/index'));






//Crear conexión a la bd
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, //eliminar warnings al compilar
    (err, res) => {

        if (err) throw err;

        console.log('Conectado a BD');
    });

app.listen(process.env.PORT, () => console.log('Escuchando en puerto', process.env.PORT));