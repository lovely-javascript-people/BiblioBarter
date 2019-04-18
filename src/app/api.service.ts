import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FooterModule } from './footer/footer.module';
import { FooterComponent } from './footer/footer.component';
import { callbackify } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {
  }

  host = 'http://ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000';
  local = 'http://localhost:3000';
  // local = 'http://18.220.255.216:3000';

  /**
   * Input fields for user to send message to API server and saved to DB.
   * @param {number} userId id of user associated with comment
   * @param {string} userEmail user's email for return response
   * @param {string} emailBody user's message to us
   */
  contactUs(userId, userEmail, emailBody) {
    console.log(userId, userEmail, emailBody, 'USER AND MESSAGE INFO');
    this.http.post(`${this.local}/contactUs`, {userId: userId, userEmail: userEmail, emailBody: emailBody})
      .subscribe((data) => {
        console.log(data);
      });
  }

  /**
   * 
   */
  userAcceptOffer() {
    console.log('accepted');
  }

  /**
   * Users can make changes to profile settings
   * @param firstName 
   * @param lastName 
   * @param userEmail 
   * @param userId 
   * @param searchRadius 
   * @param address 
   * @param phoneNumber 
   */
  updateSettings(firstName, lastName, userEmail, userId, searchRadius, address, phoneNumber) {
    console.log(userId, 'USER ID');
    console.log(firstName, 'first name');
    // patch req to server
    this.http.patch(`${this.local}/user/settings`,
    { email: userEmail,
      userId: userId,
      radius: searchRadius,
      firstName: firstName,
      lastName: lastName,
      address: address,
      phoneNumber: phoneNumber
    })
      .subscribe((data) => {
        console.log(data);
      });
  }

  // getBookInfoForOfferingList(isbn: string, callback) {
  //   this.http.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json`) // book info from book api
  //     .subscribe(((bookInfo: any) => {
  //       callback(bookInfo); // gets title of book
  //     }));
  // }

  getBookInfoForOfferingList(isbn: string, callback) {
    // https://www.googleapis.com/books/v1/volumes?q=isbn:9781573101370
    this.http.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json`) // book info from book api
      .subscribe(((bookInfo: any) => {
        callback(bookInfo); // gets title of book
      }));
  }

  addBookToUserOfferingList(isbnVal, bookCondition, title, userid, imageLink) {
    this.http.post(`${this.local}/user/listing`, { params: isbnVal, bookCondition, title, userid, imageLink })
      .subscribe((allListings: any) => {
        console.log(allListings, 'ALL LISTINGS IN OFFERING LIST');
        });
  }

  /**
   * Takes values to send to API server to save to db for user's want listings
   * @param {string} isbnVal ISBN number of book as string
   * @param {number} userid id of user for want list
   * @param {string} title title of book
   * @param {string} imageLink url of book image
   */
  addBookToUserWantList(isbnVal, userid, title, imageLink) {
    this.http.post(`${this.local}/user/want`, { params: isbnVal, userid, title, imageLink })
      .subscribe((allWants: any) => {
      console.log(allWants, 'ALL WANTS FROM API SERVICE');
    });
  }

  getAcceptedOffers(callback) {
    this.http.get(`${this.local}/accept/offerlisting`, { params: { id_user: localStorage.userid }})
    .subscribe((accepted) => {
      console.log(accepted, 'Accepted offers');
      callback(accepted);
    });
  }

  /**
   * 
   * @param {function} callback takes the values and set the want books
   */
  renderWantList(callback) {
    // console.log(localStorage.userid, 'USERID');
    this.http.get(`${this.local}/user/want?${localStorage.userid}`)
    .subscribe((wantListArray) => {
      console.log(wantListArray, 'ARRAY OF WANT LIST');
      callback(wantListArray);
    });
  }

  /**
   * 
   * @param {function} callback takes the values and sets the listings
   */
  renderListingsList(callback) {
    this.http.get(`${this.local}/user/listing?${localStorage.userid}`)
    .subscribe((listingListArray) => {
      console.log(listingListArray, 'ARRAY OF OFFERING LIST');
      callback(listingListArray);
    });
  }

  /**
   * 
   * @param {string} isbn takes in isbn to make a get request to search
   * for book with isbn
   */
  searchForBookWithIsbn(isbn) {
    this.http.get(`${this.local}/search/listing/isbn?${isbn}`)
    .subscribe((searchedListings: any) => {
      console.log(searchedListings, 'BOOKS USER HAS SEARCHED FOR');
      localStorage.setItem('searchedListings', searchedListings);
      console.log(localStorage);
    });
  }

  /**
   * 
   * @param {number} peerId makes a request to grab peer information
   * @param {number} callback takes peer's information and set book information
   */
  getPeerProfile(peerId, callback) {
    console.log(peerId, 'PEEER ID');
    this.http.get(`${this.local}/peer`, { params: {peerId} }).subscribe(data => {
      console.log(data, 'HEREERERERERE');
      callback(data);
    });
  }

  getBooks(isbn: string, callback) {
    this.http.get(`${this.local}/search/listing/isbn?${isbn}`).subscribe((searchedListings: any) => {
      console.log(searchedListings, 'SEARCHED LISTINGS');
      callback(searchedListings);
    });
  }

  sendOffer(options: any) {
    // console.log(options, 'OPTIONS');
    this.http.post(`${this.local}/offers`, { params: options }).subscribe(resp => {
      console.log(resp, 'offer created success');
    });
  }

  /**
   * 
   * @param {function} callback renders the offers for user
   */
  getOffers(callback) {
    console.log('TRYING TO GET OFFERS BUT STILL NOT WORKING');
    this.http.get(`${this.local}/offers`, { params: { id_user: localStorage.userid }}).subscribe(data => {
      console.log(data, 'DATA IN FROM GETOFFERS API CALL');
      callback(data);
    });
  }

  /**
   * 
   * @param {string} username uses username to grab information
   * @param {function} callback sets the user's information
   */
  getProfile(username, callback) {
    this.http.get(`${this.local}/profile`, { params: { username } })
    .subscribe(data => {
      callback(data);
    });
  }

  // helper function to send user info
    userSignup({nickname, family_name, given_name, picture}) {
      // // this.http.post('http://localhost:3000/signup', {
      // // this.http.post('http://bibliobarter.com/signup', {
      this.http.post(`${this.local}/signup`, { params : {
        nickname,
        family_name,
        given_name,
        picture,
      }}).subscribe(async (response) => {

        console.log(response);
        });
    }

    /**
     * 
     * @param {function} callback grabs information on other users that might match with user
     */
    getMatches(callback): any {
      // const DNS = process.env.DEVELOPMENT === 'development' ?
      console.log('IN GET MATCHES ON API SERVICE RIGHT HERE');
      this.http.get(`${this.local}/matches`).subscribe((response) => {
      callback(response);
      });
    }

    /**
     * 
     * @param {number} id_user user's information to grab user information
     * @param {function} callback sets information about user's school
     */
    getSchools(id_user, callback) {
      this.http.get(`${this.local}/schools`, { params: { id_user } }).subscribe((response) => {
        callback(response);
        });
    }

    /**
     * 
     * @param {number} id id of current offer
     * @param {number} sender_id id of user sending counter offer
     * @param {number} recipient_id id of user receiving counter offer
     * @param {array} all_listings array of listing information for offer created
     * @param {number} money value of money offered (negative) or requested (positive)
     */
    counterOffer(id, sender_id, recipient_id, all_listings, money) { // this takes in the offerId of the offer that the user is countering
      this.http.post(`${this.local}/counter`, { params: { id, sender_id, recipient_id, all_listings, money } }).subscribe((response) => {
        console.log(response);
        });
    }

    /**
     * 
     * @param {number} id gets user information by id
     * @param {function} callback sets information on user after get request
     */
    getUserInfo(id, callback) {
      this.http.get(`${this.local}/getUser`, { params: { id: id }})
        .subscribe((data) => {
          console.log(data, 'USER INFO');
          callback(data);
        });
    }
}

