// ROUTER 
const { Router } = require("express");
const router = Router();


// MIDDLEWARES
// const passport = require("../middlewares/auth.middleware");

// CONTROLLERS
const anonymeController = require("../controllers/anonyme.controller");
const { succesResponse } = require("../modules/share.module");

// ROUTES

/**
 * Renvoi la chaine de caractère « pong »
 */
router.get('/ping', function (req, res) {
    res.json(succesResponse([], {'ping': 'pong'}));
});


/**
 * Permet à un utilisateur de s'en registrer 
 */
router.post('/register',
    anonymeController.register
);


/**
 * Prend en paramètre un pseudo/email et un mot de passe et renvoi un token en cas de réussite de l’authentification.
 * En cas d’échec, renvoi « Bad credential/incorect user »
 */
router.post('/login', anonymeController.login);

/**
 * Regenere un token
 */
router.get('/refresh-token',  anonymeController.refreshToken);

// l'utilisateur peut consulter des tips sans etre connecter

/**
 * Renvoie tous les tips valide du serveur
 */
router.get('/tips',  anonymeController.tipsValidate);

/**
 * Permet de reccuper un tips precis grace à son id
 */
router.get('/tips/:tipId',  anonymeController.tipId);

/**
 * Permet de reccuper tout les commentaires d'un tips grace à son id
 */
router.get('/tips/:tipId/commentaires',  anonymeController.tipIdCommentaires);

/**
 * Renvoie tous les tags  du serveur
 */
router.get('/tags' , anonymeController.Tags)

/**
 * La liste des differentes maniere d'obtenir un object
 */
router.get('/obtentions',  anonymeController.getObtentions);

/**
 * La liste des differents niveau de rarete d'un object
 */
router.get('/raretes',  anonymeController.getRaretes);

/**
 * La liste des differentes type possible d'un object
 */
router.get('/types',  anonymeController.getTypes);

module.exports = router;