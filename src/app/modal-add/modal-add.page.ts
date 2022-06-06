import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { Goal } from '../models/goal.model';
import { Rule } from '../models/rule.model';
import { Simulation } from '../models/simulation.model';
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
  rules: Array<Rule> = new Array<Rule>();
  ruleEdit: number;
  ruleEditActive: boolean = false;
  btnAddRule = 'AGREGAR';

  date = new Date();
  dateFormat: any;
  title: string = 'Nueva meta';

  matches: Array<any> = new Array<any>();
  arrayTeams: Array<any> = new Array<any>();

  dataGol = new Simulation();
  dataJugar = new Simulation();
  dataGanar = new Simulation();

  @Input() newGoal: string;
  @Input() goalData?: Goal;
  @Input() pos?: number;

  constructor(private modalController: ModalController, private fb: FormBuilder, private goalsService: GoalsService,
    private toastController: ToastController, private actionSheetController: ActionSheetController) {
    this.createFormGoals();
    this.createFormRules();
    this.initialDate();
  }

  ngOnInit() {
    if (this.newGoal != 'N') {
      this.title = 'Meta';

      this.goalForm.controls['type'].setValue(this.goalData.type);
      this.goalForm.controls['date'].setValue(this.goalData.date);
      this.goalForm.controls['amount'].setValue(this.goalData.amount);
      this.goalForm.controls['rules'].setValue(this.goalData.rules);
      this.rules = this.goalForm.controls['rules'].value;
    }
    this.goalsService.getMatches().subscribe(
      (resp: any) => {
        this.matches = resp.matches;
        resp.matches.forEach(element => {
          this.arrayTeams.push(element.awayTeam.name);
        });

        this.arrayTeams = this.arrayTeams.filter((item, index) => {
          return this.arrayTeams.indexOf(item) === index;
        });

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
    if (this.newGoal == 'N') {
      this.goalForm.controls['rules'].setValue(this.rules);
      this.goalsService.add(this.goalForm.value);
    } else {
      this.goalsService.edit(this.goalForm.value, this.pos);
    }
    this.closeModel();
  }

  async closeModel() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

  activeRulesForm() {
    this.btnAddRule = 'AGREGAR';
    this.showRulesForm = true;
  }

  cancelRulesForm() {
    this.ruleForm.reset();
    this.showRulesForm = false;
    this.ruleEditActive = false;
  }

  addRules() {
    if (this.ruleEditActive) {
      this.rules.splice(this.ruleEdit, 1);
    }

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
        if (!this.ruleEditActive) {
          this.rules.push(this.ruleForm.value);
        } else {
          this.rules.splice(this.ruleEdit, 0, this.ruleForm.value);
          this.ruleEditActive = false;
        }
        this.goalForm.controls['rules'].setValue(this.rules);
        this.ruleForm.reset();
        this.showRulesForm = false;
      }
    }
  }

  async presentActionSheet(rule: any, pos: number) {
    if (this.newGoal != 'V') {
      const actionSheet = await this.actionSheetController.create({
        header: 'Acciones',
        cssClass: 'my-custom-class',
        buttons: [{
          text: 'Editar',
          icon: 'create-outline',
          handler: () => {
            this.showRulesForm = true;

            this.ruleForm.controls['team'].setValue(rule.team);
            this.ruleForm.controls['event'].setValue(rule.event);
            this.ruleForm.controls['amount'].setValue(rule.amount);

            this.ruleEdit = pos;
            this.btnAddRule = 'GUARDAR';
            this.ruleEditActive = true;
          }
        }, {
          text: 'Eliminar',
          icon: 'trash-outline',
          handler: () => {
            this.rules.splice(pos, 1);
            this.goalForm.controls['rules'].setValue(this.rules);
          }
        }, {
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

  simulate() {
    this.rules.forEach(element => {

      //Por jugar
      if (element.event == 'Jugar') {
        let saved: number = 0;
        let arrayTem: Array<any> = new Array<any>();

        this.matches.forEach(team => {
          if (team.awayTeam.name == element.team) {
            saved = saved + parseInt(element.amount);
            arrayTem.push(
              {
                saved: element.amount,
                opponent: team.homeTeam.name,
                date: team.utcDate
              }
            );
          }
          else if (team.homeTeam.name == element.team) {
            saved = saved + parseInt(element.amount);
            arrayTem.push(
              {
                saved: element.amount,
                opponent: team.awayTeam.name,
                date: team.utcDate
              }
            );
          }
        });
        this.dataJugar = {
          team: element.team + ' por ' + element.event,
          totalSaved: saved,
          data: arrayTem
        };
      }
      //Por ganar
      else if (element.event == 'Ganar') {
        let saved: number = 0;
        let arrayTem: Array<any> = new Array<any>();

        this.matches.forEach(team => {
          if (team.awayTeam.name == element.team) {
            if (team.score.winner == 'AWAY_TEAM') {
              saved = saved + parseInt(element.amount);
              arrayTem.push(
                {
                  saved: element.amount,
                  opponent: team.homeTeam.name,
                  date: team.utcDate
                }
              );
            }
          }
          else if (team.homeTeam.name == element.team) {
            if (team.score.winner == 'HOME_TEAM') {
              saved = saved + parseInt(element.amount);
              arrayTem.push(
                {
                  saved: element.amount,
                  opponent: team.awayTeam.name,
                  date: team.utcDate
                }
              );
            }
          }
        });
        this.dataGanar = {
          team: element.team + ' por ' + element.event,
          totalSaved: saved,
          data: arrayTem
        };
      }
      // Por gol
      else if (element.event == 'Gol') {
        let saved: number = 0;
        let arrayTem: Array<any> = new Array<any>();

        this.matches.forEach(team => {
          let golesJuego = 0;
          if (team.awayTeam.name == element.team) {
            golesJuego += team.score.fullTime.away;
            golesJuego += team.score.halfTime.away;
            if (golesJuego > 0) {
              saved += element.amount * golesJuego;
              arrayTem.push(
                {
                  saved: element.amount * golesJuego,
                  goles: golesJuego,
                  opponent: team.homeTeam.name,
                  date: team.utcDate
                }
              );
            }
          }
          else if (team.homeTeam.name == element.team) {
            golesJuego += team.score.fullTime.home;
            golesJuego += team.score.halfTime.home;
            if (golesJuego > 0) {
              saved += element.amount * golesJuego;
              arrayTem.push(
                {
                  saved: element.amount * golesJuego,
                  goles: golesJuego,
                  opponent: team.awayTeam.name,
                  date: team.utcDate
                }
              );
            }
          }
        });
        this.dataGol = {
          team: element.team + ' por ' + element.event,
          totalSaved: saved,
          data: arrayTem
        };
      }
    });
  }

}
