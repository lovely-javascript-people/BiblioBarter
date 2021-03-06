/* eslint-disable */
// import { db } from './server';

/**
 * @todo File is currently depracated. Was started out in the beginning of project.
 * Come back to refactor server functions into here
 */
/**
 * function findBookISBN takes in book title and calls on api to grab isbn number for return
 * @param {string} : isbnVal of book title, need to change to number for query
 * @returns {array} array of objects containing each listing information
 */
const findBookByIsbn = (db, isbnVal) => {
  // const isbnNum = Number(isbnVal);
  return db.Book.findAll({
    where: {
      isbn: isbnVal,
    },
  }).then(data => console.log(data, 'I am data'));
};

/**
 * function insertNewUser inserts a new user into the database
 * @param {string} username - user's username
 * @param {string} first - user's first name
 * @param {string} last - user's last name
 * @param {string} link - user's url link for picture
 * @param {number} school - school id
 * @param {string} add - user address
 * @param {string} email - user email address
 * @param {string} number - user phone number
 * @param {number} radius - user set search radius
 */
const insertNewUser = async (username, first, last, link, school, add, email, number, radius) => {
  console.log(User, 'USER');
  console.log(db.User, 'DDDBBB');
  db.User.create({
    user_name: username,
    // id_school: school,
    // address: add,
    // email: email,
    // phone_number: number,
    name_first: first,
    name_last: last,
    image_link: link,
    // search_radius_miles: radius,
  }).then(() => {
    console.log('new user created');
  }).catch(() => {
    console.log('could not insert new user');
  });
};

/**
 * function newListing creates a new listing for a user, and also inputs the values into
 * book table. Must first create a new book in table, then create listing.
 * @param {number} userId - user's id
 * @param {number} isbn - book isbn number
 * @param {string} condition - condition of book
 * @param {string} title - book title
 */
const newListing = (userId, isbn, condition, title) => {
  let bookId;
  db.Book.create({
    isbn,
    title,
    condition,
  });
  // still having trouble with which one to save first to grab the foreign key
  // db.Book.findOne({
  //   where: {

  //   }
  // })

  // model.findOne({
  //   where: {
  //     key: key,
  //   },
  //   order: [['createdAt', 'DESC']],
  // });
  db.Listing.create({
    id_user: userId,
    id_book: bookId,
    date_created: new Date(),
  });
};

/**
 * function createWant creates a row in the want table for the book this user is looking for.
 * @param {number} userId - user's id
 * @param {number} isbn - book isbn number
 * @param {string} condition - condition of book
 */
const createWant = (userId, isbn, condition) => {
  db.Want.create({
    id_user: userId,
    isbn,
    condition,
  });
};

const findOneOfferByIdOffer = (idOffer) => {
  console.log('findOneOfferByIdOffer called from apiHelpers')
  return db.Offer.findOne({
    where: {
      id_offer: idOffer,
    },
  });
}

const getAccepted = async (req, res, db) => {
  const acceptedOffers = [];
  let offerDetail = [];
  return db.Offer.findAll({
    where: {
      id_recipient: req.query.id_user,
      status: 'accepted',
    }
  }).then((accepted) => {
    for (const offer of accepted) {
      acceptedOffers.push(offer);
    }
  }).then(async () => {
    offerDetail = acceptedOffers.map(async offer => {
      let offered = [offer];
      let users = await db.User.findOne({
        where: {
          id_user: offer.id_sender
        }
      })
      offered.push(await users);
      let books = await db.Offer_Listing.findAll({
        where: {
          id_offer: offer.id_offer
        }
      })
      for(const book of books) {
        let listing = await db.Listing.findOne({
          where: {
            id_listing: book.id_listing
          }
        })
        let text = await db.Book.findOne({
          where: {
            id_book: await listing.id_book
          }
        })
        const textBook = await text;
        offered.push({book: textBook, listing: listing});
      }
      return offered;
    })
    return await Promise.all(offerDetail);
  })
}

const getPending = async (req, res, db) => {
  const pendingOffers = [];
  let offerDetail = [];
  return db.Offer.findAll({
    where: {
      id_recipient: req.query.id_user,
      status: 'pending',
    }
  }).then((pending) => {
    for (const offer of pending) {
      pendingOffers.push(offer);
    }
  }).then(async () => {
    offerDetail = pendingOffers.map(async offer => {
      let offered = [offer];
      let users = await db.User.findOne({
        where: {
          id_user: offer.id_sender
        }
      })
      offered.push(await users);
      let books = await db.Offer_Listing.findAll({
        where: {
          id_offer: offer.id_offer
        }
      })
      for(const book of books) {
        let listing = await db.Listing.findOne({
          where: {
            id_listing: book.id_listing
          }
        })
        let text = await db.Book.findOne({
          where: {
            id_book: await listing.id_book
          }
        })
        const textBook = await text;
        offered.push({book: textBook, listing: listing});
      }
      return offered;
    })
    return await Promise.all(offerDetail);
  })
}

module.exports = {
  findBookByIsbn,
  insertNewUser,
  newListing,
  createWant,
  findOneOfferByIdOffer,
  getAccepted,
  getPending,
};
