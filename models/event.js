'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    date: DataTypes.STRING,
    location: DataTypes.STRING,
    time_start: DataTypes.STRING,
    time_end: DataTypes.STRING,
    quota: DataTypes.STRING,
    description: DataTypes.STRING,
    attend: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    type: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  event.associate = function(models) {
    // associations can be defined here
    event.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'user',
      sourceKey: 'id'
    });
    event.belongsTo(models.category, {
      foreignKey: 'category_id',
      as: 'category',
      sourceKey: 'id'
    });
  };
  return event;
};
