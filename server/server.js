//Crear servidor express
const express = require('express');
const app = express();

//Importar variables de configuración
require('./config/config');

//Habilitar express.json (para parsear requests a json)
app.use(express.json({ extended: true }));


app.get('/usuario', (req, res) => {

    res.json('Get Usuario');
});

app.post('/usuario', (req, res) => {


    let body = req.body;

    if (!body.nombre) {
        res.status(400).json({ msg: "Error prro" });
    }

    res.json(body);
});


app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;


    res.json({ id: id });
});


app.delete('/usuario', (req, res) => {
    res.json('Delete Usuario');
});


app.listen(process.env.PORT, () => console.log('Escuchando en puerto', process.env.PORT));