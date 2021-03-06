import { Injectable } from '@angular/core';
// import { WebSocketServiceService } from './web-socket-service.service';
import Chatkit from '@pusher/chatkit-client';
import axios from 'axios';
import { Subject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentUser = <any>{};
  messages = [];
  currentRoom = <any>{};
  roomUsers = [];
  userRooms = [];
  newMessage = '';
  newRoom = {
    name: '',
    isPrivate: false
  };
  joinableRooms = [];
  // newUser = '';
  // local = 'localhost:3000';
  // local = 'ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000';
  local = '18.216.108.229:3000';

  // Our constructor calls our wsService connect method
  constructor() {
    // this.messages = <Subject<any>>wsService
    //   .connect()
    //   .map((response: any): any => {
    //     return response;
    //   });
  }
  /**
   * Called once an offer is accepted, creates a chat for the parties involved
   * @param roomName A roomname that is a combination of the two users involved in an offer
   * @param peerId Your peer's username
   * @param callback should be chat.addPeerToChat
   */
  offerChat(roomName, peerId, callback) {
    let userId = localStorage.username
    let user;
    axios.post(`http://${this.local}/users`, { userId })
      .then(() => {
        const tokenProvider = new Chatkit.TokenProvider({
          url: `http://${this.local}/authenticate`
        });
        const chatManager = new Chatkit.ChatManager({
          instanceLocator: 'v1:us1:1264d0d5-5678-4765-abf9-ec9e94daba1f',
          userId,
          tokenProvider
        });
        return chatManager
          .connect({})
          .then(currentUser => {
            user = currentUser;
            currentUser.createRoom({
              name: roomName,
              private: true,
            }).then(room => {
              callback(peerId, room.id, user);
            }) 
          });
      }).catch(() => {
        const tokenProvider = new Chatkit.TokenProvider({
          url: `http://${this.local}/authenticate`
        });
        const chatManager = new Chatkit.ChatManager({
          instanceLocator: 'v1:us1:1264d0d5-5678-4765-abf9-ec9e94daba1f',
          userId,
          tokenProvider
        });
        return chatManager
        .connect({})
        .then(currentUser => {
          user = currentUser;
          currentUser.createRoom({
            name: roomName,
            private: true,
          }).then(room => {
            callback(peerId, room.id, user);
          }) 
        });
      });
  }

  /**
   * Upon successful room creation, creates peer account and adds them to that room.
   * @param peerId Your peer's username
   * @param roomId Id of the room created in the previous step
   * @param user Your user object with attached chatkit methods
   */
  addPeerToChat(peerId, roomId, user) {
    axios.post(`http://localhost:3000/users`, { peerId })
      .then(() => {
        const tokenProvider = new Chatkit.TokenProvider({
          url: `http://localhost:3000/authenticate`
        });
        const chatManager = new Chatkit.ChatManager({
          instanceLocator: 'v1:us1:1264d0d5-5678-4765-abf9-ec9e94daba1f',
          peerId,
          tokenProvider
        });
        return chatManager
          .connect({})
          .then(() => {
            user.addUserToRoom({
              peerId,
              roomId,
            })
          });
      }).catch(() => {
        const tokenProvider = new Chatkit.TokenProvider({
          url: `http://localhost:3000/authenticate`
        });
        const chatManager = new Chatkit.ChatManager({
          instanceLocator: 'v1:us1:1264d0d5-5678-4765-abf9-ec9e94daba1f',
          peerId,
          tokenProvider
        });
        return chatManager
        .connect({})
        .then(() => {
          user.addUserToRoom({
            peerId,
            roomId,
          })
        });
      });
  }

  // Our simplified interface for sending
  // messages back to our socket.io server
  // sendMsg(msg) {
  //   this.messages.next(`${localStorage.username}` + msg);
  // }
}
