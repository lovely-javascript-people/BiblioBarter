/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/indent */

// user table, holds data for each user
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      user: true,
    },
    user_name: {
      type: DataTypes.STRING,
      unique: true,
    },
    id_school: DataTypes.INTEGER,
    address: DataTypes.TEXT,
    email: {
      type: DataTypes.TEXT,
      unique: true,
    },
    phone_number: DataTypes.TEXT,
    name_first: DataTypes.TEXT,
    name_last: DataTypes.TEXT,
    image_link: DataTypes.TEXT,
    search_radius_miles: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Want, { foreignKey: 'id_user' });
    User.hasMany(models.Listing, { foreignKey: 'id_user' });
    User.hasOne(models.School, { foreignKey: 'id_school' });
  };

  return User;
};
