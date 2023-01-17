
/**
 * Genere un nombre aleatoire
 * @param {number} max 
 * @returns 
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = {
    getRandomInt
}