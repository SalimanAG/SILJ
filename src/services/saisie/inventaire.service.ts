import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventaire } from '../../models/inventaire.model';
import { LigneInventaire} from '../../models/ligneInventaire.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
    providedIn: 'root'
  })

  export class InventaireService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpcli:HttpClient, private serviceIp:AssocierUtilisateurService) { }
  //Partie réservée pour Inventaire
  getAllInventaire(){
    return this.httpcli.get<Inventaire[]>(this.host+'/stock/inventaire/list');
  }

  getInventaireId(code:String){
    return this.httpcli.get<Inventaire>(this.host+'/stock/inventaire/byCodSto/'+code);
  }

  addInventaire(corps:Inventaire){
    return this.httpcli.post<Inventaire>(this.host+'/stock/inventaire/list', corps);
  }

  editInventaire(code:String, corps:Inventaire){
    return this.httpcli.put<Inventaire>(this.host+'/stock/inventaire/byCodSto/'+code, corps);
  }

  deleteInventaire(code:String){
    return this.httpcli.delete<boolean>(this.host+'/stock/inventaire/byCodSto/'+code);
  }


  //Partie réservé pour ligne inventaire
  getAllLigneInventaire(){
    return this.httpcli.get<LigneInventaire[]>(this.host+'/stock/ligneInventaire/list');
  }

  getLigneInventaireById(code:String){
    return this.httpcli.get<LigneInventaire>(this.host+'/stock/ligneInventaire/byCodSto/'+code);
  }

  addLigneInventaire(corps:LigneInventaire){
    return this.httpcli.post<LigneInventaire>(this.host+'/stock/ligneInventaire/list', corps);
  }

  editLigneInventaire(code:String, corps:LigneInventaire){
    return this.httpcli.put<LigneInventaire>(this.host+'/stock/ligneInventaire/byCodSto/'+code, corps);
  }

  deleteLigneInventaire(code:String){
    return this.httpcli.delete<boolean>(this.host+'/stock/ligneInventaire/byCodSto/'+code);
  }

  }
  