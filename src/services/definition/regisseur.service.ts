import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Regisseur } from '../../models/regisseur.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class RegisseurService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpClient:HttpClient, private serviceIp:AssocierUtilisateurService) { }

  getAllRegisseur(){
    return this.httpClient.get<Regisseur[]>(this.host+'/stock/regisseur/list');

  }

  getRegisseurById(code:String){
    return this.httpClient.get<Regisseur[]>(this.host+'/stock/regisseur/byCodReg/'+code);

  }

  addRegisseur(corps:Regisseur){
    return this.httpClient.post<Regisseur>(this.host+'/stock/regisseur/list', corps);
  }

  editRegisseur(code:String, corps:Regisseur){
    return this.httpClient.put<Regisseur>(this.host+'/stock/regisseur/byCodReg/'+code, corps);
  }

  deleteRegisseur(code:String){
    return this.httpClient.delete<Boolean>(this.host+'/stock/regisseur/byCodReg/'+code);
  }

}
