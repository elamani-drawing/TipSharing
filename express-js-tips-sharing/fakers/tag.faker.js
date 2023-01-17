const DB = require("../models/index");
const Tag = DB.Tag;
const tag_data = require("./datas/tag.data.json");

/**
 * Genere des tag dans la base de donnée
 */
const generateFakeTags = async () => {
    let tags = [];
    for (const tag of tag_data) {
        let _tag = await generateFakeTag(tag.label);
        if(!!_tag) {
            tags.push(_tag);
        }
    }
    return tags;
}

/**
 * Genere un tag
 */
const generateFakeTag = async (label) => {
    const tag = {
        label
    }
    // s'il y a pas eu d'erreur on peut enregistrer le tag
    try {
        return await Tag.create(tag);
    } catch (error) {
        return false;    
    }
}

module.exports = {
    generateFakeTags
}