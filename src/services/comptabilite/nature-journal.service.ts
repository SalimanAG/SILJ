import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NatureJournal } from '../../models/comptaModel/natur.journal.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
    providedIn: 'root'
})
export class NatureJournalService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    getAllNatureJournal(){
        return this.httpCli.get<NatureJournal[]>(this.host+'/compta/natureJournal/list');
    }
    
    getANatureJournalById(code:String){
        return this.httpCli.get<NatureJournal>(this.host+'/compta/natureJournal/byCodNatJour/'+code);
    }
    
    addANatureJournal(corps:NatureJournal){
        return this.httpCli.post<NatureJournal>(this.host+'/compta/natureJournal/list', corps);
    }
    
    editANatureJournal(code:String, corps:NatureJournal){
        return this.httpCli.put<NatureJournal>(this.host+'/compta/natureJournal/byCodNatJour/'+code, corps);
    }
    
    deleteANatureJournal(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/natureJournal/byCodNatJour/'+code);
    }

}