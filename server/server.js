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
// CURRENTLY NOT IN USE :: CURRENTLY NOT IN USE
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
        id_user: req.body.userid,
      },
      include: [db.Book]
    });
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
app.get('/peer', (req, res) => {
  let books;
  let usersBooks = [];
  let listings;
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
      listings = data;
    }).then(async () => {
      books.push([]);
      for (let listing of listings) {
        let book = await db.Book.findOne({
          where: {
            id_book: listing.id_book
          }
        })
        books[books.length - 1].push(book)}
        console.log(books[1]);
        }).then(() => {
      res.send(books);
    })
  }).catch((err) => {
    console.log(`error in get peer wants: ${err}`);
  });
});

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
//       // create array of just books using book ids
//       let offeredbooks = data.map((listing) => {
//         return db.Book.findAll({
//           where: {
//             id_book: listing.id_book
//           },
//           // include: [db.Listing]
//         })
//       })
//       books.push(offeredbooks);
      
//       res.send(books);
//     })
//   }).catch((err) => {
//     console.log(`error in get peer wants: ${err}`);
//   });
// });




// POST / offer
// Make an offer and counter offer
app.post('/offerlisting', (req, res) => {
  console.log(req);
  // incoming req.body.params. 
  // peerId = recipient (them)
  // myId = sender (me)
  // bookWanted = id_listing_recipient
  // myOffer = isbn (my book)
  // // /////////////////////////////////////////// // 
  // // DO NOT DELETE :: FOR AFTER MVP // 
  // // BELOW HERE TO THE NEXT// 
  // // need to have way to update the lister
  // // CAN BE USED TO REPLACE MVP VERSION // 
  // // TAKES IN TWO USER LISTINGS // 
  // // object to be sent back to client to update listing user of offer
  // // fill in with values after user can only select from own listing for offer
  // // ALTER AS NEEDED
  // let offerCreated = {
  //   offerId: '',
  //   senderUsername: req.body.myUsername, // need from front end
  //   senderId: req.body.myId, // currently in body
  //   senderBook: '',
  //   senderBookIsbn: '',
  //   senderListingId: '',
  //   yourBook: '',
  //   yourListingId: '',
  //   yourBookIsbn: '',
  //   money: null,
  // };
  // let idOfOffer;
  // db.Offer.create({
  //   // need id_listing, create offer, then save to offer listing
  //   // listing recipient, listing prev, listing sender, money, accepted
  //   id_listing_recipient: req.body.bookWanted,
  //   id_offer_prev: req.body.previousId || null,
  //   id_listing_sender: req.body.bookOffering, // not currently on front end
  //   money_exchange: req.body.money || null,
  //   accepted: req.body.accepted || false, // currently set to false until we accept money
  // }).then(() => {
  //   return db.Offer.findAll({
  //     limit: 1,
  //     where: {
  //       id_listing_recipient: req.body.bookWanted,
  //     },
  //     order: [['id_offer', 'DESC']]
  //   })
  // }).then((offer) => {
  //   idOfOffer = offer[0].dataValues.id_offer; // gets offer id to save values for offer listing
  //   return db.Offer_Listing.create({ // create offer listing for lister, listing recipient
  //     id_offer: idOfOffer,
  //     id_listing: req.body.bookWanted,
  //   });
  // }).then(() => {
  //   return db.Offer_Listing.create({ // create offer listing for listing sender
  //     id_offer: idOfOffer,
  //     id_listing: req.body.bookOffering,
  //   })
  // }).then(() => {
    // return db.Offer.findAll({ 
    //   where: {
    //     id_offer: idOfOffer,
    //   }
    // });
  // }).then((offerMade) => {
  //   res.send(offerMade); // SEND offer from offer table, or object above with all information for display
  //   // res.send(JSON.stringify('OFFER CREATION SUCCESS')); // currently only string is returned, need to return listing
  // }).catch((err) => {
  //   console.log(`there was an Offer Creation ERROR: ${err}`);
  // });
  // // when one offer is created, it must be sent to the lister!! // 
  // // ///////////////// END ///////////////// // 
  // // /////////////////////////////////////// // 
  // incoming req.body.params. 
  // peerId = recipient (them)
  // myId = sender (me)
  // bookWanted = id_listing_recipient
  // myOffer = isbn (my book)
  let listingSenderId;
  let currentOfferId;
  // return db.Listing.findOne({
  //   // limit: 1,
  //   where: {
  //     id_user: req.body.params.myId
  //   },
  //   include: [{
  //     model: db.Book,
  //     limit: 1, // change later, this is for demo purposes
  //     where: {
  //       isbn: req.body.params.myOffer
  //     }
  //   }]
  // let one = db.Book.findOne({
  //   where: {
  //     isbn: req.body.params.myOffer
  //   },
  // });
  // console.log(one, 'ONEEEE');
  return db.Book.findOne({
    where: {
      isbn: req.body.params.myOffer,
    },
    // include: [db.Listing]
    include: [{
      model: db.Listing,
      where: {
        id_user: req.body.params.myId || 1,
      },
    }],
  // });
  }).catch((err) => {
    console.log(`listing find failure: ${err}`);
  // }).then((myListing) => {
  //   console.log(myListing, 'MY LISTING HERE');
  // }).catch((err) => {
  //   console.log(`myListing error: ${err}`);
  }).then((myListing) => {
    console.log(myListing.listing.dataValues, 'MY LISTING AGAIN');
    console.log(req.body.params.bookWanted, 'ERRRR');
    listingSenderId = myListing.listing.dataValues.id_user;
    db.Offer.create({
      // need id_listing, create offer, then save to offer listing
      // listing recipient, listing prev, listing sender, money, accepted
      id_listing_recipient: req.body.params.bookWanted,
      id_offer_prev: req.body.params.previousId || null,
      id_listing_sender: listingSenderId,
      money_exchange: req.body.params.money || null,
      accepted: req.body.params.accepted || false,
    });
  }).catch((err) => {
      console.log(`error in offer creation: ${err}`);
  }).then(() => {
    console.log(req.body.params.bookWanted, 'WANTED');
    db.Offer.findAll({
      limit: 1,
      where: {
        id_listing_recipient: req.body.params.bookWanted,
      },
      order: [['id_offer', 'DESC']]
    }).then((offerBefore) => {
      console.log(offerBefore[0].dataValues.id_offer, 'WHAAAAT');
      currentOfferId = offerBefore[0].dataValues.id_offer; // + 1;
      return db.Offer_Listing.create({
        id_offer: currentOfferId,
        id_listing: req.body.listingId || 7, // 444 for TESTING
      })
    }).catch((err) => {
      console.log(`error in creating offer listing: ${err}`);
    }).then(() => {
      return db.Offer.findOne({
        where: {
          id_offer: currentOfferId,
        }
      })
      // res.status(200).send(JSON.stringify('offer created'));
    }).then((currentOffer) => {
      console.log(currentOffer);
      currentOffer.bookWated = req.body.params.bookWantedTitle;
      res.status(200).send(currentOffer);
    }).catch((err) => {
      console.log(`error in finding or sending offer: ${err}`);
    })
  });
  // .catch((err) => {
  //     console.log(`error in finding offer id: ${err}`);
  // }).then((offer) => {
  //   console.log(offer, 'WHAT AM I');
  //   let idOfOffer = offer[0].dataValues.id_offer;
  //   return db.Offer_Listing.create({
  //     id_offer: idOfOffer,
  //     id_listing: req.body.listingId || 444 // 444 for TESTING
  //   })
  // }).catch((err) => {
  //   console.log(`err in offer listing creation: ${err}`);
  // }).then(() => {
  //   res.send(JSON.stringify('offer creation'));
  // }).catch((err) => {
  //   console.log(`error for offer creation: ${err}`);
  // });
});
// });


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

app.get('/offers', (req, res) => {
  db.Offer.findAll({
    where: {
      id_listing_recipient: req.query.id_user
    }
  }).then(async data => {
    let offered = await db.Listing.findOne({
      where: {
        id_listing: data.id_listing_sender
      }
    })
    let offerer = await db.User.findOne({
      where: {
        id_user: offered.id_user
      }
    })
    let titleOffered = await db.Book.findOne({
      where: {
        id_book: offered.id_book
      }
    })
    let wanted = await db.Listing.findOne({
      where: {
        id_listing: data.id_listing_recipient
      }
    })
    let titleWantd = await db.Book.findOne({
      where: {
        id_book: wanted.id_book
      }
    })
    data.push([offerer, titleOffered, titleWantd])
    res.send(data);
  })
})