
import { Service } from "../service.model";
import { Activite } from "./activite.model";
import { EtatImmo } from "./etat-immo.model";
import { Localisation } from "./localisation.model";
import { TypeAmort } from "./type-amort.model";

export class Immo{
    public idImmo: Number;
    constructor( public element: String, public intitule:String,
        public datEntree:Date, public valBrute:Number,public valResid: Number,
        public valAmortissable:Number, public nbAnne:Number, public nbMois:Number,
        public nbJrs:Number, public localisation:Localisation, public service:Service,
    public activite:Activite, public etatImmo:EtatImmo, public typeAmort:TypeAmort){}
}