'use strict';
module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('role', {
    name: DataTypes.STRING
  }, {});
  role.associate = function(models) {
    // associations can be defined here
    role.hasMany(models.user, {
      foreignKey: 'id',
      as: 'role',
      sourceKey: 'id'
    });
  };
  return role;
};
