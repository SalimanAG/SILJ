 
import { Article } from './article.model';
import { Recollement } from './/recollement.model';


export class LigneRecollement {

  public idLigneRecollement:number;

  constructor(public quantiteLigneRecollement:number, public puligneRecollement:number,
     public observationLigneRecollement:String,  public recollement:Recollement, public article:Article){

  }

}

 