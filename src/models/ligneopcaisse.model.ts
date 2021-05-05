import { Article } from "./article.model";
import { Magasin } from "./magasin.model";
import { OpCaisse } from "./OpeCaisse.model";

export class LigneOpCaisse{
  public idLigneOperCaisse:number;
  public magasin: Magasin;
  public livre : boolean;
  constructor(public qteLigneOperCaisse : number, public prixLigneOperCaisse : number,
    public commentaireLigneOperCaisse : String,public opCaisse: OpCaisse,public article:Article
    ){}
}
