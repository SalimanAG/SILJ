import { LignePointVente } from "./lignePointVente.model";
import { PointVente } from "./pointVente.model";

export class PointBlock{
  constructor(public pv: PointVente, public lpv: LignePointVente[]){}
}
