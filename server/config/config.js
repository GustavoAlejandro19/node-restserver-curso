//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno (Heroku o dev)
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Connection string (esta variable URLDB no existe, se define y crea aqui)
process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;

//JWT
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30; // 60 seg * 60 min * 24 hrs * 30d
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//Google auth client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '43717589903-rl0bomklq71tjreemslkho77eu278fue.apps.googleusercontent.com';