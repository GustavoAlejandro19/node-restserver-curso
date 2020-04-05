const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

//Validaciones para enumeración
//como constrait check o in en sql server
//asignar esto a la propiedad enum de la propiedad requerida
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido.'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    img: {
        type: String,
        required: false
    },

    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false

    }

});


//Sobreescribir método toJSON para que no regrese
// el password
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


//Asignar validador de campos únicos 
//(para que esto funcione, la propiedad debe llevar unique: true)
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único.' })

module.exports = mongoose.model('Usuario', usuarioSchema);