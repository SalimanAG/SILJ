import { Arrondissement } from './arrondissement.model';
import { Correspondant } from './Correspondant.model';
import { SiteMarcher } from './siteMarcher.model';

export class EtreAffecte {

  public idAffecte:number;

  constructor(public dateArrivee:Date, public dateDepart:Date, public corres:Correspondant,
    public site:SiteMarcher, public arrondissement?:Arrondissement){

  }

}
