import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'inspector';
import { Correspondant } from '../../models/Correspondant.model';
import { EtreAffecte } from '../../models/etreAffecte.model';
import { Gerer } from '../../models/gerer.model';
import { Magasin } from '../../models/magasin.model';
import { Magasinier } from '../../models/magasinier.model';
import { Stocker } from '../../models/stocker.model';
import { TypCorres } from '../../models/typCorres.model';

@Injectable({
  providedIn: 'root'
})
export class CorrespondantService {

  private host:String = 'http://127.0.0.1:8080/perfora-gpc/v1';

  constructor(private httpCli:HttpClient) {

   }

  //Partie réservée pour Type Correspondant
   getAllTypCorres(){
    return this.httpCli.get<TypCorres[]>(this.host+'/stock/typecorrespondant/list');
   }

   getATypCorresById(code:String){
     return this.httpCli.get<TypCorres>(this.host+'/stock/typecorrespondant/byCodTypCor/'+code);
   }


  //Partie réservée Magasin
   getAllMagasin(){
     return this.httpCli.get<Magasin[]>(this.host+'/stock/magasin/list');
   }

   getAMagasinById(code:String){
     return this.httpCli.get<Magasin>(this.host+'/stock/magasin/byCodMag/'+code);
   }

   addAMagasin(corps:Magasin){
    return this.httpCli.post<Magasin>(this.host+'/stock/magasin/list', corps);
   }

   editAMagasin(code:String, corps:Magasin){
     return this.httpCli.put<Magasin>(this.host+'/stock/magasin/byCodMag/'+code, corps);
   }

   deleteAMagasin(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/magasin/byCodMag/'+code);
   }



  //Partie réservée Magasinier
  getAllMagasinier(){
    return this.httpCli.get<Magasinier[]>(this.host+'/stock/magasinier/list');
  }

  getAMagasinierById(code:String){
    return this.httpCli.get<Magasinier>(this.host+'/stock/magasinier/byCodMag/'+code);
  }

  addAMagasinier(corps:Magasinier){
   return this.httpCli.post<Magasinier>(this.host+'/stock/magasinier/list', corps);
  }

  editAMagasinier(code:String, corps:Magasinier){
    return this.httpCli.put<Magasinier>(this.host+'/stock/magasinier/byCodMag/'+code, corps);
  }

  deleteAMagasinier(code:String){
   return this.httpCli.delete<boolean>(this.host+'/stock/magasinier/byCodMag/'+code);
  }



  //Partie réservée pour Gérer un magasin par un magasinier
  getAllGerer(){
    return this.httpCli.get<Gerer[]>(this.host+'/stock/gerer/list');
  }

  getAGererById(code:String){
    return this.httpCli.get<Gerer>(this.host+'/stock/gerer/byCodGer/'+code);
  }

  addAGerer(corps:Gerer){
    return this.httpCli.post<Gerer>(this.host+'/stock/gerer/list', corps);
  }

  editAGerer(code:String, corps:Gerer){
    return this.httpCli.put<Gerer>(this.host+'/stock/gerer/byCodGer/'+code, corps);
  }

  deleteAGerer(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/gerer/byCodGer/'+code);
  }


  //Partie réservée pour Correspondant
  getAllCorres(){
    return this.httpCli.get<Correspondant[]>(this.host+'/stock/correspondant/list');
  }

  getACorresById(code:String){
    return this.httpCli.get<Correspondant>(this.host+'/stock/correspondant/byCodCor/'+code);
  }

  addACorres(corps:Correspondant){
    return this.httpCli.post<Correspondant>(this.host+'/stock/correspondant/list', corps);
  }

  editACorres(code:String, corps:Correspondant){
    return this.httpCli.put<Correspondant>(this.host+'/stock/correspondant/byCodCor/'+code, corps);
  }

  deleteACorres(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/correspondant/byCodCor/'+code);
  }

  //Partie réservée pour EtreAffecter de l'affectation d'un correspondant à un site
  getAllEtreAffecte(){
    return this.httpCli.get<EtreAffecte[]>(this.host+'/commune/Affect/list');
  }

  getAEtreAffecte(code:String){
    return this.httpCli.get<EtreAffecte>(this.host+'/commune/Affect/byId/'+code);
  }

  addAEtreAffecte(corps:EtreAffecte){
    return this.httpCli.post<EtreAffecte>(this.host+'/commune/Affect/list', corps);
  }

  editAEtreAffecte(code:String, corps:EtreAffecte){
    return this.httpCli.put<EtreAffecte>(this.host+'/commune/Affect/byId/'+code, corps);
  }

  deleteAEtreAffecte(code:String){
    return this.httpCli.delete<EtreAffecte>(this.host+'/commune/Affect/byId/'+code);
  }

  //Partie réservée pour Stocker du stockage d'un article dans un magasin
  getAllStocker(){
    return this.httpCli.get<Stocker[]>(this.host+'/stock/stocker/list');
  }

  getAStockerById(code:String){
    return this.httpCli.get<Stocker>(this.host+'/stock/stocker/byCodSto/'+code);
  }

  addAStocker(corps:Stocker){
    return this.httpCli.post<Stocker>(this.host+'/stock/stocker/list', corps);
  }

  editAStocker(code:String, corps:Stocker){
    return this.httpCli.put<Stocker>(this.host+'/stock/stocker/byCodSto/'+code, corps);
  }

  deleteAStocker(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/stocker/byCodSto/'+code);
  }


}
