'use strict';
module.exports = (sequelize, DataTypes) => {
  const ticket = sequelize.define('ticket', {
    price: DataTypes.STRING,
    event_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {});
  ticket.associate = function(models) {
    // associations can be defined here
    ticket.belongsTo(models.event, {
      foreignKey: 'event_id',
      as: 'event',
      sourceKey: 'id'
    });
    ticket.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'user',
      sourceKey: 'id'
    });
  };
  return ticket;
};
