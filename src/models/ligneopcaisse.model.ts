import { Article } from "./article.model";
import { OpCaisse } from "./OpeCaisse.model";

export class LigneOpCaisse{
  constructor(public qteLigneOpCaisse: number,  public prixLigneOpCaisse:number, public commentaireLigneOpCaisse:String,
    public opc:OpCaisse, public article:Article){}
}
