import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpCaisse } from '../../models/OpeCaisse.model';

@Injectable({
  providedIn: 'root'
})
export class OperationCaisseService {

  private host:string='127.0.0.1:8080/perfora-gpc/v1/facturation/'

  constructor(private lien:HttpClient) {

  }

  getAllOp(){
    return this.lien.get<OpCaisse[]>(this.host+'opcaisse/list');
  }

  ajouteOp(corps:OpCaisse){
    return this.lien.post<OpCaisse[]>(this.host+'',corps);
  }

}
