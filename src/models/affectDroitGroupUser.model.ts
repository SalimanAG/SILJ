import { DroitUser } from './droitUser.model';
import { GroupUser } from './groupUser.model';

export class AffectDroitGroupUser {

  public idAffectDroitGroup:number;

  constructor(public droitUser:DroitUser, public groupUser:GroupUser){

  }

}
