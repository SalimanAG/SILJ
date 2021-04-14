import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PointVente } from '../../models/pointVente.model';
import { LignePointVente } from '../../models/lignePointVente.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';
@Injectable({
  providedIn: 'root'
})
export class PointVenteService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpcli:HttpClient, private serviceIp:AssocierUtilisateurService) { }
//Partie réservée pour PointVente
getAllPointVente(){
  return this.httpcli.get<PointVente[]>(this.host+'/stock/pointvente/list');
}

getPointVenteById(code:String){
  return this.httpcli.get<PointVente>(this.host+'/stock/pointvente/byCodPvt/'+code);
}

addPointVente(corps:PointVente){
  return this.httpcli.post<PointVente>(this.host+'/stock/pointvente/list', corps);
}

editPointVente(code:String, corps:PointVente){
  return this.httpcli.put<PointVente>(this.host+'/stock/pointvente/byCodPvt/'+code, corps);
}

deletePointVente(code:String){
  return this.httpcli.delete<boolean>(this.host+'/stock/pointvente/byCodPvt/'+code);
}


//Partie réservé pour ligne commande
getAllLignePointVente(){
  return this.httpcli.get<LignePointVente[]>(this.host+'/stock/lignepointvente/list');
}

getLignePointVenteById(code:String){
  return this.httpcli.get<LignePointVente>(this.host+'/stock/lignepointvente/byCodLpv/'+code);
}

addLignePointVente(corps:LignePointVente){
  return this.httpcli.post<LignePointVente>(this.host+'/stock/lignepointvente/list', corps);
}

editLignePointVente(code:String, corps:LignePointVente){
  return this.httpcli.put<LignePointVente>(this.host+'/stock/lignepointvente/byCodLpv/'+code, corps);
}

deleteLignePointVente(code:String){
  return this.httpcli.delete<boolean>(this.host+'/stock/lignepointvente/byCodLpv/'+code);
}

}
