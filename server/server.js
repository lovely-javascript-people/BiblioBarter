/* eslint-disable */

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Chatkit = require('@pusher/chatkit-server');
const db = require('../database/database.js');
const _ = require('underscore');
// const helpers = require('./apiHelpers.js');

const chatkit = new Chatkit.default({
  instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_SECRET_KEY,
});

// const app = express();
const PORT = process.env.PORT || 3000;
const app = express();


  app.listen(PORT, () => console.log(`BiblioBarter listening on ${PORT}`));

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.get('/callback', (req, res) => {
  res.send(JSON.stringify('hello'));
});

/**
 * GET request to /matches currently grabs all the users from the db and
 * returns them in an array with each user's information.
 * Please change alter findAll() to grab specific matches.
 *
 */
let matches;
let matchObj;
app.get('/matches', (req, res) => {
  db.Listing.findAll().then(async (data) => {
  // give an array of object, each object is a user
    matches = [];
    matchObj = {};
    for (const listing of data) {
      const user = await db.User.findOne({
        where: {
          id_user: listing.id_user,
        },
      });
      const book = await db.Book.findOne({
        where: {
          id_book: listing.id_book,
        },
      });
      matchObj[`${user.user_name}_id`] = listing.id_user;
      if (!Object.keys(matchObj).includes(user.user_name)) {
      matchObj[user.user_name] = [book];
      matchObj[`${user.user_name}_id`] = listing.id_user;
      } else {
        matchObj[user.user_name].push(book);
      }
      matches.push([await user, await book]);
    }
  }).then(() => {
    res.status(200).send(matchObj);
    matches = [];
    matchObj = {};
    return;
  });
});


// POST / signup
// User sign up, makes call to map api for geolocation
/**
 * POST to signup
 * nickname is from auth0, this is the user's username
 */
app.post('/signup', (req, res) => {
  const {
    nickname,
    family_name,
    given_name,
    picture,
  } = req.body.params;
  db.User.create({
    user_name: nickname,
    name_first: given_name,
    name_last: family_name,
    image_link: picture,
  },
  { fields: ['user_name', 'name_first', 'name_last', 'image_link'] })
  .then(() => {
    res.status(200).send(JSON.stringify('User created'));
  }).catch((err) => {
    res.send(JSON.stringify(`there was a problem: ${err}`));
  });
});

app.post('/users', (req, res) => {
  const { userId } = req.body;

  chatkit
    .createUser({
      id: userId,
      name: userId,
    })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      if (err.error === 'services/chatkit/user_already_exists') {
        res.status(301).send(JSON.stringify(`User already exists: ${userId}`));
      } else {
        res.status(err.status).json(err);
      }
    });
});

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id,
  });
  res.status(authData.status).send(authData.body);
});

app.get('/profile', (req, res) => {
  let data;
  db.User.findAll({
    where: {
      user_name: req.query.username,
    },
  }).then((data1) => {
    data = data1;
  }).then(() => db.School.findAll({
    where: {
      id_school: data[0].id_school,
    },
  })).then(data2 => data.push(data2))
  .then(() => res.send(data));
});

app.patch('/school', (req, res) => {
  db.School.findOrCreate({
    where: {
      name: req.body.school, // CHANGE WHEN DROP DATABASE
      // geolocal needed
    },
  })
  .then((data) => {
    db.User.update(
      { id_school: data[0].dataValues.id_school },
      { where: { id_user: req.body.userId } },
    )
      .then(result => res.send(result))
      .catch(err => res.send(err));
}).catch(err => res.status(500).send(err));
});

// POST /user/want
// User add a want book, should also return all the user's want books
app.post('/user/want', (req, res) => { // JUST CHANGED TO POST, CHECK WITH new for functionality
  db.Want.create({
    isbn: req.body.params,
    condition: null, // set to NULL for now
    id_user: req.body.userid,
    title: req.body.title,
    image_link: req.body.imageLink,
  }).then(() => db.Want.findAll({
      where: {
        id_user: req.body.userid,
      },
    })).catch(() => {
    res.status(404).send(JSON.stringify('Found no wants'));
  })
  .then((allUserWantBooks) => {
    // console.log(allUserWantBooks, 'ALL WANT');
    res.status(200).send(allUserWantBooks);
  })
  .catch(() => {
    res.status(404).send(JSON.stringify('Found no wants'));
  });
});

// GET /user/want
// should get all users want listing
app.get('/user/want', (req, res) => db.Want.findAll({
    where: {
      id_user: Object.keys(req.query)[0],
    },
  })
  .then((allWantBooks) => {
    res.status(200).send(allWantBooks);
  }));

// POST /user/listing (addBook)
// user adds a listing, returns all users listings
app.post('/user/listing', (req, res) => { // JUST CHANGED TO POST, CHECK WITH new for functionality
  const isbnNum = req.body.params;
  db.Book.create({
    isbn: isbnNum,
    title: req.body.title,
    condition: req.body.bookCondition,
    image_link: req.body.imageLink,
  }).catch((err) => {
    res.status(401).send(JSON.stringify(`book creation err: ${err}`));
  }).then(() => db.Book.findAll({
      limit: 1,
      where: {
        isbn: isbnNum,
      },
      order: [['id_book', 'DESC']],
    })).catch((err) => {
      res.status(401).send(JSON.stringify(`listing of book err: ${err}`));
  })
  .then((book) => {
    const idOfBook = book[0].dataValues.id_book;
    return db.Listing.create({
      date_created: new Date(),
      id_user: req.body.userid,
      id_book: idOfBook,
    });
  })
  .then(() => db.Listing.findAll({
      where: {
        id_user: req.body.userid,
      },
      include: [db.Book],
    }))
  .then((allListings) => {
    res.status(201).send(allListings);
  })
  .catch((err) => {
    res.status(401).send(JSON.stringify(`there was a user listing err: ${err}`));
  });
});

// GET /user/listing
// should get all users want listing
app.get('/user/listing', (req, res) => db.Listing.findAll({
    where: {
      id_user: Object.keys(req.query)[0],
    },
    include: [db.Book],
  }).then((allListingBooks) => {
    res.status(200).send(allListingBooks);
  }));

// GET /search/listing/isbn
// Search for listing(other’s offers)
app.get('/search/listing/isbn', (req, res) => {
  // db helper function getBookByIsbn
    // send back res from helper
  const isbnNum = Object.keys(req.query)[0];
  db.Book.findAll({
    where: {
      isbn: isbnNum,
    },
    include: [db.Listing],
  }).then((allBooksWithIsbn) => {
    const listingResults = [];
    allBooksWithIsbn.forEach((book) => {
      listingResults.push(book.dataValues);
    });
    res.send(listingResults);
  }).catch((err) => {
    res.status(401).send(JSON.stringify(`there was an error: ${err}`));
  });
});

// GET /peer
// returns wants and listings for a profile you visit
app.get('/peer', (req, res) => {
  let books;
  let listings;
  db.Want.findAll({
    where: {
      id_user: req.query.peerId,
    },
  }).catch((err) => {
    res.status(401).send(JSON.stringify(`error in peer wants: ${err}`));
  }).then((peerWants) => {
    books = peerWants;
  }).then(() => {
    db.Listing.findAll({
      where: {
        id_user: req.query.peerId,
      },
    }).then((data) => {
      listings = data;
    }).then(async () => {
      books.push([]);
      for (const listing of listings) {
        const book = await db.Book.findOne({
          where: {
            id_book: listing.id_book,
          },
        });
        books[books.length - 1].push(book);
      }
        books.push(listings);
        }).then(() => {
      res.send(books);
    });
  })
  .catch((err) => {
    res.status(401).send(JSON.stringify(`error in get peer wants: ${err}`));
  });
});


// POST / offer
// Make an offer and counter offer
app.post('/offerlisting', (req, res) => {
  let idOfOffer;
  db.Offer.create({
    id_listing_recipient: req.body.params.bookWanted[0].id_listing,
    id_offer_prev: req.body.params.previousId || null,
    id_listing_sender: req.body.params.bookOffering,
    money_exchange_cents: req.body.params.money || null,
    // accepted: req.body.accepted || false,
  }).then(async () => {
    const newOffer = await db.Offer.findAll({
      limit: 1,
      where: {
        id_listing_recipient: req.body.params.bookWanted[0].id_listing,
      },
      order: [['id_offer', 'DESC']],
    });
    return newOffer;
  }).then((offer) => {
    idOfOffer = offer[0].id_offer; // gets offer id to save values for offer listing
    return db.Offer_Listing.create({ // create offer listing for lister, listing recipient
      id_offer: idOfOffer,
      id_listing: req.body.params.bookWanted[0].id_listing,
    });
  }).then(() => db.Offer_Listing.create({ // create offer listing for listing sender
      id_offer: idOfOffer,
      id_listing: req.body.params.bookOffering,
    }))
    .then(() => db.Offer.findAll({
      where: {
        id_offer: idOfOffer,
      },
    }))
  .then((offerMade) => {
    res.send(offerMade);
  })
  .catch((err) => {
    res.status(401).send(JSON.stringify(`there was an Offer Creation ERROR: ${err}`));
  });
});


// PATCH / offerlisting
// Final transaction made by two users boolean changed
app.patch('/offerlisting', (req, res) => {
  db.Offer.update(
    {
      status: req.body.params.status,
    },
    {
    returning: true,
    where: {
      id_offer: req.body.params.offerId,
      },
  },
  ).then(([listingsUpdated, [updatedListing]]) => {
    res.status(200).send(updatedListing);
  }).catch((err) => {
    res.status(401).send(JSON.stringify(`patch error: ${err}`));
  });
});


app.get('/offers', (req, res) => {
  let offered;
  let titleOffered;
  let titleWantd;
  let peer;
  db.Listing.findAll({
    where: {
      id_user: req.query.id_user,
    },
  }).then(async (data) => {
    const lists = [...data];
    const resArr = [data];
    for (const piece of lists) {
    offered = await db.Offer.findAll({
      where: {
        id_listing_recipient: piece.dataValues.id_listing,
      },
    });
    if (offered.length) {
      for (const offer of offered) {
    const offerer = await db.User.findOne({
      where: {
        id_user: await piece.dataValues.id_user,
      },
    });
    titleWantd = await db.Book.findOne({
      where: {
        id_book: await piece.id_book,
      },
    });
    const wanted = await db.Listing.findOne({
      where: {
        id_listing: offer.id_listing_sender,
      },
    });
    titleOffered = await db.Book.findOne({
      where: {
        id_book: await wanted.id_book,
      },
    });
    const peerListing = await db.Listing.findOne({
      where: {
        id_listing: offer.id_listing_sender,
      },
    });
    peer = await db.User.findOne({
      where: {
        id_user: peerListing.id_user,
      },
    });
    resArr.push({
      offer,
      titleOffered,
      titleWantd,
      peer,
    });
  }
}
  }
    res.send(resArr);
  });
});

// POST /offers
// create an offer / counter an offer
// if id_offer provided, save to id_prev_offer column
/**
 * @param {number} idRecipient Id of user who is receiving offer
 * @param {number} idOfferPrev Id of previous offer if counter offer
 * @param {number} idSender Id of user who is sending offer
 * @param {number} moneyExchangeCents Money exchange, if negative, sender is sending money,
 * if positive, sender is requesting money. 
 * Upon creation of offer, hold onto offer id and create offer listing for each listing
 * @param {array} listings all listings associated with the offer as an object, at the least, need listing id 
 */
app.post('/offers', (req, res) => {
  let offerId;
  db.Offer.create({
    id_recipient: req.body.params.idRecipient,
    id_offer_prev: req.body.params.idOfferPrev,
    id_sender: req.body.params.idSender,
    money_exchange_cents: req.body.params.money || null,
  }).then(async () => {
    const newOffer = await db.Offer.findAll({
      limit: 1,
      where: {
        id_recipient: req.body.params.idRecipient,
      },
      order: [['id_offer', 'DESC']],
    });
    console.log(newOffer, 'NEW OFFER');
    offerId = await newOffer[0].id_offer;
    return newOffer;
  }).then((newOfferArray) => {
      _.each(req.body.params.listings, async listing => {
      await db.Offer_Listing.create({
        id_offer: offerId,
        id_listing: listing.id_listing,
      });
    }
  )}).then(() => {
    db.Offer.findOne({
      where: {
        id_offer: offerId,
      },
    });
  }).then((offerMade) => {
    res.status(200).send(offerMade);
  })
  .catch((err) => { console.log(`error in offer creation: ${err}`)});
});

// patch /user/setting
// user may change settings
/**
 * @todo make it so that each update does not turn the other values to null
 */
app.patch('/user/settings', (req, res) => {
  const val = req.body; // please change later, not currently saving and not replacing
  db.User.update(
    {
      name_first: req.body.firstName || null,
      name_last: req.body.lastName || null,
      email: req.body.email || null,
      search_radius_miles: req.body.radius || null,
      address: req.body.address || null,
      phone_number: req.body.phoneNumber || null,
    },
    {
      returning: true,
      where: {
        id_user: req.body.userId,
      },
    },
  ).then(([userUpdated, [updatedUser]]) => {
    res.status(200).send(updatedUser);
  }).catch((err) => {
    res.status(401).send(JSON.stringify(`patch error to user settings: ${err}`));
  });
});

// POST /contactus
// users can send us a message
// userId, userEmail, emailBody
app.post('/contactUs', (req, res) => {
  db.Contact_Us.create({
    id_user: req.body.userId,
    message: req.body.emailBody,
  }).then(() => {
    if (req.body.userEmail !== undefined) {
      db.User.update(
        {
          email: req.body.userEmail,
        },
        {
        where: {
          id_user: req.body.userId,
        },
      },
      );
    } else {
      res.send(JSON.stringify('no need to change email'));
    }
  }).then(() => {
    res.status(200).send(JSON.stringify('Message sent to developers'));
  }).catch((err) => {
    res.status(401).send(JSON.stringify(`error in contact us: ${err}`));
  });
});

app.get('/schools', (req, res) => {
  axios({
    method: 'GET',
    url: `https://api.tomtom.com/search/2/search/${req.query.school}.json?countrySet=US&idxSet=POI&key=${process.env.TOMTOMKEY}`,
  headers: {
    Referer: 'https://developer.tomtom.com/content/search-api-explorer',
    Accept: '*/*',
  },
}).then((colleges) => {
  res.send(colleges.data);
});
});

app.get('/counter', (req, res) => {
  res.send(JSON.stringify("Please wait while you are redirected to your peer's profile"));
})

// /DELETE /deleteListing
// delete request deletes a listing (including from books)
app.delete('/deleteListing', (req, res) => {
  db.Book.destroy({
    where: {
      id_book: req.query.bookId,
    },
    // include: [db.Listing],
  }).then(() => {
    db.Listing.destroy({
      where: {
        id_listing: req.query.listingId,
      },
    });
  }).then((data) => {
    res.status(203).send(JSON.stringify(`${data}, Listing deletion successful.`));
  }).catch((err) => {
    res.status(401).send(JSON.stringify(`Error in deleting listing: ${err}`));
  });
});


// /DELETE /deleteWant
// delete request deletes a want
app.delete('/deleteWant', (req, res) => {
  db.Want.destroy({
    where: {
      id_want: req.query.wantId,
    },
  }).then(() => {
    res.send(JSON.stringify('Want deletion successful.'));
  }).catch((err) => {
    res.status(401).send(JSON.stringify(`Error in deleting want: ${err}`));
  });
});
