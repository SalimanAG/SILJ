import { Placement } from "./placement.model";
import { LignePlacement } from "./lignePlacement.model";

export class EncapPlacement {

    constructor(public placement: Placement, public lignePlacements: LignePlacement[]){
  
    }
  
  
  }