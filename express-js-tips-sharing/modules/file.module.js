const path = require("path");

const linkUserPdp= "userPDP/"
const linkTipsPicture= "tipsPicture/"

// const sizeMB = 1024 * 1024; //1 MB

const sizeO = 1; //1 octets
const sizeKO = 1024 * sizeO; // 1Ko
const sizeMO = 1024 * sizeKO; //1 Mo
const sizeGO = 1024 * sizeMO; // 1 GO
const sizeTO = 1024 * sizeGO; // 1 TO


const sizeLimit = {
    'picture': sizeMO * 5, //5 Mo
}
const extentions = {
    'picture': ['.jpg', '.jpeg', '.png', '.gif'],
}

/**
 * Verifie si un fichier à été envoyer
 * @param {*} files 
 * @returns true: envoyer, false: absent
 */
const filesPayloadExists = (files) => {
    if (!files) {
        return {
            'etat': false,
            'status' : 400 , //400 Bad Request
            'message': 'Un ou plusieurs fichiers attendues sont absent.'
        }
    }
    else {
        return {
            'etat': true,
            'status' : -1 ,
            'message': ''
        };
    }
}

/**
 * 
 * @param {*} typeFile Une des cles de extentions indiquant l'ensemble d'extension accepter pour files, ex: 'picture'
 * @param {*} files Les fichiers à verifier
 * @returns {}
 */
const fileExtentionAccepter = async (typeFile, files) => {
    //reccuperation des extentions
    const fileExtensions = []
    Object.keys(files).forEach(key => {
        fileExtensions.push(path.extname(files[key].name));
    })
    // verifie si l'ensemble des extensions fichiers uploader sont accepter
    const allowed = fileExtensions.every(ext => extentions[typeFile].includes(ext));
    if (!allowed) {
        return {
            'etat': false,
            'status' : 422 ,// 422 Unprocessable Entity
            'message': `1 ou plusieurs fichiers possedent une extension qui n'est pas valide. Voici la liste des extensions accepter: ${extentions[typeFile]}`
        };
    } 
    return {
        'etat': true,
        'status' : -1 ,
        'message': ''
    };
}
/**
 * 
 * @param {*} typeFile 
 * @param {*} files le fichier à verifier
 * @returns {boolean, number, string} 
 */
const fileSizeAccepter = async (typeFile, files) => {
    //Reccuperation de la liste des fichiers qui sont trop lourd
    const filesOverLimit = [];
    Object.keys(files).forEach(key => {
        if (files[key].size > sizeLimit[typeFile]) {
            filesOverLimit.push(files[key].name)
        }
    });

    if (filesOverLimit.length) {
        return {
            'etat': false,
            'status': 413, //size too large
            'message': `Au moin 1 fichier dépasse la taille maximal qui est de: ${sizeLimit[typeFile]} octets.`
        };
    }
    return {
        'etat': true,
        'status': -1,
        'message': 'OK'
    };
}

/**
 * Verifie si une image est acceptable par le serveur (selon nos criteres)
 * @param {*} file le fichier à verifier
 * @returns {boolean, string} un boolean avec l'erreur que possede le fichier
 */
const pictureValidator = async(files) => {
    const keyValidator = 'picture';
    // const functions = [fileSizeAccepter, fileExtentionAccepter];//les methodes qui sont utiliser pour la verification des fichiers de type picture
    
    let res = filesPayloadExists(files); 
    if (res.etat==true) {
        res = await fileSizeAccepter(keyValidator, files);
        if (res.etat==false){
            return res;
        }
        res = await fileExtentionAccepter(keyValidator, files);
        if (res.etat==false){
            return res;
        }
        //si on arrive ici, c'est qu'il n'y a eu aucune erreur dans les fichiers qu'on a recu
        res = {
            'etat': true,
            'status': -1,
            'message': 'OK'
        };
    }
    return res;
}

/**
 * Permet d'uploader un fichier sur le site, attention si le fichier existait deja en utilisant cette fonction vous decidez de l'ecraser
 * @param {String} link le dossier de destination ainsi que le nom du fichier, ex: userPDP/pseudo.jpg 
 * @param {*} file le fichier à upload
 * @returns true si ca à réeussi, et false sinon
 */
const uploadFile = (link, file) => {
    let uploadDirectory = `./media/upload/${link}`;
    try {
        file.mv(uploadDirectory, function (error) {
            if (error) throw error;
            else return true;
        })
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    pictureValidator, 
    uploadFile,
    linkTipsPicture,
    linkUserPdp
}