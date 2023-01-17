// ROUTER 
const { Router } = require("express");
const router = Router();

// MIDDLEWARES
const passport = require("../middlewares/auth.middleware");

// CONTROLLERS
const membreController = require("../controllers/membre.controller");

// ROUTES
// Précondition: Avoir un token valide

/**
 * Prend en parametre un pseudo et renvoi les informations de l’utilisateur (nom, prénom, email, pseudo etc.)
 */
router.get('/profil/',  membreController.profil);

/**
 * Met à jour le profil d'un utilisateur (nom, prénom)
 */
router.post('/profil/',  membreController.profilUpdate);

/**
 * Renvoi tout les tips d'un membre
 */
router.get('/tips/all',  membreController.allTipsOfMembre);

/**
 * Renvoi les tips valide d'un membre
 */
router.get('/tips/:pseudo',  membreController.tipsOfMembre);


module.exports = router;