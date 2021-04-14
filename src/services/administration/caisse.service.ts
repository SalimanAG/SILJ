import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Caisse } from '../../models/caisse.model';
import { AssocierUtilisateurService } from './associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class CaisseService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

  }

  getAllCaisse(){
    return this.httpCli.get<Caisse[]>(this.host+'/facturation/caisse/list');
  }

  getACaissById(code:String){
    return this.httpCli.get<Caisse>(this.host+'/facturation/caisse/byCodCai/'+code);
  }

  addACaisse(corps:Caisse){
    return this.httpCli.post<Caisse>(this.host+'/facturation/caisse/list', corps);
  }

  editACaisse(code:String, corps:Caisse){
    return this.httpCli.put<Caisse>(this.host+'/facturation/caisse/byCodCai/'+code, corps);
  }

  deleteACaisse(code:String){
    return this.httpCli.delete<boolean>(this.host+'/facturation/caisse/byCodCai/'+code);
  }

}
