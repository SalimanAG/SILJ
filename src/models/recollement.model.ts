import { Exercice } from './exercice.model';
import { Magasin } from './magasin.model';
import { Utilisateur } from './utilisateur.model';

export class Recollement{
  public valideRecol:boolean;

  constructor(public numRecollement:String, public descriptionRecollement:String, public dateRecollement:Date,
     public magasinsource:Magasin, public magasinDestination:Magasin, public exercice:Exercice, public utilisateur?: Utilisateur){

  }



}
