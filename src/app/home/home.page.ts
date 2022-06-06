import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ModalAddPage } from '../modal-add/modal-add.page';
import { Goal } from '../models/goal.model';
import { GoalsService } from '../services/goals.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  goalsList: Array<any> = new Array<any>();

  constructor(private modalController: ModalController, private goalsService: GoalsService,
    private actionSheetController: ActionSheetController) {}

  ngOnInit() {
    this.getGoals();
  }

  async openModal(newGoal: string, goal?: Goal, pos?: number) {
    const modal = await this.modalController.create({
      component: ModalAddPage,
      componentProps: {
        'newGoal': newGoal,
        'goalData': goal,
        'pos': pos
      }
    });
    modal.onDidDismiss().then((modelData) => {
    });
    return await modal.present();
  }

  getGoals() {
    this.goalsList = this.goalsService.get();
  }

  async presentActionSheet(goal: Goal, pos: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Ver',
        icon: 'eye-outline',
        handler: () => {
          this.openModal('V', goal);
        }
      },{
        text: 'Editar',
        icon: 'create-outline',
        handler: () => {
          this.openModal('E', goal, pos);
        }
      },{
        text: 'Eliminar',
        icon: 'trash-outline',
        handler: () => {
          this.goalsList.splice(pos, 1);
        }
      },{
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

}
