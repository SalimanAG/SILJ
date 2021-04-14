import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recollement } from '../../models/recollement.model';
import { LigneRecollement } from '../../models/ligneRecollement.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';
@Injectable({
  providedIn: 'root'
})
export class RecollementService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpcli:HttpClient, private serviceIp:AssocierUtilisateurService) { }

//Partie réservée pour Recollement
getAllRecollement(){
  return this.httpcli.get<Recollement[]>(this.host+'/stock/recollement/list');
}

getRecollementById(code:String){
  return this.httpcli.get<Recollement>(this.host+'/stock/recollement/byCodReco/'+code);
}

addRecollement(corps:Recollement){
  return this.httpcli.post<Recollement>(this.host+'/stock/recollement/list', corps);
}

editRecollement(code:String, corps:Recollement){
  return this.httpcli.put<Recollement>(this.host+'/stock/recollement/byCodReco/'+code, corps);
}

deleteRecollement(code:String){
  return this.httpcli.delete<boolean>(this.host+'/stock/recollement/byCodReco/'+code);
}


//Partie réservé pour ligne recollement
getAllLigneRecollement(){
  return this.httpcli.get<LigneRecollement[]>(this.host+'/stock/ligneRecoll/list');
}

getLigneRecollementById(code:String){
  return this.httpcli.get<LigneRecollement>(this.host+'/stock/ligneRecoll/byCodLigRecoll/'+code);
}

addLigneRecollement(corps:LigneRecollement){
  return this.httpcli.post<LigneRecollement>(this.host+'/stock/ligneRecoll/list', corps);
}

editLigneRecollement(code:String, corps:LigneRecollement){
  return this.httpcli.put<LigneRecollement>(this.host+'/stock/ligneRecoll/byCodLigRecoll/'+code, corps);
}

deleteLigneRecollement(code:String){
  return this.httpcli.delete<boolean>(this.host+'/stock/ligneRecoll/byCodLigRecoll/'+code);
}

}
