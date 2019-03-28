import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import Chatkit from '@pusher/chatkit-client';
import axios from 'axios';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  userId = '';
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
  newUser = '';

      addUserToRoom() {
        const { newUser, currentUser, currentRoom } = this;
        currentUser.addUserToRoom({
          userId: newUser,
          roomId: currentRoom.id
        })
          .then((currentRoom) => {
            this.roomUsers = currentRoom.users;
          })
          .catch(err => {
            console.log(`Error adding user: ${err}`);
          });

        this.newUser = '';
      }

  createRoom() {
    const { newRoom: { name, isPrivate }, currentUser } = this;

    if (name.trim() === '') {return;}

    currentUser.createRoom({
      name,
      private: isPrivate,
    }).then(room => {
      this.connectToRoom(room.id);
      this.newRoom = {
        name: '',
        isPrivate: false,
      };
    }).catch(err => {
      console.log(`Error creating room ${err}`);
    });
  }

  getJoinableRooms() {
    const { currentUser } = this;
    currentUser.getJoinableRooms()
    .then(rooms => {
      this.joinableRooms = rooms;
    }).catch(err => {
      console.log(`Error getting joinable rooms: ${err}`);
    });
  }

  joinRoom(id) {
    const { currentUser } = this;
    currentUser.joinRoom({ roomId: id })
    .catch(err => {
      console.log(`Error joining room ${id}: ${err}`);
    });
  }

      connectToRoom(id) {
        this.messages = [];
        const { currentUser } = this;

        currentUser.subscribeToRoom({
          roomId: `${id}`,
          messageLimit: 100,
          hooks: {
            onMessage: message => {
              this.messages.push(message);
            },
            onPresenceChanged: () => {
              this.roomUsers = this.currentRoom.users.sort((a) => {
                if (a.presence.state === 'online') {
                  return -1;
                }
                return 1;
              });
            },
          },
        })
        .then(currentRoom => {
          this.currentRoom = currentRoom;
          this.roomUsers = currentRoom.users;
          this.userRooms = currentUser.rooms;
        });
      }

      sendMessage() {
        const { newMessage, currentUser, currentRoom } = this;

        if (newMessage.trim() === '') {
          return;
        }
        currentUser.sendMessage({
          text: newMessage,
          roomId: `${currentRoom.id}`,
        });

        this.newMessage = '';
      }

  // local = 'localhost:3000';
  // local = 'ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000';
  local = '18.188.132.186:3000';

      addUser() {
        const { userId } = this;
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
              .connect({
                onAddedToRoom: room => {
                  this.userRooms.push(room);
                  this.getJoinableRooms();
                },
              })
              .then(currentUser => {
                this.currentUser = currentUser;
                this.connectToRoom('19418038');
                this.getJoinableRooms();
              });
          }).catch(error => console.error(error));
      }

  // title = 'app';

  // constructor(private chat: ChatService) { }

  ngOnInit() {
    // this.chat.messages.subscribe(msg => {
    //   console.log(msg);
    // });
  }

  // sendMessage() {
  //   this.chat.sendMsg("Test Message");
  // }
}
