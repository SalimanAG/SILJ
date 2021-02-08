import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commande } from '../../models/commande.model';
import { LigneCommande } from '../../models/ligneCommande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private host:String = 'http://127.0.0.1:8080/perfora-gpc/v1';

  constructor(private httpcli:HttpClient) { }

  //Partie réservée pour Commande
  getAllCommande(){
    return this.httpcli.get<Commande[]>(this.host+'/stock/commande/list');
  }

  getACommandeById(code:String){
    return this.httpcli.get<Commande>(this.host+'/stock/commande/byCodCom/'+code);
  }

  addACommande(corps:Commande){
    return this.httpcli.post<Commande>(this.host+'/stock/commande/list', corps);
  }

  editACommande(code:String, corps:Commande){
    return this.httpcli.put<Commande>(this.host+'/stock/commande/byCodCom/'+code, corps);
  }

  deleteACommande(code:String){
    return this.httpcli.delete<boolean>(this.host+'/stock/commande/byCodCom/'+code);
  }


  //Partie réservé pour ligne commande
  getAllLigneCommande(){
    return this.httpcli.get<LigneCommande[]>(this.host+'/stock/ligneCommande/list');
  }

  getALigneCommandeById(code:String){
    return this.httpcli.get<LigneCommande>(this.host+'/stock/ligneCommande/byCodLigCom/'+code);
  }

  addALigneCommande(corps:LigneCommande){
    return this.httpcli.post<LigneCommande>(this.host+'/stock/ligneCommande/list', corps);
  }

  editALigneCommande(code:String, corps:LigneCommande){
    return this.httpcli.put<LigneCommande>(this.host+'/stock/ligneCommande/byCodLigCom/'+code, corps);
  }

  deleteALigneCommande(code:String){
    return this.httpcli.delete<boolean>(this.host+'/stock/ligneCommande/byCodLigCom/'+code);
  }

}
