/* eslint-disable @typescript-eslint/indent */
// BOOK table is the table that has all books for offering
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('book', {
    id_book: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    isbn: DataTypes.BIGINT,
    title: DataTypes.TEXT,
    condition: DataTypes.TEXT,
  });
  Book.associate = (models) => {
    // Book.belongsToMany(models.User);
    Book.belongsTo(models.Listing, { foreignKey: 'id_book' });
  };
  return Book;
};

