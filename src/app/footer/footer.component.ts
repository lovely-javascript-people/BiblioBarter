import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router'
import { SettingsModal } from '../modals/modals.component';
import { SearchModal } from '../search_modal/search_modal.component';
import { ContactModal } from '../contact_modal/contact_modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, public modal: ModalController) { }
  
  logoutButton(): void {
    console.log('log me out!');
    this.authService.logout();
    this.router.navigate(['/Greet']);
  }

  // onSearch(): void {
  //   console.log('Search clicked');
  // }

  logoClick(): void {
    console.log('logo clicked');
  }

  async openSettingsModal()
  {
    console.log('hi')

    const modalPage = await this.modal.create({
      component: SettingsModal
    });
    return await modalPage.present();
  }

  async openSearchModal()
  {
    var data = { message : 'hello world' };
    const modalPage = await this.modal.create({
      component: SearchModal, 
      componentProps:{values: data}
    });
    return modalPage.present();
  }

  async openContactModal()
  {
    var data = { message : 'hello world' };
    const modalPage = await this.modal.create({
      component: ContactModal,
    });
    return modalPage.present();
  }

  async closeModal() {
    this.modal.dismiss();
  }

  redirectOnClick() {
    this.router.navigate(['/Matches']);
  }

  redirectToProfile() {
    this.router.navigate(['/Profile']);
  }
  
  redirectToChat() {
    this.router.navigate(['/Chat']);
  }

  ngOnInit() {}


}
