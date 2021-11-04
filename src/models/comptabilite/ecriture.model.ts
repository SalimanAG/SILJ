import { Exercice } from "../exercice.model";
import { Utilisateur } from "../utilisateur.model";
import { Journal } from "./journal.model";

export class Ecriture{
    ordre: number
    datSaisie: Date;
    valide: boolean;
    constructor(public numEcri: String, public datEcri: Date, public descript: String,
        public refIntern, public refExtern: String,public journal: Journal,
        public user: Utilisateur, public exo: Exercice){}
}