import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncapPlacement } from '../../models/EncapPlacement';
import { LignePlacement } from '../../models/lignePlacement.model';
import { Placement } from '../../models/placement.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class PlacementService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpCli:HttpClient, private serviceIp:AssocierUtilisateurService) { }

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

  //Léonel
  addPlacement(corps:EncapPlacement){
    return this.httpCli.post<EncapPlacement>(this.host+'/stock/placement/list2', corps);
  }

  editAPlacement(code:String, corps:Placement){
    return this.httpCli.put<Placement>(this.host+'/stock/placement/byCodPla/'+code, corps);
  }

  //Léonel 
  editPlacement(code:String, corps:EncapPlacement){
    return this.httpCli.put<EncapPlacement>(this.host+'/stock/placement/update/'+code, corps);
  }

  //Léonel (Annulation d'un Placement)
  annulePlacement(code:String, corps:Placement){
    return this.httpCli.put<Placement>(this.host+'/stock/placement/annulation/'+code, corps);
  }

  deleteAPlacement(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/placement/byCodPla/'+code);
  }
  //Léonel (Delete Placement)
  deletePlacement(code:String){
    return this.httpCli.delete<boolean>(this.host+'/stock/placement/delete/'+code);
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
