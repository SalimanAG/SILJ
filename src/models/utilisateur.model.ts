import { Service } from './service.model';

export class Utilisateur
{

  public idUtilisateur:Number;

  constructor(public login:String, public motDePass:String, public nomUtilisateur:String,
    public prenomUtilisateur:String, public fonctionUtilisateur:String,
    public activeUtilisateur:Boolean, public service:Service){

  }

}
