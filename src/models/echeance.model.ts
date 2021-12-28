import { Contrat } from "./contrat.model";
import { OpCaisse } from "./OpeCaisse.model";

export class Echeance{
  idEcheance:number;
  constructor(public moisEcheance:String, public annee:Number, public dateEcheance:Date, public payeEcheance:Boolean,
     public prix:Number, public contrat:Contrat, public opCaisse:OpCaisse, public superficie: number, public nbrPlace: number,
     public nbrFace: number, public datPaiement: Date, public datDebPeri: Date, public datFinPeri: Date,
     public typPaiement: String){

     }
}
