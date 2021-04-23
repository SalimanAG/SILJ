import { Inventaire } from './inventaire.model';
import { Article } from './article.model';

export class LigneInventaire{

    public idLigneInv:number;

  constructor(public pu:number, public stockTheoriq:number,
     public stockreel:number, public Observation:String,
     public article:Article, public inventaire:Inventaire){

  }



}
