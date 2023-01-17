const DB = require("../models/index");

const Tip = DB.Tip;
const Commentaire = DB.Commentaire;
const TagTip = DB.TagTip;
const Tag = DB.Tag;
const User = DB.User;

const Type = DB.Type;
const Rarete = DB.Rarete;
const Obtention = DB.Obtention;
// const Information = DB.Information;

const { succesResponse, errorResponse, isNumber } = require("../modules/share.module");
const { pictureValidator, uploadFile, linkTipsPicture } = require("../modules/file.module");
const path = require("path");

module.exports = {

    /**
     * Permet de creer un tips
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */

    tipPost: async (req, res) => {
        const body = req.body;
        //verification des information necessaire
        if (body && !!body.title == false) {
            return res.json(
                errorResponse(`Le titre est obligatoire`)
            );
        }
        if (body && !!body.content == false) {
            return res.json(
                errorResponse(`Le contenu est obligatoire`)
            );
        }
        let rarete, type, obtention;
        if (body && !!body.rarete == false) {
            return res.json(
                errorResponse(`Vous devez indiquez le niveau de rarete de l'object`)
            );
        }
        // si la rarete n'existe pas on arrete
        rarete = await Rarete.findOne({
            where: {
                label: body.rarete
            }
        });
        if (!rarete) {
            return res.json(
                errorResponse(`Le niveau de rarete indiquer n'existe pas`)
            );
        }

        if (body && !!body.type == false) {
            return res.json(
                errorResponse(`Vous devez indiquez le type de l'object`)
            );
        }
        // si le type n'existe pas on arrete
        type = await Type.findOne({
            where: {
                label: body.type
            }
        });
        if (!type) {
            return res.json(
                errorResponse(`Le type indiquez n'existe pas`)
            );
        }

        if (body && !!body.obtention == false) {
            return res.json(
                errorResponse(`Vous devez indiquez la maniere d'obtenir l'object`)
            );
        }
        // si la rarete n'existe pas on arrete
        obtention = await Obtention.findOne({
            where: {
                label: body.obtention
            }
        });
        if (!obtention) {
            return res.json(
                errorResponse(`L'obtention indiquer n'existe pas`)
            );
        }
        //verification de picture
        const pictureValid = await pictureValidator(req.files);
        //s'il y a eu un probleme sur l'image on retourne l'erreur indiquer par le validator
        if (pictureValid.etat == false) {
            return res.json(
                errorResponse(pictureValid.message, { type: 'picture' })
            )
        }
        //l'image est valide
        //nous avons assez d'information pour creer un tip
        let new_tip;
        try {
            new_tip = await Tip.create({
                title: body.title,
                astuce: body.content,
                picture: 'defaulttips.jpg',
                UserId: req.user.id,
                isValidate: false,
                RareteId: rarete.id, 
                TypeId: type.id,
                ObtentionId: obtention.id
            });
        } catch (error) {
            //ce n'est jamais censer se realiser, mais on laisse un message d'erreur au cas ou
            return res.json(
                errorResponse(`La création du tip à échouée`, { key: 'serveur' })
            );
        }
        // verifications des tags 
        if (body && !!body.tags == false || !Array.isArray(body.tags) || body.tags.length < 2) {
            return res.json(
                errorResponse(`Un tip doit avoir au moin 2 tags`)
            );
        }
        // creation des tags
        let tags = [];
        let tag;
        for (const tag_string of body.tags) {
            // recherche d'un tag ayant le label tag_string
            tag = await Tag.findOne({
                where: {
                    label: tag_string
                }
            });
            if (!!tag == false) {
                // le tag n'a pas ete trouver, on essaye de le cree
                try {
                    tag = await Tag.create({
                        label: tag_string
                    });
                    // creation reussi
                } catch (error) {
                    // il y a eu une erreur, le label doit etre trop long ou trop petit
                    return res.json(
                        errorResponse(`Un tag doit faire entre 3 et 20 carracteres`)
                    );
                }
            }
            // le tag a ete trouver ou a ete creer
            tags.push(tag);
        }
        // nous avons la liste des tags 
        // nous avons pus le tips
        const nameFile = "tips" + new_tip.id;// nous reccuperons l'id
        const picture = `${nameFile}${path.extname(req.files.picture.name)}`
        // nous sauvegardons donc sa photo 
        uploadFile(linkTipsPicture + picture, req.files.picture);
        // nous mettons à jour l'url de l'image du tips
        new_tip.picture = picture;
        new_tip.save();
        // nous lions les tags et le tips
        for (const tag of tags) {
            await TagTip.create({
                TipId: new_tip.id,
                TagId: tag.id
            });
        }
        // reccuperation des informations du type
        new_tip = await Tip.findOne({
            include : [
                {
                    model : Rarete,
                    as : 'Rarete' 
                }, 
                {
                    model : Type,
                    as : 'Type' 
                }, 
                {
                    model : Obtention,
                    as : 'Obtention' 
                },
            ], 
            where: {
                id: new_tip.id
                
            }
        })

        return res.json(
            succesResponse(`Le tip à bien été créer`, { tip: new_tip, tags: tags })
        );
    },
    /**
     * Permet de supprimer un tips grace à son id
     * Ex: .../tips/id
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    tipDelete: async (req, res) => {
        const body = req.params;
        //verification du tipId
        if (body && !!body.tipId == false) {
            return res.json(
                errorResponse(`L'id de tips est manquante`)
            );
        }
        // si l'id n'est pas un nombre on renvoit une erreur
        if (!isNumber(body.tipId)) {
            return res.json(
                errorResponse(`L'id de tip doit être un nombre`)
            );
        }
        // reccuperation du tip
        const tip = await Tip.findOne({
            where: {
                id: body.tipId
            }
        });
        if (tip) {
            // suppression de ces commentaires
            // Commentaire.destroy({
            //     where: {
            //         TipId : tip.id
            //     }
            // })
            // les commentaires sont normalement supprimer en cascade
            // reccuperation de l'utilisateur connecter
            const user = await User.findOne({
                where: {
                    pseudo: req.user.pseudo
                }
            })
            // si l'utilisateur est le createur du tips ou un admin, il peut supprimer le tip
            if (user.id == tip.UserId || user.isAdmin) {
                //suppression du tips
                await tip.destroy();
                return res.json(
                    succesResponse('Le tip à bien été supprimer', { tip })
                );
            } else {
                return res.json(
                    errorResponse(`Vous n'avez pas le droit de supprimer se tip`)
                )
            }
        } else {
            return res.json(
                errorResponse(`Le tip n'a pas été trouver`)
            )
        }
    },

    /**
     * Permet de poster un commentaires sur un tips
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    tipCommentairesPost: async (req, res) => {
        const body = req.body;
        //verification de l'id
        if (body && !!body.content == false) {
            return res.json(
                errorResponse(`Il n'y a pas de contenu`, { key: 'content' })
            );
        }
        if (body && !!body.tipId == false) {
            return res.json(
                errorResponse(`Il manque l'id du tip`, { key: 'tipId' })
            );
        }
        // si l'id n'est pas un nombre on renvoit une erreur
        if (!isNumber(body.tipId)) {
            return res.json(
                errorResponse(`L'id de tip doit être un nombre`)
            );
        }
        // reccuperation du tip
        const tip = await Tip.findOne({
            where: {
                id: body.tipId
            }
        });
        if (!!tip == false) {
            return res.json(
                errorResponse(`Ce tip n'existe pas`, { key: 'serveur' })
            );
        }
        //nous avons un contenu et un id de tips
        let new_commentaire;
        try {
            new_commentaire = await Commentaire.create({
                comment: body.content,
                TipId: tip.id,
                UserId: req.user.id
            });
        } catch (error) {
            //ce n'est jamais censer se realiser, mais on laisse un message d'erreur au cas ou
            return res.json(
                errorResponse(`La création du commentaire à échouée`, { key: 'serveur' })
            );
        }
        new_commentaire.save();
        return res.json(
            succesResponse(`Le commentaire à bien été créer`, { commentaire: new_commentaire })
        );
    },

    /**
     * Permet de supprimer un commentaires sur un tip
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    tipCommentairesDelete: async (req, res) => {
        const body = req.params;
        //verification de l'id
        if (body && !!body.commentaireId == false) {
            return res.json(
                errorResponse(`L'id de commentaire est manquante`)
            );
        }
        // si l'id n'est pas un nombre on renvoit une erreur
        if (!isNumber(body.commentaireId)) {
            return res.json(
                errorResponse(`L'id de commentaire doit être un nombre`)
            );
        }
        // reccuperation du commentaire
        const commentaire = await Commentaire.findOne({
            where: {
                id: body.commentaireId,
            }
        });
        if (commentaire) {
            const user = await User.findOne({
                where: {
                    pseudo: req.user.pseudo
                }
            })
            // si l'utilisateur est le createur du commentaire ou un admin, il peut supprimer le commentaire
            if (user.id == commentaire.UserId || user.isAdmin) {
                //suppression du commentaire
                await commentaire.destroy();
                return res.json(
                    succesResponse('Le commentaire à bien été supprimer', { commentaire })
                );
            } else {
                return res.json(
                    errorResponse(`Vous n'avez pas le droit de supprimer ce commentaire`)
                )
            }
        } else {
            return res.json(
                errorResponse(`Le commentaire n'a pas été trouver`)
            )
        }
    },
    

}