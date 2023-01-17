'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');
const env = require('./../modules/env.module');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id : {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false, 
      unique: true
    },
    pseudo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false, 
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false, 
    },
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false, 
    },
    picture : {
      type: DataTypes.STRING(100),
      allowNull: false, 
    },
    lastName: {
      type: DataTypes.STRING(20),
      allowNull: false, 
    },
    isActif : {
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: true,
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  /**
   * Hash un mot de passe
   */
  User.hashPassword = async(password) => {
    return await bcrypt.hash(password, parseInt(env.BCRYPT_SALT_ROUND));
  }

  /**
   * S'occupe de crypter le password avant de l'envoyer en base de donnée
   */
  User.beforeCreate( async(user, Options) => {
    let hash = await User.hashPassword(user.password);
    user.password = hash;
  })

  /**
   * Compare les deux password
   * @param {*} password le mot de passe qu'on recoit du client
   * @param {*} originel le mot de passe dans l'instanse User
   * @returns 
   */
  User.checkPassword = async (password, originel)=> {
    return await bcrypt.compare(password, originel)
  }

  // User.sync();
  return User;
};