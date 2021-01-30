import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Regisseur } from '../../models/regisseur.model';

@Injectable({
  providedIn: 'root'
})
export class RegisseurService {

  private host:String = 'http://localhost:8080/perfora-gpc/v1';

  constructor(private httpClient:HttpClient) { }

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
