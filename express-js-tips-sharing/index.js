const express = require('express');
const bodyParser = require('body-parser');
const upload = require("express-fileupload");
const env = require("./modules/env.module");

const cors = require('cors');
const cookieParser = require('cookie-parser');

// MIDDLEWARES
const passport = require("./middlewares/auth.middleware");

// chargement des routes
const anonymeRoutes = require('./routes/anonyme.route');
const adminRoutes = require('./routes/admin.route');
const membreRoute = require('./routes/membre.route');
const tipRoute = require('./routes/tip.route');

const app = express();

app.use(cookieParser());
app.use(cors());
//authorisation d'upload des fichier
app.use(upload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// sert les fichiers statique, image file etc.
app.use('/media', express.static('media'));

//placement des routes qui ne necessitent pas de connexion
//
app.use('/', anonymeRoutes);

//placement des routes reserver aux membres connecter, si l'utilisateur a acces à la routes (possede un token valide)

// ex: /membre/profil
app.use('/membre/', passport.authenticate('jwt', { session: false }), membreRoute);

//  et ajout d'un middleware verifiant si l'utilisateur a acces à la routes (possede un token valide)
// ex: /tips/14
app.use('/tips/',passport.authenticate('jwt', { session: false }), tipRoute);

//placement des routes reserver qu'aux admin du site

// ex: /admin/
app.use('/admin/', passport.authenticate('jwt', { session: false }), adminRoutes);

//handle errors
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

app.listen(env.PORT_API, () => {
    console.log(`L'api est lancé sur : http://${env.HOST_BDD}:${env.PORT_API}`);
});