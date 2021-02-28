import { LigneAppro } from './ligneAppro.model';
import { LignePlacement } from './lignePlacement.model';

export class PlageNumArticle {

  public idPlage:number;

  constructor(public numDebPlage:String, public numFinPlage:String, public ligneRecollement?:String,
    public lignePlacement?:LignePlacement, public ligneAppro?:LigneAppro){

  }


}
