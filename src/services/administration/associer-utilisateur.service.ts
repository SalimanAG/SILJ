import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Affecter } from '../../models/affecter.model';
import { AffectUserGroup } from '../../models/affectUserGroup.model';

@Injectable({
  providedIn: 'root'
})
export class AssocierUtilisateurService {

  private host:String = 'http://127.0.0.1:8080/perfora-gpc/v1';

  constructor(private httpCli:HttpClient) {

  }

  //Partie réservée pour l'association d'un utilisateur à un arrondissement
  


  //Partie réservée pour l'association d'un utilisateur à une Caisse (Affecter)
  getAllAffecter(){
    return this.httpCli.get<Affecter[]>(this.host+'/facturation/affecter/list');
  }

  getAAffecterById(code:String){
    return this.httpCli.get<Affecter>(this.host+'/facturation/affecter/byCodAff/'+code);
  }

  addAAffecter(corps:Affecter){
    return this.httpCli.post<Affecter>(this.host+'/facturation/affecter/list', corps);
  }

  editAAffecter(code:String, corps:Affecter){
    return this.httpCli.put<Affecter>(this.host+'/facturation/affecter/byCodAff/'+code, corps);
  }

  deleteAAffecter(code:String){
    return this.httpCli.delete<boolean>(this.host+'/facturation/affecter/byCodAff/'+code);
  }

  //Patie réservée pour l'association d'un utilisateur à un group d'utilisateur (AffectUserGroup)
  getAllAffectUserGroup(){
    return this.httpCli.get<AffectUserGroup[]>(this.host+'/commune/ug/list');
  }

  getAAffectUserGroup(code:String){
    return this.httpCli.get<AffectUserGroup>(this.host+'/commune/aug/byId/'+code);
  }

  addAAffectUserGroup(corps:AffectUserGroup){
    return this.httpCli.post<AffectUserGroup>(this.host+'/commune/ug/list', corps);
  }

  editAAffectUserGroup(code:String, corps:AffectUserGroup){
    return this.httpCli.put<AffectUserGroup>(this.host+'/commune/aug/byId/'+code, corps);
  }

  deleteAAffectUserGroup(code:String){
    return this.httpCli.delete<boolean>(this.host+'/commune/aug/byId/'+code);
  }

}
