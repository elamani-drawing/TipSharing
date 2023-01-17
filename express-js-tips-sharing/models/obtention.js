'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Obtention extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Obtention.init({
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        min: 3, 
        max: 20
      }
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'Obtention',
  });
  // Obtention.sync();
  return Obtention;
};