/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/indent */
// BOOK table is the table that has all books for offering
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('book', {
    id_book: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isbn: DataTypes.TEXT,
    title: DataTypes.TEXT,
    image_link: DataTypes.TEXT,
    condition: DataTypes.TEXT,
  });
  Book.associate = (models) => {
    Book.hasOne(models.Listing, { foreignKey: 'id_book', targetKey: 'id_book' });
  };

  return Book;
};
