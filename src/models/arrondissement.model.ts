import { Commune } from './commune.model';

export class Arrondissement {

    constructor(public codeArrondi:String, public nomArrondi:String,  public numTelArrondi:String,  public adresseArrondi:String, public commune:Commune){
  
    }
  }