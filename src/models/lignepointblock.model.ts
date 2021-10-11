import { Magasin } from './magasin.model';
import { LignePointVente } from './lignePointVente.model';

export class LignePointBlock{
  constructor(public lpv: LignePointVente, public mg: Magasin){}
}
