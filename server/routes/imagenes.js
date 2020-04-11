const express = require('express');
const fs = require('fs');
const path = require('path');


const { verificaTokenImg } = require('../middleware/auth');
let app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let { tipo, img } = req.params;

    let imgPath = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let noImgPath = path.resolve(__dirname, '../assets/original.jpg');


    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);

    } else {
        res.sendFile(noImgPath);

    }

});

module.exports = app;