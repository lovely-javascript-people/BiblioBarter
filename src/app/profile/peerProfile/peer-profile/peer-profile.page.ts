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
  img: any;
  user: any;
  school: any;
  offers: any = [
    {title1: 'My name jeff', title2: 'Your name jeff', offerer: 'Jim Pickens'},
    {title1: 'How to argue with "round earthers"', title2: "Trump's toupee: A feat of modern engineering", offerer: 'Jeff Sessions'}
  ];
  wants: any[];
  listings: any = [
    {
      title: "How to eat your van's insulation and other life hacks",
      condition: 'poor',
      value: '$0.01'
    },
    {
      title: "How to not give off that 'creepy guy' vibe",
      condition: 'Fair',
      value: 'Priceless'
    }
  ];

  constructor(private apiService: ApiService, public modal: ModalController, private router: Router,) {}

  setUser(data) {
    let user: any = JSON.parse(localStorage.getItem('selectedUser'));
    console.log(user);
    this.user = user.nickname;
    this
  }
  ngOnInit() {
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
    this.apiService.getProfile(localStorage.getItem('username'), this.setUser);
  }

}
