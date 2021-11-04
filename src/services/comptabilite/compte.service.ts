import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Compte } from '../../models/comptabilite/compte.model';
import { Journal } from '../../models/comptabilite/journal.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';


@Injectable({
    providedIn: 'root'
})
export class CompteService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    getAllCompte(){
        return this.httpCli.get<Compte[]>(this.host+'/compta/compte/list');
    }
    
    getACompteById(code:String){
        return this.httpCli.get<Compte>(this.host+'/compta/compte/byCodCom/'+code);
    }
    
    getACompteByTyp(typ:String){
        return this.httpCli.get<Compte[]>(this.host+'/compta/compte/byTyp/'+typ);
    }
    
    getCompteEligible(id: Number){
        return this.httpCli.get<Compte[]>(this.host+'/compta/compte/jn/'+id);
    }
    
    addACompte(corps:Compte){
        return this.httpCli.post<Compte>(this.host+'/compta/compte/list', corps);
    }
    
    editACompte(code:String, corps:Compte){
        return this.httpCli.put<Compte>(this.host+'/compta/compte/byCodCom/'+code, corps);
    }
    
    deleteACompte(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/compte/byCodCom/'+code);
    }

}