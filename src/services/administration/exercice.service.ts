import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exercice } from '../../models/exercice.model';
import { AssocierUtilisateurService } from './associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {

  public exoSelectionner:Exercice = new Exercice('', '', new Date(), new Date(), '', false);
  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) {
    this.getAllExo().subscribe(
      (data) => {
        this.exoSelectionner = data[data.length - 1];
        console.log(this.exoSelectionner);

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des exos', erreur);
      }
    );
  }

  getAllExo(){
    return this.httpCli.get<Exercice[]>(this.host+'/commune/exercice/list');
  }

  getAExoById(code:String){
    return this.httpCli.get<Exercice>(this.host+'/commune/exercice/byCodExe/'+code);
  }

  addAExo(corps:Exercice){
    return this.httpCli.post<Exercice>(this.host+'/commune/exercice/list', corps);
  }

  editAExo(code:String, corps:Exercice){
    return this.httpCli.put<Exercice>(this.host+'/commune/exercice/byCodExe/'+code, corps);
  }

  deleteAExo(code:String){
    return this.httpCli.delete<Boolean>(this.host+'/commune/exercice/byCodExe/'+code);
  }

}
