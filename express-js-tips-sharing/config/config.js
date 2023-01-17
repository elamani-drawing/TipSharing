const env = require("../modules/env.module");

module.exports = {
"development": {
    "username": env.USER_BDD,
    "password": env.PASSWORD_BDD,
    "database": env.DATABASE_BDD,
    "host": env.HOST_BDD,
    "dialect": env.SQUELIZE_DIALECT
},
"test": {
    "username": env.USER_BDD,
    "password": env.PASSWORD_BDD,
    "database": env.DATABASE_BDD,
    "host": env.HOST_BDD,
    "dialect": env.SQUELIZE_DIALECT
},
"production": {
    "username": env.USER_BDD,
    "password": env.PASSWORD_BDD,
    "database": env.DATABASE_BDD,
    "host": env.HOST_BDD,
    "dialect": env.SQUELIZE_DIALECT
}
};