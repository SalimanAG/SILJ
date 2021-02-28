import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LignePlacement } from '../../models/lignePlacement.model';
import { Placement } from '../../models/placement.model';

@Injectable({
  providedIn: 'root'
})
export class PlacementService {

  private host:String = 'http://127.0.0.1:8080/perfora-gpc/v1';

  constructor(private httpCli:HttpClient) { }

  //partie réservée pour placement
  getAllPlacement(){
    return this.httpCli.get<Placement[]>(this.host+'/stock/placement/list');
  }

  getAPlacementById(code:String){
    return this.httpCli.get<Placement>(this.host+'/stock/placement/byCodPla/'+code);
  }

  addAPlacement(corps:Placement){
    return this.httpCli.post<Placement>(this.host+'/stock/placement/list', corps);
  }

  editAPlacement(code:String, corps:Placement){
    return this.httpCli.put<Placement>(this.host+'/stock/placement/byCodPla/'+code, corps);
  }

  deleteAPlacement(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/placement/byCodPla/'+code);
  }


  //Partie réservée pour lignePlacement
  getAllLignePlacement(){
    return this.httpCli.get<LignePlacement[]>(this.host+'/stock/lignePla/list');
  }

  getALignePlacementById(code:String){
    return this.httpCli.get<LignePlacement>(this.host+'/stock/lignePla/byCodLigPla/'+code);
  }

  addALignePlacement(corps:LignePlacement){
    return this.httpCli.post<LignePlacement>(this.host+'/stock/lignePla/list', corps);
  }

  editALignePlacement(code:String, corps:LignePlacement){
    return this.httpCli.put<LignePlacement>(this.host+'/stock/lignePla/byCodLigPla/'+code, corps);
  }

  deleteALignePlacement(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/lignePla/byCodLiPla/'+code);
  }


}
