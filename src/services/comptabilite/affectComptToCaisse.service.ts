import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AffectComptToCaisse } from '../../models/comptabilite/affectComptToCaisse.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
    providedIn: 'root'
})
export class AffectComptToCaisseService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    getAllAffectComptToCaisse(){
        return this.httpCli.get<AffectComptToCaisse[]>(this.host+'/compta/affectComptToCaisse/list');
    }
    
    getAAffectComptToCaisseById(code:String){
        return this.httpCli.get<AffectComptToCaisse>(this.host+'/compta/affectComptToCaisse/byCodAffComToCai/'+code);
    }
    
    addAAffectComptToCaisse(corps:AffectComptToCaisse){
        return this.httpCli.post<AffectComptToCaisse>(this.host+'/compta/affectComptToCaisse/list', corps);
    }
    
    editAAffectComptToCaisse(code:String, corps:AffectComptToCaisse){
        return this.httpCli.put<AffectComptToCaisse>(this.host+'/compta/affectComptToCaisse/byCodAffComToCai/'+code, corps);
    }
    
    deleteAAffectComptToCaisse(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/affectComptToCaisse/byCodAffComToCai/'+code);
    }

}