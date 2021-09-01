import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Incineration } from '../../models/incineration.model';
import { LigneIncineration } from '../../models/ligneIncineration.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class IncinerationService {

  
  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';
  constructor(private httpcli:HttpClient, private serviceIp:AssocierUtilisateurService) { }

  getAllIncineration(){
    return this.httpcli.get<Incineration[]>(this.host+'/stock/incine/list');
  }
  createIncineration(inc : Incineration){
    return this.httpcli.post<Incineration[]>(this.host+'/stock/incine/list', inc);
  }

  editIncineration(cod: String, inc : Incineration){
    return this.httpcli.put<Incineration>(this.host+'/stock/incine/byCod/'+cod, inc);
  }

  getAnIncineration(cod: String){
    return this.httpcli.get<Incineration>(this.host+'/stock/incine/byCod/'+cod);
  }

  deleteAnIncineration(cod : String){
    return this.httpcli.delete<Incineration>(this.host+'/stock/incine/list'+cod);
  }

  getAllLigneIncineration(){
    return this.httpcli.get<LigneIncineration[]>(this.host+'/stock/lInci/list');
  }
  createLigneIncineration(lin : LigneIncineration){
    return this.httpcli.post<LigneIncineration[]>(this.host+'/stock/lInci/list', lin);
  }

  editLigneIncineration(cod: String, lin : LigneIncineration){
    return this.httpcli.put<LigneIncineration>(this.host+'/stock/lInci/byCod/'+cod, lin);
  }

  getALigneIncineration(cod: String){
    return this.httpcli.get<LigneIncineration>(this.host+'/stock/lInci/byCod/'+cod);
  }

  deleteALigneIncineration(cod : String){
    return this.httpcli.delete<LigneIncineration>(this.host+'/stock/lInci/list'+cod);
  }
}
