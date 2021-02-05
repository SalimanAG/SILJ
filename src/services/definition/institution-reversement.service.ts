import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { InstituReverse } from '../../models/institution.model';
import { HttpClient } from '@angular/common/http';
import { listenToTriggers } from 'ngx-bootstrap/utils';

@Injectable({
  providedIn: 'root'
})
export class InstitutionReversementService {


  private host:String = 'http://127.0.0.1:8080/perfora-gpc/v1/commune/ins/';

  constructor(private lien:HttpClient) {
    console.log(lien);

    }

    ListerInstitution(){

      return this.lien.get<InstituReverse[]>(this.host+'list');
    }

    ajouteInstitution(instit:InstituReverse){
      return this.lien.get<InstituReverse[]>(this.host+'list');
    }

    ModifieInstitution(){
      return this.lien.get<InstituReverse[]>('127.0.0.1:8080/perfora-gpc/v1/commune/ins/list');
    }

    suppInstitution(){
      return this.lien.get<InstituReverse[]>('127.0.0.1:8080/perfora-gpc/v1/commune/ins/list');
    }
}
