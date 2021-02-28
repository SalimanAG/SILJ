import { Article } from './article.model';
import { DemandeApprovisionnement } from './demandeApprovisionnement.model';

export class LigneDemandeAppro {

  public idLigneDA:number;

  constructor(public quantiteDemandee:number, public article:Article, public appro:DemandeApprovisionnement){

  }


}
