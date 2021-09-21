import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Occuper } from '../../models/occuper.model';
import { Personne } from '../../models/personne.model';
import { Rapport } from '../../models/rapport.model';
import { Poste } from '../../models/post.model';
import { AssocierUtilisateurService } from './associer-utilisateur.service';
import { Signer } from '../../models/signer.model';

@Injectable({
  providedIn: 'root'
})
export class SignataireService {
  racine='http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1/commune/';

  constructor(public serviceIp: AssocierUtilisateurService, public http: HttpClient) { }

  ///////Poste signataire
  getPostes() {
    return this.http.get<Poste[]>(this.racine + 'post/list');
  }

  getPoste(id: number) {
    return this.http.get<Poste>(this.racine + 'post/byId/'+id);
  }

  editPoste(id: number, cor: Poste) {
    return this.http.put<Poste>(this.racine + 'post/byId/'+id, cor);
  }

  delPoste(id: number) {
    return this.http.delete<boolean>(this.racine + 'post/byId/'+id);
  }

  addPoste(cor: Poste) {
    return this.http.post<Poste>(this.racine + 'post/list', cor);
  }

  ///////la personne du signataire
  getPersonnes() {
    return this.http.get<Personne[]>(this.racine + 'pers/list');
  }

  getPersonne(id: number) {
    return this.http.get<Personne>(this.racine + 'pers/byId/'+id);
  }

  editPersonne(id: number, cor: Personne) {
    return this.http.put<Personne>(this.racine + 'pers/byId/'+id, cor);
  }

  delPersonne(id: number) {
    return this.http.delete<Personne>(this.racine + 'pers/byId/'+id);
  }

  addPersonne(cor: Personne) {
    return this.http.post<Personne>(this.racine + 'pers/list', cor);
  }

  ///////Occupation du poste signataire
  getOccupers() {
    return this.http.get<Occuper[]>(this.racine + 'occ/list');
  }

  getOccupAct() {
    return this.http.get<Occuper[]>(this.racine + 'occ/mtn');
  }

  getOccuper(id: number) {
    return this.http.get<Occuper>(this.racine + 'occ/byId/'+id);
  }

  editOccuper(id: number, cor: Occuper) {
    return this.http.put<Occuper>(this.racine + 'occ/byId/'+id, cor);
  }

  delOccuper(id: number) {
    return this.http.delete<Occuper>(this.racine + 'occ/byId/'+id);
  }

  addOccuper(cor: Occuper) {
    return this.http.post<Occuper>(this.racine + 'occ/list', cor);
  }

  /////// Rapports à signer
  getRapports() {
    return this.http.get<Rapport[]>(this.racine + 'rap/list');
  }

  getRapport(id: number) {
    return this.http.get<Rapport>(this.racine + 'rap/byId/'+id);
  }

  editRapport(id: number, cor: Rapport) {
    return this.http.put<Rapport>(this.racine + 'rap/byId/'+id, cor);
  }

  delRapport(id: number) {
    return this.http.delete<Rapport>(this.racine + 'rap/byId/'+id);
  }

  addRapport(cor: Rapport) {
    return this.http.post<Rapport>(this.racine + 'rap/list', cor);
  }

  /////// Autorisation de signature d'un rapport par un poste
  getSigners() {
    return this.http.get<Signer[]>(this.racine + 'sig/list');
  }

  getSignerActuel() {
    return this.http.get<Signer[]>(this.racine + 'sig/mtn');
  }

  getSigner(id: number) {
    return this.http.get<Signer>(this.racine + 'sig/byId/'+id);
  }

  editSigner(id: number, cor: Signer) {
    return this.http.put<Signer>(this.racine + 'sig/byId/'+id, cor);
  }

  delSigner(id: number) {
    return this.http.delete<Signer>(this.racine + 'sig/byId/'+id);
  }

  addSigner(cor: Signer) {
    return this.http.post<Signer>(this.racine + 'sig/list', cor);
  }

}
