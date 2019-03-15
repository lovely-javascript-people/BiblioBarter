/* eslint-disable @typescript-eslint/indent */
const db = require('../database/database.js');

/**
 * function findBookISBN takes in book title and calls on api to grab isbn number for return
 * @params {string}: string of book title
 * 
 */
const findBookISBN = () => {

};

/**
 * function insert new user
 * @params {string} username
 */
const insertNewUser = (username, first, last, link, school, add, email, number, radius) => {
  db.User.create({
    user_name: username,
    // id_school: school,
    // address: add,
    // email: email,
    // phone_number: number,
    name_first: first,
    name_last: last,
    link_image: link,
    // search_radius: radius,
  }).then(() => {
    console.log('new user created');
  }).catch(() => {
    console.log('could not insert new user');
  });
};



module.exports = {
  insertNewUser,
};
