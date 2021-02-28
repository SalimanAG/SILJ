import { Correspondant } from './Correspondant.model';
import { Exercice } from './exercice.model';
import { Regisseur } from './regisseur.model';

export class Placement {


  constructor(public numPlacement:String, public datePlacement:Date, public regisseur:Regisseur,
    public correspondant:Correspondant, public exercice:Exercice){

  }


}
