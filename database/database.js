/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/indent */

const Sequelize = require('sequelize');
require('dotenv').config();
const helpers = require('../server/apiHelpers');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: false, // may not possibly need
  define: {
    timestamps: false, // will not create createdAt and updatedAt column for each table
  },
  pool: { // currently not sure if needed
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
},
);

// connect to db instance
sequelize
  .authenticate()
  .then(() => {
      console.log('Database connection established successfully.');
  })
  .catch((err) => {
      console.error('Unable to connect to the database:', err);
  });

// use this if need to separate tables
const db = {};
const models = [
  'School',
  'User',
  'Want',
  'Book',
  'Listing',
  'Offer',
  'Offer_Listing',
  'Contact_Us',
];

models.forEach((model) => {
  db[model] = sequelize.import(`${__dirname}/${model}`);
});

models.forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

/**
 * @todo uncomment below to restart database
 * running force will clear database
 * without force, will sync
 */
// sequelize.sync({ force: true });
// sequelize.sync();
