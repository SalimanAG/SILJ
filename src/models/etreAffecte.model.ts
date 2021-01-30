import { Correspondant } from './Correspondant.model';

export class EtreAffecte {

  public idAffecte:number;

  constructor(public dateArrivee:Date, public dateDepart:Date, public corres:Correspondant,
    public site:String){

  }

}
