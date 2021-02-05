import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { data }from 'jquery';
import { InstituReverse } from '../../../models/institution.model';
import { InstitutionReversementService } from '../../../services/definition/institution-reversement.service';

@Component({
  selector: 'app-institution-reversement',
  templateUrl: './institution-reversement.component.html',
  styleUrls: ['./institution-reversement.component.css']
})
export class InstitutionReversementComponent implements OnInit {

  ins:String;
  perce:Number;
  addInstRevForm:FormGroup;
  modInstRevForm:FormGroup;
  addPourcenForm:FormGroup;
  modPourcenForm:FormGroup;
  tabInst:DataTables.Settings={};
  dtrigInst:Subject<any>=new Subject<any>();
  tabPeRev:DataTables.Settings={};
  dtrigPeRev:Subject<any>=new Subject<any>();

  addInstGroup:FormGroup;

  @ViewChild('addInst') public addInst:ModalDirective;
  @ViewChild('modInst') public modInst:ModalDirective;
  @ViewChild('addPerce') public addPerce:ModalDirective;
  @ViewChild('modPerce') public modPerce:ModalDirective;
  @ViewChild('delInst') public delInst:ModalDirective;
  @ViewChild('delPerce') public delPerce:ModalDirective;

  acodInst:String;
  addInstGrou:FormGroup;
  modInstGrou:FormGroup;
  addPercGrou:FormGroup;
  modPercGrou:FormGroup;

  institutions: InstituReverse[];
  add: InstituReverse = new InstituReverse('', '');
  editeArti: InstituReverse = new InstituReverse('', '');

  constructor(private instServ: InstitutionReversementService, private fbuilder:FormBuilder, private router:Router) {
    this.initialiseTableau();
    this.initialiseFenetre();
  }

  initialiseTableau(){
    this.tabInst = {
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

    this.tabPeRev = {
      columnDefs:[
        {
          "targets":[1],
          visible:false
        }],


      /*"columnDefs": [
        {
            "targets": [ 1 ],
            "visible": false
            //data:Number,
            //orderable:true
        },
        {
            "targets": [ 4 ],
            "visible": false
            //data:Number,
            //orderable:true
        },
        {
            "targets": [ 2 ],
            "visible": false
        }
    ],*/


      responsive:true,
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

  initialiseFenetre(){
    this.addInstGrou=this.fbuilder.group({
      addInstCod:['',Validators.required],
      addInstLib:['',Validators.required]
    });

    this.modInstGrou=this.fbuilder.group({
      modInstCod:['',Validators.required],
      modInstLib:['',Validators.required]
    });

    this.addPercGrou=this.fbuilder.group({
      addPInsCod:['',Validators.required],
      addPInsLib:[''],
      addPArtCod:['',Validators.required],
      addPArtLib:[''],
      addVal:['',Validators.required]
    });

    this.modPercGrou=this.fbuilder.group({
      modPInsCod:['',Validators.required],
      modPInsLib:[''],
      modPArtCod:['',Validators.required],
      modPArtLib:[''],
      modVal:['',Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('AAA');
    this.instServ.ListerInstitution()
    .subscribe(
      (data) => {
        this.institutions = data;
        this.dtrigInst.next();
      },
      (erreur) => {
        console.log('uuuuuuu : '+erreur);
      }
    );
  }

  ajouteInst(){
    console.log('Créer ('+this.addInstGrou.value['addInstCod']+';'+
    this.addInstGrou.value['addInstLib']+')');
  }

  initmodInst(ainst:String){
    this.modInst.show();
    this.acodInst=ainst
    console.log(this.acodInst);
  }

  modifieInst(){
    console.log('Modification de '+this.acodInst+' en ('+this.modInstGrou.value['modInstCod']+';'+
    this.modInstGrou.value['modInstLib']+')');
    this.acodInst=null;
    this.modInst.hide();
  }

  initdelInst(ainst:String){
    this.acodInst=ainst
    this.delInst.show();
  }

  deleteInst(){
    console.log('Suppression de '+this.addInst);
  }

/////////Pourcentage de reversement
  ajoutePerce(){
    console.log('Créer ('+this.addInstGrou.value['addInstCod']+'; '+this.addInstGroup.value['addInstLib']);
  }

  initmodPerce(ainst:String){
    this.acodInst=ainst
  }

  modifiePerce(){
    console.log('Modification de '+this.acodInst+' en ('+this.modInstGrou.value['modInstCod']+';'+
    this.modInstGrou.value['modInstLib']+')');
    this.acodInst=null;
  }

  initdelPerce(ainst:String){
    this.acodInst=ainst
    this.delInst.show();
  }

  deletePerce(){
    console.log('Suppression de '+this.addInst);
  }
}
