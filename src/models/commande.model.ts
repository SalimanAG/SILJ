import { Exercice } from './exercice.model';
import { Fournisseur } from './fournisseur.model';

export class Commande{

  constructor(public numCommande:String, public dateCommande:Date, public description:String,
    public delaiLivraison:number, public frs:Fournisseur, public exercice:Exercice){

  }



}
