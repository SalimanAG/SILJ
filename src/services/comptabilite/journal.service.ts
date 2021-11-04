import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Journal } from '../../models/comptabilite/journal.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';


@Injectable({
    providedIn: 'root'
})
export class JournalService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    getAllJournal(){
        return this.httpCli.get<Journal[]>(this.host+'/compta/journal/list');
    }
    
    getAutreJournaux(code:String){
        return this.httpCli.get<Journal[]>(this.host+'/compta/journal/!cod/'+code);
    }
    
    getAJournalById(code:String){
        return this.httpCli.get<Journal>(this.host+'/compta/journal/byCodJour/'+code);
    }
    
    addAJournal(corps:Journal){
        return this.httpCli.post<Journal>(this.host+'/compta/journal/list', corps);
    }
    
    editAJournal(code:String, corps:Journal){
        return this.httpCli.put<Journal>(this.host+'/compta/journal/byCodJour/'+code, corps);
    }
    
    deleteAJournal(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/journal/byCodJour/'+code);
    }

}