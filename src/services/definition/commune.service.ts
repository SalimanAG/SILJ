import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pays } from '../../models/pays.model';
import { Departement } from '../../models/departement.model';
import { Commune } from '../../models/commune.model';
import { Arrondissement } from '../../models/arrondissement.model';
import { Quartier } from '../../models/quartier.model';
import { Service } from '../../models/service.model';
import { SiteMarcher } from '../../models/siteMarcher.model';


@Injectable({
  providedIn: 'root'
})
export class CommuneService {

  private host:String = 'http://localhost:8080/perfora-gpc/v1';

  constructor(private httpClient:HttpClient) { }

  getAllPays(){
    return this.httpClient.get<Pays[]>(this.host+'/commune/pays/list');

  }

  addAPays(corps:Pays){
    return this.httpClient.post<Pays>(this.host+'/commune/pays/list', corps);
  }

  editPays(code:String, corps:Pays){
    return this.httpClient.put<Pays>(this.host+'/commune/pays/byCodPay/'+code, corps);
  }

  deletePays(code:String){
    return this.httpClient.delete<Boolean>(this.host+'/commune/pays/byCodPay/'+code);
  }

  //departement
  getAllDepartement(){
    return this.httpClient.get<Departement[]>(this.host+'/commune/departement/list');
  }

  addDepartement(corps:Departement){
    return this.httpClient.post<Departement>(this.host+'/commune/departement/list', corps);
  }

  editDepartement(code:String, corps:Departement){
    return this.httpClient.put<Departement>(this.host+'/commune/departement/byCodDep/'+code, corps);
  }

  deleteDepartement(code:String){
    return this.httpClient.delete<boolean>(this.host+'/commune/departement/byCodDep/'+code);
  }

  // commune
  getAllCommune(){
    return this.httpClient.get<Commune[]>(this.host+'/commune/commune/list');
  }

  addCommune(corps:Commune){
    return this.httpClient.post<Commune>(this.host+'/commune/commune/list', corps);
  }

  editCommune(code:String, corps:Commune){
    return this.httpClient.put<Commune>(this.host+'/commune/commune/byCodCom/'+code, corps);
  }

  deleteCommune(code:String){
    return this.httpClient.delete<boolean>(this.host+'/commune/commune/byCodCom/'+code);
  }

  // arrondissement
  getAllArrondissement(){
    return this.httpClient.get<Arrondissement[]>(this.host+'/commune/arrondissement/list');
  }

  addArrondissement(corps:Arrondissement){
    return this.httpClient.post<Arrondissement>(this.host+'/commune/arrondissement/list', corps);
  }

  editArrondissement(code:String, corps:Arrondissement){
    return this.httpClient.put<Arrondissement>(this.host+'/commune/arrondissement/byCodArr/'+code, corps);
  }

  deleteArrondissement(code:String){
    return this.httpClient.delete<boolean>(this.host+'/commune/arrondissement/byCodArr/'+code);
  }

  // quartier
  getAllQuartier(){
    return this.httpClient.get<Quartier[]>(this.host+'/commune/quartier/list');
  }

  addQuartier(corps:Quartier){
    return this.httpClient.post<Quartier>(this.host+'/commune/quartier/list', corps);
  }

  editQuartier(code:String, corps:Quartier){
    return this.httpClient.put<Quartier>(this.host+'/commune/quartier/byCodQua/'+code, corps);
  }

  deleteQuartier(code:String){
    return this.httpClient.delete<boolean>(this.host+'/commune/quartier/byCodQua/'+code);
  }

  // Service
  getAllService(){
    return this.httpClient.get<Service[]>(this.host+'/commune/service/list');
  }

  addService(corps:Service){
    return this.httpClient.post<Service>(this.host+'/commune/service/list', corps);
  }

  editService(code:String, corps:Service){
    return this.httpClient.put<Service>(this.host+'/commune/service/byCodSev/'+code, corps);
  }

  deleteService(code:String){
    return this.httpClient.delete<boolean>(this.host+'/commune/service/byCodSev/'+code);
  }

  // Site marcher
  getAllSiteMarcher(){
    return this.httpClient.get<SiteMarcher[]>(this.host+'/commune/site/list');
  }

  addSiteMarcher(corps:SiteMarcher){
    return this.httpClient.post<SiteMarcher>(this.host+'/commune/site/list', corps);
  }

  editSiteMarcher(code:String, corps:SiteMarcher){
    return this.httpClient.put<SiteMarcher>(this.host+'/commune/site/byCodSit/'+code, corps);
  }

  deleteSiteMarcher(code:String){
    return this.httpClient.delete<boolean>(this.host+'/commune/site/byCodSit/'+code);
  }
}
