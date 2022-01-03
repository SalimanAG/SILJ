import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Approvisionnement } from '../../models/approvisionnement.model';
import { EncapApprovisionnement } from '../../models/EncapApprovisionnement';
import { LigneAppro } from '../../models/ligneAppro.model';
import { PlageNumArticle } from '../../models/plageNumArticle.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class BonApproService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) { }

  //Partie réservée pour Bon Approvisionnement
  getAllAppro(){
    return this.httpCli.get<Approvisionnement[]>(this.host+'/stock/approvisionnement/list');
  }

  getAApproById(code:String){
    return this.httpCli.get<Approvisionnement>(this.host+'/stock/approvisionnement/byCodApp/'+code);
  }

  addAAppro(corps:Approvisionnement){
    return this.httpCli.post<Approvisionnement>(this.host+'/stock/approvisionnement/list', corps);
  }

  //Léonel
  addAppro(corps:EncapApprovisionnement){
    return this.httpCli.post<EncapApprovisionnement>(this.host+'/stock/approvisionnement/list2', corps);
  }

  editAAppro(code:String, corps:Approvisionnement){
    return this.httpCli.put<Approvisionnement>(this.host+'/stock/approvisionnement/byCodApp/'+code, corps);
  }

  editAppro(code:String, corps:EncapApprovisionnement){
    return this.httpCli.put<EncapApprovisionnement>(this.host+'/stock/approvisionnement/byCodAppro2/'+code, corps);
  }

  deleteAAppro(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/approvisionnement/byCodApp/'+code);
  }


  //Partie réservée pour Ligne Bon Approvisionnement
  getAllLigneAppro(){
    return this.httpCli.get<LigneAppro[]>(this.host+'/stock/ligneAppro/list');
  }

  getALigneApproById(code:String){
    return this.httpCli.get<LigneAppro>(this.host+'/stock/ligneAppro/byCodLigApp/'+code);
  }

  addALigneAppro(corps:LigneAppro){
    return this.httpCli.post<LigneAppro>(this.host+'/stock/ligneAppro/list', corps);
  }

  editALigneAppro(code:String, corps:LigneAppro){
    return this.httpCli.put<LigneAppro>(this.host+'/stock/ligneAppro/byCodLigApp/'+code, corps);
  }

  deleteALigneAppro(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneAppro/byCodLigApp/'+code);
  }

  //Partie réservée pour PlageNumArticle
  getAllPlageNumArticle(){
    return this.httpCli.get<PlageNumArticle[]>(this.host+'/stock/plageNumArticle/list');
  }

  getAPlageNumArticleById(code:String){
    return this.httpCli.get<PlageNumArticle>(this.host+'/stock/plageNumArticle/byCodPlaNumArt/'+code);
  }

  addAPlageNumArticle(corps:PlageNumArticle){
    return this.httpCli.post<PlageNumArticle[]>(this.host+'/stock/plageNumArticle/list', corps);
  }

  editAPlageNumArticle(code:String, corps:PlageNumArticle){
    return this.httpCli.put<PlageNumArticle>(this.host+'/stock/plageNumArticle/byCodPlaNumArt/'+code, corps);
  }

  deleteAPlageNumArticle(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/plageNumArticle/byCodPlaNumArt/'+code);
  }


}
