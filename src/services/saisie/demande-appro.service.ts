import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemandeApprovisionnement } from '../../models/demandeApprovisionnement.model';
import { LigneDemandeAppro } from '../../models/ligneDemandeAppro.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeApproService {

  private host:String = 'http://127.0.0.1:8080/perfora-gpc/v1';

  constructor(private httpCli:HttpClient) { }

  //Partie réservée pour Bon d'Appro (Demande d'Appro)
  getAllDemandeAppro(){
    return this.httpCli.get<DemandeApprovisionnement[]>(this.host+'/stock/demandeAppro/list');
  }

  getADemandeApproById(code:String){
    return this.httpCli.get<DemandeApprovisionnement>(this.host+'/stock/demandeAppro/byCodDemApp/'+code);
  }

  addADemandeAppro(corps:DemandeApprovisionnement){
    return this.httpCli.post<DemandeApprovisionnement>(this.host+'/stock/demandeAppro/list', corps);
  }

  editADemandeAppro(code:String, corps:DemandeApprovisionnement){
    return this.httpCli.put<DemandeApprovisionnement>(this.host+'/stock/demandeAppro/byCodDemApp/'+code, corps);
  }

  deleteADemandeAppro(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/demandeAppro/byCodDemApp/'+code);
  }

  //Partie réservée pour les lignes de demande d'Approvisionnement
  getAllLigneDemandeAppro(){
    return this.httpCli.get<LigneDemandeAppro[]>(this.host+'/stock/ligneDemandeAppro/list');
  }

  getALigneDemandeApproById(code:String){
    return this.httpCli.get<LigneDemandeAppro>(this.host+'/stock/ligneDemandeAppro/byCodLigDemApp/'+code);
  }

  addALigneDemandeAppro(corps:LigneDemandeAppro){
    return this.httpCli.post<LigneDemandeAppro>(this.host+'/stock/ligneDemandeAppro/list', corps);
  }

  editALigneDemandeAppro(code:String, corps:LigneDemandeAppro){
    return this.httpCli.put<LigneDemandeAppro>(this.host+'/stock/ligneDemandeAppro/byCodLigDemApp/'+code, corps);
  }

  deleteALigneDemandeAppro(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/ligneDemandeAppro/byCodLigDemApp/'+code);
  }



}
