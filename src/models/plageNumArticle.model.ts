import { LigneAppro } from './ligneAppro.model';
import { LignePlacement } from './lignePlacement.model';

export class PlageNumArticle {

  public idPlage:number;

  constructor(public numDebPlage:number, public numFinPlage:number, public ligneRecollement?:String,
    public lignePlacement?:LignePlacement, public ligneAppro?:LigneAppro){

  }


}
