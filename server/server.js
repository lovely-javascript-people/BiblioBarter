/* eslint-disable */

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Chatkit = require('@pusher/chatkit-server');
const db = require('../database/database.js');
const _ = require('underscore');
const helpers = require('./apiHelpers.js');

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
  db.Listing.findAll({
    where: {
      available: true,
    }
  }).then(async (data) => {
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
      if (user.id_school) {
      const school = await db.School.findOne({
        where: {
          id_school: user.id_school
        }
      })
      matchObj[`${user.user_name}_id`] = listing.id_user;
      if (!Object.keys(matchObj).includes(user.user_name)) {
      matchObj[`${user.user_name}_school`] = school;
      matchObj[user.user_name] = [book];
      matchObj[`${user.user_name}_id`] = listing.id_user;
      } else {
        matchObj[user.user_name].push(book);
      }
      matches.push([await user, await book]);
    }
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
  console.log('LAURA LAURA LAURA');
  let uni = req.body.school;
  axios({
    method: 'GET',
    url: `https://api.tomtom.com/search/2/search/${uni}.json?countrySet=US&idxSet=POI&key=${process.env.TOMTOMKEY}`,
  headers: {
    Referer: 'https://developer.tomtom.com/content/search-api-explorer',
    Accept: '*/*',
  },
}).then((info) => 
    db.School.findOrCreate({
    where: {
      name: req.body.school, // CHANGE WHEN DROP DATABASE
      geo_latitude: info.data.results[0].position.lat,
      geo_longitude: info.data.results[0].position.lon
    },
  })
).then((data) => {
  db.User.update(
    { id_school: data[0].dataValues.id_school },
    { where: { id_user: req.body.userId } },
  )
    .then(result => res.send(result))
    .catch(err => res.send(err))
.catch(err => res.status(500).send(err));
})
})
  

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
      fulfilled: false,
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
      available: true,
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
    include: [{
      model: db.Listing, 
      where: {
      available: true,
    }}],
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
      fulfilled: false,
    },
  }).catch((err) => {
    res.status(401).send(JSON.stringify(`error in peer wants: ${err}`));
  }).then((peerWants) => {
    books = peerWants;
  }).then(() => {
    db.Listing.findAll({
      where: {
        id_user: req.query.peerId,
        available: true,
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
// offer transaction, status change from pending to rejected
app.patch('/offerlisting', (req, res) => {
  const { body: { params: { status, offerId } } } = req;
  db.Offer.update(
    {
      status,
    },
    {
    returning: true,
    where: {
      id_offer: offerId,
      },
  },
  ).then(([listingsUpdated, [updatedListing]]) => {
    res.status(200).send(updatedListing);
  }).catch((err) => {
    res.status(401).send(JSON.stringify(`patch error: ${err}`));
  });
});

// PATCH / accept/offerlisting
/**
 * Patch request sent for accepted offers. Db status on offers table changes to accepted.
 * Listings available column changed to false.
 * Wants fulfilled column changes to true.
 * @param {number} offerId offer id of offer to change to accepted.
 * @param {number} peerid peer's id
 * @param {number} userId user's id
 * @param {array} myTitles array of titles 
 * @param {array} peerTitles array of titles from peer
 * Use offerId to change status to accepted.
 * Change all status on Want and Listings tables so they no longer display on user's page.
 */

app.patch('/accept/offerlisting', (req, res) => {
  var allListingIdsOfOffer = [];
  let { offerId, peerid, userId, peerTitles, myTitles } = req.body.params;
  return db.Offer.update({
    status: 'accepted',
  },
  {
    returning: true,
    where: {
      id_offer: offerId,
    },
    }).then((booksGalore) => {
    return db.Offer_Listing.findAll({
      where: {
        id_offer: offerId,
      },
    });
  }).then((allAccList) => {
    for (let i = 0; i < allAccList.length; i++) {
      allListingIdsOfOffer.push(allAccList[i].id_listing);
      db.Listing.update({
        available: false,
      }, {
          where: {
            id_listing: allAccList[i].id_listing,
          },
          returning: true,
          plain: true,
        });
    }
  }).then((steady) => {
    myTitles = ['The diversity of fishes'];
    for (let j = 0; j < myTitles.length; j++) {
      db.Want.update({
        fulfilled: true,
      }, {
        where: {
          title: myTitles[j],
          id_user: peerid,
        },
      }).catch((err) => console.log(err));
    }
  }).then(() => {
    peerTitles = ['Technical drawing with engineering graphics', 'The AMA Guide to Management Development'];
    for (let i = 0; i < peerTitles.length; i++) {
      db.Want.update({
        fulfilled: true,
      }, {
        where: {
          title: peerTitles[i],
          id_user: userId,
        },
      }).catch((err) => console.log(err));
    }
  }).then(() => {
    res.status(200).send(JSON.stringify('Successful accept'));
  }).catch((err) => {
    res.status(500).send(JSON.stringify(`Unsuccessful accept, error: {err}`));
  });
});

// GET /offers
// grabs all the user's offers and gives the information back for display
// build the object for return
/**
 * @param {number} req.query.id_user User id
 * @returns {array} array and objects. In first index, array of user's listings.
 * In following indexes, objects holding information of offer.
 * Each object contains myListings, offer, peerInfo, peerListings
 * myListings contains a user's book information on the offer
 * offer contains information on the current offer
 * peerInfo gives information on the user
 * peerListings contains information on peer's listings pertaining to the offer
 */
app.get('/offers', (req, res) => {
  let allOffersForIds = []; // all offer id related to user
  let allPeers = []; // all peer id who has an offer connected to user
  let allOffers = []; // array of all offers with information for each user
  let allYourListingIds = []; // all id_listings for user
  var allUserListings = [];
  var allUsersBooks = [];
  db.Listing.findAll({ // first find all listings for this user
    where: {
      id_user: req.query.id_user,
    },
  }).then(async (data) => {
    console.log(data, 'ALL YOUR LISTINGS');
    allUserListings = [...data];
    let listingData = [...data];
    for (let b = 0; b < listingData.length; b++) { // loop through the array of listings
      allYourListingIds.push(listingData[b].id_listing); // push listing id into array for comparison later
      let bookFound = await db.Book.findOne({ // find book information for listing
        where: {
          id_book: listingData[b].id_book,
        },
      });
      allUsersBooks.push(bookFound); // push book into array for utilization
    }
    return listingData; // return all listings to find all offers tied to listing
  }).then(async (data) => {
    console.log(allUsersBooks);
    const lists = [...data];
    for (let i = 0; i < lists.length; i++) { // for each listing, find the offer id linked to listing
      offersOnListing = await db.Offer_Listing.findAll({ // finds all offer_listing with listing
        where: {
          id_listing: lists[i].id_listing,
        },
      });
      console.log(offersOnListing, 'OFFER LISTING');
      for (let p = 0; p < offersOnListing.length; p++) {
        allOffersForIds.push(offersOnListing[p].id_offer);
      } // all is good at this point
      for (let j = 0; j < offersOnListing.length; j++) { // on each offer_listing, grab id_offer
        offerIdForListing = await db.Offer.findAll({
          where: {
            id_offer: offersOnListing[j].id_offer,
          },
        });
        if (!await allOffersForIds.includes(offerIdForListing[0].id_offer)) { // add offer id to array if not already in
          allOffersForIds.push(offerIdForListing[0].id_offer); // 
        }
        if (!await allPeers.includes(offerIdForListing[0].id_sender) && // checks to see if user is sender or recipient
        offerIdForListing[0].id_sender !== req.query.id_user) {
          allPeers.push(offerIdForListing[0].id_sender);
        }
        if (!await allPeers.includes(offerIdForListing[0].id_recipient) && // then pushes the peer's id into array
          offerIdForListing[0].id_recipient !== req.query.id_user) { // may currently add user id as well
          allPeers.push(offerIdForListing[0].id_recipient);
        }
      }
    }
    // using the information from the offer id, grab all the listings, and grab the book details
    // if book offering versus book want
    console.log(lists, 'LISTS'); // array of objects, each holding data on listing
    console.log(allPeers, 'ALL PEERS'); // user ids, may include user along with peers in transaction
    console.log(allOffersForIds, 'OFFER IDS for USER'); // user ids, may include user along with peers in transaction
    // start with offer id, then move to grabbing each listing, part of each offer
    return allPeers;
  }).then(async (allpeers) => {
    for (let k = 0; k < _.uniq(allOffersForIds).length; k++) {
      console.log('enter async all offers');
      var oneCompleteOffer = {};
      let offerForId = await db.Offer.findOne({
        where: {
          id_offer: allOffersForIds[k],
        }
      });
      oneCompleteOffer.offer = offerForId;
      const myListings = [];
      const peerListings = [];
      let listingsForOffer = await db.Offer_Listing.findAll({
        where: {
          id_offer: allOffersForIds[k],
        },
      });
      let currentBook;
      for (let i = 0; i < listingsForOffer.length; i++) {
        currentBookListing = await db.Listing.findOne({
            where: {
              id_listing: listingsForOffer[i].id_listing,
              // include: [db.Book],
            },
          });
<<<<<<< HEAD
          if(currentBookListing !== null) {
=======
          if (currentBookListing !== null) {
>>>>>>> c0bd203dfb308fa2b1009177ae2cf0b2e2e40a07
        currentBook = await db.Book.findOne({
          where: {
            id_book: currentBookListing.id_book,
          },
        });
        let finalBook = {...currentBook.dataValues};
        finalBook.listing = currentBookListing;
        if (allYourListingIds.includes(listingsForOffer[i].id_listing)) {
          myListings.push(finalBook);
        } else {
          peerListings.push(finalBook);
        }
<<<<<<< HEAD
      }}
=======
          }
      }
>>>>>>> c0bd203dfb308fa2b1009177ae2cf0b2e2e40a07
      oneCompleteOffer.myListings = myListings;
      oneCompleteOffer.peerListings = peerListings;
      let peerInfo;
      if (offerForId.id_recipient === req.query.id_user) {
        peerId = await db.User.findOne({
          where: {
            id_user: offerForId.id_recipient,
          },
        });
      } else {
        peerInfo = await db.User.findOne({
          where: {
            id_user: offerForId.id_sender,
          },
        });
      }
      oneCompleteOffer.peerInfo = peerInfo;
      console.log(offerForId, 'ID OFFER');
      console.log(listingsForOffer, 'LISTINGS FOR OFFER');
      // oneCompleteOffer.allUsersListings = allUserListings; // uncomment if need all users listings, currently not needed
      allOffers.push(oneCompleteOffer);
    }
    allOffers.push(allUserListings);
    return allOffers;
  }).then((allOffers) => {
    console.log(allOffers, 'END: ALL OFFERS');
    res.status(200).send(allOffers);
  }).catch((err) => {
    // console.log(`Aw Man, you got an error: ${err}`);
    res.status(500).send(JSON.stringify(`An error occured in retrieving all offers: ${err}`));
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
  const { idRecipient, idOfferPrev, idSender, money, listings } = req.body.params;
  if (idOfferPrev) {
    db.Offer.update({
      status: 'rejected',
    },
    {
      where: {
        id_offer: idOfferPrev,
      },
    }).catch((err) => console.log(`Error in offer rejection status changed: ${err}`));
  }
  db.Offer.create({
    id_recipient: idRecipient,
    id_offer_prev: idOfferPrev,
    id_sender: idSender,
    money_exchange_cents: money || null,
  }).then(async () => {
    const newOffer = await db.Offer.findAll({
      limit: 1,
      where: {
        id_recipient: idRecipient,
      },
      order: [['id_offer', 'DESC']],
    });
    console.log(newOffer, 'NEW OFFER');
    offerId = await newOffer[0].id_offer;
    return newOffer;
  }).then((newOfferArray) => {
      _.each(listings, async listing => {
      await db.Offer_Listing.create({
        id_offer: offerId,
        id_listing: listing.id_listing,
      });
    }
  )}).then(async () => {
    let newOfferMade = await db.Offer.findOne({
      where: {
        id_offer: offerId,
      },
    });
    return newOfferMade;
  }).then((offerMade) => {
    res.status(200).send(offerMade);
  })
  .catch((err) => {
    res.status(401).send(JSON.stringify(`error in offer creation: ${err}`));
  });
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
  let radiusInMeters;
  db.User.findOne({
    where: {
      id_user: req.query.id_user
    }
  }).then(userInfo => {
    radiusInMeters = userInfo.search_radius_miles * 1609.34;
    return db.School.findOne({
      where: {
        id_school: userInfo.id_school
      }
  })
}).then(schoolInfo => {
  let lat = schoolInfo.geo_latitude;
  let lon = schoolInfo.geo_longitude;
  axios({
    method: 'GET',
    url: `https://api.tomtom.com/search/2/poiSearch/university.json?key=${process.env.TOMTOMKEY}&typeahead=false&limit=10&ofs=1000&countrySet=US&lat=${lat}&lon=${lon}&radius=${radiusInMeters}&language=en-us&extendedPostalCodesFor=POI&view=Unified`,
  headers: {
    Referer: 'https://developer.tomtom.com/content/search-api-explorer',
    Accept: '*/*',
  },
}).then((colleges) => {
  res.send(colleges.data);
});
});
})


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


// GET //getUser
app.get('/getUser', (req, res) => {
  console.log(req.query);
  let allUserInfo;
  db.User.findOne({
    where: {
      id_user: req.query.id,
    },
  }).then(async (userInfo) => {
    console.log(userInfo, 'USER INFO IN GET USER');
    allUserInfo = {...userInfo.dataValues};
    let schoolInfo = await db.School.findOne({
        where: {
          id_school: userInfo.id_school
        },
      });
      allUserInfo.school = await schoolInfo;
    return allUserInfo;
  }).then((userInfo) => {
    console.log(userInfo, 'PART TWO OF USR INFO');
    res.status(200).send(userInfo);
  }).catch((err) => {
    res.status(500).send(JSON.stringify(`Error in retreiving peer information: ${err}`));
  });
});