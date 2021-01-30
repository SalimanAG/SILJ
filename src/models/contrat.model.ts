
export class Contrat{



  constructor(public numContrat:String, public dateSignatureContrat:Date, public dateEffetContrat:Date,
    public avanceContrat:number, public cautionContrat:number, public immeuble:String,
    public locataire:Location){

  }

}
