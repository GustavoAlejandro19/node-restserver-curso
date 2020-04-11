const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');


const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const app = express();


//Usar file upload
app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', async(req, res) => {

    let { tipo, id } = req.params;

    if (!req.files || Object.keys(req.files).length === 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo.'
            }
        });
    }

    // files.archivo  "archivo"=el nombre del campo en el request
    let archivo = req.files.archivo;


    //Obtener nombre y extensión del archivo
    let [nombre, extension] = archivo.name.split('.');

    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Extensiones válidas: " + extensionesValidas.join(" ")
            }
        });
    }

    //Generar nombre del archivo
    let finalName = `${id}-${ new Date().getMilliseconds() }.${extension}`;


    switch (tipo) {
        case 'usuarios':
            archivo.mv(`./uploads/${tipo}/${finalName}`, err => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                //Imagen cargada, actualizar imagen del usuario
                imagenUsuario(id, finalName, res);

            });
            break;

        case 'productos':
            archivo.mv(`./uploads/${tipo}/${finalName}`, err => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                //Imagen cargada, actualizar imagen del producto
                imagenProducto(id, finalName, res);

            });
            break;

        default:
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Tipos válidos usuarios, productos"
                }
            });

    }


});


let imagenUsuario = async(id, finalName, res) => {
    try {

        let usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            borrarArchivo(finalName, 'usuarios');
            throw "Usuario no encontrado en BD";
        }


        //Eliminar imagen anterior del usuario
        borrarArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = finalName;

        let updatedUser = await usuarioDB.save();


        return res.json({
            ok: true,
            usuario: updatedUser,
            img: finalName
        });


    } catch (err) {
        borrarArchivo(finalName, 'usuarios');
        return res.status(400).json({
            ok: false,
            err: err
        })
    }
}

let imagenProducto = async(id, finalName, res) => {
    try {

        let productoDB = await Producto.findById(id);

        if (!productoDB) {
            borrarArchivo(finalName, 'productos');
            throw "Producto no encontrado en BD";
        }

        //Eliminar imagen anterior del producto
        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = finalName;

        let updatedProducto = await productoDB.save();


        return res.json({
            ok: true,
            producto: updatedProducto,
            img: finalName
        });



    } catch (err) {
        borrarArchivo(finalName, 'productos');
        res.status(400).json({
            ok: false,
            err
        })
    }
}


let borrarArchivo = (nombreImagen, tipo) => {
    let urlImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(urlImg)) {
        fs.unlinkSync(urlImg);
    }
}

module.exports = app;