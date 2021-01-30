import {TypeImmeuble} from './typeImmeuble.model';
import {Arrondissement} from './arrondissement.model';
import {Quartier} from './quartier.model';
import {SiteMarcher} from './siteMarcher.model';

export class Immeuble {

    constructor(public codeIm:String, public libIm:String, public localisationIm:String, 
        public etatIm:boolean, public superficie:DoubleRange, public valUnit: DoubleRange, 
        public stuctResp:String, public autre:String, public arrondissement:Arrondissement, 
        public quartier:Quartier, public typeImmeuble:TypeImmeuble, public siteMarcher: SiteMarcher){
  
    }
  
  }
  