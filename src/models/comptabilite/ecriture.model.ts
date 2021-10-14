import { Exercice } from "../exercice.model";
import { Utilisateur } from "../utilisateur.model";
import { Journal } from "./journal.model";

export class Ecriture{
    constructor(public numEcri: String, public datEcri: Date, public descri: String,
        public refInterne, public refExterne: String,public journal: Journal,
        public user: Utilisateur, public exercice: Exercice){}
}