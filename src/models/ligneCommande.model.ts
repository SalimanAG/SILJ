import { Article } from './article.model';
import { Commande } from './commande.model';

export class LigneCommande {

  public idLigneCommande:number;

  constructor(public qteLigneCommande:number, public puligneCommande:number, public remise:number,
    public tva:number, public numCommande:Commande, public article:Article){

  }

}
