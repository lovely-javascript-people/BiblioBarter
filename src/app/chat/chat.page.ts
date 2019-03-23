import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  title = 'app';

  constructor(private chat: ChatService) { }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      console.log(msg);
    });
  }

  /* 
   * sendMessage removed from button on chat.page.html
   * <button (click)="sendMessage()"></button>
   * currently depracated
   */
  sendMessage(msg) {
    this.chat.sendMsg("Test Message");
  }
  
}
