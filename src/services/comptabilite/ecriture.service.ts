import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ecriture } from '../../models/comptaModel/ecriture.model';
import { LigneEcriture } from '../../models/comptaModel/ligne.ecriture.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';
@Injectable({
    providedIn: 'root'
})
export class EcritureService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    //Partie réservée pour les ecritures

    getAllEcriture(){
        return this.httpCli.get<Ecriture[]>(this.host+'/compta/ecriture/list');
    }
    
    getAEcritureById(code:String){
        return this.httpCli.get<Ecriture>(this.host+'/compta/ecriture/byCodEcri/'+code);
    }
    
    addAEcriture(corps:Ecriture){
        return this.httpCli.post<Ecriture>(this.host+'/compta/ecriture/list', corps);
    }
    
    editAEcriture(code:String, corps:Ecriture){
        return this.httpCli.put<Ecriture>(this.host+'/compta/ecriture/byCodEcri/'+code, corps);
    }
    
    deleteAEcriture(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/ecriture/byCodEcri/'+code);
    }

    //Partie réservée pour les lignes d'ecritures

    getAllLigneEcriture(){
        return this.httpCli.get<LigneEcriture[]>(this.host+'/compta/ligneEcriture/list');
    }
    
    getALigneEcritureById(code:String){
        return this.httpCli.get<LigneEcriture>(this.host+'/compta/ligneEcriture/byCodLigEcr/'+code);
    }
    
    addALigneEcriture(corps:LigneEcriture){
        return this.httpCli.post<LigneEcriture>(this.host+'/compta/ligneEcriture/list', corps);
    }
    
    editALigneEcriture(code:String, corps:LigneEcriture){
        return this.httpCli.put<LigneEcriture>(this.host+'/compta/ligneEcriture/byCodLigEcr/'+code, corps);
    }
    
    deleteALigneEcriture(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/ligneEcriture/byCodLigEcr/'+code);
    }

}