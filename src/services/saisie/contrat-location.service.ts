import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contrat } from '../../models/contrat.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class ContratLocationService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) { }

  getAllContrat(){
    return this.httpCli.get<Contrat[]>(this.host+'/location/contrat/list');
  }

  getAContratById(code:String){
    return this.httpCli.get<Contrat>(this.host+'/location/contrat/byCodCon/'+code);
  }

  addAContrat(corps:Contrat){
    return this.httpCli.post<Contrat>(this.host+'/location/contrat/list', corps);
  }

  editAContrat(code:String, corps:Contrat){
    return this.httpCli.put<Contrat>(this.host+'/location/contrat/byCodCon/'+code, corps);
  }

  deleteAContrat(code:String){
    return this.httpCli.delete<boolean>(this.host+'/location/contrat/byCodCon/'+code);
  }

}
