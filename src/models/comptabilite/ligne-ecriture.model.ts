import { Compte } from "./compte.model";
import { Ecriture } from "./ecriture.model";

export class LigneEcriture{
    constructor(public idLigEcri: Number, public datEcri: Date,public debit:Number, public credit: Number,
        public obsLigEcri: String, public ecriture: Ecriture, public compte: Compte){} }