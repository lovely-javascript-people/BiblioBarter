/* eslint-disable @typescript-eslint/indent */
// OFFER table holds information on offer made between two people, negative money equals money out of listing owner
module.exports = (sequelize, DataTypes) => {

  const Offer = sequelize.define('offer', {
    id_offer: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_listing_recipient: Sequelize.INTEGER,
    id_offer_prev: Sequelize.INTEGER,
    id_listing_sending: Sequelize.INTEGER,
    money_exchange: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    accepted: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
  });

  // Offer.associate = (models) => {
  //   Offer.belongsToMany(models.User);
  // };
  return Offer;
};
