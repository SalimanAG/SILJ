import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Uniter } from '../../models/uniter.model';
import { Famille } from '../../models/famille.model';
import { Article } from '../../models/article.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) { }

  //Partie réservé pour les Unités
  getAllUniter(){
    return this.httpCli.get<Uniter[]>(this.host+'/stock/uniter/list');

  }

  getUniterById(code:String){
    return this.httpCli.get<Uniter>(this.host+'/stock/uniter/byCodUni/'+code);
  }

  editAUniter(code:String, corps:Uniter){
    return this.httpCli.put<Uniter>(this.host+'/stock/uniter/byCodUni/'+code, corps);
  }

  addAUniter(corps:Uniter){
    return this.httpCli.post<Uniter>(this.host+'/stock/uniter/list', corps);
  }

  deleteAUniter(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/stock/uniter/byCodUni/'+code);
  }

  //Partie réservée pour les familles
  getAllFamille(){
    return this.httpCli.get<Famille[]>(this.host+'/stock/famille/list');
  }

  getFamilleById(code:String){
    return this.httpCli.get<Famille>(this.host+'/stock/famille/byCodFam/'+code);
  }

  addAFamille(corps:Famille){
    return this.httpCli.post<Famille>(this.host+'/stock/famille/list', corps);
  }

  editAFamille(code:String, corps: Famille){
    return this.httpCli.put<Famille>(this.host+'/stock/famille/byCodFam/'+code,corps)
  }

  deleteAFamille(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/stock/famille/byCodFam/'+code);
  }

  //partie Réservée pour les articles
  getAllArticle(){
    return this.httpCli.get<Article[]>(this.host+'/stock/article/list');
  }

  getArticleById(code:String){
    return this.httpCli.get<Article>(this.host+'/stock/article/byCodArt/'+code);
  }

  addArticle(corps: Article){
    return this.httpCli.post<Article>(this.host+'/stock/article/list', corps);
  }

  editArticle(code:String, corps:Article){
    return this.httpCli.put<Article>(this.host+'/stock/article/byCodArt/'+code, corps);
  }

  deleteArticle(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/article/byCodArt/'+code);
  }

}
