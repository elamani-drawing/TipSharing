'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Type.init({
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        min: 3, 
        max: 30
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
    modelName: 'Type',
  });
  // Type.sync();
  return Type;
};