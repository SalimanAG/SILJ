import { Article } from './article.model';
import { Magasin } from './magasin.model';

export class Stocker {

  public idStocker:number;

  constructor(public quantiterStocker:number, public stockDeSecuriter:number, public stockMinimal:number,
    public cmup:number, public article: Article, public magasin:Magasin){

  }

}
