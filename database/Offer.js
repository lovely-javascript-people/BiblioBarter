/* eslint-disable @typescript-eslint/indent */
// OFFER table holds information on offer made between two people, negative money equals money out of listing owner
module.exports = (sequelize, DataTypes) => {

  const Offer = sequelize.define('offer', {
    id_offer: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    id_listing_recipient: DataTypes.INTEGER,
    id_offer_prev: DataTypes.INTEGER,
    id_listing_sender: DataTypes.INTEGER,
    money_exchange: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
  });

  Offer.associate = (models) => {
    Offer.belongsTo(models.Offer, { foreignKey: 'id_offer' });
    // Offer.hasOne(models.Offer, { foreignKey: 'id_offer', target: 'id_offer' });
  };
  return Offer;
};
