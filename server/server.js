/* eslint-disable */
const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
const { sequelize } = require('../database/database.js');
const db = require('../database/database.js');
const helpers = require('./apiHelpers.js');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
// app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/**
 * GET request to /matches currently grabs all the users from the db and
 * returns them in an array with each user's information.
 * Please change alter findAll() to grab specific matches.
 */
app.get('/matches', (req, res) => {
  db.User.findAll().then((data) => {
  // give an array of object, each object is a user
    const matches = [];
    data.forEach((user) => {
      matches.push(user.dataValues);
    });
    res.status(200).send(matches);
  });
});

app.listen(port, () => console.log(`Biblio server listening on port ${port}!${db.User.create}`));


// /////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////
// ///// start end points here to not interfere with Laura

// POST / signup
// User sign up, makes call to map api for geolocation
/**
 * POST to signup
 * nickname is from auth0, this is the user's username
 */
app.post('/signup', (req, res) => {
  const { nickname, family_name, given_name, picture } = req.body.params;
  console.log(req.body.params, 'REQ');
  db.User.create({ user_name: nickname, name_first: given_name, name_last: family_name, link_image: picture }, {fields: ['user_name', 'name_first', 'name_last', 'link_image']})
  .then(() => {
    console.log(JSON.stringify('new user success'));
  }).catch((err) => {
    res.send(JSON.stringify(`there was a problem: ${err}`));
  })
});

// POST / listing
// User creates a listing
app.post('/listing', (req, res) => {
  const userId = req.body.params.id_user;
  const cond = req.body.params.condition;
  const bookNameOrIsbn = req.body.params.book;
  const date = new Date();
  
});

app.get('/profile', (req, res) => {
  let data;
  db.User.findAll({
    where: {
      user_name: req.query.username
    }
  }).then(data1 => {
    console.log(data1, 'DATA1');
    data = data1;
  }).then(() => db.School.findAll({
    where: {
      id_school: 1
    }
  }
  )).then(data2 => data.push(data2))
  .then(() => res.send(data));
});


// POST / want 
// User add a want book, should also return all the user's want books
app.post('/user/want', (req, res) => { // JUST CHANGED TO POST, CHECK WITH new for functionality
  console.log(req.body.isbn);
  db.Want.create({
    isbn: 123444446, // go back and input params
    condition: null, // set to NULL for now
    id_user: 1, // need to grab user id
    // title: 'some title' // needs to be in req and inside DB!!!!!
  }).then(() => {
    return db.Want.findAll({
      where: {
        id_user: 1, // need to replace with user id
      }
    });
  }).catch((err) => {
    console.log(`there's a findAll want err: ${err}`);
  }).then((allUserWantBooks) => {
    console.log(allUserWantBooks, 'ALL WANT');
    res.status(200).send(allUserWantBooks);
  }).catch((err) => {
    console.log(`unfortunate error with wants: ${err}`);
  });
});

// POST /user/listing (addBook)
// user adds a listing, returns all users listings
let listingBookCount = 11;
app.post('/user/listing', (req, res) => { // JUST CHANGED TO POST, CHECK WITH new for functionality
  // let count = 10;
  // console.log(req, 'REUEST');
  // console.log(Object.keys(req.query)[0], 'THIS SHOULD BE THE ISBN NUMBER');
  console.log(req.body.params, 'PARAMS, ISBN???');
  console.log(req.body, 'BODY, any params? ');
  
  // needs user id, 
  // book isbn number, 
  // title, and 
  // condition, may need helper function to call api for title
  let isbnNum = Number(req.body.params);
  db.Listing.create({
    id_book: listingBookCount += 1,
    date_created: new Date(),
    id_user: 1
  }).catch((err) => {
    console.log(`there was a listing creation error for listing: ${err}`);
  }).then((data) => {
    console.log(data, 'DATA FROM LISTING');
    console.log(data.dataValues.id_book, 'DATA BALUE IN LISTING');
    return db.Book.create({
      id_book: data.dataValues.id_book,
      isbn: isbnNum, // put isbnNum here
      title: 'NEW',
      condition: 'NEWWW'
    })
  }).catch((err) => {
    console.log(`error in book creation: ${err}`);
  }).then(() => {
    console.log('book saved successfully');
    // console.log(book, 'BOOK SAVED DATA');
    return db.Listing.findAll({
      where: {
        id_user: 1, // change to user id
      },
      include: [db.Book]
      
    })
  }).catch((err) => {
    console.log(`an error in acquiring all listings for user: ${err}`);
  }).then((usersListings) => {
    // console.log(`these are the user's listings: ${usersListings}`);
    let allListings = [];

    res.status(200).send(usersListings);
  }).catch((err) => {
    console.log(`oh no, it's an err in listings: ${err}`);
  });
})

// GET /search/listing/isbn
// Search for listing(other’s offers)
app.get('/search/listing/isbn', (req, res) => {
  // db helper function getBookByIsbn
    // send back res from helper
    // console.log(Object.keys(req.query)[0], 'THIS SHOULD BE THE ISBN NUMBER');
  ////// 
  let isbnNum = Number(Object.keys(req.query)[0]);
  db.Book.findAll({
    where: {
      isbn: isbnNum
    }, 
    include: [db.Listing]
  }).then((allBooksWithIsbn) => {
    // console.log(allBooksWithIsbn, 'ALL BOOKS ISBN');
    let listingResults = [];
    allBooksWithIsbn.forEach((book) => {
      listingResults.push(book.dataValues);
    });
    // console.log(listingResults, 'LISTING RESULTS');
    res.send(listingResults);
  }).catch((err) => {
    console.log(`there was an error: ${err}`);
  });

});

// GET / want
// Search for want(people who want your book)


// POST / offer
// Make an offer and counter offer


// PATCH / offer
// Final transaction made by two users boolean changed

// app.listen(port, () => console.log(`Biblio server listening on port ${port}!`));
