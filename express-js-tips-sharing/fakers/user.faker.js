const DB = require("../models/index");
const {getRandomInt} = require('./module.faker');
const { userValidator } = require("../modules/user.module");
const User = DB.User;
const user_data = require("./datas/user.data.json");

const password_user = "MotDepasse42$";

/**
 * Genere des utilisateurs dans la base de donnée
 */
const generateFakeUsers = async () => {
    let users = [];
    for (const user of user_data) {
        let _user = await generateFakeUser(user.firstName + getRandomInt(100), user.email, user.firstName, user.lastName, user.picture, false)
        if(!!_user) {
            users.push(_user);
        }
    }
    return users;
}

/**
 * Genere un utilisateur fake
 */
const generateFakeUser = async (pseudo, email, firstName, lastName, picture, isAdmin) => {
    const { messages, user } = await userValidator({
        pseudo: pseudo,
        password: password_user,
        email: email,
        firstName: firstName,
        lastName: lastName,
        picture: picture,
        isAdmin: isAdmin,
        isActif: true, // par defaut tout les comptes sont activer
    });
    // s'il y a pas eu d'erreur on peut enregistrer l'utilisateur
    if (messages.length == 0) {
        return await User.create(user);
    }
    return false;
}

module.exports = {
    generateFakeUsers
}