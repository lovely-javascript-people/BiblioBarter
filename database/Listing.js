/* eslint-disable @typescript-eslint/indent */
// LISTING table is the books the user has to offer
module.exports = (sequelize, DataTypes) => {

  const Listing = sequelize.define('listing', {
    id_listing: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // id_user: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: User,
    //     key: 'id_user',
    //     deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE,
    //   },
    // },
    id_book: {
      type: DataTypes.INTEGER,
      references: {
        model: Book,
        key: 'id_book',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    date_created: DataTypes.DATE,
  });

  Listing.associate = (models) => {
    Listing.belongsToMany(models.User);
  };
  return Listing;
};
