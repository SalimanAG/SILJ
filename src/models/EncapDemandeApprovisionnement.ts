import { DemandeApprovisionnement } from "./demandeApprovisionnement.model";
import { LigneDemandeAppro } from "./ligneDemandeAppro.model";

export class EncapDemandeApprovisionnement {

    constructor(public demandeApprovisionnement: DemandeApprovisionnement, public ligneDemandeAppros: LigneDemandeAppro[]){
  
    }
  
  
  }