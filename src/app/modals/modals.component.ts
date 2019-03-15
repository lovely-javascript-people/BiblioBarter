import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
})

export class SettingsModal implements OnInit {

  constructor(public modal: ModalController) { }

  async closeModal() {
    this.modal.dismiss();
  }

  ngOnInit() {}

}
