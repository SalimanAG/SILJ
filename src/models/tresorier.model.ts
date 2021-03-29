import { Magasinier } from "./magasinier.model";
import { Utilisateur } from "./utilisateur.model";

export class TresCom{

  constructor(public idRp: String, public magasinier:Magasinier, public utilisateur: Utilisateur){

  }

}
