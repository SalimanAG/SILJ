import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TresCom } from '../../models/tresorier.model';

@Injectable({
  providedIn: 'root'
})
export class TresorierCommunalService {
  private host:String = 'http://localhost:8080/perfora-gpc/v1';

  constructor(private httpClient:HttpClient) { }

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
