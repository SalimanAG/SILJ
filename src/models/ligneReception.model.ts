import { LigneCommande } from './ligneCommande.model';
import { Reception } from './reception.model';

export class LigneReception {

  public idLigneReception:number;

  constructor(public quantiteLigneReception:number, public puligneReception:number,
    public observationLigneReception:String, public numSerieDebLigneReception:number,
    public numSerieFinLigneReception:number, public ligneCommande:LigneCommande, public reception:Reception){

  }


}
