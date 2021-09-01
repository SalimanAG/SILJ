import { Approvisionnement } from './approvisionnement.model';
import { Article } from './article.model';
import { Exercice } from './exercice.model';
import { LigneAppro } from './ligneAppro.model';
import { LignePlacement } from './lignePlacement.model';
import { LigneReception } from './ligneReception.model';
import { LigneRecollement } from './ligneRecollement.model';
import { Magasin } from './magasin.model';
import { Placement } from './placement.model';
import { Reception } from './reception.model';
import { Recollement } from './recollement.model';

export class PlageNumDispo {

  public codePlageDispo:number;

  constructor( public numDebPlage : number, public numDebPlageDispo : number,
    public numFinPlage : number, public numFinPlageDispo : number,
    public exercice: Exercice, public article: Article, public magasin: Magasin,
    public reception: Reception, public Appro: Approvisionnement,
    public placement: Placement, public recollement: Recollement) {

  }


}
