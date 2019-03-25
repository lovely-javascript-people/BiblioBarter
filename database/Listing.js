/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/indent */
// LISTING table is the books the user has to offer
module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define('listing', {
    id_listing: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    id_book: DataTypes.INTEGER,
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    date_created: DataTypes.DATE,
  });

  Listing.associate = (models) => {
    Listing.belongsTo(models.Book, { foreignKey: 'id_book' });
  };

  return Listing;
};
