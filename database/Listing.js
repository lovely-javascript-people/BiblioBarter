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
    // id_user: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: User,
    //     key: 'id_user',
    //     deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE,
    //   },
    // },
    // id_book: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: Book,
    //     key: 'id_book',
    //     deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE,
    //   },
    // },
    id_book: DataTypes.INTEGER,
    date_created: DataTypes.DATE,
  });

  Listing.associate = (models) => {
    // Listing.belongsTo(models.User, { foreignKey: 'id_listing' });
    // Listing.hasOne(models.Book, { foreignKey: 'id_book', targetKey: 'id_book' });
    Listing.belongsTo(models.Book, { foreignKey: 'id_book' });

  };
  return Listing;
};
