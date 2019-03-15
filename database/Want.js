/* eslint-disable @typescript-eslint/indent */
// WANT table is the books the user would like / need
module.exports = (sequelize, DataTypes) => {
  const Want = sequelize.define('want', {
    id_want: {
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
    isbn: DataTypes.BIGINT,
    condition: DataTypes.TEXT,
  });

  Want.associate = (models) => {
    Want.belongsToMany(models.User);
  };
  return Want;
};
