import { Departement } from './departement.model';

export class Commune {

    constructor(public codeCommune:String, public nomCommune:String,  public numTelMairie:String,  public adresseMairie:String, public codeDepartement:Departement){
  
    }
  }