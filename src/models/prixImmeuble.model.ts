import { Immeuble } from './immeuble.model';

export class PrixImmeuble {

    constructor(public idPrixIm:number, public dateDebPrixIm:Date, public dateFinPrixIm:Date, public prixIm:number,
         public immeuble:Immeuble){
  
    }
  }