import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValeurLocative } from '../../models/valeurLocative.model';
@Injectable({
  providedIn: 'root'
})
export class ValeurLocativeService {

  private host:String = 'http://localhost:8080/perfora-gpc/v1';

  constructor(private httpClient:HttpClient) { }

  getAllValeurLocative(){
    return this.httpClient.get<ValeurLocative[]>(this.host+'/location/immeuble/list');

  }

  getValeurLocativeById(code:String){
    return this.httpClient.get<ValeurLocative[]>(this.host+'/location/immeuble/byCodImm/'+code);

  }

  addValeurLocative(corps:ValeurLocative){
    return this.httpClient.post<ValeurLocative>(this.host+'/location/immeuble/list', corps);
  }

  editValeurLocative(code:String, corps:ValeurLocative){
    return this.httpClient.put<ValeurLocative>(this.host+'/location/immeuble/byCodImm/'+code, corps);
  }

  deleteValeurLocative(code:String){
    return this.httpClient.delete<Boolean>(this.host+'/location/immeuble/byCodImm/'+code);
  }

}
