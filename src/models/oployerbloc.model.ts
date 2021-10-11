import { Echeance } from "./echeance.model";
import { OpCaisse } from "./OpeCaisse.model";

export class OpLocBlock {
  constructor(public opc: OpCaisse, public lines: Echeance[]){}
}
