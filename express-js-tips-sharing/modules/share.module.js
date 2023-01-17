const crypto = require('crypto');
const env = require("../modules/env.module");
const jwt = require("jsonwebtoken");

/**
 * Formatte les messages d'erreur/succes qui seront envoyer à l'utilisateur
 * @param {*} messages string | object
 * @returns 
 */
const formatageMessagesValue = (messages) => {

    if (typeof (messages) == typeof ('')) {
        messages = [{ 'message': messages }];
    }
    else if (typeof (messages) == typeof ({}) && !(Array.isArray(messages))) {
        messages = [messages];
    }
    return messages
}

/**
 * Formatte les messages de succes
 * @param {*} messages string | object
 * @param {*} data des données qui doivent etre envoyer à l'utilisateur, comme un token etc.
 * @returns 
 */
const succesResponse = (messages, data) => {
    messages = formatageMessagesValue(messages);
    return {
        succes: true,
        messages: messages,
        payload: data
    };
}

/**
 * Formatte les messages d'erreurs
 * @param {*} messages string | object
 * @param {*} data des données qui doivent etre envoyer à l'utilisateur, comme un token etc.
 * @returns 
 */
const errorResponse = (messages, data) => {
    messages = formatageMessagesValue(messages);
    return {
        error: true,
        messages: messages,
        payload: data
    };
}

/**
 * Creer un jwt token
 * @returns {} le token et un token xsrf
 */
const createJwtToken = (body) => {
    const xsrf = makeXsrfToken();
    const res = {
        token: jwt.sign(
            { user: body, xsrf: xsrf },
            env.SECRET_JWT_KEY,
            { expiresIn: env.JWT_DURING_TIME * 60 } //5* 60 secondes
        ), xsrf: xsrf, 
        isAdmin: body.isAdmin
    }
    return res;
}

/**
 * Cree un token XSRF
 * @returns 
 */
const makeXsrfToken = () => {
    return crypto.randomBytes(64).toString('hex');
}

/**
 * Verifie si arg est un nombre ou non
 * @param {*} arg la valeur à verifier
 * @returns un boolean
 */
const isNumber = (arg) =>{
    return !!Number(arg)==true
}

module.exports = {
    succesResponse,
    errorResponse,
    createJwtToken,
    makeXsrfToken,
    isNumber
}