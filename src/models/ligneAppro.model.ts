import { Approvisionnement } from './approvisionnement.model';
import { LigneDemandeAppro } from './ligneDemandeAppro.model';

export class LigneAppro {

  public idLigneAppro:number;

  constructor(public quantiteLigneAppro:number, public puligneAppro:number, public appro:Approvisionnement,
    public ligneDA:LigneDemandeAppro ){

  }


}
