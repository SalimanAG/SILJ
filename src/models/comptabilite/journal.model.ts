import { Compte } from "./compte.model";
import { NatureJournal } from "./nature-journal.model";

export class Journal{
    constructor(public idJrn:Number, public codJrn: String, public libJrn: String,
        public compteAutorises:Compte[], public autoContrepart: Compte, public natJrn: NatureJournal){}
}