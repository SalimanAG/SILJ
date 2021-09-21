import { Personne } from "./personne.model";
import { Poste } from "./post.model";
import { Rapport } from "./rapport.model";

export class Signer{
  id: number;
    constructor(public datDeb: Date, public datFin: Date, public poste: Poste, public rapport: Rapport){}
}
