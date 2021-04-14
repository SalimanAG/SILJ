import { Exercice } from './exercice.model';

export class Reception {

  public valideRecep:boolean;

  constructor(public numReception:String, public observation:String, public dateReception:Date
    , public exercice:Exercice){

  }

}
