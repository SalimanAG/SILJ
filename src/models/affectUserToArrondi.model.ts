import { Arrondissement } from './arrondissement.model';
import { Utilisateur } from './utilisateur.model';

export class AffectUserToArrondi{

  public idAffectUserToArrondi:number;

  constructor(public utilisateur:Utilisateur, public arrondissement:Arrondissement,
    public dateDebutAffectToArrondi:Date, public dateFinAffectToArrondi:Date){

  }

}
