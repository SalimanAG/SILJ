import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Immeuble } from '../../models/immeuble.model';
import { TypeImmeuble } from '../../models/typeImmeuble.model';
import { PrixImmeuble } from '../../models/prixImmeuble.model';
@Injectable({
  providedIn: 'root'
})
export class ValeurLocativeService {

  private host:String = 'http://localhost:8080/perfora-gpc/v1';

  constructor(private httpClient:HttpClient) { }

  getAllImmeuble(){
    return this.httpClient.get<Immeuble[]>(this.host+'/location/immeuble/list');

  }

  getImmeubleById(code:String){
    return this.httpClient.get<Immeuble[]>(this.host+'/location/immeuble/byCodImm/'+code);

  }

  addImmeuble(corps:Immeuble){
    return this.httpClient.post<Immeuble>(this.host+'/location/immeuble/list', corps);
  }

  editImmeuble(code:String, corps:Immeuble){
    return this.httpClient.put<Immeuble>(this.host+'/location/immeuble/byCodImm/'+code, corps);
  }

  deleteImmeuble(code:String){
    return this.httpClient.delete<Boolean>(this.host+'/location/immeuble/byCodImm/'+code);
  }


  
  //Services type valeur locatives
  getAllTypeImmeuble(){
    return this.httpClient.get<TypeImmeuble[]>(this.host+'/location/typeimmeuble/list');

  }

  getTypeImmeubleById(code:String){
    return this.httpClient.get<TypeImmeuble[]>(this.host+'/location/typeimmeuble/byCodImm/'+code);

  }

  addTypeImmeuble(corps:TypeImmeuble){
    return this.httpClient.post<TypeImmeuble>(this.host+'/location/typeimmeuble/list', corps);
  }

  editTypeImmeuble(code:String, corps:TypeImmeuble){
    return this.httpClient.put<TypeImmeuble>(this.host+'/location/typeimmeuble/byCodImm/'+code, corps);
  }

  deleteTypeImmeuble(code:String){
    return this.httpClient.delete<Boolean>(this.host+'/location/typeimmeuble/byCodImm/'+code);
  }



  //Services prix valeur locatives
  getAllPrixImmeuble(){
    return this.httpClient.get<PrixImmeuble[]>(this.host+'/location/priximmeuble/list');

  }

  getPrixImmeubleById(code:String){
    return this.httpClient.get<PrixImmeuble[]>(this.host+'/location/priximmeuble/byCodImm/'+code);

  }

  addPrixImmeuble(corps:PrixImmeuble){
    return this.httpClient.post<PrixImmeuble>(this.host+'/location/priximmeuble/list', corps);
  }

  editPrixImmeuble(code:String, corps:PrixImmeuble){
    return this.httpClient.put<PrixImmeuble>(this.host+'/location/priximmeuble/byCodImm/'+code, corps);
  }

  deletePrixImmeuble(code:String){
    return this.httpClient.delete<Boolean>(this.host+'/location/priximmeuble/byCodImm/'+code);
  }

}
