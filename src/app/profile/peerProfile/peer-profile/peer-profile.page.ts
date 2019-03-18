import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { PopoverController } from '@ionic/angular';
import { WantListModal } from '../../../want_list_modal/want_list_modal.component';
import { AddListingModal } from '../../../add_listing_modal/add_listing_modal.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router'

@Component({
  selector: 'app-peer-profile',
  templateUrl: './peer-profile.page.html',
  styleUrls: ['./peer-profile.page.scss'],
})
export class PeerProfilePage implements OnInit {
  img: string;
  me: any;
  peer: any;
  user: any;
  school: string;
  offers: any[];
  wants: any[];
  listings: any[];

  constructor(private apiService: ApiService, public modal: ModalController, private router: Router,) {}

  getPeerBooks(id, callback) {
    this.apiService.getPeerProfile(id, callback);
  }

  async setBooks(data) {
    let temp = data.slice(0, data.length - 1)
    this.wants = temp;
    this.listings = data[data.length - 1];
  }

  makeOffer(myOffer: number, bookWanted: number) {
    console.log(this.peer);
    this.apiService.sendOffer({ 
      myId: this.me, 
      myOffer, 
      bookWanted: this.peer.listing.id_listing,
      bookWantedTitle: this.peer.title,
      peerId: this.peer.listing.id_user 
    });
  }

  setUser(data) {
    let user: any = JSON.parse(localStorage.getItem('selectedUser'));
    console.log(data);
    this.user = data || user.nickname;
  }
  ngOnInit() {
    this.me = JSON.parse(localStorage.userid);
    this.peer = JSON.parse(localStorage.getItem('selectedUser'));

    this.wants = [
      {
        title: 'Computer science 101: how to be toxic on stack overflow',
        ISBN: 8675309
      },
      {
        title: 'Computer science 102: Why backbone is the best',
        ISBN: 5551234
      },
      {
        title: 'ZOMG! Those coding bootcamps steal jobs',
        ISBN: 8000000
      }
    ];
    this.setUser = this.setUser.bind(this);
    this.setBooks = this.setBooks.bind(this);
    this.getPeerBooks(this.peer.listing.id_user, this.setBooks)
  }

}
