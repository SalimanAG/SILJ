import {ValeurLocative} from './valeurLocative.model'
export class PrixImmeuble {

    constructor(public idPrixIm:Number, public dateDebPrixIm:Date, public dateFinPrixIm:Date,
        public prixIm: DoubleRange, public valeurLocative:ValeurLocative){
  
    }
  
  }
  