import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {

  goalsList: Array<Goal> = new Array<Goal>();

  constructor(private http: HttpClient) { }

  get() {
    return this.goalsList;
  }

  add(goal: Goal) {
    this.goalsList.push(goal);
  }

  edit(goal: Goal, pos: number) {
    this.goalsList.splice(pos, 1, goal);
  }
  
  getMatches() {
    return this.http.get('./assets/data/data.json');
    /*const httpHeader = {
      headers: new HttpHeaders({'X-Auth-Token': '38a35048f8b84ea686bb11c96520dc8b'})
    };
    return this.http.get('https://api.football-data.org/v4/competitions/CL/matches', httpHeader);*/
  }
}
