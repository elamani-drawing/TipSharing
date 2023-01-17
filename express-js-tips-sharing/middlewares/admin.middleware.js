const DB = require("../models/index");
const User = DB.User
const jwt = require("jsonwebtoken");
const env = require("../modules/env.module");
const { succesResponse, errorResponse } = require("../modules/share.module");


module.exports = {
    /**
     * Verifie que l'utilisateur est un admin
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    adminGuard : async (req, res, next) => {
        //reccuperation d'un utilisateur admin avec les informations present dans le token 
        const user = await User.findOne({ where: { pseudo: req.user.pseudo, id: req.user.id, isAdmin: true } });
        //si l'utilisateur n'a pas ete trouver, c'est que soit il n'existe pas, soit ce n'est pas un admin
        if (!user) {
            res.json({
                errors : 'Vous n\'etes pas un admin!',
            });
        } else {
            //c'est un admin donc on peut passer à la suite
            next();
        }
    },
}