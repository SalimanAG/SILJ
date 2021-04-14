import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Locataire } from '../../models/locataire.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class LocataireService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

  }

  getAllLocataire(){
    return this.httpCli.get<Locataire[]>(this.host+'/location/locataire/list');
  }

  getALocataireById(code:String){
    return this.httpCli.get<Locataire>(this.host+'/location/locataire/byCodLoc/'+code);
  }

  addALocataire(corps:Locataire){
    return this.httpCli.post<Locataire>(this.host+'/location/locataire/list', corps);
  }

  editALocataire(code:string, corps:Locataire){
    return this.httpCli.put<Locataire>(this.host+'/location/locataire/byCodLoc/'+code, corps);
  }

  deleteALocataire(code:string){
    return this.httpCli.delete<boolean>(this.host+'/location/locataire/byCodLoc/'+code);
  }

}
