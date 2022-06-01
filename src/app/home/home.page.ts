import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalAddPage } from '../modal-add/modal-add.page';
import { GoalsService } from '../services/goals.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  goalsList = [];

  constructor(private modalController: ModalController, private goalsService: GoalsService) {}

  ngOnInit() {
    this.getGoals();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalAddPage
    });
    modal.onDidDismiss().then((modelData) => {
    });
    return await modal.present();
  }

  getGoals() {
    this.goalsList = this.goalsService.get();
  }

}
