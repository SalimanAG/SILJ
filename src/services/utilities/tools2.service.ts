import { Injectable } from '@angular/core';
import { Occuper } from '../../models/occuper.model';
import { Personne } from '../../models/personne.model';
import { Poste } from '../../models/post.model';
import { Signer } from '../../models/signer.model';
import { SignataireService } from '../administration/signataire-service.service';

@Injectable({
  providedIn: 'root'
})
export class Tools2Service {

  public static typePeriodes = [
    {code: '1', name: 'jour'},
    {code: '2', name: 'semaine'},
    {code: '3', name: 'mois'},
    {code: '4', name: 'année'}
  ];

  constructor() { }

  

  public static getSignatairesOfAdocAtAmoment(codeRapport:String, dateSig:Date, listOccuper:Occuper[], listSigner:Signer[]):Array<Occuper>{
    let liste:Occuper[] = [];
    let selectedPoste:Poste[] = [];

    for (const sign of listSigner) {
      if(sign.rapport.codRap == codeRapport && sign.datDeb.valueOf() <= dateSig.valueOf() && sign.datFin.valueOf() >= dateSig.valueOf()){
        selectedPoste.push(sign.poste);
        
      }
    }

    for (const post of selectedPoste) {
      
      listOccuper.forEach(element => {
        if(element.post.idPost == post.idPost && element.datDeb.valueOf() <= dateSig.valueOf() && element.datFin.valueOf() >= dateSig.valueOf()){
          liste.push(element);
        }
      });

    }

    return liste;
  }


}
