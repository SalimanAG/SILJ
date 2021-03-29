import { Exercice } from './exercice.model';

export class Approvisionnement {

  public valideAppro:boolean;

  constructor(public numAppro:String, public descriptionAppro:String, public dateAppro:Date,
    public exercice:Exercice){

    }


}
