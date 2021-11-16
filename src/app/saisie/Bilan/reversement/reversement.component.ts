import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { Article } from '../../../../models/article.model';
import { PointVente } from '../../../../models/pointVente.model';
import { Exercice } from '../../../../models/exercice.model';
import { Famille } from '../../../../models/famille.model';
import { LigneReversement } from '../../../../models/ligneReversement.model';
import { Uniter } from '../../../../models/uniter.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { RegisseurService } from '../../../../services/definition/regisseur.service';
import { Magasinier } from '../../../../models/magasinier.model';
import { Regisseur } from '../../../../models/regisseur.model';
import { Utilisateur } from '../../../../models/utilisateur.model';
import { Service } from '../../../../models/service.model';
import { ReversementService } from '../../../../services/saisie/reversement.service';
import { Reversement } from '../../../../models/reversement.model';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolsService } from '../../../../services/utilities/tools.service';
import { Fonction } from '../../../../models/fonction.model';
@Component({
  selector: 'app-reversement',
  templateUrl: './reversement.component.html',
  styleUrls: ['./reversement.component.css']
})
export class ReversementComponent implements OnInit {

  pdfToShow = null;

   //Commune
   @ViewChild('addComModal') public addComModal: ModalDirective;
   @ViewChild('editComModal') public editComModal: ModalDirective;
   @ViewChild('deleteComModal') public deleteComModal: ModalDirective;
   @ViewChild('addArticle1') public addArticle1: ModalDirective;
   @ViewChild('addArticle2') public addArticle2: ModalDirective;

   //
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;

   dtOptions1: DataTables.Settings = {};
   dtOptions2: DataTables.Settings = {};
   dtOptions3: DataTables.Settings = {};
   dtTrigger1: Subject<any> = new Subject<any>();
   dtTrigger2: Subject<any> = new Subject<any>();
   dtTrigger3: Subject<any> = new Subject<any>();

    reversement:Reversement[] = [];
    addReversementFormGroup:FormGroup;
    editReversementFormGroup:FormGroup;

    editReversement:Reversement = new Reversement('', new Date(),new Exercice('', '', new Date(), new Date(), '', false),
    new Regisseur('',new Magasinier('','',''), new Utilisateur('','','','',new Fonction('',''),false, new Service('',''))));

    suprReversement:Reversement = new Reversement('', new Date(),new Exercice('', '', new Date(), new Date(), '', false),
    new Regisseur('',new Magasinier('','',''), new Utilisateur('','','','',new Fonction('',''),false, new Service('',''))));

    tempAddLigneReversement:LigneReversement[] = [];
    tempEditLigneReversement:LigneReversement[] = [];
    tempDeleteLigneReversement:LigneReversement[] = [];

    ligneReversement:LigneReversement[] = [];

    editLigneReversement :LigneReversement = new LigneReversement(0,0,'',new Date(),'','',new Reversement('', new Date(),new Exercice('', '', new Date(), new Date(), '', false),
    new Regisseur('',new Magasinier('','',''), new Utilisateur('','','','',new Fonction('',''),false, new Service('','')))),
    new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')) );

    suprLigneReversement :LigneReversement = new LigneReversement(0,0,'',new Date(),'','',new Reversement('', new Date(),new Exercice('', '', new Date(), new Date(), '', false),
    new Regisseur('',new Magasinier('','',''), new Utilisateur('','','','',new Fonction('',''),false, new Service('','')))),
    new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')) );

    exercices:Exercice[] = [];
    articles:Article[] = [];
    regisseur:Regisseur[] = [];
    magasinier:Magasinier[] = [];

    articlesOfAConcernedReversementAddingRevers:Article[] = [];
    articlesOfAConcernedReversementEditingRvers:Article[] = [];


  constructor(private serviceReversement:ReversementService, private serviceRegisseur:RegisseurService, private serviceExercice:ExerciceService,
    private serviceArticle:ArticleService,private formBulder:FormBuilder,
    private sanitizer:DomSanitizer, public outil: ToolsService) {
    this.initDtOptions();
    this.initFormsGroup();
    moment.locale('fr');
  }

  initDtOptions(){
    this.dtOptions1 = {
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
    this.dtOptions2 = {
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
    this.dtOptions3 = {
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

   initFormsGroup(){
    this.addReversementFormGroup = this.formBulder.group({
      addNumRevers:['RV-200000001', Validators.required],
      addDateRevers:[new Date().toISOString().substring(0, 10), Validators.required],
      addReg:[0, Validators.required]
    });

    this.editReversementFormGroup = this.formBulder.group({
      editNumRevers:['', Validators.required],
      editDateRevers:[new Date(), Validators.required],
      editReg:[0, Validators.required]
    });
  }


  ngOnInit(): void {

    this.getAllExercice();
    this.getAllRegisseur();

    this.serviceArticle.getAllArticle().subscribe(
      (data) => {
        this.articles = data;
        this.dtTrigger2.next();
        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );

    this.serviceReversement.getAllReversement().subscribe(
      (data) => {
        this.reversement = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des points ventes', erreur);
      }
    );
    //this.getAllArticle();
    this.getAllLigneReversement();
  }

  getAllReversement(){
    this.serviceReversement.getAllReversement().subscribe(
      (data) => {
        this.reversement = data;
        //$('#RecovDataTable').dataTable().api().destroy();
        //this.dtTrigger1.next();
       // this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des points ventes', erreur);
      }
    );
  }

  getAllLigneReversement(){
    this.serviceReversement.getAllLigneReversement().subscribe(
      (data) => {
        this.ligneReversement = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récuparation de la liste des lignes de commande', erreur);
      }
    );
  }

  getAllExercice(){
    this.serviceExercice.getAllExo().subscribe(
      (data) => {
        this.exercices = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des exercices', erreur);
      }
    );
  }

  getAllRegisseur(){
    this.serviceRegisseur.getAllRegisseur().subscribe(
      (data) => {
        this.regisseur = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des regisseur', erreur);
      }
    );
  }

  getAllArticle(){
    this.serviceArticle.getAllArticle().subscribe(
      (data) => {
        this.articles = data;
        $('#tabListArt1').dataTable().api().destroy();
        this.dtTrigger2.next();
        $('#tabListArt2').dataTable().api().destroy();
        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );
  }

  popArticleAddingOfReversement(inde:number){
    this.tempAddLigneReversement.splice(inde, 1);
  }

  popArticleEditingOfReversement(inde:number){
    this.tempEditLigneReversement.splice(inde, 1);
  }

  initAddReversement(){
    //this.onConcernedCommandSelected();
    this.addComModal.show();
  }

  initEditReversement(inde:number){
    this.tempEditLigneReversement=[];
    this.editReversement = this.reversement[inde];
    console.log(this.editReversement);

    this.serviceReversement.getAllLigneReversement().subscribe(
      (data) => {
        this.ligneReversement = data;
        console.log(this.ligneReversement);
        this.ligneReversement.forEach(element => {
          if(element.numReversement.numReversement==this.editReversement.numReversement){
            this.tempEditLigneReversement.push(element);
          }
        });
        this.editComModal.show();
      },
      (erreur) => {
        console.log('Erreur lors de la récuparation de la liste des lignes reversement', erreur);
      }
    );

  }

  initDeleteReversement(inde:number){
    this.suprReversement = this.reversement[inde];
    this.deleteComModal.show();
  }

  onShowAddArticleModalAddingReversement(){

    this.addArticle1.show();
    this.getAllArticle();

}

onShowAddArticleModalEditingReversement(){
  this.addArticle2.show();
  this.getAllArticle();


}

addArticleForAddingOfReversement(inde:number){
  let exist:boolean = false;
  this.tempAddLigneReversement.forEach(element => {
    if(element.article.codeArticle==this.articles[inde].codeArticle){
      exist = true;
      exit;
    }
  });

  if(exist===false){
    this.tempAddLigneReversement.push(new LigneReversement(0, this.articles[inde].prixVenteArticle, '', new Date(), '','',
    new Reversement('', new Date(),new Exercice('', '', new Date(), new Date(), '', false),
    new Regisseur('',new Magasinier('','',''), new Utilisateur('','','','',new Fonction('',''),false, new Service('','')))),
      this.articles[inde]));
  }


}

addArticleForEditingOfReversement(inde:number){
  let exist:boolean = false;
  this.tempEditLigneReversement.forEach(element => {
    if(element.article.codeArticle==this.articles[inde].codeArticle){
      exist = true;
      exit;
    }
  });

  if(exist===false){
    this.tempEditLigneReversement.push(new LigneReversement(0, this.articles[inde].prixVenteArticle, '', new Date(),'','',
    new Reversement('', new Date(),new Exercice('', '', new Date(), new Date(), '', false),
    new Regisseur('',new Magasinier('','',''), new Utilisateur('','','','',new Fonction('',''),false, new Service('','')))),
      this.articles[inde]));
  }

}

onSubmitAddReversementFormsGroup(){

  const newReversement= new Reversement(this.addReversementFormGroup.value['addNumRevers'],
  this.addReversementFormGroup.value['addDateRevers'],
  this.serviceExercice.exoSelectionner, this.regisseur[this.addReversementFormGroup.value['addReg']]);
  console.log(this.tempAddLigneReversement, newReversement);
  this.serviceReversement.addReversement(newReversement).subscribe(
    (data) => {
      console.log('********',data);

      this.tempAddLigneReversement.forEach(element => {
        element.numReversement = data;
        this.serviceReversement.addLigneReversement(element).subscribe(
          (data2) => {
            console.log('********',data2);

          },
          (erreur) => {
            console.log('Erreur lors de la création de la ligne de point vente',erreur );
          }
        );
      });
      this.addReversementFormGroup.reset();
      this.initFormsGroup();
      this.addComModal.hide();
      this.getAllReversement();
      this.getAllLigneReversement();
    },
    (erreur) => {
      console.log('Erreur lors de la création de reversement', erreur);
    }
  );

}

onSubmitEditReversementFormsGroup(){
  const newRevers= new Reversement(this.editReversementFormGroup.value['editNumRevers'],
  this.editReversementFormGroup.value['editDateRevers'],
  this.serviceExercice.exoSelectionner,
  this.regisseur[this.editReversementFormGroup.value['editReg']]);

  let oldReversementLines:LigneReversement[] = [];

  this.ligneReversement.forEach(element => {
    if(element.numReversement.numReversement==this.editReversement.numReversement){
      oldReversementLines.push(element);
    }
  });


  this.serviceReversement.editReversement(this.editReversement.numReversement, newRevers).subscribe(
    (data) => {

      //Pour ajout et ou modification des lignes
      this.tempEditLigneReversement.forEach(element => {
        let added:boolean = true;
        oldReversementLines.forEach(element2 => {
          if(element.article.codeArticle==element2.article.codeArticle){
            added = false;
            element.numReversement = data;

            this.serviceReversement.editLigneReversement(element2.idLigneReversement.toString(), element).subscribe(
              (data2) => {

              },
              (erreur) => {
                console.log('Erreur lors de la modification de ligne de reversement', erreur);
              }
            );
            exit;
          }
        });

        if(added===true){
          element.numReversement = data;
          this.serviceReversement.addLigneReversement(element).subscribe(
            (data3) => {

            },
            (erreur) => {
              console.log('Erreur lors de la création dUne nouvelle ligne pour lEdition', erreur)
            }
          );
        }

      });


      //Pour suppression des lignes suprimés
      oldReversementLines.forEach(element => {
        let deleted:boolean = true;
        this.tempEditLigneReversement.forEach(element2 => {

          if(element.article.codeArticle==element2.article.codeArticle){
            deleted = false;
            exit;
          }

        });

        if(deleted===true){
          this.serviceReversement.deleteLigneReversement(element.idLigneReversement.toString()).subscribe(
            (data) => {

            },
            (erreur) => {
              console.log('Erreur lors de la suppression de la ligne', erreur);
            }
          );
        }

      });

      this.editComModal.hide();

      this.getAllReversement();
      this.getAllLigneReversement();

    },
    (erreur) => {
      console.log('Erreur lors de lEdition de la commande', erreur);
    }
  );



}

onConfirmDeleteReversement(){
  this.getAllLigneReversement();
  let faled:boolean=false;
  this.ligneReversement.forEach(element => {
    if(element.numReversement.numReversement==this.suprReversement.numReversement){
      this.serviceReversement.deleteLigneReversement(element.idLigneReversement.toString()).subscribe(
        (data) => {
          this.serviceReversement.deleteReversement(this.suprReversement.numReversement).subscribe(
            (data) => {
              this.deleteComModal.hide();
              this.getAllReversement();
              this.getAllLigneReversement();
            },
            (erreur) => {
              console.log('Erreur lors de la suppression de la reversement', erreur);
            }
          );
        },
        (erreur) => {
          console.log('Erreur lors de la suppression dUne ligne de reversement', erreur);
          //faled=true;
        }
      );
    }
  });

  if(faled==false){
    this.serviceReversement.deleteReversement(this.suprReversement.numReversement).subscribe(
      (data) => {
        this.deleteComModal.hide();
        this.getAllReversement();
        this.getAllLigneReversement();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de reversement', erreur);
      }
    );
  }

}

initPrintPdfOfReversement(inde:number){
  const commande = this.reversement[inde];
  const doc = new jsPDF();
  let lignes = [];
  let totalHT, totalTTC, totalRemise, totalTVA;
  totalHT = 0;
  totalRemise = 0;
  totalTVA = 0;
  totalTTC = 0;
  this.ligneReversement.forEach(element => {
    if(element.numReversement.numReversement == commande.numReversement){
      let lig = [];
      lig.push(element.article.codeArticle);
      lig.push(element.article.libArticle);
      lig.push(element.quantiteLigneReversement);
     // lig.push(element.num+' à '+element.numFinLignePointVente);
      lig.push(element.puligneReversement);

      lig.push(element.puligneReversement*element.quantiteLigneReversement);
      lig.push(element.quittanceReversement);
      lig.push(moment(element.dateQuittanceReversement).format('DD/MM/YYYY'));
      lig.push(element.beneficiaire);
      lig.push(element.observation);
      lignes.push(lig);

      totalHT += element.puligneReversement*element.quantiteLigneReversement;


    }

  });
  doc.setDrawColor(0);
  doc.setFillColor(255, 255, 255);
  //doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
  //doc.setFont("Times New Roman");
  doc.addImage(this.outil.ente, 5, 5, 190, 25);
  autoTable(doc, {
    theme: 'plain',
    margin: { top: 35},

    body: [['REVERSEMENT\nRéférence: ' + commande.regisseur.magasinier.nomMagasinier + ' du ' +
      moment(commande.dateVersement).format('DD/MM/YYYY')]],
    bodyStyles: {
      fontSize:20,halign: 'center'
    }
  });
  /*doc.setFontSize(25);
  doc.text(, 62, 30);
  doc.setFontSize(14);
  doc.text(' : '+commande.numReversement, 15, 45);
  doc.text('Régisseur : '+
  commande.regisseur.magasinier.prenomMagasinier, 15, 55);
  doc.text('Date : '+, 145, 45);*/


  autoTable(doc, {
    theme: 'grid',
    head: [['Article', 'Désignation', 'Quantité', 'PU', 'Montant','Numéro Quittance','Date Quittance','Bénéficiaire','Observation']],
    headStyles: {
       fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold' ,
    },
    margin: { top: 100 },

    body: lignes
    ,
  });

  autoTable(doc, {
    theme: 'grid',
    margin: { top: 100, left:130 },
    columnStyles: {
      0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    },
    body: [
      ['Montant Total', totalHT]
    ]

  });
  doc.text('Powered by Guichet Unique', 130, 230);
  //doc.autoPrint();
  //doc.output('dataurlnewwindow');

  this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'reversement.pdf'}));
  this.viewPdfModal.show();
}

}
