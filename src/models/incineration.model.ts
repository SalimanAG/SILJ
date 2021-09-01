import { Exercice } from "./exercice.model";

export class Incineration{
    constructor(public numIncine : String, public dateIncine : Date, public valideIncine : boolean, 
        public observationIncine : String, public exercice : Exercice) {
        }
}