import { Article } from "./article.model";
import { OpCaisse } from "./OpeCaisse.model";

export class LigneOpCaisse{
  idLigneOperCaisse:number;
  public livre : boolean;
  constructor(public qteLigneOperCaisse : number, public prixLigneOperCaisse : number,
    public commentaireLigneOperCaisse : String,public opCaisse: OpCaisse,public article:Article
    ){}
}
