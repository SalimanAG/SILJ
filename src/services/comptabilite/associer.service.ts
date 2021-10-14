import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Associer } from '../../models/comptaModel/assossiercompte.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
    providedIn: 'root'
})
export class AssocierService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    getAllAssocier(){
        return this.httpCli.get<Associer[]>(this.host+'/compta/associer/list');
    }
    
    getAAssocierById(code:String){
        return this.httpCli.get<Associer>(this.host+'/compta/associer/byCodAsso/'+code);
    }
    
    addAAssocier(corps:Associer){
        return this.httpCli.post<Associer>(this.host+'/compta/associer/list', corps);
    }
    
    editAAssocier(code:String, corps:Associer){
        return this.httpCli.put<Associer>(this.host+'/compta/associer/byCodAsso/'+code, corps);
    }
    
    deleteAAssocier(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/associer/byCodAsso/'+code);
    }

}