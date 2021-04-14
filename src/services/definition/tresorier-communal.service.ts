import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TresCom } from '../../models/tresorier.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class TresorierCommunalService {
  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpClient:HttpClient, private serviceIp:AssocierUtilisateurService) { }

  getAllTresCom(){
    return this.httpClient.get<TresCom[]>(this.host+'/stock/rp/list');

  }

  addATresCom(corps:TresCom){
    return this.httpClient.post<TresCom>(this.host+'/stock/rp/list', corps);
  }

  editTresCom(code:String, corps:TresCom){
    return this.httpClient.put<TresCom>(this.host+'/stock/rp/byCodRp/'+code, corps);
  }

  deleteTresCom(code:String){
    return this.httpClient.delete<Boolean>(this.host+'/stock/rp/byCodRp/'+code);
  }

}
