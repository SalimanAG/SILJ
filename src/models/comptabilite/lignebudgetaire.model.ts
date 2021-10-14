import { Budget } from "./budget.model";
import { Compte } from "./compte.model";

export class LigneBudgetaire{
    constructor(private idLigBdg:Number, public debit: Number, public credit: Number,public bdg:Budget,
        public cpte:Compte){}
     }