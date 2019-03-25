/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/indent */
// OFFER table holds information on offer made between two people,
// negative money equals money out of listing owner
module.exports = (sequelize, DataTypes) => {
  const Offer_Listing = sequelize.define('offer_listing', {

  id_offer_listing: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
});

  Offer_Listing.associate = (models) => {
    Offer_Listing.belongsTo(models.Offer, { foreignKey: 'id_offer', targetKey: 'id_offer' });
    Offer_Listing.belongsTo(models.Listing, { foreignKey: 'id_listing', targetKey: 'id_listing' });
  };

  return Offer_Listing;
};
