// ROUTER 
const { Router } = require("express");
const router = Router();

// MIDDLEWARES
const passport = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

// CONTROLLERS
const adminController = require("../controllers/admin.controller");

// ROUTES
// Précondition: Avoir un token valide et etre administrateur

//placement d'un middleware verifiant si l'utilisateur est un admin ou non
router.all("/*", adminMiddleware.adminGuard);

/**
 * Permet d'avoir la liste des admins
 */
router.get('/',  adminController.admins);
/**
 * Renvoie les tips invalide se trouvant dans la base de donnée
 */
router.get('/tips',  adminController.tipsInvalid);
/**
 * Permet de valider un tips
 */
router.post('/tips/valider',  adminController.validateTips);
/**
 * Reccupere tous les utilisateurs de la base de donnée
 */
router.get('/user',  adminController.users);
/**
 * Permet de bannir et debannir un membre
 */
router.post('/user/ban',  adminController.adminBanOrUnbanMember);
/**
 * Permet de promouvoir un membre en admin
 */
router.post('/user/promote', adminController.adminAdd);

module.exports = router;
