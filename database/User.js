/* eslint-disable @typescript-eslint/indent */

// user table, holds data for each user
module.export = (sequelize, DataTypes) => {

  const User = sequelize.define('user', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING,
      unique: true,
    },
    // id_school: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: School,
    //     key: 'id_school',
    //     deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE,
    //   },
    // },
    address: DataTypes.TEXT,
    email: DataTypes.TEXT,
    phone_number: DataTypes.TEXT,
    name_first: DataTypes.TEXT,
    name_last: DataTypes.TEXT,
    link_image: DataTypes.TEXT,
    search_radius: DataTypes.INTEGER,
  });

  User.associate = (models) => {
    User.hasMany(models.Book);
    User.hasMany(models.Listing);
    User.hasMany(models.Want);
    User.hasOne(models.School);
  };
  
  return User;
};
