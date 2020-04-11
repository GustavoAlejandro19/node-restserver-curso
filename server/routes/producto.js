const express = require('express');
const ObjectID = require('mongodb').ObjectID;


const Producto = require('../models/producto');

//Middleware de autenticación
const { verificarToken } = require('../middleware/auth');

//Crear servidor express
const app = express();


app.get('/productos', verificarToken, async(req, res) => {

    try {

        let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);


        let usuarios = await Producto.find({ disponible: true }, 'nombre')
            .skip(desde)
            .limit(limite);

        let cuantos = await Producto.count({ disponible: true });

        res.json({
            ok: true,
            usuarios,
            cuantos
        });



    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        })
    }
});


app.get('/productos/:id', verificarToken, async(req, res) => {

    let id = req.params.id;

    try {

        if (!ObjectID.isValid(id)) throw "No es un Object id válido";

        let productoDB = await Producto.findById(id).populate('usuario').populate('categoria');

        return res.json({
            ok: true,
            productoDB
        })


    } catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }


});


app.post('/productos', verificarToken, async(req, res) => {

    let request = req.body;
    let idUsuario = req.usuario._id;

    try {

        let { nombre, precioUni, descripcion, categoria } = request;

        let producto = new Producto({
            nombre,
            precioUni,
            descripcion,
            categoria,
            usuario: idUsuario
        });

        let productoDB = await producto.save();

        if (productoDB) {
            return res.json({
                ok: true,
                producto: productoDB
            });
        }

    } catch (err) {
        res.status(400).json({
            ok: false,
            err: err
        })
    }
});


app.put('/productos/:id', verificarToken, async(req, res) => {

    let id = req.params.id;
    let productoRQ = req.body;

    try {

        let { nombre, precioUni, descripcion, categoria } = productoRQ;

        let updateOptions = {
            new: true,
            runValidators: true
        }

        let productoUpdate = {
            nombre,
            precioUni,
            descripcion,
            categoria
        };

        let productoDB = await Producto.findByIdAndUpdate(id, productoUpdate, updateOptions);


        if (!productoDB) {
            return res.json({
                ok: false,
                producto: "Producto no encontrado"
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    } catch (err) {

        return res.status(400).json({
            ok: false,
            err
        })

    }
});


app.delete('/productos/:id', verificarToken, async(req, res) => {

    let id = req.params.id;

    try {

        let updateOptions = {
            new: true,
            runValidators: true
        }

        let productoDB = await Producto.findByIdAndUpdate(id, { disponible: false }, updateOptions);

        if (!productoDB) {
            return res.json({
                ok: false,
                producto: "Producto no encontrado"
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    } catch (err) {

        return res.status(400).json({
            ok: false,
            err
        })

    }

});

app.get('/productos/buscar/:termino', verificarToken, async(req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    try {
        let productos = await Producto.find({ nombre: regex })
            .populate('categoria', 'descripcion');

        res.json({
            ok: true,
            productos
        })


    } catch (err) {

        res.status(400).json({
            ok: false,
            err
        })
    }


});


module.exports = app;