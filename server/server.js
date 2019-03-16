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
    console.log('new user success');
  }).catch((err) => {
    res.send(`there was a problem: ${err}`);
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
      user_name: 'jeff'
    }
  }).then(data1 => {
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
// User add a want book

// POST /listing
// user adds a listing 
app.get('/addlisting', (req, res) => {
  let count = 0;
  console.log(Object.keys(req.query)[0], 'THIS SHOULD BE THE ISBN NUMBER');
  let isbnNum = Number(Object.keys(req.query)[0]);
  db.Listing.create({
    id_book: count += 1,
    date_created: new Date(),
    id_user: 1
  }).then(() => {
    db.Book.create({
      id_book: count,
      isbn: isbnNum,
      title: 'The Cat Chronicles',
      condition: 'brand spankin new'
    })
  }).then(() => {
    console.log('book saved successfully');
  }).catch((err) => {
    console.log(`oh no, it's a terrible error: ${err}`);
  });
})

// GET /search/listing/isbn
// Search for listing(other’s offers)
app.get('/search/listing/isbn', (req, res) => {
  // db helper function getBookByIsbn
    // send back res from helper
    console.log(Object.keys(req.query)[0], 'THIS SHOULD BE THE ISBN NUMBER');
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
