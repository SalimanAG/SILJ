import { Arrondissement } from './arrondissement.model';
import { Quartier } from './quartier.model';
import { SiteMarcher } from './siteMarcher.model';
import { TypeImmeuble } from './typeImmeuble.model';

export class Immeuble {

    constructor(public codeIm:String, public libIm:String, public localisationIm:String, public etatIm:boolean,
      public superficie: number, public stuctResp: String, public autre: String,
        public arrondissement:Arrondissement, public quartier:Quartier,
         public typeImmeuble:TypeImmeuble, public siteMarcher:SiteMarcher, public ilot: String, public parcelle: String
         , public batie: boolean, public nbrFace: number, public nbrPlace: number, public activiter: String, public forme: String
         , public dimensions: String){
  
    }
  }
