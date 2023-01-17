const DB = require("../models/index");
const User = DB.User;
const Tip = DB.Tip;
const path = require("path");
const { userFormating, updateUserWithBody } = require("../modules/user.module");
const { succesResponse, errorResponse, createJwtToken } = require("../modules/share.module");
const { pictureValidator, uploadFile, linkUserPdp } = require("../modules/file.module");


module.exports = {
    /**
     * Renvoie le profil de l'utilisateur grace à son pseudo
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    profil: async (req, res) => {
        const data = req.query;
        let pseudo = data.pseudo;
        //si la requete est correctement former
        if (!pseudo) {
            pseudo = req.user.pseudo; //s'il ne donne pas de pseudo on affiche son profil
        }
        //recherche d'un utilisateur ayant pseudo = username
        let user = await User.findOne({ where: { pseudo: pseudo } });
        user = userFormating(user ? [user] : []);
        return res.json(
            succesResponse('', Array.isArray(user) && user.length == 0 ? { user: null } : { user })
        );
    },

    /**
     * Met à jour le profil d'un utilisateur
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    profilUpdate: async (req, res) => {
        const body = req.body;
        const user = await User.findOne({
            where: {
                pseudo: req.user.pseudo
            }
        });

        // si l'utilisateur existe, ont met a jour ses données
        let resultat
        // on met à jour les données de l'utilisateur
        if (user) {
            resultat = await updateUserWithBody(user, body);
        } else {
            resultat = { error: { attribut: 'user', message: `Cet utilisateur n'a pas été trouver` } }
        }
        if (!user || resultat.error) {
            // une erreur c'est produite durant le traitement des données
            return res.json(
                errorResponse(
                    resultat.error
                )
            );
        }
        // verifie si on a une image
        if (req.files) {
            const pictureValid = await pictureValidator(req.files);
            //s'il y a eu un probleme sur l'image on retourne l'erreur indiquer par le validator
            if (pictureValid.etat == false) {
                return res.json(
                    errorResponse(
                        pictureValid.message
                    )
                );
            }
            user.picture = `${user.pseudo}${path.extname(req.files.picture.name)}`;
            // nous sauvegardons donc ca nouvelle photo de profil
            uploadFile(linkUserPdp + user.picture, req.files.picture);
            resultat.history.push("picture");
        }
        await resultat.user.save();
        // si le pseudo a ete modifier, on rafraichi le token de l'utilisateur
        if (resultat.history.includes("pseudo")) {
            resultat["jwt"] = createJwtToken({
                id: user.id,
                pseudo: user.pseudo,
                isAdmin: user.isAdmin
            });
            resultat["jwt"]['isAdmin'] = user.isAdmin;
        }
        res.json(
            succesResponse('', {
                historique: {
                    description: 'Listes des attributs mis à jour',
                    values: resultat.history
                },
                refreshData: {
                    user: userFormating([resultat.user]),
                    jwt: resultat.jwt
                }
            })
        );
    },
    /**
     * Permet de reccuperer tout les tips valide d'un membre
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    tipsOfMembre: async (req, res) => {
        // const data = req.query;
        const data = req.params;
        let pseudo = data.pseudo;
        if (!pseudo) {
            pseudo = req.user.pseudo; //si on ne recoit pas de pseudo on renvoi les tips du membre connecter
        }
        // reccuperation des tips
        const tips = await Tip.findAll({
            include: [
                {
                    model: User,
                    as: 'User'
                }
            ],
            where: {
                isValidate: true, // reccupere que les tips valide
                '$User.pseudo$': pseudo // on filtre les resultats par apport au pseudo
            },
            // range dans l'ordre decroissant
            order: [
                ['id', 'DESC'],
            ],
        });
        return res.json(
            succesResponse('', { tips })
        );
    },
    /**
     * Permet de reccuperer tout les tips d'un membre (meme les invalide)
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    allTipsOfMembre: async (req, res) => {
        // const data = req.query;
        let pseudo;
        if (!pseudo) {
            pseudo = req.user.pseudo;
        }
        // reccuperation des tips
        const tips = await Tip.findAll({
            include: [
                {
                    model: User,
                    as: 'User'
                }
            ],
            where: {
                '$User.pseudo$': pseudo // on filtre les resultats par apport au pseudo
            },
            // range dans l'ordre decroissant
            order: [
                ['id', 'DESC'],
            ],
        });
        return res.json(
            succesResponse('', { tips })
        );
    },
}