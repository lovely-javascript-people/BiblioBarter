import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import {NavController, ToastController} from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-modals',
  templateUrl: './contact_modal.component.html',
  styleUrls: ['./contact_modal.component.scss'],
})

export class ContactModal implements OnInit {

  // emailAddress: string = '';
  // emailBody: string = '';

  available: boolean = true;

  email: object = {
    to: 'example@gmail.com',
    subject: 'Cordova Icons',
    body: 'How are you? Nice greetings from Leipzig',
    isHtml: true       };

  constructor(
    public modal: ModalController,
    private emailComposer: EmailComposer,
    // private _FORM: FormBuilder,
    // public form: FormGroup,
    // public navCtrl: NavController,
    ) { 

    //   this.form = this._FORM.group({
    //     "to"            : ["", Validators.required],
    //     "cc"            : ["", Validators.required],
    //     "bcc"           : ["", Validators.required],
    //     "subject"       : ["", Validators.required],
    //     "message"       : ["", Validators.required]
    // });

    }

    
    send(){
      this.emailComposer.isAvailable().then((available) =>{
      if(available) {
        //Now we know we can send    
        console.log('sending email');  
      }
      });
    }



/////////////////////
  // submitEmail() {
  //   console.log(this.emailAddress);
  //   console.log(this.emailBody);
  //   this.closeModal();
  // }

  async closeModal() {
    this.modal.dismiss();
  }

  ngOnInit() {
  }

}