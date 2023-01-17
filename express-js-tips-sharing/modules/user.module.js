const DB = require('./../models/index');
const User = DB.User;
const { Op } = require("sequelize");
const regexEmail = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g;
const regexPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}/g;  //Minimum 8 caractères, maximum 15 caractères, au moins une lettre majuscule, une lettre minuscule, un caractères special et un chiffre
const regexPseudo = /[a-zA-Z0-9-_]{3,15}/g

/**
 * Enleve les informations "sensible" de l'utilisateur, comme le password etc.
 * @param {[Object]} list_user est une liste d'utilisateur
 * @return une nouvelle liste avec les informations pretes à etre afficher au utilisateur
 */
const userFormating = (list_user) => {
    let new_list_user = [];
    for (let user of list_user) {
        delete user.password; //lorsqu'on a un object Users
        delete user.dataValues.password; //lorsqu'on a un object Users.dataValues
        new_list_user.push(
            user
        )
    }
    if (new_list_user.length == 0) return new_list_user;
    else if (new_list_user.length == 1) return new_list_user[0];
    return new_list_user;
}

const selectUserWithUsername = async (username) => {
    return await User.findOne({
        where: {
            [Op.or]: [
                { pseudo: username },
                { email: username }
            ]
        }
    });
}

/**
 * Verifi si l'email est correctement former
 * @param {*} email l'email a verifier
 * @returns true (valide) ou false (invalide)
 */
const emailValidator = async (email) => {
    if(!email){
        return false;
    }
    let res = email.match(regexEmail);
    // nous avons un match et il correspond parfaitement a se qua renseigner l'utilisateur
    return (!!res) && res.length == 1 && res[0]==email;
}
/**
 * Verifi si le mot de passe est correctement former
 * @param {*} password le mot de passe a verifier
 * @returns true (valide) ou false (invalide)
 */
const passwordValidator = async (password) => {
    if(!password){
        return false;
    }
    let res = password.match(regexPassword);
    // nous avons un match et il correspond parfaitement a se qua renseigner l'utilisateur
    return  (!!res) && res.length == 1 && res[0]==password;
}
/**
 * Verifi si le pseudo est correctement former
 * @param {*} pseudo le pseudo à verifier
 * @returns 
 */
const pseudoValidator = async (pseudo) => {
    if(!pseudo){
        return false;
    }
    let res = pseudo.match(regexPseudo);
    return (!!res) && res.length == 1;
}

/**
 * Verifie que l'email est disponnible
 * @param {*} email 
 * @returns 
 */
const emailDisponnible = async (email) => {
    const user = await User.findOne({
        where: {
            email: email,
        }
    });
    if (user) {
        return {
            'etat': false,
            'status': -1, //connait pas le numero de l'erreur mais de toute facon on ne le renvoie pas
            'message': 'Cet email n\'est pas disponnible.'
        }
    }
    return {
        'etat': true,
        'status': -1,
        'message': ''
    };
}

/**
 * Verifie que le pseudo est disponnible
 * @param {*} pseudo 
 * @returns 
 */
const pseudoDisponnible = async (pseudo) => {
    const user = await User.findOne({
        where: {
            pseudo: pseudo,
        }
    });
    if (user) {
        return {
            'etat': false,
            'status': -1, //connait pas le numero de l'erreur mais de toute facon on ne le renvoie pas
            'message': 'Ce pseudo n\'est pas disponnible.'
        }
    }
    return {
        'etat': true,
        'status': -1,
        'message': ''
    };
}

/**
 * Verifie si user est valide
 * @param {*} user Un object ayant les attributs de User
 * @returns 
 */
const userValidator = async (user) => {
    //la fonction verifie juste le contenu de l'object, si vous oubliez un attribut il ne le dira pas
    let messages = [];
    for (const [key, value] of Object.entries(user)) {
        if (value == undefined) {
            messages.push({
                'attribute': `${key}`,
                'message': `n'a pas été défini.`
            });
        }
    }

    if (messages.length == 0) {
        let email = await emailValidator(user.email);
        if (email == false) {
            messages.push({
                'attribute': 'email',
                'message': `Merci d\'entrer une adresse email valide`
            });
        }
        let pass = await passwordValidator(user.password)
        if (pass == false) {
            messages.push({
                'attribute': 'password',
                'message': "Le mot de passe doit être entre 8 et 15 caractères, avoir au moins une majuscule, une minuscule, un caractères special et un chiffre"
            });
        }
    }
    return { messages, user };
}

/**
 * Met à jour l'email de l'utilisateur
 * @param {*} user l'instance User
 * @param {*} email L'ancien email
 * @param {*} newEmail le nouvel email
 * @param {*} buffer est une liste qui retrace les modifications de user
 */
const setEmail = async (user, email, newEmail, buffer) => {
    // verifie si l'ancien email est le bon
    if (!(email == user["email"])) {
        // le mail est faux 
        return { user, buffer, error: { attribut: 'email', message: `Votre email actuel est incorret` } };
    }
    res = await emailValidator(newEmail);
    if (res == false) {
        return { user, buffer, error: { attribut: 'newEmail', message: "Votre nouvel email n'est pas valide" } };
    }
    // verifie que personne d'autre n'a se mail
    res = await emailDisponnible(newEmail);
    if (res.etat==false && (res.id != user.id)) {
        return { user, buffer, error: { attribut: 'newEmail', message: `Votre nouvel email est déjà ratacher à un compte, choisissez en un autre` } };
    }
    // on peut changer lemail
    user["email"] = newEmail;
    buffer.push("email");
    return { user, buffer }
}


/**
 * Met à jour le pseudo
 * @param {*} user l'instance User
 * @param {*} pseudo L'ancien pseudo
 * @param {*} newPseudo le nouveau pseudo
 * @param {*} buffer est une liste qui retrace les modifications de user
 */
const setPseudo = async (user, pseudo, newPseudo, buffer) => {
    // es ce que c'est un pseudo valide
    res = await pseudoValidator(newPseudo);
    if (res == false) {
        return { user, buffer, error: { attribut: 'newPseudo', message: "Votre nouveau pseudo n'est pas un pseudo valide: Le pseudo doit contenir 3 à 15 carracteres et ne peut etre composer que de lettre et de nombre" } };
    }
    // es ce qu'il est disponnible
    res = await pseudoDisponnible(newPseudo);
    if (res.etat == false) {
        return { user, buffer, error: { attribut: 'newPseudo', message: res.message } };
    }
    // on peut changer lemail
    user["pseudo"] = newPseudo;
    buffer.push("pseudo");
    return { user, buffer }
}


/**
 * Met à jour le mot de passe
 * @param {*} user l'instance User
 * @param {*} password L'ancien mot de passe
 * @param {*} newpassword le nouveau mot de passe
 * @param {*} buffer est une liste qui retrace les modifications de user
 * @returns {User, string[], {}[]} un object contenant l'utilisateur et l'historique des modifications qu'il a recu, et les erreurs rencontrer
 */
const setPassword = async (user, password, newPassword, buffer) => {
    // verifie si l'ancien mot de passe est le bon
    let res = await User.checkPassword(password, user.password);
    if (!res) {
        // le mot de passe est faux 
        return { user, buffer, error: `Le mot de passe actuel que vous avez saisi est incorrect` }
    }
    res = await passwordValidator(newPassword)
    if (res == false) {
        return { user, buffer, error: "Le mot de passe doit être entre 8 et 15 caractères, avoir au moins une majuscule, une minuscule, un caractères special et un chiffre" }
    }
    // on peut changer le mot de passe
    user["password"] = await User.hashPassword(newPassword);
    buffer.push("password");
    return { user, buffer }
}


/**
 * Met à jour une valeur de user
 * @param {*} user une instance de User
 * @param {*} key la cle (doit etre dans user et body)
 * @param {*} body le body ayant la valeur a attribuer
 * @param {*} buffer est une liste qui retrace les modifications de user
 * @returns {User, string[], {}[]} un object contenant l'utilisateur et l'historique des modifications qu'il a recu et les ereurs rencontrer
 */
const setValueUserWithHistory = async (user, key, body, buffer) => {
    // si la cle qu'on a recu n'est pas defini, nous ne faisons aucune modification
    if ((body && !!body[key] == false) || (user && !!user[key] == false)) {
        return { user, buffer }
    }
    // nous avons recu une valeur à modifier
    // if(key =="password"){
    //     // si c'est le mot de passe, on le hash avant de l'enregistrer
    //     user[key] = await User.hashPassword(body[key]);
    // }
    // else{
    // sinon on enregistre juste la valeur
    user[key] = body[key];
    // }
    // ajout de la cle dans le buffer
    buffer.push(key);
    return { user, buffer }
}

/**
 * Met à jour l'utlisateur en utilisant le contenu du body
 * @param {*} user l'utilisateur qui va etre modifier 
 * @param {*} body le body contenant les informations de mise à jour
 * @returns {User, string[], {}[]} un object contenant l'utilisateur et l'historique des modifications qu'il a recu et les erreurs rencontrer
 */

const updateUserWithBody = async (user, body) => {
    let history = [];
    let res;
    let error=false;
    if(body)
    for (const key in body) {
        // si c'est le mot de passe qu'est modifier
        if (key == "password") {
            // si c'est le mot de passe, on appelle sa fonction
            res = await setPassword(user, body[key], body["newPassword"], history);
        } else if (key == "newPseudo") {
            // si c'est le pseudo qu'on doit modifier
            // on appelle sa fonction 
            res = await setPseudo(user, user.pseudo, body["newPseudo"], history);
        } else if (key == "email") {
            // si c'est lemail qu'on doit modifier
            // on appelle sa fonction 
            res = await setEmail(user, body[key], body["newEmail"], history);
        } else {
            // si c'est un autre attribut
            res = await setValueUserWithHistory(user, key, body, history);

        }
        user = res.user;
        history = res.buffer;
        error = res.error;
        if (error) break; // s'il y a eu une erreur, ca sert a rien de poursuivre
    }
    return { user, history, error }
}

/**
 * Indique si l'utilisateur est actif ou non
 * @param {number} id 
 * @returns un boolean
 */
const userIsActif = async (id) => {
    const user = await User.findOne({
        where: {
            id: id,
            isActif: true
        }
    });
    return !!user;
}

module.exports = {
    userFormating,
    userValidator,
    emailDisponnible,
    pseudoDisponnible,
    updateUserWithBody,
    userIsActif
}