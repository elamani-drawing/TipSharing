const DB = require("../models/index");
const User = DB.User
const Tip = DB.Tip
const { Op } = require("sequelize");
const { succesResponse, errorResponse } = require("../modules/share.module");
const { userFormating } = require("../modules/user.module");

module.exports = {
    /**
     * Permet d'avoir la liste des admins
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    admins: async (req, res) => {
        // requete pour reccuperer tout les comptes administrateur
        const admins = await User.findAll({ 
            where: { isAdmin: true },
            // range dans l'ordre decroissant
            order: [
                ['id', 'DESC'],
            ],
        });
        // reponse envoyer à l'utilisateur
        res.json(
            succesResponse('', { administrateur: userFormating(admins) })
        );
    },
    /**
     * Permet d'ajouter un admin
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    adminAdd: async (req, res) => {
        // reccuperation du body
        const body = req.body;
        console.log(body)
        // si la cle username est manquante ou pas defini
        if (body && !!body.username == false) {
            return res.json(
                errorResponse(`La clé username est manquante`)
            );
        }
        // reccuperation de l'utilisateur ayant l'username correspondant
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { pseudo: body.username },
                    { email: body.username }
                ]
            }
        });
        // si on a pas d'utilisateur, on renvoie une erreur
        if (!!user == false) {
            return res.json(
                errorResponse(`L'utilisateur ${body.username} n'a pas été trouver`)
            );
        }
        // sinon on met à jour de l'utilisateur
        user.isAdmin = true;
        // on le sauvegarde
        await user.save();
        // on renvoie la reponse
        res.json(
            succesResponse(`L'utilisateur ${body.username} est desormais un admin`, { user: userFormating([user]) })
        );
    },
    /**
     * Permet de valider un tips
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    validateTips: async (req, res) => {
        const body = req.body;
        const tip = await Tip.findOne({
            where: {
                id: body.tipId, 
            }
        });
        if(!tip){
            return res.json(
                errorResponse("Le tip n'existe pas", {tip:null})
            )
        }
        // modification et sauvegarde
        tip.isValidate= true;
        tip.save();
        res.json(succesResponse('', { tip }));
    },
    /**
     * Renvoie les tips invalide se trouvant dans la base de donnée
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    tipsInvalid: async (req, res) => {
        // nous estimons que ca ne sert à rien d'afficher les tips des utilisateurs bannis tant qu'il le seront
        const tips = await Tip.findAll({
            include: [
                {
                    model: User,
                    as: 'User'
                }
            ],
            where: {
                isValidate: false, // reccupere que les tips non valide du serveur
                '$User.isActif$': true// l'utilisateur doit etre actif
            }, 
            // range dans l'ordre decroissant
            order: [
                ['id', 'DESC'],
            ],
        });
        res.json(succesResponse('', { tips }));
    },
    /**
     * Permet de bannir et debannir un membre
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    adminBanOrUnbanMember: async (req, res) => {
        const body = req.body;
        // tentative de reccuperer l'utilisateur
        const user = await User.findOne({
            where: {
                id: body.id // on utilise l'id pour etre sur qu'il ny a pas de malentondu (un utilisateur qui change son pseudo ou son mail pour pas se faire ban)
            }
        });
        // traitement du resultat
        if (!!user) {
            // mise à jour de l'utilsateur
            user.isActif = !user.isActif; // on lui passe l'inverse de la valeur qu'il avait deja
            await user.save();
            // retour positif
            return res.json(
                succesResponse(user.isActif ? `L'utilisateur ${user.pseudo} a été débanni` : `L'utilisateur ${user.pseudo} a été banni`, {
                    user: userFormating([user])
                })
            );
        } else {
            // retour negatif
            return res.json(errorResponse(`L'utilisateur ayant l'id '${body.id}' n'a pas été trouver`))
        }
    },
    /**
     * Reccupere tous les utilisateurs de la base de donnée
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    users: async (req, res) => {
        const users = await User.findAll({ 
            // range dans l'ordre decroissant
            order: [
                ['id', 'DESC'],
            ],
        });
        // traitement du resultat
        return res.json(
            succesResponse('', {
                users: userFormating(users)
            })
        );
    },

}