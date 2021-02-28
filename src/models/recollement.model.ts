import { Exercice } from './exercice.model';
import { Regisseur } from './regisseur.model';
import { Magasin } from './magasin.model';
import { Correspondant } from './Correspondant.model';

export class Recollement{

  public corres:Correspondant;

  constructor(public numRecollement:String, public descriptionRecollement:String, public dateRecollement:Date,
     public magasin:Magasin, public regisseur:Regisseur, public exercice:Exercice){

  }



}
