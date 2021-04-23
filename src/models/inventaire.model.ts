import { Exercice } from './exercice.model';
import { Magasin } from './magasin.model';

export class Inventaire{

  constructor(public numInv:String, public dateInv:Date,
     public descrInv:String, public exercice:Exercice, 
     public magasin:Magasin){

  }

}
