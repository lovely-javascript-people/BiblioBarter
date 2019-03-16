import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { PopoverController } from '@ionic/angular';
import { WantListModal } from '../want_list_modal/want_list_modal.component';
import { AddListingModal } from '../add_listing_modal/add_listing_modal.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit{
  img: any;
  user: any;
  school: any;
  offers: any = [
    {title1: 'My name jeff', title2: 'Your name jeff', offerer: 'Jim Pickens'},
    {title1: 'How to argue with "round earthers"', title2: "Trump's toupee: A feat of modern engineering", offerer: 'Jeff Sessions'}
  ];
  wants: any = [
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

  constructor(private apiService: ApiService, public modal: ModalController, private router: Router, private http: HttpClient,) {}

  setUser(data) {
    console.log(data);
    // add userid to local storage
    localStorage.setItem('userid', data[0].id_user);

    if (data[0].length) {
        this.user = data[0].user_name;
        if (data[1].length) {
        this.school = data[1][0].name_school;
        }
        this.img = data[0].link_image;
    } else {
      this.user = localStorage.username;
    }
  }

  async openWantListModal()
  {
    var data = { message : 'hello world' };
    const modalPage = await this.modal.create({
      component: WantListModal, 
      componentProps:{values: data}
    });
    return await modalPage.present();
  }
  
  async openAddListingModal()
  {
    var data = { message : 'hello world' };
    const modalPage = await this.modal.create({
      component: AddListingModal, 
      componentProps:{values: data}
    });
    return await modalPage.present();
  }

  renderWantList() {
    console.log(localStorage.userid, 'USERID');
  this.http.get(`http://localhost:3000/user/want?${localStorage.userid}`)
    .subscribe((wantListArray) => {
      console.log(wantListArray, 'ARRAY OF WANT LIST');
    })
  }

  ngOnInit() {
    this.renderWantList();
    this.setUser = this.setUser.bind(this);
    this.apiService.getProfile(localStorage.getItem('username'), this.setUser);
  }

}