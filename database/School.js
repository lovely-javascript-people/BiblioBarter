/* eslint-disable @typescript-eslint/indent */
// SCHOOL table is the user's school, takes in geo location so that we can access map proximity for filter feature
module.export = (sequelize, DataTypes) => {
  const School = sequelize.define('school', {
    id_school: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_school: {
      type: DataTypes.TEXT,
      unique: true,
    },
    geo_latitude: DataTypes.DECIMAL,
    geo_longitude: DataTypes.DECIMAL,
  });
  School.associate = (models) => {
    School.belongsToMany(models.User);
  };
  return School;
};
