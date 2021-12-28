import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncapReception } from '../../models/EncapReception';
import { LigneReception } from '../../models/ligneReception.model';
import { Reception } from '../../models/reception.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class ReceptionService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) { }

  //Partie réservée pour les récèptions
  getAllReception(){
    return this.httpCli.get<Reception[]>(this.host+'/stock/reception/list');
  }

  getAReceptionById(code:String){
    return this.httpCli.get<Reception>(this.host+'/stock/reception/byCodRec/'+code);
  }

  addAReception(corps:Reception){
    return this.httpCli.post<Reception>(this.host+'/stock/reception/list', corps);
  }

  addReception(corps:EncapReception){
    return this.httpCli.post<EncapReception>(this.host+'/stock/reception/list2', corps);
  }

  editAReception(code:String, corps:Reception){
    return this.httpCli.put<Reception>(this.host+'/stock/reception/byCodRec/'+code, corps);
  }

  //Léo
  editReception(code:String, corps:EncapReception){
    return this.httpCli.put<Reception>(this.host+'/stock/reception/byCodRec2/'+code, corps);
  }

  //Léo Annulation d'une ReCeption

  annuleReception(code:String, corps:Reception){
    return this.httpCli.put<Reception>(this.host+'/stock/reception/annulation/'+code, corps);
  }


  deleteAReception(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/reception/byCodRec/'+code);
  }

  //Léo Delete Reception
  deleteReception(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/reception/delete/'+code);
  }



  //Partie réservée pour les lignes de récèption
  getAllLigneReception(){
    return this.httpCli.get<LigneReception[]>(this.host+'/stock/ligneReception/list');
  }

  getALigneReceptionById(code:String){
    return this.httpCli.get<LigneReception>(this.host+'/stock/ligneReception/byCodLigRec/'+code);
  }

  addALigneReception(corps:LigneReception){
    return this.httpCli.post<LigneReception>(this.host+'/stock/ligneReception/list', corps);
  }

  editALigneReception(code:String, corps:LigneReception){
    return this.httpCli.put<LigneReception>(this.host+'/stock/ligneReception/byCodLigRec/'+code, corps);
  }

  deleteALigneReception(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneReception/byCodLigRec/'+code);
  }


}
