import { Caisse } from './caisse.model';
import { Utilisateur } from './utilisateur.model';

export class Affecter {

  public idAffecter:number;

  constructor(public dateDebAffecter:Date, public dateFinAffecter:Date, public caisse:Caisse,
    public utilisateur:Utilisateur){

  }

}
