import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reversement } from '../../models/reversement.model';
import { LigneReversement } from '../../models/ligneReversement.model';
@Injectable({
  providedIn: 'root'
})
export class ReversementService {

  private host:String = 'http://127.0.0.1:8080/perfora-gpc/v1';

  constructor(private httpcli:HttpClient) { }

//Partie réservée pour Reversement
getAllReversement(){
  return this.httpcli.get<Reversement[]>(this.host+'/facturation/reversement/list');
}

getReversementById(code:String){
  return this.httpcli.get<Reversement>(this.host+'/facturation/reversement/byCodRev/'+code);
}

addReversement(corps:Reversement){
  return this.httpcli.post<Reversement>(this.host+'/facturation/reversement/list', corps);
}

editReversement(code:String, corps:Reversement){
  return this.httpcli.put<Reversement>(this.host+'/facturation/reversement/byCodRev/'+code, corps);
}

deleteReversement(code:String){
  return this.httpcli.delete<boolean>(this.host+'/facturation/reversement/byCodRev/'+code);
}


//Partie réservé pour ligne reversement
getAllLigneReversement(){
  return this.httpcli.get<LigneReversement[]>(this.host+'/facturation/ligneReversement/list');
}

getLigneReversementById(code:String){
  return this.httpcli.get<LigneReversement>(this.host+'/facturation/ligneReversement/byCodLigRev/'+code);
}

addLigneReversement(corps:LigneReversement){
  return this.httpcli.post<LigneReversement>(this.host+'/facturation/ligneReversement/list', corps);
}

editLigneReversement(code:String, corps:LigneReversement){
  return this.httpcli.put<LigneReversement>(this.host+'/facturation/ligneReversement/byCodLigRev/'+code, corps);
}

deleteLigneReversement(code:String){
  return this.httpcli.delete<boolean>(this.host+'/facturation/ligneReversement/byCodLigRev/'+code);
}

}
