'use strict';
module.exports = (sequelize, DataTypes) => {
  const ticket = sequelize.define('ticket', {
    price: DataTypes.STRING,
    event_id: DataTypes.INTEGER
  }, {});
  ticket.associate = function(models) {
    // associations can be defined here
    ticket.belongsTo(models.event, {
      foreignKey: 'event_id',
      as: 'event',
      sourceKey: 'id'
    });
  };
  return ticket;
};
