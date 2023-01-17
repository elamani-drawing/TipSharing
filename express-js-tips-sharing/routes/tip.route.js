// ROUTER 
const { Router } = require("express");
const router = Router();

// MIDDLEWARES
const passport = require("../middlewares/auth.middleware");

// CONTROLLERS
const tipsController = require("../controllers/tip.controller");

// ROUTES
// Précondition: Avoir un token valide

/**
 * Permet de poster un tip sur le site
 */
router.post('/',  tipsController.tipPost);

/**
 * Permet de poster un commentaire sur un tips grace à son id
 */
router.post('/commentaires',  tipsController.tipCommentairesPost);

/**
 * Permet de supprimer un commentaire sur un tips grace à l'id du commentaire
 */
router.delete('/commentaires/:commentaireId',  tipsController.tipCommentairesDelete);


/**
 * Permet de supprimer un tips precis grace à son id
 */
router.delete('/:tipId',  tipsController.tipDelete);


module.exports = router;