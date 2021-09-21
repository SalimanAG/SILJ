import { Personne } from "./personne.model";
import { Poste } from "./post.model";

export class Occuper{
  idOccu: number;
    constructor(public datDeb: Date, public datFin: Date, public personne: Personne, public post: Poste){}
}
