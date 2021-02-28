import { Exercice } from './exercice.model';
import { Regisseur } from './regisseur.model';

export class Reversement {

    constructor(public numReversement:String, public dateVersement:Date, public exercice:Exercice,
        public regisseur:Regisseur){
  
    }
  }