import { Rule } from "./rule.model";

export class Simulation {
    team: string;
    totalSaved: number;
    data: Array<Rule> = new Array<Rule>();
}