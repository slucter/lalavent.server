'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.belongsTo(models.role, {
      foreignKey: 'role_id',
      as: 'role',
      sourceKey: 'id'
    });
    user.hasMany(models.event, {
      foreignKey: 'id',
      as: 'event',
      sourceKey: 'id'
    });
  };
  return user;
};
