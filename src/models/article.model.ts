import { Exercice } from './exercice.model';
import { Famille } from './famille.model';
import { Uniter } from './uniter.model';

export class Article {






  constructor(public codeArticle:String, public libArticle:String, public stockerArticle:boolean,
  public numSerieArticle:boolean, public livrableArticle:boolean, public consommableArticle:boolean ,
  public prixVenteArticle:number, public couleurArticle:String, public famille:Famille, public unite:Uniter,
  public qteStIniTres?:number, public puStIniTres?:number, public datStInitArtTres?:Date, public exo?:Exercice ){

  }

}
