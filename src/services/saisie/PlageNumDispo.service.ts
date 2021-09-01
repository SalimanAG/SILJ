import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlageNumArticle } from '../../models/plageNumArticle.model';
import { PlageNumDispo } from '../../models/PlageNumDispo';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class PlageNumDispoService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1/stock/';

  constructor(public serviceIp : AssocierUtilisateurService, 
    public http : HttpClient) {

   }

   getAllPND(){
    return this.http.get<PlageNumDispo[]>(this.host+"plageNumDispo/list");
  }

  getAPND(cod : String){
    return this.http.get<PlageNumDispo[]>(this.host+"plageNumDispo/byCodPlaNumDis/"+cod);
  }

  addPND(corps : PlageNumDispo){
    return this.http.post<PlageNumDispo>(this.host+"plageNumDispo/list", corps);
  }

  editPND(cod: String, corps : PlageNumDispo){
    return this.http.put<PlageNumDispo>(this.host+"plageNumDispo/byCodPlaNumDis/"+cod, corps);
  }

  deletePND( cod : String){
    return this.http.delete<PlageNumDispo>(this.host+"plageNumDispo/byCodPlaNumDis/"+cod);
  }


  getAllPNA(){
    return this.http.get<PlageNumArticle[]>(this.host+"plageNumArticle/list");
  }

  getAPNA(cod : String){
    return this.http.get<PlageNumArticle[]>(this.host+"plageNumArticle/byCodPlaNumDis/"+cod);
  }

  addPNA(corps : PlageNumArticle){
    return this.http.post<PlageNumArticle>(this.host+"plageNumArticle/list", corps);
  }

  editPNA(cod: String, corps : PlageNumArticle){
    return this.http.put<PlageNumArticle>(this.host+"plageNumArticle/byCodPlaNumDis/"+cod, corps);
  }

  deletePNA( cod : String){
    return this.http.delete<PlageNumArticle>(this.host+"plageNumArticle/byCodPlaNumDis/"+cod);
  }

}
