import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeAmort } from '../../models/comptaModel/type.amort.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
    providedIn: 'root'
})
export class TypeAmortService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    getAllTypeAmort(){
        return this.httpCli.get<TypeAmort[]>(this.host+'/compta/typeAmort/list');
    }
    
    getATypeAmortById(code:String){
        return this.httpCli.get<TypeAmort>(this.host+'/compta/typeAmort/byCodTypAmo/'+code);
    }
    
    addATypeAmort(corps:TypeAmort){
        return this.httpCli.post<TypeAmort>(this.host+'/compta/typeAmort/list', corps);
    }
    
    editATypeAmort(code:String, corps:TypeAmort){
        return this.httpCli.put<TypeAmort>(this.host+'/compta/typeAmort/byCodTypAmo/'+code, corps);
    }
    
    deleteATypeAmort(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/typeAmort/byCodTypAmo/'+code);
    }

}