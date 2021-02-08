import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneOpCaisse } from '../../models/ligneopcaisse.model';
import { OpCaisse } from '../../models/OpeCaisse.model';
import { ModePaiement } from '../../models/mode.model';
import { TypeRecette } from '../../models/type.model';
import { Caisse } from '../../models/caisse.model';
import { Utilisateur } from '../../models/utilisateur.model';
import { Exercice } from '../../models/exercice.model';
import { Article } from '../../models/article.model';
import { Locataire } from '../../models/locataire.model';

@Injectable({
  providedIn: 'root'
})
export class OperationCaisseService {

  private host:string='http://127.0.0.1:8080/perfora-gpc/v1/'

  constructor(private lien:HttpClient) {

  }

  getAllOp(){
    return this.lien.get<OpCaisse[]>(this.host+'facturation/opcaisse/list');
  }

  getAOpCaissById(code:String){
    return this.lien.get<OpCaisse>(this.host+'facturation/opcaisse/byCodOpCai/'+code);
  }

  ajouteOp(corps:OpCaisse){
    return this.lien.post<OpCaisse>(this.host+'facturation/opcaisse/list',corps);
  }

  editAOpCaiss(code:String, corps:OpCaisse){
    return this.lien.put<OpCaisse>(this.host+'facturation/opcaisse/byCodOpCai/'+code, corps);
  }

  deleteAOpCaiss(code:String){
    return this.lien.delete<boolean>(this.host+'facturation/opcaisse/byCodOpCai/'+code);
  }

  getAllModes(){
    return this.lien.get<ModePaiement[]>(this.host+'facturation/modePaiement/list');
  }

  getAllCaisses(){
    return this.lien.get<Caisse[]>(this.host+'facturation/caisse/list');
  }

  getAllTypes(){
    return this.lien.get<TypeRecette[]>(this.host+'facturation/typeRecette/list');
  }

  getAllUsers(){
    return this.lien.get<Utilisateur[]>(this.host+'commune/user/list');
  }

  getAllExos(){
    return this.lien.get<Exercice[]>(this.host+'commune/exercice/list');
  }


  getAllArticles(){
    return this.lien.get<Article[]>(this.host+'stock/article/list');
  }


  getAllLocataires(){
    return this.lien.get<Locataire[]>(this.host+'location/locataire/list')
  }

  getAllOpLines(){
    return this.lien.get<LigneOpCaisse[]>(this.host+'ligneOpCaisse/list');
  }

  getOpLineById(id:number){
    return this.lien.get<LigneOpCaisse>(this.host+'ligneOpCaisse/byCodLigOpCai/'+(id));
  }

  addOpLine(corps:LigneOpCaisse){
    return this.lien.post<LigneOpCaisse>(this.host+"ligneOpCaisse/list",corps);
  }

  editOpLine(id:number,corps:LigneOpCaisse){
    return this.lien.put<LigneOpCaisse>(this.host+'ligneOpCaisse/byCodLigOpCai/'+(id),corps);
  }

  deleteOpLine(id:number){
    return this.lien.delete<LigneOpCaisse>(this.host+'ligneOpCaisse/byCodLigOpCai/'+(id));
  }

  getOpLinesByOpCais(opcais:OpCaisse){
    return
  }

}
