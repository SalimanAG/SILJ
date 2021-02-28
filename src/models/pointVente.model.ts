import { Exercice } from './exercice.model';
import { Regisseur } from './regisseur.model';
import { Correspondant } from './Correspondant.model';
import { OpCaisse } from './OpeCaisse.model';

export class PointVente{

  public opCaisse:OpCaisse;

  constructor(public numPointVente:String, public datePointVente:Date,
     public payerPoint:boolean, public exercice:Exercice, 
     public correspondant:Correspondant, public regisseur:Regisseur){

  }



}
