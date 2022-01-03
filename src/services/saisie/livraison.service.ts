import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LigneOpCaisse } from '../../models/ligneopcaisse.model';
import { Magasin } from '../../models/magasin.model';
import { AssocierUtilisateurService } from '../administration/associer-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {

  private host:String = 'http://'+this.serviceIp.adresseIp+'/perfora-gpc/v1';

  constructor(private httpcli:HttpClient, private serviceIp:AssocierUtilisateurService) { }

  validerLivraison(idLigne: number, idUser: Number){
    return this.httpcli.get<LigneOpCaisse[]>(this.host+'/facturation/ligneOpCaisse/livraison/'+idLigne+'/'+idUser);
  }

  //Magasin By userId
  magasinByUserId(idUser: Number){
    return this.httpcli.get<Magasin>(this.host+'/facturation/magasin/'+idUser);
  }
}
