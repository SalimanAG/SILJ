import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Localisation } from '../../models/comptabilite/localisation.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';


@Injectable({
    providedIn: 'root'
})
export class LocalisationService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    getAllLocalisation(){
        return this.httpCli.get<Localisation[]>(this.host+'/compta/localisation/list');
    }
    
    getALocalisationById(code:String){
        return this.httpCli.get<Localisation>(this.host+'/compta/localisation/byCodLocali/'+code);
    }
    
    addALocalisation(corps:Localisation){
        return this.httpCli.post<Localisation>(this.host+'/compta/localisation/list', corps);
    }
    
    editALocalisation(code:String, corps:Localisation){
        return this.httpCli.put<Localisation>(this.host+'/compta/localisation/byCodLocali/'+code, corps);
    }
    
    deleteALocalisation(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/localisation/byCodLocali/'+code);
    }

}