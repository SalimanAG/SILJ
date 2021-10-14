import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Immo } from '../../models/comptaModel/immo.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
    providedIn: 'root'
})
export class ImmoService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    getAllImmo(){
        return this.httpCli.get<Immo[]>(this.host+'/compta/immo/list');
    }
    
    getAImmoById(code:String){
        return this.httpCli.get<Immo>(this.host+'/compta/immo/byCodImmo/'+code);
    }
    
    addAImmo(corps:Immo){
        return this.httpCli.post<Immo>(this.host+'/compta/immo/list', corps);
    }
    
    editAImmo(code:String, corps:Immo){
        return this.httpCli.put<Immo>(this.host+'/compta/immo/byCodImmo/'+code, corps);
    }
    
    deleteAImmo(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/immo/byCodImmo/'+code);
    }

}