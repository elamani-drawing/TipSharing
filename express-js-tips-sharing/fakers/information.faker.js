const DB = require("../models/index");

const Tip = DB.Tip;
const Type = DB.Type;
const Rarete = DB.Rarete;
const Obtention = DB.Obtention;
// const Information = DB.Information;

const type_data =  require("./datas/type.data.json");
const rarete_data =  require("./datas/rarete.data.json");
const obtention_data =  require("./datas/obtention.data.json");

const {getRandomInt} = require("./module.faker");

/**
 * Genere de faux type
 */
const generateFakeType = async () => {
    let types = []
    for (const item of type_data) {
        // creer et ajoute l'element
        types.push(
            await Type.create({
                label : item.label
            })
        );
    }
    return types

}

/**
 * Genere de fausse Rarete
 */
const generateFakeRarete = async () => {
    let raretes = []
    for (const item of rarete_data) {
        // creer et ajoute l'element
        raretes.push(
            await Rarete.create({
                label : item.label
            })
        );
    }
    return raretes
}

/**
 * Genere de fausse Obtention
 */
const generateFakeObtention = async () => {
    let obtentions = []
    for (const item of obtention_data) {
        // creer et ajoute l'element
        obtentions.push(
            await Obtention.create({
                label : item.label
            })
        );
    }
    return obtentions
}
/**
 * Genere des fausses informations dans la base de donnée
 * @param {*} tips la liste de tips
 * @param {*} obtentions une liste d'obtentions pour informations
 * @param {*} raretes une liste de rarete pour informations
 * @param {*} types une liste de types pour informations
 * @returns 
 */
const generateFakeInformation = async (tips, obtentions, raretes, types) => {
    let ob;
    let ra;
    let ty;
    // let info;
    // let infos = []
    // parcour la liste des tips, creer des informations pour chaque tips
    for (const tip of tips) {
        // selectionne les valeur au hasard
        ob = obtentions[getRandomInt(obtentions.length-1)];
        ra = raretes[getRandomInt(raretes.length-1)];
        ty = types[getRandomInt(types.length-1)];
        // creer l'information
        // info = await Information.create({
        //     RareteId : ra.id,
        //     TypeId: ty.id,
        //     ObtentionId: ob.id,
        //     TipId: tip.id
        // });
        tip.RareteId = ra.id;
        tip.TypeId = ty.id;
        tip.ObtentionId = ob.id;
        await tip.save();
        // infos.push(info);
        console.log("---------------------------------------", tip.ObtentionId)
    }
    // return infos;
}

/**
 * Créer des faux informations dans la base de donnée
 * @param {*} tips une liste de tips
 * @returns 
 */
const makeFakeInformations = async (tips) => {
    // genere les differents element dont a besoin une information
    let obtentions = await generateFakeObtention();
    let raretes = await generateFakeRarete();
    let types = await generateFakeType();
    await generateFakeInformation(tips, obtentions, raretes, types);
    return {obtentions, raretes, types}
}

module.exports = {
    makeFakeInformations
}