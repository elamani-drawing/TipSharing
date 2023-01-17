const jwt = require("jsonwebtoken");
const env = require("../modules/env.module");
const { userIsActif } = require("../modules/user.module");
const DB = require("../models/index");
const Tip = DB.Tip;
const Tag = DB.Tag;
const Commentaire = DB.Commentaire;
const User = DB.User;

const Type = DB.Type;
const Rarete = DB.Rarete;
const Obtention = DB.Obtention;

// MIDDLEWARES
const passport = require("../middlewares/auth.middleware");
const { succesResponse, errorResponse, createJwtToken, makeXsrfToken, isNumber } = require("../modules/share.module");

module.exports = {
    /**
     * Inscrit un utilisateur
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    register:
        async (req, res, next) => {
            passport.authenticate('register', { session: false },
                async (error, user, info) => {
                    if (!!user) {
                        // L'utilisateur à etait inscrit
                        // Selection des informations public à lui r'envoyer, pour eviter d'envoyer des informations sensible sans le vouloir
                        const body = { id: user.id, pseudo: user.pseudo, admin: user.isAdmin, email: user.email, lastName: user.lastName, firstName: user.firstName, picture: user.picture };
                        res.json(
                            succesResponse('Inscription réeussi', body)
                        );
                    } else {
                        //une erreur 
                        res.json(
                            errorResponse(error)
                        );
                    }
                }
            )(req, res, next);
        },

    /**
     * Connecte un utilisateur et lui renvoie un token valide durant 5 minutes
     * @param {*} err 
     * @param {*} user 
     * @param {*} info 
     * @returns 
     */
    login:
        async (req, res, next) => {
            passport.authenticate(
                'login',
                async (err, user, info) => {
                    try {
                        if (err || !user) {
                            // return next(info);
                            return res.json(errorResponse(info));
                        }
                        req.login(
                            user,
                            { session: false },
                            async (error) => {
                                if (error) return next(error);
                                //preparation des données à inscrire dans le token dans le token
                                const body = {
                                    id: user.id,
                                    pseudo: user.pseudo,
                                    isAdmin: user.isAdmin
                                };
                                //creation du token
                                const payload = createJwtToken(body);
                                payload['isAdmin'] = user.isAdmin;
                                //envoie du coockie 
                                res.cookie('jwt_token', payload.token, {
                                    httpOnly: true,
                                    secure: true,
                                    maxAge: env.JWT_DURING_TIME * 60 * 1000
                                });
                                //envoie du token à l'utilisateur
                                return res.json(succesResponse(info, payload));
                            }
                        );
                    } catch (error) {
                        // return next(error);
                        return res.json(errorResponse(info));
                    }
                }
            )(req, res, next);
        },

    /**
     * Permet à un utilisateur de regenerer son token
     * @param {*} req 
     * @param {*} res 
     */
    refreshToken: async (req, res) => {
        const bearerHeader = req.headers['authorization'];
        let refreshToken = 'le refresh est refuser';
        if (bearerHeader) {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            try {
                let decode = jwt.verify(
                    bearerToken,
                    env.SECRET_JWT_KEY,
                    {
                        clockTolerance: env.JWT_MAX_EXPIRATION_TIME * 60 //accepte de renouveler un token jusqua JWT_MAX_EXPIRATION_TIME min d'expirations
                    }
                );
                //generation d'un nouveau token valide
                const payload = createJwtToken(decode.user);
                // payload['isAdmin'] = decode.user.isAdmin;
                if (await userIsActif(decode.user.id)) {
                    // l'utilisateur na pas été bannis entre temps, on peut renouveler son token

                    //envoie du coockie 
                    res.cookie('jwt_token', payload.token, {
                        httpOnly: true,
                        secure: true,
                        maxAge: env.JWT_DURING_TIME * 60 * 1000
                    });
                    return res.json(
                        succesResponse('Le token à été regenerer', payload)
                    );
                }
            } catch (error) {
                // console.log(error)
            }
        }
        res.json(
            errorResponse('Le token n\'a pas été regenerer', { refreshToken })
        );
    },
    /**
     * Renvoie les tips se trouvant dans la base de donnée
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    tipsValidate: async (req, res) => {
        const tips = await Tip.findAll({
            include: [
                {
                    model: User,
                    as: 'User'
                }
            ],
            where: {
                isValidate: true, // reccupere que les tips valide
                '$User.isActif$': true // on ne reccupere pas les tips des personnes qui sont bannis
            },
            // range dans l'ordre decroissant
            order: [
                ['id', 'DESC'],
            ],
        });
        res.json(succesResponse('', { tips }));
    },

    /**
     * Permet de reccuper un tip grace à son id
     * Ex: .../tips/1/
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    tipId: async (req, res) => {
        const body = req.params;
        //verification de l'id
        if (body && !!body.tipId == false) {
            return res.json(
                errorResponse(`L'id de tip est manquante`)
            );
        }
        // si l'id n'est pas un nombre on renvoit une erreur
        if (!isNumber(body.tipId)) {
            return res.json(
                errorResponse(`L'id de tip doit être un nombre`)
            );
        }
        // reccuperation du tip
        let tip = await Tip.findOne({
            include: [
                { model: Tag },
                {
                    model: Rarete
                },
                {
                    model: Type
                },
                {
                    model: Obtention
                },
                {
                    model: User,
                    as: 'User'
                }
            ],// fait une jointure et reccupere ces tags
            where: {
                id: body.tipId,
                isValidate: true, // le tips doit etre valider 
                '$User.isActif$': true// l'utilisateur doit etre actif
            }
        });

        res.json(
            succesResponse('', { tip: tip })
        );
    },

    /**
     * Permet de reccupere tout les commentaires d'un tips
     * Ex: .../tips/1/commentaires
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    tipIdCommentaires: async (req, res) => {
        const body = req.params;
        //verification de l'id
        if (body && !!body.tipId == false) {
            return res.json(
                errorResponse(`L'id de tip est manquante`)
            );
        }
        // si l'id n'est pas un nombre on renvoit une erreur
        if (!isNumber(body.tipId)) {
            return res.json(
                errorResponse(`L'id de tip doit être un nombre`)
            );
        }
        // reccuperation des commentaires
        const commentaires = await Commentaire.findAll({
            include: [
                {
                    model: User,
                    as: 'User'
                }
            ],
            where: {
                TipId: body.tipId,
                '$User.isActif$': true // seul les commentaires de personnes actifs seront reccuperer
            },        
            // range dans l'ordre decroissant
            order: [
                ['id', 'DESC'],
            ],
        })
        return res.json(
            succesResponse('', { commentaires })
        );
    },
    /**
     * Renvoie tous les tags  du serveur
     * @param {*} req 
     * @param {*} res 
     */
    Tags: async (req, res) => {
        const tags = await Tag.findAll({
            include: [
                {
                    model: Tip,
                }
            ]
        }
        );
        res.json(succesResponse('', { tags }));
    },
    /**
     * La liste des differentes maniere d'obtenir un object
     * @param {*} req 
     * @param {*} res 
     */
    getObtentions: async (req, res) => {
        const obtentions = await Obtention.findAll();
        res.json(succesResponse('', { obtentions }));
    },
    /**
     * La liste des differents niveau de rarete d'un object
     * @param {*} req 
     * @param {*} res 
     */
    getRaretes: async (req, res) => {
        const raretes = await Rarete.findAll();
        res.json(succesResponse('', { raretes }));
    },
    /**
     * La liste des differentes type d'un object
     */
    getTypes: async (req, res) => {
        const types = await Type.findAll();
        res.json(succesResponse('', { types }));
    },

}