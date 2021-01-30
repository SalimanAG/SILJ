import { Arrondissement } from './arrondissement.model';

export class Quartier {

    constructor(public codeQuartier:String, public nomQuartier:String,  public numTelQuartier:String,  public adresseQuartier:String, public arrondissement:Arrondissement){
  
    }
  }