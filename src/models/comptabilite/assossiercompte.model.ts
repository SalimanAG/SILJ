import { Article } from "../article.model";
import { Compte } from "./compte.model";

export class Associer{
    constructor(public idComArt: Number, public debComArt: Date, public finComArt: Date, public article: Article, 
        public compte: Compte){}}