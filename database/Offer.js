/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/indent */
// OFFER table holds information on offer made between two people,
// negative money equals money out of listing owner
module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define('offer', {
    id_offer: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    id_recipient: DataTypes.INTEGER,
    id_offer_prev: DataTypes.INTEGER,
    id_sender: DataTypes.INTEGER,
    money_exchange_cents: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.TEXT, // change from boolean to text so allows accepted, rejected
      // allowNull: true,
      defaultValue: 'pending',
    },
  });

  return Offer;
};
