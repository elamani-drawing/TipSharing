'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tip.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    astuce: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isValidate: {
      type: DataTypes.BOOLEAN,
      allowNull: false, 
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Tip',
  });
  // Tip.sync();
  return Tip;
};