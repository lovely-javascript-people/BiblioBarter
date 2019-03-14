import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router'
import { ModalsComponent } from '../modals/modals.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, public modal: ModalController) { }
  
  onClick(): void {
    console.log('log me out!');
    this.authService.logout();
    this.router.navigate(['/Greet']);
  }
  async openModal()
  {

    var data = { message : 'hello world' };

    const modalPage = await this.modal.create({
      component: ModalsComponent, 
      componentProps:{values: data}
    });

    return await modalPage.present();
  }
  ngOnInit() {}

}
