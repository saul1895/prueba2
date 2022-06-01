import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { GoalsService } from '../services/goals.service';

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.page.html',
  styleUrls: ['./modal-add.page.scss'],
})
export class ModalAddPage implements OnInit {

  goalForm: FormGroup;
  ruleForm: FormGroup;

  showRulesForm = false;
  rules: Array<any> = new Array<any>();

  date = new Date();
  dateFormat: any;

  constructor(private modalController: ModalController, private fb: FormBuilder, private goalsService: GoalsService,
    private toastController: ToastController) {
    this.createFormGoals();
    this.createFormRules();
    this.initialDate();
  }

  ngOnInit() {
    this.goalsService.getMatches().subscribe(
      (resp: any) => {
        console.log('RESP: ', resp);
      },
      error => {
        console.log('ERROR: ', error);
      }
    );
  }

  createFormGoals() {
    this.goalForm = this.fb.group({
      type: ['', [Validators.required]],
      date: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      rules: []
   });
  }

  createFormRules() {
    this.ruleForm = this.fb.group({
      team: ['', [Validators.required]],
      event: ['', [Validators.required]],
      amount: ['', [Validators.required]]
   });
  }

  save() {
    this.goalForm.controls['rules'].setValue(this.ruleForm.value);
    this.goalsService.add(this.goalForm.value);
    this.closeModel();
  }

  async closeModel() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

  activeRulesForm() {
    this.showRulesForm = true;
  }

  cancelRulesForm() {
    this.showRulesForm = false;
  }

  addRules() {
    const posTeam = this.rules.indexOf(this.rules.find(data => data.team === this.ruleForm.controls['team'].value));
    if (posTeam >= 0) {
      this.toastMessage('Selecciona un equipo distinto');
    }
    else {
      const posEvent = this.rules.indexOf(this.rules.find(data => data.event === this.ruleForm.controls['event'].value));
      if (posEvent >= 0) {
        this.toastMessage('Selecciona un evento distinto');
      }
      else {
        this.rules.push(this.ruleForm.value);
        this.ruleForm.reset();
        this.showRulesForm = false;
      }
    }
  }

  async toastMessage(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  initialDate() {
    const formatDate = (date) => {
      let d = new Date(date);
      let month = (d.getMonth() + 1).toString().padStart(2, '0');
      let day = d.getDate().toString().padStart(2, '0');
      let year = d.getFullYear();
      return [year, month, day].join('-');
    }

    this.date.setDate(this.date.getDate() + 30);
    this.dateFormat = formatDate(this.date);
    this.goalForm.controls['date'].setValue(this.dateFormat);
  }

}
