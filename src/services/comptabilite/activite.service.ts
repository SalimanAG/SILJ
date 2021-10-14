import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activite } from '../../models/comptabilite/activite.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';


@Injectable({
    providedIn: 'root'
})
export class ActiviteService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    getAllActivite(){
        return this.httpCli.get<Activite[]>(this.host+'/compta/activite/list');
    }
    
    getAActiviteById(code:String){
        return this.httpCli.get<Activite>(this.host+'/compta/activite/byCodAct/'+code);
    }
    
    addAActivite(corps:Activite){
        return this.httpCli.post<Activite>(this.host+'/compta/activite/list', corps);
    }
    
    editAActivite(code:String, corps:Activite){
        return this.httpCli.put<Activite>(this.host+'/compta/activite/byCodAct/'+code, corps);
    }
    
    deleteAActivite(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/activite/byCodAct/'+code);
    }

}