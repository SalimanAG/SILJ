import { Arrondissement } from './arrondissement.model';
import { Quartier } from './quartier.model';
import { SiteMarcher } from './siteMarcher.model';
import { TypeImmeuble } from './typeImmeuble.model';

export class ValeurLocative {

    constructor(public codeIm:String, public libIm:String, public localisationIm:String, public etatIm:boolean,
        public superficie:number, public valUnit:number, public stuctResp:String, public autre:String,
        public arrondissement:Arrondissement, public quartier:Quartier,
         public typeImmeuble:TypeImmeuble, public siteMarcher:SiteMarcher){
  
    }
  }