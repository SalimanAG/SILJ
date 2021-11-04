import { Ecriture } from "./ecriture.model";
import { LigneEcriture } from "./ligne-ecriture.model";

export class EcritureBlock{
    constructor(public e: Ecriture, public lines: LigneEcriture[]){}
}