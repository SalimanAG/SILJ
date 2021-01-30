import { Magasinier } from './magasinier.model';
import { TypCorres } from './typCorres.model';
import { Utilisateur } from './utilisateur.model';

export class Correspondant {

  constructor(public idCorrespondant:String, public imputableCorres:boolean, public magasinier:Magasinier,
    public typecorres:TypCorres, public utilisateur:Utilisateur){

  }

}
