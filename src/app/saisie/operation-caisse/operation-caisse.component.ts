import {Component, ViewChild, OnInit, ElementRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { from, Subject } from 'rxjs';
import { Article } from '../../../models/article.model';
import { Caisse } from '../../../models/caisse.model';
import { OpCaisse } from '../../../models/OpeCaisse.model';
import { OperationCaisseService } from '../../../services/saisie/operation-caisse.service';
import { TypeRecette } from '../../../models/type.model';
import { ModePaiement } from '../../../models/mode.model';
import { LigneOpCaisse } from '../../../models/ligneopcaisse.model';
import { Exercice } from '../../../models/exercice.model';
import { Utilisateur } from '../../../models/utilisateur.model';
import { InstituReverse }from '../../../models/institution.model';
import { exit } from 'process';
import { Locataire } from '../../../models/locataire.model';

@Component({
  selector: 'app-operation-caisse',
  templateUrl: './operation-caisse.component.html',
  styleUrls: ['./operation-caisse.component.css']
})
export class OperationCaisseComponent implements OnInit {

  //cocheArt:boolean=false;
  @ViewChild('addVente') public addVente:ModalDirective;
  @ViewChild('addArticle') public addArticle:ModalDirective;
  @ViewChild('addLoyer') public addLoyer:ModalDirective;
  dtListOpeCa: DataTables.Settings = {};
  dtrigOpeCa: Subject<any> = new Subject<any>();
  listOp:OpCaisse[];

  dtArticleV: DataTables.Settings = {};
  dtArtV: Subject<any> = new Subject<any>();
  addVentGroup:FormGroup;
  line:OpCaisse[];

  dtListArt: DataTables.Settings = {};
  dtrigAddArt: Subject<any> = new Subject<any>();
  addArtGroup:FormGroup;
  Articles:Article[];



  caisses : Caisse[];
  opTypes : TypeRecette[];
  modes : ModePaiement[];
  exercices : Exercice[];
  exo:Exercice;
  users : Utilisateur[];
  operateur:Utilisateur;
  institutions : InstituReverse[];

  locataires:Locataire[];
  tabLocataire:DataTables.Settings={};
  dtLocataite: Subject<any>=new Subject<any>();

  totalVente:number;
  venteTmp:number;
  tligne:number;

  /*echeance:Ech[];
  ListLocataire:DataTables.Settings={};
  dtLocataite: Subject<any>=new Subject<any>();*/

  tempLigneOpCais:LigneOpCaisse[]=[];
  tmpOpC:OpCaisse;

  constructor( private servOp:OperationCaisseService, private fbuilder:FormBuilder, private router:Router) {

    this.dtListArt = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: "Affichage de _MENU_ lignes par page",
        zeroRecords: "Aucune ligne trouvée - Desolé",
        info: "Affichage de la page _PAGE_ sur _PAGES_",
        infoEmpty: "Pas de ligne trouvée",
        infoFiltered: "(Filtré à partie de _MAX_ lignes)",
        search: "Rechercher",
        loadingRecords: "Chargement en cours...",
        paginate:{
          first:"Début",
          last: "Fin",
          next: "Suivant",
          previous: "Précédent"
        }
      }
    };


    this.tabLocataire = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: "Affichage de _MENU_ lignes par page",
        zeroRecords: "Aucune ligne trouvée - Desolé",
        info: "Affichage de la page _PAGE_ sur _PAGES_",
        infoEmpty: "Pas de ligne trouvée",
        infoFiltered: "(Filtré à partie de _MAX_ lignes)",
        search: "Rechercher",
        loadingRecords: "Chargement en cours...",
        paginate:{
          first:"Début",
          last: "Fin",
          next: "Suivant",
          previous: "Précédent"
        }
      }
    };
  }

  chargerLigneDuneOpCaisse(opcai:OpCaisse){
    this.servOp.getOpLinesByOpCais(opcai);
  }

  initialiseAccueilVente(){
    this.addVentGroup=this.fbuilder.group ({
      nVentNum:new FormControl(),
      nVentDat:new FormControl(),
      nVentCont:new FormControl(),
      nVentObs:new FormControl(),
      nVentCais:new FormControl(),
      nVentTyp:new FormControl(),
      nVentMod:new FormControl(),
      nTotalV:new FormControl(),
      nVentLigne:new FormControl()
    });

  }

  InitialiseNouvelleVente(){
    this.totalVente=0;
    this.venteTmp=0;
    this.addVente.show();
    this.tmpOpC=new OpCaisse(new Date().getUTCFullYear+'-000001',new Date(),'Divers',true,'',new Date(),
    this.caisses[this.addVentGroup.value['nVentCais']],this.opTypes[this.addVentGroup.value['nVentTyp']],
    this.modes[this.addVentGroup.value['nVentMod']],this.exercices[0],this.users[0]);
  }

  chargerOperations(){
    this.servOp.getAllOp()
    .subscribe(
      (data) => {
        this.listOp = data;
        this.dtrigOpeCa.next();
        console.log('Opérations: ',this.listOp);

      },
      (erreur) => {
        console.log('Opération : '+erreur);
      }
    );
  }

  ChargerAccessoires(){
    this.servOp.getAllCaisses()
    .subscribe(
      (data)=>{
        this.caisses=data;
        console.log('Caisse',this.caisses);
      },
      (err)=>{
        console.log('Caisses:', err)
      }
    );

    this.servOp.getAllModes()
    .subscribe(
      (data)=>{
        this.modes=data;
        console.log('Mode; ', this.modes);
      },
      (err)=>{
        console.log('Modes: ', err);
      }
    );

    this.servOp.getAllExos()
    .subscribe(
      (data)=>{
        this.exercices=data;
        console.log('exos: ', this.exercices);
      },
      (err)=>{
        console.log('Exo: ', err);
      }
    );

    this.servOp.getAllUsers()
    .subscribe(
      (data)=>{
        this.users=data;
        console.log('User; ', this.users);
      },
      (err)=>{
        console.log('User erreur: ', err);
      }
    );

    this.servOp.getAllTypes()
    .subscribe(
      (data)=>{
        this.opTypes=data;
        console.log('Types; ', this.opTypes);
      },
      (err)=>{
        console.log('types erreur: ', err);
      }
    );

}

chargerLocataire(){
  this.servOp.getAllLocataires()
    .subscribe(
      (data)=>{
        this.locataires=data;
        console.log('Locataires; ', this.opTypes);
      },
      (err)=>{
        console.log('Locataire erreur: ', err);
      }
    );
}

ngOnInit(){
  this.ChargerAccessoires();
  this.initialiseAccueilVente();
  this.chargerOperations();
}

  ouvreAddArt(){
    this.addArticle.show();

    this.servOp.getAllArticles()
    .subscribe(
      (data) => {
        this.Articles = data;
        this.dtrigAddArt.next();
      },
      (erreur) => {
        console.log('Erreur : '+erreur);
      }
    );

  }

  supTempLigneOpCais(i:number){

    this.tempLigneOpCais.splice(i,1);
  }

  choisirArticle(i: number){

    console.log(i);
    const artChoisi=this.Articles[i];
    let trver = false;
    this.tempLigneOpCais.forEach(element => {
      if(element.article.codeArticle===artChoisi.codeArticle){
        trver = true;
        exit;
      }
    });

    const tmpOpc=new OpCaisse(this.addVentGroup.value['nVenNum'],this.addVentGroup.value['nVentDate'],
    this.addVentGroup.value['nVent'],true, this.addVentGroup.value['nVentObs'],
    new Date(),this.addVentGroup.value['nVentCais'],this.addVentGroup.value['nVentTyp'],
    this.modes[this.addVentGroup.value['nVentMod']],this.exercices[0],this.users[0]);
    if(trver===false) this.tempLigneOpCais.push(new LigneOpCaisse(0,artChoisi.prixVenteArticle,'',this.tmpOpC,artChoisi));
    console.log(this.tempLigneOpCais);


  }

  AjouteVente(){
    this.exo=this.exercices[0];
    this.operateur=this.users[0];
    console.log(this.exo, this.operateur);
    const newOC=new OpCaisse(this.addVentGroup.value['nVentNum'], this.addVentGroup.value['nVentDat'],
    this.addVentGroup.value['nVentCont'],true,this.addVentGroup.value['nVentObs'], new Date(),
    this.caisses[this.addVentGroup.value['nVentCais']], this.opTypes[this.addVentGroup.value['nVentTyp']],
    this.modes[this.addVentGroup.value['nVentMod']],this.exercices[0],this.users[0]);
    console.log('Exoa', newOC.exercice);
    console.log('usera', newOC.utilisateur);
    this.servOp.ajouteOp(newOC)
    .subscribe(
      (data)=>{
        this.tempLigneOpCais.forEach(element => {

        });
      }
    );
  }

    /*console.log(this.addVentGroup.value['nVentNum'], this.addVentGroup.value['nVentDat'],
    this.addVentGroup.value['nVentCont'], true, this.addVentGroup.value['nVentObs'], new Date(),
    this.caisses[this.addVentGroup.value['nVentCais']], this.opTypes[this.addVentGroup.value['nVentTyp']],
    this.modes[this.addVentGroup.value['nVentMod']],this.exercices[0],this.users[0]);*/

    /*this.exo=this.exercices[0];
    this.operateur=this.users[0];
    console.log(this.exo, this.operateur);

    const newOC=new OpCaisse(this.addVentGroup.value['nVentNum'], this.addVentGroup.value['nVentDat'],
    this.addVentGroup.value['nVentCont'],true,this.addVentGroup.value['nVentObs'], new Date(),
    this.caisses[this.addVentGroup.value['nVentCais']], this.opTypes[this.addVentGroup.value['nVentTyp']],
    this.modes[this.addVentGroup.value['nVentMod']],this.exercices[0],this.users[0]);
    console.log('Exoa', newOC.exercice);
    console.log('usera', newOC.utilisateur);

    this.servOp.ajouteOp(newOC)
    .subscribe(
      (data) => {
        this.tempLigneOpCais.forEach(element => {this.servOp.addOpLine(
          new LigneOpCaisse(element.qteLigneOpCaisse, element.prixLigneOpCaisse, element.commentaireLigneOpCaisse,
            data,element.article)).subscribe(
              data2=>{
              },
              erreur2=>{
                console.log("Erreur 2"+erreur2);
              }
            );
        this.chargerOperations();
      },
      (erreur) => {
        console.log('op : ',erreur);
      }
    );
      }
    }


    /*const operation=new OpCaisse(this.addVentGroup.value['nVentNum'], this.addVentGroup.value['nVentDat'],
    this.addVentGroup.value['nVentCont'], true, this.addVentGroup.value['nVentObs'], new Date(),
    this.caisses[this.addVentGroup.value['nVentCais']], this.opTypes[this.addVentGroup.value['nVentTyp']],
    this.modes[this.addVentGroup.value['nVentMod']],this.exercices[0],this.users[0]);
    console.log('Exercice concerné: ', operation.utilisateur);


    this.servOp.ajouteOp(operation)
    .subscribe(
      (data) => {
        this.tempLigneOpCais.forEach(element => {this.servOp.addOpLine(
          new LigneOpCaisse(element.qteLigneOpCaisse, element.prixLigneOpCaisse, element.commentaireLigneOpCaisse,
            data,element.article)).subscribe(
              data2=>{
              },
              erreur2=>{
                console.log("Erreur 2"+erreur2);
              }
            );

        });
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );*/

  recupererTotalVente(){
    this.totalVente-=this.addVentGroup.value['nVentLigne'];
    console.log(this.totalVente);

  }

  recalculerTotalvente(){
    this.totalVente+=this.addVentGroup.value['nVentLigne'];
    this.addVentGroup.value['nTotalV']=this.totalVente;
  }

  initialiseNouveauLoyer(){
    this.chargerLocataire();
    this.addLoyer.show();
  }
}
