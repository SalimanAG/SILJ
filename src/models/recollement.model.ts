import { Exercice } from './exercice.model';
import { Magasin } from './magasin.model';

export class Recollement{
  public valideRecol:boolean;

  constructor(public numRecollement:String, public descriptionRecollement:String, public dateRecollement:Date,
     public magasinSource:Magasin, public magasinDestination:Magasin, public exercice:Exercice){

  }



}
