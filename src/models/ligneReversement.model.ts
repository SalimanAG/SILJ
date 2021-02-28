 
import { Article } from './article.model';
import { Reversement } from './reversement.model';


export class LigneReversement {

  public idLigneReversement:number;

  constructor(public quantiteLigneReversement:number, public puligneReversement:number,
     public quittanceReversement:String, public dateQuittanceReversement:Date, public beneficiaire:String,
     public observation: String, public numReversement:Reversement, public article:Article){

  }

}

 