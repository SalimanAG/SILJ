import { Magasinier } from "./magasinier.model";
import { Magasin } from "./magasin.model";

export class Gerer {

    public idGerer:number;

    constructor (public dateDebGerer:Date, public dateFinGerer:Date, public magasinier: Magasinier,
      public magasin:Magasin){

    }

}
