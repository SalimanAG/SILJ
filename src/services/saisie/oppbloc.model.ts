import { Magasin } from "../../models/magasin.model";
import { OpCaisse } from "../../models/OpeCaisse.model";
import { PointBlock } from "../../models/pointblock.model";
import { PointVente } from "../../models/pointVente.model";

export class OpPointBlock{
  constructor(public opc: OpCaisse, public pv:PointVente){}
}
