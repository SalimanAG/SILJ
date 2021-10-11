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
import { Observable } from 'rxjs';
import { OpPrestBlock } from '../../models/opprestlock.model';
import { OpLocBlock } from '../../models/oployerbloc.model';
import { OpPointBlock } from './oppbloc.model';


import { SearchOpCaisseDTO } from '../../models/searchOpCaisseDTO.model';
import { SearchLinesOpCaissDTO } from '../../models/searchLinesOpCaissDTO.model';

@Injectable({
  providedIn: 'root'
})
export class OperationCaisseService {

  private host: string = 'http://' + this.serviceIp.adresseIp + '/perfora-gpc/v1/';

  constructor(private lien: HttpClient, private serviceIp: AssocierUtilisateurService) {

  }

  getPoitVenteByOp(num: String) {
    return this.lien.get<LignePointVente[]>(this.host+'stock/lignepointvente/byOp/'+num)
  }

  getUserCaisse(id: Number) {
    return this.lien.get<Affecter[]>(this.host + 'facturation/affecter/uc/actu/usId=' + id);
  }

  getAllOp() {
    return this.lien.get<OpCaisse[]>(this.host + 'facturation/opcaisse/list');
  }

  getloptypmod(dDeb: String, dFin: String, typ: String, mod: String): Observable<Object> {
    return this.lien.get<LigneOpCaisse[]>(this.host + 'facturation/opcaisse/byPer/' + typ+'/' +
      mod+'?dDeb=$'+dDeb+'&?dFin=$'+dFin)
  }

  getAOpCaissById(code: String) {
    return this.lien.get<OpCaisse>(this.host + 'facturation/opcaisse/byCodOpCai/' + code);
  }

  getDailyOp(id: Number) {
    return this.lien.get<OpCaisse[]>(this.host + 'facturation/opcaisse/jdh/usId='+id);
  }

  getOpValide() {
    return this.lien.get<OpCaisse[]>(this.host + 'facturation/opcaisse/list/vld');
  }

  getOpAnnulees() {
    return this.lien.get<OpCaisse[]>(this.host + 'facturation/opcaisse/list/anl');
  }

  imputCorres(corps: OpCaisse, points: PointVente[]) {
    return this.lien.post<OpCaisse>(this.host + 'facturation/opcaisse/list', corps);
  }

  addOp(corps: OpCaisse) {
    return this.lien.post<OpCaisse>(this.host + 'facturation/opcaisse/list', corps)
  }

  addVente(corps: OpPrestBlock) {
    return this.lien.post<OpCaisse>(this.host + 'facturation/op/listV', corps)
  }

  addLoyer(corps: OpLocBlock) {
    console.log(corps);

    return this.lien.post<OpCaisse>(this.host + 'facturation/op/listL', corps)
  }

  addImput(corps: OpPointBlock) {
    return this.lien.post<OpCaisse>(this.host + 'facturation/op/listI', corps)
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

  addEcheanceByOp(typ: TypeRecette) {
    return this.lien.post<TypeRecette[]>(this.host + 'facturation/typeRecette/list', typ);
  }

  getEcheanceByOp(num: String) {
    return this.lien.get<Echeance[]>(this.host + 'location/echeance/byOp/'+num);
  }

  getLignePVByOp(numop: String) {
    return this.lien.get<LignePointVente[]>(this.host + 'stock/lignepointvente/byOp/'+numop);
  }

  getAllArticles() {
    return this.lien.get<Article[]>(this.host + 'stock/article/list');
  }

  getAllValideLines() {
    return this.lien.get<LigneOpCaisse[]>(this.host + 'facturation/ligneOpCaisse/list/vld');
  }

  getAllAnnulLines() {
    return this.lien.get<LigneOpCaisse[]>(this.host + 'facturation/ligneOpCaisse/list/anl');
  }

  saveBlock(bloc: OpPrestBlock) {
    return this.lien.post<LigneOpCaisse[]>(this.host + 'facturation/ligneOpCaisse/op', bloc);
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

  getLineByOp(id: String) {
    return this.lien.get<LigneOpCaisse[]>(this.host + 'facturation/ligneOpCaisse/numOp/' + (id));
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

  getAllEcheancesValides() {
    return this.lien.get<Echeance[]>(this.host + 'location/echeance/list/vld');
  }

  getAllEcheancesAnnulees() {
    return this.lien.get<Echeance[]>(this.host + 'location/echeance/list/anl');
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

   //Léonel
   getAllOpCaisseOfDay(searchOpCaisseDTO: SearchOpCaisseDTO){
    return this.lien.post<OpCaisse[]>(this.host + 'facturation/find/date-between',searchOpCaisseDTO);
  }
  getAllLinesOpCaisseByPeriodeAndCaisse(searchLinesOpCaissDTO: SearchLinesOpCaissDTO){
    return this.lien.post<LigneOpCaisse[]>(this.host + 'facturation/find/lines-opcaisse-by-periode-caisse',searchLinesOpCaissDTO);
  }

}
