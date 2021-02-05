import { ModePaiement } from "./mode.model";
import { TypeRecette } from "./type.model";


export class OpCaisse{

  constructor(public numero:String, public datOp:Date, public contribuable:String, public caisse:String,
    public type:TypeRecette, public dateSaisi:Date, public mode:ModePaiement, public exo:String, public user:String,
    public obsop:String, public valide:boolean){
      //Les champs Caisse est de type Caisse
      //Les champs user est de type Utilisateur
      //Les champs exo est de type Exercice
  }

}
