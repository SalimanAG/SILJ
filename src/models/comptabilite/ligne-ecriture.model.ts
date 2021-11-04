import { Compte } from "./compte.model";
import { Ecriture } from "./ecriture.model";

export class LigneEcriture{
    reference: String;
    constructor(public idLigEcri: Number, public debit:Number, public credit: Number, 
        public observation: String, public ecriture: Ecriture, public compte: Compte){} }