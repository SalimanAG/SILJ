import { Service } from './service.model';
import { Fonction } from './fonction.model'


export class Utilisateur
{

  public idUtilisateur:Number;

  constructor(public login:String, public motDePass:String, public nomUtilisateur:String,
    public prenomUtilisateur:String, public fonctionUtilisateur:Fonction,
    public activeUtilisateur:Boolean, public service:Service, public askMdp1erLance?:boolean ){

  }

}
