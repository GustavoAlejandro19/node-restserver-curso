const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');


const app = express();

//Funciones de google sign-in
verify = async token => {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let { name, email, picture } = payload;

    console.log('name', name);
    console.log('email', email);
    console.log('picture', picture);

    return {
        nombre: name,
        email: email,
        img: picture,
        google: true
    }
}



app.post('/login', (req, res) => {

    let { email, password } = req.body;

    Usuario.findOne({ email: email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos.'
                }
            })
        }

        if (!bcrypt.compareSync(password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }


        //Generando token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuarioDB,
            token
        })


    });

});


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        })
    });

    let { email, nombre, img } = googleUser;

    Usuario.findOne({ email: email }, (err, usuarioDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar autenticación normal'
                    }
                });
            } else {

                //Generando token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //Si el usuario de google no existe en la bd

            let usuario = new Usuario();

            usuario.nombre = nombre;
            usuario.email = email;
            usuario.img = img;
            usuario.google = true;
            usuario.password = "no password (google)";

            usuario.save((err, usuarioDB) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Debe usar autenticación normal'
                        }
                    });
                }


                //Generando token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


            });

        }

    });






});

module.exports = app;