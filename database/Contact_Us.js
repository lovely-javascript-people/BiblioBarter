/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/indent */
// Contact us table holds the users message to us
module.exports = (sequelize, DataTypes) => {
  const Contact_Us = sequelize.define('contact_us', {
    id_contact_us: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    id_user: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    responded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Contact_Us;
};
