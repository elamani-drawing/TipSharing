const DB = require("../models/index");
const Tip = DB.Tip;
const tip_data = require("./datas/tip.data.json");

/**
 * Genere des tips dans la base de donnée
 */
const generateFakeTips = async (users) => {
    // let tips = [];
    // for (const tip of tip_data) {
    //     let _tip = await generateFakeTip(UserId, tip.title, tip.astuce, 'https://picsum.photos/800/400', false);
    //     if(!!_tip) {
    //         tips.push(_tip);
    //     }
    // }
    let tips = [];
    let turn = users.length> tip_data.length? tip_data.length : users.length ;// le nombre de fois quon va boucler
    for (let index = 0; index < turn; index++) {
        const user = users[index];
        const tip = tip_data[index];
        
        let _tip = await generateFakeTip(user.id, tip.title, tip.astuce, 'https://picsum.photos/800/400', false);
        if(!!_tip) {
            tips.push(_tip);
        }
    }

    return tips;
}

/**
 * Genere un Tip
 */
const generateFakeTip = async (UserId, title, astuce, picture, isValidate) => {
    const tip = {
        title, 
        astuce, 
        picture,
        isValidate,
        UserId
    }
    // s'il y a pas eu d'erreur on peut enregistrer le tag
    try {
        return await Tip.create(tip);
    } catch (error) {
        return false;    
    }
}

module.exports = {
    generateFakeTips
}