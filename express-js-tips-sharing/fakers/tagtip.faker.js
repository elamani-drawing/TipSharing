const DB = require("../models/index");
const TagTip = DB.TagTip;
const { getRandomInt } = require('./module.faker');

/**
 * Genere des tagtip dans la base de données
 */
const generateFakeTagTip = async (tags, tips) => {
    let tagtip = []
    // for (const tag of tags) {
    //     for (const tip of tips) {
    //         // on fait un produit cartesiens de tags et tips
    //         tagtip.push(await TagTip.create({
    //             TipId : tip.id,
    //             TagId: tag.id
    //         }));
    //     }
    // }
    for (const tip of tips) {
        // on fait un produit cartesiens de tags et tips
        for (let index = 0; index < 4; index++) {
            // reccupere un tag au hasard
            const tag = tags[getRandomInt(tags.length - 1)];
            try {
                // essate de creer le tagtip 
                tagtip.push(await TagTip.create({
                    TipId: tip.id,
                    TagId: tag.id
                }));
            } catch (error) {
                // si ca a echouer, c'est que le tagtip existe, on ignore lerreur
            }

        }
    }
    return tagtip;
}

module.exports = {
    generateFakeTagTip
}