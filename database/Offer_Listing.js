/* eslint-disable @typescript-eslint/indent */
// OFFER table holds information on offer made between two people, negative money equals money out of listing owner
module.exports = (sequelize, DataTypes) => {

  const Offer_Listing = sequelize.define('offer_listing', {

  id_offer_listing: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  // id_offer: DataTypes.INTEGER,
  // id_offer: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: Offer,
  //     key: 'id_offer',
  //     deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE,
  //   },
  // },
  // id_listing: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: Listing,
  //     key: 'id_listing',
  //     deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE,
  //   },
  // },
});


  Offer_Listing.associate = (models) => {
    Offer_Listing.belongsTo(models.Offer, { foreignKey: 'id_offer', targetKey: 'id_offer' });
    Offer_Listing.belongsTo(models.Listing, { foreignKey: 'id_listing', targetKey: 'id_listing' });
    // Offer_Listing.belongsTo(models.Offer_Listing, { foreignKey: 'id_listing' });
    // Offer_Listing.hasMany(models.Offer);
    // Offer_Listing.hasOne(models.Offer, { foreignKey: 'id_offer' });
    // // Offer_Listing.belongsTo(models.Offer, { foreignKey: 'id_offer' });
    // Offer_Listing.belongsTo(models.Listing, { foreignKey: 'id_listing' });
  };
  return Offer_Listing;
};

