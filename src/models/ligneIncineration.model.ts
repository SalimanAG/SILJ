import { Article } from "./article.model";
import { Incineration } from "./incineration.model";

export class LigneIncineration{
    constructor(public quantiteLigneIncine :number, public pULigneIncine : number, public obsLigneIncine: String,
        public incineration: Incineration, public article : Article){}
}