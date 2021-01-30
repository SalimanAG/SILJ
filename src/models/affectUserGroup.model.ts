import { GroupUser } from './groupUser.model';
import { Utilisateur } from './utilisateur.model';

export class AffectUserGroup{

  public idAffectUserGroup:number;

  constructor(public utilisateur:Utilisateur, public groupUser:GroupUser){

  }

}
