import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EtatImmo } from '../../models/comptabilite/etat-immo.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';



@Injectable({
    providedIn: 'root'
})
export class EtatImmoService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    getAllEtatImmo(){
        return this.httpCli.get<EtatImmo[]>(this.host+'/compta/etatImmo/list');
    }
    
    getAEtatImmoById(code:String){
        return this.httpCli.get<EtatImmo>(this.host+'/compta/etatImmo/byCodEtaImm/'+code);
    }
    
    addAEtatImmo(corps:EtatImmo){
        return this.httpCli.post<EtatImmo>(this.host+'/compta/etatImmo/list', corps);
    }
    
    editAEtatImmo(code:String, corps:EtatImmo){
        return this.httpCli.put<EtatImmo>(this.host+'/compta/etatImmo/byCodEtaImm/'+code, corps);
    }
    
    deleteAEtatImmo(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/etatImmo/byCodEtaImm/'+code);
    }

}