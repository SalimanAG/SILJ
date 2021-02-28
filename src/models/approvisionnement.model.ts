import { Exercice } from './exercice.model';

export class Approvisionnement {

  constructor(public numAppro:String, public descriptionAppro:String, public dateAppro:Date,
    public exercice:Exercice){
      
    }


}
