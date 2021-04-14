import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fournisseur } from '../../models/fournisseur.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  private host:String ='http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1'
  constructor(private httpCli: HttpClient, private serviceIp:AssocierUtilisateurService) { }

  getAllFrs(){
    return this.httpCli.get<Fournisseur[]>(this.host+'/commune/fournisseur/list');
  }

  getAFrsById(code:String){
    return this.httpCli.get<Fournisseur>(this.host+'/commune/fournisseur/byCodFou/'+code);
  }

  addAFrs(corps:Fournisseur){
    return this.httpCli.post<Fournisseur>(this.host+'/commune/fournisseur/list', corps);
  }

  editAFrs(code:String, corps:Fournisseur){
    return this.httpCli.put<Fournisseur>(this.host+'/commune/fournisseur/byCodFou/'+code, corps);
  }

  deleteAFrs(code:String){
    return this.httpCli.delete<boolean>(this.host+'/commune/fournisseur/byCodFou/'+code);
  }

}
