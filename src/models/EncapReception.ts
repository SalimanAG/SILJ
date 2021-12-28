import { Reception } from "./reception.model";
import { LigneReception } from "./ligneReception.model";

export class EncapReception {

    constructor(public reception: Reception, public ligneReceptions: LigneReception[]){
  
    }
  
  
  }