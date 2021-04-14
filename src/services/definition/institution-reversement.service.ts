import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { InstituReverse } from '../../models/institution.model';
import { HttpClient } from '@angular/common/http';
import { listenToTriggers } from 'ngx-bootstrap/utils';
import { Pourcentage } from '../../models/pourcentage.model';

@Injectable({
  providedIn: 'root'
})
export class InstitutionReversementService {


  private host:String = 'http://127.0.0.1:8080/perfora-gpc/v1';

  constructor(private lien:HttpClient) {
    }
    getAllInstitutes(){
      return this.lien.get<InstituReverse[]>(this.host+'/commune/ins/list');
    }

    getInstitueById(code:String){
      return this.lien.get<InstituReverse[]>(this.host+'/commune/ins/byCodIns'+code);
    }

    addAnInstitute(corps:InstituReverse){
      return this.lien.post<InstituReverse>(this.host+'/commune/ins/list', corps);
    }

    editAnInstitute(code:String, corps:InstituReverse){
      return this.lien.put<InstituReverse>(this.host+'/commune/ins/byCodIns/'+code, corps);
    }

    deleteAnInstitute(code:String){
      return this.lien.delete<Boolean>(this.host+'/commune/ins/byCodIns/'+code);
    }

    getAllPeRev(){
      return this.lien.get<Pourcentage[]>(this.host+'/commune/pourcentage/list');
    }

    getPeRevById(code:String){
      return this.lien.get<Pourcentage[]>(this.host+'/commune/pourcentage/byId'+code);
    }

    addAPeRev(corps:Pourcentage){
      return this.lien.post<Pourcentage>(this.host+'/commune/pourcentage/list', corps);
    }

    editAPeRev(code:number, corps:Pourcentage){
      console.log(code, corps);
      corps.idPourcenRevers=code;
      return this.lien.put<Pourcentage>(this.host+'/commune/pourcentage/byId/'+code, corps);
      //return this.lien.put<Pourcentage>(this.host+'/commune/pourcentage/byId/'+code, corps);
    }

    deleteAPeRev(code:String){
      return this.lien.delete<Boolean>(this.host+'/commune/pourcentage/byId/'+code);
    }
}
