import { Caisse } from "./caisse.model";
import { Exercice } from "./exercice.model";
import { ModePaiement } from "./mode.model";
import { TypeRecette } from "./type.model";
import { Utilisateur } from "./utilisateur.model";


export class OpCaisse{

constructor(public numOpCaisse:String,public dateOpCaisse: Date,public contribuable: String,public valideOpCaisse: boolean,
   public obsOpCaisse: String, public dateSaisie: Date,public caisse: Caisse,public typeRecette: TypeRecette,
   public modePaiement: ModePaiement, public exercice: Exercice,public utilisateur: Utilisateur){
      //Les champs Caisse est de type Caisse
      //Les champs user est de type Utilisateur
      //Les champs exo est de type Exercice
  }

}