import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AffectDroitGroupUser } from '../../models/affectDroitGroupUser.model';
import { DroitUser } from '../../models/droitUser.model';
import { GroupUser } from '../../models/groupUser.model';

@Injectable({
  providedIn: 'root'
})
export class DroitGroupeService {

  private host:String = 'http://127.0.0.1:8080/perfora-gpc/v1';

  constructor(private httpCli:HttpClient) {

  }

  //Partie réservée pour Group d'utilisateur (GroupUser)
  getAllGroupUser(){
    return this.httpCli.get<GroupUser[]>(this.host+'/commune/gro/list');
  }

  getAGroupUserById(code:String){
    return this.httpCli.get<GroupUser>(this.host+'/commune/gro/byId/'+code);
  }

  addAGroupUser(corps:GroupUser){
    return this.httpCli.post<GroupUser>(this.host+'/commune/gro/list', corps);
  }

  editAGroupUser(code:String, corps:GroupUser){
    return this.httpCli.put<GroupUser>(this.host+'/commune/gro/byId/'+code, corps);
  }

  deleteAGroupUser(code:String){
    return this.httpCli.delete<boolean>(this.host+'/commune/gro/byId/'+code);
  }

  //Partie Réservée pour l'affectation de droit à un group d'utilsateur (AffectDroitGroupUser)
  getAllAffectDroitGroup(){
    return this.httpCli.get<AffectDroitGroupUser[]>(this.host+'/commune/adgu/list');
  }

  getAAffectDroitGroupUserById(code:String){
    return this.httpCli.get<AffectDroitGroupUser>(this.host+'/commune/adgu/byId/'+code);
  }

  addAAffectDroitGroupUser(corps:AffectDroitGroupUser){
    return this.httpCli.post<AffectDroitGroupUser>(this.host+'/commune/adgu/list', corps);
  }

  editAAffectDroitGroupUser(code:String, corps:AffectDroitGroupUser){
    return this.httpCli.put<AffectDroitGroupUser>(this.host+'/commune/adgu/byId/'+code, corps);
  }

  deleteAAffectDroitGroupUser(code:String){
    return this.httpCli.delete<boolean>(this.host+'/commune/adgu/byId/'+code);
  }


  //Partie Réservée pour les droits d'utilisateur (DroitUser)
  getAllDroitUser(){
    return this.httpCli.get<DroitUser[]>(this.host+'/commune/du/list');
  }

  getADroitUserById(code:String){
    return this.httpCli.get<DroitUser>(this.host+'/commune/du/byId/'+code);
  }

}
