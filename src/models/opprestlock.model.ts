import { OpCaisse } from './OpeCaisse.model';
import { LigneOpCaisse } from './ligneopcaisse.model';

export class OpPrestBlock{
  constructor(public opc:OpCaisse, public lines: LigneOpCaisse[]){}
}
