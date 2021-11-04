import { Caisse } from '../caisse.model';
import { Compte } from './compte.model';

export class AffectComptToCaisse {
    constructor(public idAffectComptCai: Number, public datDebAffComptCai: Date, public datFinAffComptCai: Date,
         public compte: Compte, public caisse: Caisse) {
        
    }
}