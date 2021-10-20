import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Budget } from '../../models/comptabilite/budget.model';
import { Compte } from '../../models/comptabilite/compte.model';
import { LigneBudgetaire } from '../../models/comptabilite/lignebudgetaire.model';
import { TypeBudget } from '../../models/comptabilite/typebudget.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';


@Injectable({
    providedIn: 'root'
})
export class BudgetService {

    private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

    constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {

    }

    ///Type budgetaire
    getAllTypeBudget(){
        return this.httpCli.get<TypeBudget[]>(this.host+'/compta/natBud/list');
    }
    
    getATypeBudgetById(code:Number){
        return this.httpCli.get<TypeBudget>(this.host+'/compta/natBud/byCodNat/'+code);
    }
    
    addATypeBudget(corps:TypeBudget){
        return this.httpCli.post<TypeBudget>(this.host+'/compta/natBud/list', corps);
    }
    
    editATypeBudget(code:Number, corps:TypeBudget){
        return this.httpCli.put<TypeBudget>(this.host+'/compta/natBug/byCodNat/'+code, corps);
    }
    
    deleteATypeBudget(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/natBug/byCodNat/'+code);
    }
    

    ///Budget
    getAllBudget(){
        return this.httpCli.get<Budget[]>(this.host+'/compta/bdg/list');
    }
    
    getABudgetById(code:Number){
        return this.httpCli.get<Budget>(this.host+'/compta/bdg/byIdBdg/'+code);
    }
    
    addABudget(corps:Budget){
        return this.httpCli.post<Budget>(this.host+'/compta/bdg/list', corps);
    }
    
    editABudget(code:Number, corps:Budget){
        return this.httpCli.put<Budget>(this.host+'/compta/bdg/byIdBdg/'+code, corps);
    }
    
    deleteABudget(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/bdg/byIdBdg/'+code);
    }

    

    ///Budget
    getAllLigneBudget(){
        return this.httpCli.get<LigneBudgetaire[]>(this.host+'/compta/lBdg/list');
    }
    
    getALigneBudgetById(code:Number){
        return this.httpCli.get<LigneBudgetaire>(this.host+'/compta/lBdg/byCodLigBdg/'+code);
    }
    
    addALigneBudget(corps:LigneBudgetaire){
        return this.httpCli.post<LigneBudgetaire>(this.host+'/compta/lBdg/list', corps);
    }
    
    editALigneBudget(code:Number, corps:LigneBudgetaire){
        return this.httpCli.put<LigneBudgetaire>(this.host+'/compta/lBdg/byCodLigBdg/'+code, corps);
    }
    
    deleteALigneBudget(code:String){
        return this.httpCli.delete<boolean>(this.host+'/compta/lBdg/byCodLigBdg/'+code);
    }

}