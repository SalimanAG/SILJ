import { Article } from './article.model';
import { PointVente } from './pointVente.model';


export class LignePointVente {

  public idLignePointVente:number;

  constructor(public quantiteLignePointVente:number, public pulignePointVente:number,
     public numDebLignePointVente:number, public numFinLignePointVente:number, 
     public pointVente:PointVente, public article:Article){

  }

}
