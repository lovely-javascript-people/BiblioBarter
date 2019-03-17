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
  res.header('Access-Control-Allow-Methods', '*');
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

app.patch('/school', (req, res) => {
  db.School.findOrCreate({
    where: {
      name_school: req.body.school
      //geolocal needed
    }
  })
  .then(data => {
    db.User.update(
      { id_school: data[0].dataValues.id_school },
      { where: { id_user: req.body.userId } }
    )
      .then(result =>
        res.send(result)
      )
      .catch(err =>
        res.send(err)
      )
}).catch(err => console.log(err))
});

// POST /user/want 
// User add a want book, should also return all the user's want books
app.post('/user/want', (req, res) => { // JUST CHANGED TO POST, CHECK WITH new for functionality
  console.log(req.body.isbn);
  // isbnVal, userid, title 
  console.log(req.body, 'BODY');
  db.Want.create({
    isbn: req.body.params,
    condition: null, // set to NULL for now
    id_user: req.body.userid,
    title: req.body.title,
  }).then(() => {
    return db.Want.findAll({
      where: {
        id_user: req.body.userid,
      }
    });
  }).catch((err) => {
    console.log(`there's a findAll want err: ${err}`);
  }).then((allUserWantBooks) => {
    // console.log(allUserWantBooks, 'ALL WANT');
    res.status(200).send(allUserWantBooks);
  }).catch((err) => {
    console.log(`unfortunate error with wants: ${err}`);
  });
});

// GET /user/want
// should get all users want listing
app.get('/user/want', (req, res) => {
  console.log(Object.keys(req.query)[0]);
  return db.Want.findAll({
    where: {
      id_user: Object.keys(req.query)[0],
    }
  }).then((allWantBooks) => {
    res.status(200).send(allWantBooks);
  })
});

// POST /user/listing (addBook)
// user adds a listing, returns all users listings
app.post('/user/listing', (req, res) => { // JUST CHANGED TO POST, CHECK WITH new for functionality
  // let count = 10;
  // isbnVal, bookCondition, title, userid
  console.log(req.body.params, 'PARAMS, ISBN???');
  console.log(req.body, 'BODY, any params? ');
  let listingUserId = req.body.params.userid;
  // needs user id, 
  // book isbn number, 
  // title, and 
  // condition, may need helper function to call api for title
  let isbnNum = Number(req.body.params);
  db.Book.create({
    isbn: isbnNum,
    title: req.body.title,
    condition: req.body.bookCondition,
  }).catch((err) => {
    console.log(`book creation err: ${err}`)
  }).then(() => {
    return db.Book.findAll({
      limit: 1,
      where: {
        isbn: isbnNum
      },
      order: [['id_book', 'DESC']]
    })
    // console.log(listing, 'FROM LISTING');
  }).catch((err) => {
    console.log(`listing of book err: ${err}`);
  }).then((book) => {
    // console.log(book[0].dataValues.id_book, 'DATAVALUES');
    // console.log(req.body.userid, 'ELEVEN', listingUserId);
    let idOfBook = book[0].dataValues.id_book;
    return db.Listing.create({
      date_created: new Date(),
      id_user: req.body.userid,
      id_book: idOfBook,
    })
    // console.log('listing set book');
  }).then(() => {
    console.log(req.body.userid);
    return db.Listing.findAll({
      where: {
        id_user: req.body.userid, // change to user id
      },
      include: [db.Book]
    })
  }).then((allListings) => {
    res.status(200).send(allListings);
  }).catch((err) => {
    console.log(`there was a user listing err: ${err}`);
  });
});

// GET /user/listing
// should get all users want listing
app.get('/user/listing', (req, res) => {
  console.log(Object.keys(req.query)[0]);
  return db.Listing.findAll({
    where: {
      id_user: Object.keys(req.query)[0],
    },
    include: [db.Book],
  }).then((allListingBooks) => {
    res.status(200).send(allListingBooks);
  })
});

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

// GET /peer
// returns wants for a profile you visit 
// app.get('/peer', (req, res) => {
//   let books;
//   db.Want.findAll({
//     where: {
//       id_user: req.query.peerId
//     }
//   }).catch((err) => {
//     console.log(`error in peer wants: ${err}`);
//   }).then((peerWants) => {
//     books = peerWants;
//   }).then(() => {
//     db.Listing.findAll({
//       where: {
//         id_user: req.query.peerId
//       }
//     }).then((data) => {
//       books.push(data);
//       res.send(books);
//     })
//   }).catch((err) => {
//     console.log(`error in get peer wants: ${err}`);
//   });
// });

app.get('/peer', (req, res) => {
  let books;
  db.Want.findAll({
    where: {
      id_user: req.query.peerId
    }
  }).catch((err) => {
    console.log(`error in peer wants: ${err}`);
  }).then((peerWants) => {
    books = peerWants;
  }).then(() => {
    db.Listing.findAll({
      where: {
        id_user: req.query.peerId
      }
    }).then((data) => {
      // create array of just books using book ids
      let offeredbooks = data.map((listing) => {
        return db.Book.findAll({
          where: {
            id_book: listing.id_book
          },
          // include: [db.Listing]
        })
      })
      books.push(offeredbooks);
      
      res.send(books);
    })
  }).catch((err) => {
    console.log(`error in get peer wants: ${err}`);
  });
});




// POST / offer
// Make an offer and counter offer
app.post('/offerlisting', (req, res) => {
  console.log(req);
  // incoming req.boy.params. 
  // peerId = recipient (them)
  // myId = sender (me)
  // bookWanted = id_listing_recipient
  // myOffer = isbn (my book)
  return db.Listing.findAll({
    limit: 1,
    where: {
      id_user: req.body.params.myId
    },
    include: [{
      model: db.Book,
      limit: 1, // change later, this is for demo purposes
      where: {
        isbn: req.body.params.myOffer
      }
    }]
  }).catch((err) => {
    console.log(`listing find failure: ${err}`);
  }).then((myListing) => {
    console.log(myListing, 'MY LISTING HERE');
  }).catch((err) => {
    console.log(`myListing error: ${err}`);
  }).then(() => {
  db.Offer.create({
    // need id_listing, create offer, then save to offer listing
    // listing recipient, listing prev, listing sender, money, accepted
    id_listing_recipient: 2,
    id_offer_prev: 2,
    id_listing_sender: 5,
    money_exchange: null,
    accepted: false,
  }).catch((err) => {
    console.log(`err in offer creation: ${err}`);
  }).then(() => {
    return db.Offer.findAll({
      limit: 1,
      where: {
        id_listing_recipient: 2
      },
      order: [['id_offer', 'DESC']]
    })
  }).catch((err) => {
    console.log(`error in finding offer id: ${err}`);
  }).then((offer) => {
    let idOfOffer = offer[0].dataValues.id_offer;
    return db.Offer_Listing.create({
      id_offer: idOfOffer,
      id_listing: req.body.listingid
    })
  }).catch((err) => {
    console.log(`err in offer listing creation: ${err}`);
  }).then(() => {
    res.send(JSON.stringify('offer creation'));
  }).catch((err) => {
    console.log(`error for offer creation: ${err}`);
  });
});
});


// PATCH / offerlisting
// Final transaction made by two users boolean changed
app.patch('/offerlisting', (req, res) => {
  // needs id of offer
  db.Offer.update(
    {
      accepted: true,
    }, 
    {
    returning: true,
    where: {
      id_offer: req.params.offerid,
      }
  }).then(([listingsUpdated, [updatedListing]]) => {
    res.status(200).send(updatedListing);
  }).catch((err) => {
    console.log(`patch error: ${err}`);
  });
});

// app.listen(port, () => console.log(`Biblio server listening on port ${port}!`));