const express = require('express');

let Categoria = require('../models/catgoria');

//Middleware de autenticación
let { verificarToken, verificaAdmin_Role } = require('../middleware/auth');

//Crear servidor express
let app = express();



//Obtener todas las categorias
app.get('/categoria', verificarToken, async(req, res) => {

    try {

        let categorias = await Categoria.find({}).sort('descripcion').populate('usuario', 'nombre email');

        return res.json({
            ok: true,
            categorias
        })


    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        })
    }

});

//Mostrar categoria por id
app.get('/categoria/:id', verificarToken, async(req, res) => {

    let id = req.params.id;

    try {
        let categoria = await Categoria.findOne({
            _id: id
        });

        if (!categoria) {
            throw "Categoría no encontrada";
        }


        return res.json({
            categoria
        })


    } catch (err) {
        return res.status(400).json({
            ok: false,
            err
        })
    }
});

//Crear y regresar nueva categoría
app.post('/categoria', verificarToken, async(req, res) => {


    let categoriaReq = req.body;

    let usuario = req.usuario;

    try {
        let categoria = new Categoria({
            descripcion: categoriaReq.descripcion,
            usuario: usuario._id
        });

        let categoriaDB = await categoria.save();

        res.json({
            categoria: categoriaDB
        })

    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        })
    }

});

//Actualizar categoría
app.put('/categoria/:id', verificarToken, async(req, res) => {

    let id = req.params.id;
    let categoriaUpdate = req.body;

    try {

        let updateOptions = {
            new: true,
            runValidators: true
        }

        let updatedCategory = await Categoria.findByIdAndUpdate(id, categoriaUpdate, updateOptions);

        return res.json({
            ok: true,
            categoria: updatedCategory
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        })
    }

});

//Delete de categoría
app.delete('/categoria/:id', verificarToken, verificaAdmin_Role, async(req, res) => {

    let id = req.params.id;

    try {

        let categoria = await Categoria.findByIdAndRemove(id);

        return res.json({
            categoria
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        });
    }

});




module.exports = app;