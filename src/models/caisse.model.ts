import { Arrondissement } from './arrondissement.model';

export class Caisse{


  constructor(public codeCaisse:String, public libeCaisse:String, public arrondissement:Arrondissement){
  }
}
