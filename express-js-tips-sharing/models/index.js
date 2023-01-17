'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Declaration des relations

// User à 1 ou N Tips
//db.User.hasMany(db.Tip, {foreignKey: 'userId', onDelete: 'cascade'})
db.User.hasMany(db.Tip, {
  foreignKey: 'UserId',
  onDelete: 'cascade'
});
db.Tip.belongsTo(db.User);

// User à 1 ou N commentaires
// db.User.hasMany(db.Comment, {foreignKey: 'userId', onDelete: 'cascade'})
db.User.hasMany(db.Commentaire, {
  foreignKey: 'UserId',
  onDelete: 'cascade'
});
db.Commentaire.belongsTo(db.User);

// Tip à 0 ou N commentaires
// db.Tip.hasMany(db.Comment, {foreignKey: 'tipId', onDelete: 'cascade'})
db.Tip.hasMany(db.Commentaire, {
  foreignKey: 'TipId',
  onDelete: 'cascade'
});
db.Commentaire.belongsTo(db.Tip);

// Un Tip à 1 ou N Tag et un Tag peut etre dans 1 ou N Tip
db.Tip.belongsToMany(db.Tag, { through: db.TagTip });
db.Tag.belongsToMany(db.Tip, { through: db.TagTip });

// db.Information.belongsTo(db.Tip);
// db.Tip.belongsToMany(db.Obtention, { through: db.Information });
// db.Obtention.belongsToMany(db.Tip, { through: db.Information });
// db.Tip.belongsToMany(db.Rarete, { through: db.Information });
// db.Rarete.belongsToMany(db.Tip, { through: db.Information });
// db.Tip.belongsToMany(db.Type, { through: db.Information });
// db.Type.belongsToMany(db.Tip, { through: db.Information });

db.Tip.belongsTo(db.Obtention);
db.Obtention.hasMany(db.Tip);
db.Tip.belongsTo(db.Rarete);
db.Rarete.hasMany(db.Tip);
db.Tip.belongsTo(db.Type);
db.Type.hasMany(db.Tip);

db.sequelize = sequelize;
// Synchronization de tous les models
db.sequelize.sync({alter: true})

module.exports = db;
