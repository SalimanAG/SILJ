import { OpPrestBlock } from './opprestlock.model';
import { PointBlock } from './pointblock.model';

export class OpPointBlock{
  constructor(public blocOpc: OpPrestBlock, public blocPV: PointBlock){}
}
