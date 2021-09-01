import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneOpCaisse } from '../../models/ligneopcaisse.model';
import { OpCaisse } from '../../models/OpeCaisse.model';
import { ModePaiement } from '../../models/mode.model';
import { TypeRecette } from '../../models/type.model';
import { Caisse } from '../../models/caisse.model';
import { Utilisateur } from '../../models/utilisateur.model';
import { Exercice } from '../../models/exercice.model';
import { Article } from '../../models/article.model';
import { Locataire } from '../../models/locataire.model';
import { Contrat } from '../../models/contrat.model';
import { Immeuble } from '../../models/immeuble.model';
import { Echeance } from '../../models/echeance.model';
import { PrixImmeuble } from '../../models/prixImmeuble.model';
import { Correspondant } from '../../models/Correspondant.model';
import { PointVente } from '../../models/pointVente.model';
import { LignePointVente } from '../../models/lignePointVente.model';
import { Gerer } from '../../models/gerer.model';
import { Affecter } from '../../models/affecter.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class OperationCaisseService {

  private host: string = 'http://' + this.serviceIp.adresseIp + '/perfora-gpc/v1/';

  constructor(private lien: HttpClient, private serviceIp: AssocierUtilisateurService) {

  }

  getAllOp() {
    return this.lien.get<OpCaisse[]>(this.host + 'facturation/opcaisse/list');
  }

  getAOpCaissById(code: String) {
    return this.lien.get<OpCaisse>(this.host + 'facturation/opcaisse/byCodOpCai/' + code);
  }

  addOp(corps: OpCaisse) {
    return this.lien.post<OpCaisse>(this.host + 'facturation/opcaisse/list', corps);
  }

  editAOpCaiss(code: String, corps: OpCaisse) {
    return this.lien.put<OpCaisse>(this.host + 'facturation/opcaisse/byCodOpCai/' + code, corps);
  }

  deleteAOpCaiss(code: String) {
    return this.lien.delete<boolean>(this.host + 'facturation/opcaisse/byCodOpCai/' + code);
  }

  getAllModes() {
    return this.lien.get<ModePaiement[]>(this.host + 'facturation/modePaiement/list');
  }

  addAMode(mod: ModePaiement) {
    return this.lien.post<ModePaiement[]>(this.host + 'facturation/modePaiement/list', mod);
  }

  editAMode(id: String, corp: ModePaiement) {
    return this.lien.put<ModePaiement>(this.host + 'facturation/modePaiement/byCodModPai/' + id, corp);
  }

  deleteAMode(id: String) {
    return this.lien.delete<boolean>(this.host + 'facturation/modePaiement/byCodModPai/' + id);
  }

  getAllAffectations() {
    return this.lien.get<Affecter[]>(this.host + 'facturation/affecter/list');
  }

  getAllCaisses() {
    return this.lien.get<Affecter[]>(this.host + 'facturation/caisse/list');
  }

  getAllTypes() {
    return this.lien.get<TypeRecette[]>(this.host + 'facturation/typeRecette/list');
  }

  addATypes(typ: TypeRecette) {
    return this.lien.post<TypeRecette[]>(this.host + 'facturation/typeRecette/list', typ);
  }
/*
  getAllUsers() {
    return this.lien.get<Utilisateur[]>(this.host + 'commune/user/list');
  }

  getAllExos() {
    return this.lien.get<Exercice[]>(this.host + 'commune/exercice/list');
  }
*/
  getAllArticles() {
    return this.lien.get<Article[]>(this.host + 'stock/article/list');
  }

  getAllOpLines() {
    return this.lien.get<LigneOpCaisse[]>(this.host + 'facturation/ligneOpCaisse/list');
  }

  addOpLine(op: OpCaisse, corps: LigneOpCaisse) {
    return this.lien.post<LigneOpCaisse>(this.host + 'facturation/ligneOpCaisse/byNumOp/' + op.numOpCaisse, corps);
  }

  editOpLine(id: number, corps: LigneOpCaisse) {
    return this.lien.put<LigneOpCaisse>(this.host + 'facturation/ligneOpCaisse/byCodLigOpCai/' + (id), corps);
  }

  getOpLineById(id: number) {
    return this.lien.get<LigneOpCaisse>(this.host + 'facturation/ligneOpCaisse/byCodLigOpCai/' + (id));
  }

  deleteAOpLine(id: number) {
    return this.lien.delete<LigneOpCaisse>(this.host + 'facturation/ligneOpCaisse/byCodLigOpCai/' + (id));
  }

  getAllLocataires() {
    return this.lien.get<Locataire[]>(this.host + 'location/locataire/list');
  }

  getAllContrats() {
    return this.lien.get<Contrat[]>(this.host + 'location/contrat/list');
  }

  getAllEcheances() {
    return this.lien.get<Echeance[]>(this.host + 'location/echeance/list');
  }

  addEcheance(e: Echeance) {
    console.log(this.host + 'location/echeance/list');
    return this.lien.post<Echeance>(this.host + 'location/echeance/list', e);
  }

  editEcheance(id: number, e: Echeance) {
    return this.lien.put<Echeance>(this.host + 'location/echeance/byCodEch/' + id, e);
  }

  delEcheance(id: number) {
    return this.lien.delete<Echeance>(this.host + 'location/echeance/byCodEch/' + id);
  }

  getAllImmeubles() {
    return this.lien.get<Immeuble[]>(this.host + 'location/immeuble/list');
  }

  getContratByLocataire(id: number) {
    return this.lien.get<Contrat[]>(this.host + 'location/contrat/byIdLoc/' + (id));
  }

  getAllPrixImmeuble() {
    return this.lien.get<PrixImmeuble[]>(this.host + 'location/priximmeuble/list');
  }

  getCorres() {
    return this.lien.get<Correspondant[]>(this.host + '/stock/correspondant/list');
  }

  getAllCor() {
    return this.lien.get<Correspondant[]>(this.host + 'stock/correspondant/list');
  }

  getAllPV() {
    return this.lien.get<PointVente[]>(this.host + 'stock/pointvente/list');
  }

  getAllLPV() {
    return this.lien.get<LignePointVente[]>(this.host + 'stock/lignepointvente/list');
  }

}
