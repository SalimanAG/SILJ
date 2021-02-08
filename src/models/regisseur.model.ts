import { Utilisateur } from './utilisateur.model';
import { Magasinier } from './magasinier.model';

export class Regisseur {

    constructor(public idRegisseur:String,
     public magasinier:Magasinier, public utilisateur:Utilisateur){
  
    }
  }