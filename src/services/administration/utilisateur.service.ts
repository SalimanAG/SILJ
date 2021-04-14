import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from '../../models/service.model';
import { Utilisateur } from '../../models/utilisateur.model';
import { AssocierUtilisateurService } from './associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  public connectedUser:Utilisateur = new Utilisateur('', '', '', '','', false, new Service('', ''));

  public isAuth:boolean = false;

  constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) { }

  getAllUsers(){
    return this.httpCli.get<Utilisateur[]>(this.host+'/commune/user/list');
  }

  getAUserById(code:String){
    return this.httpCli.get<Utilisateur>(this.host+'/commune/user/byCodUser/'+code);
  }

  addAUser(corps:Utilisateur){
    return this.httpCli.post<Utilisateur>(this.host+'/commune/user/list',corps);
  }

  editAUser(code:String, corps:Utilisateur){
    return this.httpCli.put<Utilisateur>(this.host+'/commune/user/byCodUser/'+code, corps);
  }

  deleteAUser(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/commune/user/byCodUser/'+code);
  }

}
