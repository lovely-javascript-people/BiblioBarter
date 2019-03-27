import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {

  // Our socket connection
  // private socket;

  constructor() { }
  // connect(): Rx.Subject<MessageEvent> {
  //   // Can use an environmental variable here
  //   this.socket = io(`http://localhost:3000`);

  //   // We define our observable which will observe any incoming messages
  //   // from our socket.io server.
  //   const observable = new Observable(observer => {
  //     this.socket.on('message', (data) => {
  //       console.log('Received message from Websocket Server');
  //       observer.next(data);
  //     });
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   });

  //   // We define our Observer which will listen to messages
  //   // from our other components and send messages back to our
  //   // socket server whenever the `next()` method is called.
  //   const observer = {
  //     next: (data: Object) => {
  //       this.socket.emit('message', JSON.stringify(data));
  //     },
  //   };

  //   // we return our Rx.Subject which is a combination
  //   // of both an observer and observable.
  //   return Rx.Subject.create(observer, observable);
  // }

}
