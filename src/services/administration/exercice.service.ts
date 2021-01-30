import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exercice } from '../../models/exercice.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {

  public exoSelectionner:Exercice = new Exercice('', '', new Date(), new Date(), '', false);
  private host:String = 'http://127.0.0.1:8080/perfora-gpc/v1';

  constructor(private httpCli:HttpClient) {
    
  }

  getAllExo(){
    return this.httpCli.get<Exercice[]>(this.host+'/commune/exercice/list');
  }

  getAExoById(code:String){
    return this.httpCli.get<Exercice>(this.host+'/commune/exercice/byCodExe/'+code);
  }

  addAExo(corps:Exercice){
    return this.httpCli.post<Exercice>(this.host+'/commune/exercice/list', corps);
  }

  editAExo(code:String, corps:Exercice){
    return this.httpCli.put<Exercice>(this.host+'/commune/exercice/byCodExe/'+code, corps);
  }

  deleteAExo(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/commune/exercice/byCodExe/'+code);
  }

}
