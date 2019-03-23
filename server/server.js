/* eslint-disable */
const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors')
const { sequelize } = require('../database/database.js');
const db = require('../database/database.js');
const helpers = require('./apiHelpers.js');
const Chatkit = require('@pusher/chatkit-server');
const axios = require('axios');

const chatkit = new Chatkit.default({
  instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_SECRET_KEY,
});

// const app = express();
const PORT = process.env.PORT || 3000;
///////////////
const app = express();
const socketIO = require('socket.io');

const server = express()
  .use(app)
  .listen(PORT, () => console.log(`BiblioBarter listening on ${PORT}`));

const io = socketIO(server);
///////////////

// var http = require('http').Server(app);
// // var io = require('socket.io')(http);

// let serve = app.listen(port, () => console.log(`Biblio server listening on port ${port}!`));
// var io = require('socket.io').listen(serve);



app.use(bodyParser.json());
// app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.get('/callback', (req, res) => {
  res.send(JSON.stringify('hello'))
})

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
    for (let listing of data) {
      let user = await db.User.findOne({
        where: {
          id_user: listing.id_user
        }
      })
      let book = await db.Book.findOne({
        where: {
          id_book: listing.id_book
        }
      })
      matchObj[user.user_name + '_id'] = listing.id_user;
      if (!matchObj.hasOwnProperty(user.user_name)) {
      matchObj[user.user_name] = [book];
      matchObj[(user.user_name + '_id')] = listing.id_user;
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
  })
});

// does not currently work, no get request on front end
// app.get('/chat', function (req, res) {
//   // res.sendFile(__dirname + '../src/app/chat/chat.page.html');
//   res.send(JSON.stringify("HEY HEY HEY"));
// });

// ///////////////////////////////////// // 
// ///////////////////////////////////// //

// users object, holds each user's socket connection
// property is username of user, value is socket
const users = {};

// socket io connection
// on each new socket creation, we save it on users object
io.on('connection', (socket) => {
  console.log('a user connected');
  // this sends message into chatroom
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg); // logs in terminal
    io.emit('chat message', msg); // emits to the chat..
  });
  socket.on('disconnect', (data) => {
    console.log('user disconnected');
    io.emit('emit user disconnected'); // has not worked on one computer connection
  });
  // When we receive a 'message' event from our client, print out
  // the contents of that message and then echo it back to our client
  // using `io.emit()`
  // CURRENTLY BELOW only logs on server
  // emit sent to client, but NO Messages appear in chat room
  // socket.on('message', (message) => {
  //   console.log('Message Received: ' + message);
  //   io.emit('message', { type: 'new-message', text: message });
  // });
});
// ///////////////////////////
// io.on('connection', function (socket) {
//   socket.on('chat message', function (msg) {
//     console.log('message: ' + msg);
//   });
// });
// io.on('connection', function (socket) {
  // socket.on('chat message', function (msg) {
  //   io.emit('chat message', msg);
  // });
// });

// app.listen(port, () => console.log(`Biblio server listening on port ${port}!`));


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
  db.User.create({ user_name: nickname, name_first: given_name, name_last: family_name, image_link: picture }, {fields: ['user_name', 'name_first', 'name_last', 'image_link']})
  .then(() => {
    console.log(JSON.stringify('new user success'));
  }).catch((err) => {
    res.send(JSON.stringify(`there was a problem: ${err}`));
  })
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
    .catch(err => {
      if (err.error === 'services/chatkit/user_already_exists') {
        console.log(`User already exists: ${userId}`);
        res.sendStatus(200);
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
      name: req.body.school // CHANGE WHEN DROP DATABASE
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
    image_link: req.body.imageLink,
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
  console.log(Object.keys(req.query));
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
  let isbnNum = req.body.params;
  db.Book.create({
    isbn: isbnNum,
    title: req.body.title,
    condition: req.body.bookCondition,
    image_link: req.body.imageLink
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
  let isbnNum = Object.keys(req.query)[0];
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
// returns wants and listings for a profile you visit 
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
        books.push(listings);
        }).then(() => {
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
  let idOfOffer;
  db.Offer.create({
    // need id_listing, create offer, then save to offer listing
    // listing recipient, listing prev, listing sender, money, accepted
    id_listing_recipient: req.body.params.bookWanted[0].id_listing,
    id_offer_prev: req.body.params.previousId || null,
    id_listing_sender: req.body.params.bookOffering, // not currently on front end
    money_exchange: req.body.money || null,
    accepted: req.body.accepted || false, // currently set to false until we accept money
  }).then(async () => {
    let newOffer = await db.Offer.findAll({
      limit: 1,
      where: {
        id_listing_recipient: req.body.params.bookWanted[0].id_listing,
      },
      order: [['id_offer', 'DESC']]
    })
    return newOffer;
  }).then((offer) => {
    idOfOffer = offer[0].id_offer; // gets offer id to save values for offer listing
    return db.Offer_Listing.create({ // create offer listing for lister, listing recipient
      id_offer: idOfOffer,
      id_listing: req.body.params.bookWanted[0].id_listing,
    });
  }).then(() => {
    return db.Offer_Listing.create({ // create offer listing for listing sender
      id_offer: idOfOffer,
      id_listing: req.body.params.bookOffering,
    })
  }).then(() => {
    return db.Offer.findAll({ 
      where: {
        id_offer: idOfOffer,
      }
    });
  }).then((offerMade) => {
    res.send(offerMade);
  }).catch((err) => {
    console.log(`there was an Offer Creation ERROR: ${err}`);
  });
  
});



// PATCH / offerlisting
// Final transaction made by two users boolean changed
app.patch('/offerlisting', (req, res) => {
  // needs id of offer
  console.log(req.body, 'REQ BODY /OFFERLISTING');
  db.Offer.update(
    {
      status: req.body.params.status,
    }, 
    {
    returning: true,
    where: {
      id_offer: req.body.params.offerId,
      }
  }).then(([listingsUpdated, [updatedListing]]) => {
    res.status(200).send(updatedListing);
  }).catch((err) => {
    console.log(`patch error: ${err}`);
  });
});

// app.listen(port, () => console.log(`Biblio server listening on port ${port}!`));

app.get('/offers', (req, res) => {
  console.log(req.body, 'REQ BODY')
  db.Listing.findAll({
    where: {
      id_user: req.query.id_user
    }
  }).then(async data => {
    console.log(data, 'ISSSSSSSSS');
    let lists = [...data];
    let resArr = [data];
    for (let piece of lists) {
      console.log(piece, 'PIECE');
    var offered = await db.Offer.findAll({
      where: {
        id_listing_recipient: piece.dataValues.id_listing
      }
    })
    if (offered.length) {
      for (let offer of offered) {
    let offerer = await db.User.findOne({
      where: {
        id_user: await piece.dataValues.id_user
      }
    })
    var titleOffered = await db.Book.findOne({
      where: {
        id_book: await piece.id_book
      }
    })
    console.log('OFFERED ********', offer, 'offer******');
    let wanted = await db.Listing.findOne({
      where: {
        id_listing: offer.id_listing_sender
      }
    })
    var titleWantd = await db.Book.findOne({
      where: {
        id_book: await wanted.id_book
      }
    })
    let peerListing = await db.Listing.findOne({
      where: {
        id_listing: offer.id_listing_sender
      }
    })
    var peer = await db.User.findOne({
      where: {
        id_user: peerListing.id_user
      }
    })
    resArr.push({ offer, 'titleWanted': titleOffered, 'titleOffered': titleWantd, peer });
  }
}
  }
    res.send(resArr);
  })
})

// patch /user/setting
// user may change settings
/**
 * @todo make it so that each update does not turn the other values to null
 */
app.patch('/user/settings', (req, res) => {
  let val = req.body; // please change later, not currently saving and not replacing
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
      }
    }
  ).then(([userUpdated, [updatedUser]]) => {
    res.status(200).send(updatedUser);
  }).catch((err) => {
    console.log(`patch error to user settings: ${err}`);
  });
});

// POST /contactus 
// users can send us a message
// userId, userEmail, emailBody
app.post('/contactUs', (req, res) => {
  console.log(req.body, 'BODY OF EMAIL');
  db.Contact_Us.create({
    id_user: req.body.userId,
    message: req.body.emailBody,
  }).then((success) => {
    console.log(success, 'SUCCESS');
    if (req.body.userEmail !== undefined) {
      db.User.update(
        {
          email: req.body.userEmail,
        },
        {
        where: {
          id_user: req.body.userId,
        },
      });
    } else {
      console.log('no need to change email');
    }
  }).then(() => {
    console.log('sucesss in email input');
    res.status(200).send(JSON.stringify('Message sent to developers'));
  }).catch((err) => {
    console.log(`error in contact us: ${err}`);
  });
});

app.get('/schools', (req, res) => {
  axios({
    method: 'GET',
    url: `https://api.tomtom.com/search/2/search/${req.query.school}.json?countrySet=US&idxSet=POI&key=${process.env.KEY}`,
  headers: {
    Referer: 'https://developer.tomtom.com/content/search-api-explorer',
    Accept: '*/*',
  }
}).then(colleges => {
  res.send(colleges.data);
})
})

app.get('/counter', (req, res) => {
  res.send("Please wait while you are redirected to your peer's profile");
})

// /DELETE /deleteListing
// delete request deletes a listing (including from books)
app.delete('/deleteListing', (req, res) => {
  console.log(req.query, 'DELETE LISTING BODY');
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
    console.log(`${data}, Listing deletion successful.`);
  }).catch((err) => {
    console.log(`Error in deleting listing: ${err}`);
  });
});


// /DELETE /deleteWant
// delete request deletes a want
app.delete('/deleteWant', (req, res) => {
  console.log(req.query, 'WANT BODY');
  db.Want.destroy({
    where: {
      id_want: req.query.wantId,
    },
  }).then(() => {
    console.log(`Want deletion successful.`);
  }).catch((err) => {
    console.log(`Error in deleting want: ${err}`);
  });
});
