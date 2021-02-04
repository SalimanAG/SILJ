import {Immeuble} from './Immeuble.model'
export class PrixImmeuble {

    constructor(public idPrixIm:number, public dateDebPrixIm:Date, public dateFinPrixIm:Date,
        public prixIm: DoubleRange, public valeurLocative:Immeuble){
  
    }
  
  }
  