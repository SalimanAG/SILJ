import { Immeuble } from './immeuble.model';
import { Locataire } from './locataire.model';

export class Contrat{

  public dateFinContrat:Date = null;

  constructor(public numContrat:String, public dateSignatureContrat:Date, public dateEffetContrat:Date,
    public avanceContrat:number, public cautionContrat:number, public immeuble:Immeuble,
    public locataire:Locataire){

  }

}
