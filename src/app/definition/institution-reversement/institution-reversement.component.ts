import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { data }from 'jquery';
import { InstituReverse } from '../../../models/institution.model';
import { InstitutionReversementService } from '../../../services/definition/institution-reversement.service';
import { Pourcentage } from '../../../models/pourcentage.model';
import { Article } from '../../../models/article.model';
import { ArticleService } from '../../../services/definition/article.service';

@Component({
  selector: 'app-institution-reversement',
  templateUrl: './institution-reversement.component.html',
  styleUrls: ['./institution-reversement.component.css']
})
export class InstitutionReversementComponent implements OnInit {


  ////////////////////// institution
  institutions: InstituReverse[];
  inst=new InstituReverse('','');
  addInstGrou:FormGroup;
  modInstGrou:FormGroup;
  tabInst:DataTables.Settings={};
  dtrigInst:Subject<InstituReverse>=new Subject<InstituReverse>();

  @ViewChild('addInst') public addInst:ModalDirective;
  @ViewChild('modInst') public modInst:ModalDirective;
  @ViewChild('delInst') public delInst:ModalDirective;

  //////////////////////Pourcentage de reversement
  per=new Pourcentage(null,new InstituReverse('',''),new Article('','',null,null,null,null,null,null,null,null));
  pourcentages : Pourcentage[];
  indInst: number;
  indArt: number;
  addPercGrou:FormGroup;
  modPercGrou:FormGroup;
  tabPeRev:DataTables.Settings={};
  dtrigPeRev:Subject<Pourcentage>=new Subject<Pourcentage>();

  @ViewChild('addPerce') public addPerce:ModalDirective;
  @ViewChild('modPerce') public modPerce:ModalDirective;
  @ViewChild('delPerce') public delPerce:ModalDirective;
  articles : Article[];

  constructor(private instServ: InstitutionReversementService, private fbuilder:FormBuilder, private router:Router,
    private serArt : ArticleService) {
    this.initialiseTableau();
  }

  ngOnInit(): void {
    this.serArt.getAllArticle().subscribe(
      data=>{
        this.articles=data;
      }
    );
    this.instServ.getAllInstitutes()
    .subscribe(
      (data) => {
        this.institutions = data;
        this.dtrigInst.next();
        console.log(this.institutions);

      },
      (erreur) => {
        console.log('erreur chargement institution : '+erreur);
      }
    );

    this.instServ.getAllPeRev()
    .subscribe(
      (data) => {
        this.pourcentages = data;
        console.log(this.pourcentages);

        this.dtrigPeRev.next();
      },
      (erreur) => {
        console.log('erreur chargement institution : '+erreur);
      }
    );

    this.addInstGrou=this.fbuilder.group({
      addInstCod:['',Validators.requiredTrue],
      addInstLib:['',Validators.requiredTrue]
    });

    this.modInstGrou=this.fbuilder.group({
      modInstCod:['hhhh',Validators.requiredTrue],
      modInstLib: ['hhhh',Validators.requiredTrue],
    });

    this.addPercGrou=this.fbuilder.group({
      addPerInst:['',Validators.requiredTrue],
      addPerArt:['',Validators.requiredTrue],
      addVal:['',Validators.required]
    });

    this.modPercGrou=this.fbuilder.group({
      modPerInst:[this.indInst,Validators.requiredTrue],
      modPerArt:[this.indArt,Validators.requiredTrue],
      modVal:[this.per.valPourcenRevers,Validators.required]
    });

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

  ////////////////////////Institution de reversement

  ChargerInstitution(){
    this.instServ.getAllInstitutes().subscribe(
      data=>{
        this.institutions=data;
        $('#dtInst').dataTable().api().destroy();
        this.dtrigInst.next();
      },
      err=>{
        console.log('Chargement echouée',err);
      }
    );
  }

  initAddInst(){
    this.addInstGrou.reset();
    this.addInst.show();
  }

  ajouteInst(){
    this.instServ.addAnInstitute(new InstituReverse(this.addInstGrou.value['addInstCod'],
    this.addInstGrou.value['addInstLib'])).subscribe(
      data=>{
        console.log('ajout avec succès');
        this.ChargerInstitution();
      },
      err=>{
        console.log('Nouvelle institution échouée ',err);
      }
    );
    this.addInstGrou.reset();
    this.addInst.hide();
  }

  initDelInst(i : number){
    this.inst = this.institutions[i];
    console.log(i, this.inst);

    this.delInst.show();
  }

  modifieInst(){
    this.instServ.editAnInstitute(this.inst.codeInstRevers,new InstituReverse(this.modInstGrou.value['modInstCod'],
    this.modInstGrou.value['modInstLib'])).subscribe(
      data=>{
        console.log('ajout avec succès');
        this.ChargerInstitution();
      },
      err=>{
        console.log('Nouvelle institution échouée ',err);
      }
    );
    this.modInst.hide();
  }

  initModInst(i : number){
    this.inst=this.institutions[i];
    this.modInst.show();
}

  deleteInst(){
    this.instServ.deleteAnInstitute(this.inst.codeInstRevers).subscribe(
      data=>{
        this.ChargerInstitution();
      },
      err=>{
        console.log('Suppression échouée ', err);
      }
    );
    this.delInst.hide();
  }

/////////Pourcentage de reversement

  initAddPeRev(){
    this.addPercGrou.reset();
    this.addPerce.show();
  }

  ajoutePerce(){
    console.log(this.addPercGrou.value['addVal'],
    this.institutions[this.addPercGrou.value['addPerInst']],this.articles[this.addPercGrou.value['addPerArt']]);

    if(this.addPercGrou.value['addPerInst']>=0 && this.addPercGrou.value['addPerArt']>=0 &&
    this.addPercGrou.value['addVal']>0){
      this.per=new Pourcentage(this.addPercGrou.value['addVal'],
      this.institutions[this.addPercGrou.value['addPerInst']],this.articles[this.addPercGrou.value['addPerArt']]);
      this.instServ.addAPeRev(this.per).subscribe(
        data=>{
          console.log('Ajout réussi');
          this.chargerPourcentatges();
          this.addPerce.hide();
        },
        err=>{
          console.log('Ajout échoué: ', err);

        }
      );
    }
  }

  chargerPourcentatges(){
    this.instServ.getAllPeRev().subscribe(
      data=>{
        this.pourcentages=data;
        $('#dtPeRev').dataTable().api().destroy();
        this.dtrigPeRev.next();
      }
    );
  }

  initModPerev(pr : Pourcentage){
    this.per=pr;
    console.log(this.per,'\nId:'+this.per.idPourcenRevers);

    this.indInst=this.institutions.map(i=>i.codeInstRevers).indexOf(this.per.instituReverse.codeInstRevers);
    this.indArt=this.articles.map(a=>a.codeArticle).indexOf(this.per.article.codeArticle);
    console.log('Indix de l\'innstitution: '+this.indInst,'\nIndix de l\'article: '+this.indArt);

    this.modPerce.show();
  }

  modifiePerce(){
    const np=new Pourcentage(this.modPercGrou.value['modVal'],
    this.institutions[this.modPercGrou.value['modPerInst']],this.articles[this.modPercGrou.value['modPerArt']]);
    console.log('ancien pourcentage', this.per,'\nNouveau: ',np);

    this.instServ.editAPeRev(this.per.idPourcenRevers,np).subscribe(
      data=>{
        console.log('Modification effectuée avec succès');
        this.chargerPourcentatges();
        this.modPerce.hide();
      },
      err=>{
        console.log('La modification a échoué. ', err);
      }
    );
  }

  initDelPeRev(i:number){
    this.per=this.pourcentages[i];
    this.delPerce.show();
  }

  deletePerce(){
    this.instServ.deleteAPeRev(this.per.idPourcenRevers.toString()).subscribe(
      data=>{
        console.log('Suppresion réussie');
        this.chargerPourcentatges();
        this.delPerce.hide();
      },
      err=>{
        console.log('Suppression échouée ', err);

      }
    );
  }

}
