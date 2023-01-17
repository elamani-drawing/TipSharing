const DB = require("../models/index");
const Commentaire = DB.Commentaire;
const { getRandomInt } = require('./module.faker');
const comment_data = require("./datas/commentaire.data.json");

/**
 * retourne un commentaire aleatoire
 */
const getRandomComment = () => {
    return comment_data[getRandomInt(comment_data.length-1)].comment;
}

/**
 * Genere des commentaires dans la base de données
 */
const generateFakeCommentaires = async (users, tips) => {
    let commentaires = [];
    let commentaire;
    let turn = users.length> tips.length? tips.length : users.length ;// le nombre de fois quon va boucler
    for (let index = 0; index < turn; index++) {
        const user = users[index];
        const tip = tips[index];
        // on essaye de creer 5 commentaires avec l'user et le tip courrant
        for (let nbr = 0; nbr < 5; nbr++) {
            commentaire = await generateFakeCommentaire(user.id, tip.id, getRandomComment());
            if(!!commentaire) {
                // si le commentaire à ete creer, on l'enregistre
                commentaires.push(commentaires);
            }
        }
    }
    return commentaires;
}


const generateFakeCommentaire = async (UserId, TipId, comment) => {
    const commentaire = {
        UserId, 
        TipId, 
        comment
    }
    // s'il y a pas eu d'erreur on peut enregistrer le tag
    try {
        return await Commentaire.create(commentaire);
    } catch (error) {
        return false;    
    }
}

module.exports = {
    generateFakeCommentaires
}