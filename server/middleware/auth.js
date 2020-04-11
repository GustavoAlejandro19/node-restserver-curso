const jwt = require('jsonwebtoken');


//Validar token
let verificarToken = (req, res, next) => {

    let token = req.header('Authorization');

    //Esto verifica fecha, firma y regresa payload del token
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token inválido'
            })
        }

        //Añadir propiedad usuario al request para que
        //se pueda obtener en los siguientes métodos
        req.usuario = decoded.usuario;


        //Pasar al siguiente middleware (o al método del controlador)
        next();

    });

}

//Validar token por parámetro de url
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    //Esto verifica fecha, firma y regresa payload del token
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token inválido'
            });
        }

        //Añadir propiedad usuario al request para que
        //se pueda obtener en los siguientes métodos
        req.usuario = decoded.usuario;


        //Pasar al siguiente middleware (o al método del controlador)
        next();

    });


}


//Verificar si es ADMIN_ROLE
let verificaAdmin_Role = (req, res, next) => {

    let { role } = req.usuario;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: 'Se requiere acceso de administrador'
        });
    }

    next();
}

module.exports = {
    verificarToken,
    verificaAdmin_Role,
    verificaTokenImg
}