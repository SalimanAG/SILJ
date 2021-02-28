import { Article } from './article.model';
import { Placement } from './placement.model';

export class LignePlacement {

  public idLignePlacement:number;

  constructor(public quantiteLignePlacement:number, public pulignePlacement:number,
    public placement:Placement, public article:Article){

  }


}
