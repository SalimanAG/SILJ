import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { Article } from '../../../../models/article.model';
import { Recollement } from '../../../../models/recollement.model';
import { Exercice } from '../../../../models/exercice.model';
import { Famille } from '../../../../models/famille.model';
//import { Fournisseur } from '../../../../models/fournisseur.model';
import { LigneRecollement } from '../../../../models/ligneRecollement.model';
import { Uniter } from '../../../../models/uniter.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { RegisseurService } from '../../../../services/definition/regisseur.service';
import { CorrespondantService } from '../../../../services/definition/correspondant.service';
import { Correspondant } from '../../../../models/Correspondant.model';
import { Magasinier } from '../../../../models/magasinier.model';
import { TypCorres } from '../../../../models/typCorres.model';
import { Regisseur } from '../../../../models/regisseur.model';
import { Utilisateur } from '../../../../models/utilisateur.model';
import { Service } from '../../../../models/service.model';
import { RecollementService } from '../../../../services/saisie/recollement.service';
import { Magasin } from '../../../../models/magasin.model';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-recollement',
  templateUrl: './recollement.component.html',
  styleUrls: ['./recollement.component.css']
})
export class RecollementComponent implements OnInit {

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

  recollement:Recollement[] = [];
  addRecollementFormGroup:FormGroup;
  editRecollementFormGroup:FormGroup;
  editRecollement:Recollement = new Recollement('','',new Date(), new Magasin('',''), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))), new Exercice('', '', new Date(), new Date(), '', false));

  suprRecollement:Recollement = new Recollement('','',new Date(), new Magasin('',''), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))), new Exercice('', '', new Date(), new Date(), '', false));

  tempAddLigneRecollement:LigneRecollement[] = [];
  tempEditLigneRecollement:LigneRecollement[] = [];
  tempDeleteLigneRecollement:LigneRecollement[] = [];

  ligneRecollement:LigneRecollement[] = [];
  editLigneRecollement :LigneRecollement = new LigneRecollement(0,0,'',new Recollement('','',new Date(), new Magasin('',''), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))), new Exercice('', '', new Date(), new Date(), '', false)),
  new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));

  suprLigneRecollement :LigneRecollement = new LigneRecollement(0,0,'',new Recollement('','',new Date(), new Magasin('',''), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))), new Exercice('', '', new Date(), new Date(), '', false)),
  new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));

  exercices:Exercice[] = [];
  articles:Article[] = [];
  regisseur:Regisseur[] = [];
  correspondant:Correspondant[] = [];
  magasinier:Magasinier[] = [];
  magasin:Magasin[] = [];

  articlesOfAConcernedRecollementAddingRecoll:Article[] = [];
  articlesOfAConcernedRecollementEditingRecoll:Article[] = [];

  constructor(private serviceRecollement:RecollementService, private serviceRegisseur:RegisseurService, private serviceExercice:ExerciceService, 
    private serviceArticle:ArticleService, private serviceCorrespodant:CorrespondantService, private formBulder:FormBuilder,
    private sanitizer:DomSanitizer) { 
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
    this.addRecollementFormGroup = this.formBulder.group({
      addNumRecoll:['RL-200000005', Validators.required],
      addDateRecoll:[new Date().toISOString().substring(0, 10), Validators.required], 
      addDesRecoll:'', 
      addMag:[0, Validators.required],
      addReg:[0, Validators.required]
    });

    this.editRecollementFormGroup = this.formBulder.group({
      editNumRecoll:['', Validators.required],
      editDateRecoll:[new Date(), Validators.required], 
      editDesRecoll:'', 
      editMag:[0, Validators.required],
      editReg:[0, Validators.required]
    });
  }

  ngOnInit(): void {

    this.getAllExercice();
    this.getAllRegisseur();
    this.getAllMagasin();
    this.getAllLigneRecollement();

    this.serviceRecollement.getAllRecollement().subscribe(
      (data) => {
        this.recollement = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des recollements', erreur);
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

  getAllMagasin(){
    this.serviceCorrespodant.getAllMagasin().subscribe(
      (data) => {
        this.magasin = data;
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
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );
  }

  getAllRecollement(){
    this.serviceRecollement.getAllRecollement().subscribe(
      (data) => {
        this.recollement = data;
        //$('#RecollDataTable').dataTable().api().destroy();
        //this.dtTrigger1.next();
        //this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des recollement', erreur);
      }
    );

  }

  getAllLigneRecollement(){
    this.serviceRecollement.getAllLigneRecollement().subscribe(
      (data) => {
        this.ligneRecollement = data;
        //this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des ligne recollement', erreur);
      }
    );

  }


  initAddRecollement(){
    //this.onConcernedCommandSelected();
    this.addComModal.show()
  }

  initDeleteRecollement(inde:number){
    this.suprRecollement = this.recollement[inde];
    this.deleteComModal.show();
  }

  onShowAddArticleModalAddingRecollement(){
   
    this.addArticle1.show();
    this.getAllArticle();

}

onShowAddArticleModalEditingRecollement(){
  this.addArticle2.show();
  this.getAllArticle();

}

popArticleAddingOfRecollement(inde:number){
  this.tempAddLigneRecollement.splice(inde, 1);
}

popArticleEditingOfRecollement(inde:number){
  this.tempEditLigneRecollement.splice(inde, 1);
}

addArticleForAddingOfRecollement(inde:number){
  let exist:boolean = false;
  this.tempAddLigneRecollement.forEach(element => {
    if(element.article.codeArticle==this.articles[inde].codeArticle){
      exist = true;
      exit;
    }
  });

  if(exist===false){
    this.tempAddLigneRecollement.push(new LigneRecollement(0, this.articles[inde].prixVenteArticle, '',
      new Recollement('','',new Date(), new Magasin('',''), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))), new Exercice('', '', new Date(), new Date(), '', false)),
      this.articles[inde]));
  }


}

addArticleForEditingOfRecollement(inde:number){
  let exist:boolean = false;
  this.tempEditLigneRecollement.forEach(element => {
    if(element.article.codeArticle==this.articles[inde].codeArticle){
      exist = true;
      exit;
    }
  });

  if(exist===false){
    this.tempEditLigneRecollement.push(new LigneRecollement(0, this.articles[inde].prixVenteArticle, '',
    new Recollement('','',new Date(), new Magasin('',''), new Regisseur('',new Magasinier('','',''),
    new Utilisateur('','','','','',false, new Service('',''))), new Exercice('', '', new Date(), new Date(), '', false)),
      this.articles[inde]));
  }

}

onSubmitAddRecollementFormsGroup(){

  const newRecoll= new Recollement(this.addRecollementFormGroup.value['addNumRecoll'],
  this.addRecollementFormGroup.value['addDesRecoll'],this.addRecollementFormGroup.value['addDateRecoll'],
   this.magasin[this.addRecollementFormGroup.value['addMag']],
  this.regisseur[this.addRecollementFormGroup.value['addReg']],this.serviceExercice.exoSelectionner);
  console.log(this.tempAddLigneRecollement, newRecoll);
  this.serviceRecollement.addRecollement(newRecoll).subscribe(
    (data) => {
      console.log('********',data);
      
      this.tempAddLigneRecollement.forEach(element => {
        element.recollement = data;
        this.serviceRecollement.addLigneRecollement(element).subscribe(
          (data2) => {
            console.log('********',data2);

          },
          (erreur) => {
            console.log('Erreur lors de la création de la ligne de recollement',erreur );
          }
        );
      });
      this.addRecollementFormGroup.reset();
      this.initFormsGroup();
      this.addComModal.hide();
      this.getAllRecollement();
      this.getAllLigneRecollement();
    },
    (erreur) => {
      console.log('Erreur lors de la création de recollement', erreur);
    }
  );

}

onSubmitEditRecollementFormsGroup(){
  const newRecoll= new Recollement(this.editRecollementFormGroup.value['editNumRecoll'],
  this.editRecollementFormGroup.value['editDesRecoll'], this.editRecollementFormGroup.value['editDateRecoll'],
   this.magasin[this.editRecollementFormGroup.value['editMag']],
  this.regisseur[this.editRecollementFormGroup.value['editReg']],this.serviceExercice.exoSelectionner);

  let oldRecollementLines:LigneRecollement[] = [];

  this.ligneRecollement.forEach(element => {
    if(element.recollement.numRecollement==this.editRecollement.numRecollement){
      oldRecollementLines.push(element);
    }
  });


  this.serviceRecollement.editRecollement(this.editRecollement.numRecollement, newRecoll).subscribe(
    (data) => {

      //Pour ajout et ou modification des lignes
      this.tempEditLigneRecollement.forEach(element => {
        let added:boolean = true;
        oldRecollementLines.forEach(element2 => {
          if(element.article.codeArticle==element2.article.codeArticle){
            added = false;
            element.recollement = data;

            this.serviceRecollement.editLigneRecollement(element2.idLigneRecollement.toString(), element).subscribe(
              (data2) => {

              },
              (erreur) => {
                console.log('Erreur lors de la modification de ligne de recollement', erreur);
              }
            );
            exit;
          }
        });

        if(added===true){
          element.recollement = data;
          this.serviceRecollement.addLigneRecollement(element).subscribe(
            (data3) => {

            },
            (erreur) => {
              console.log('Erreur lors de la création dUne nouvelle ligne pour lEdition', erreur)
            }
          );
        }

      });


      //Pour suppression des lignes suprimés
      oldRecollementLines.forEach(element => {
        let deleted:boolean = true;
        this.tempEditLigneRecollement.forEach(element2 => {

          if(element.article.codeArticle==element2.article.codeArticle){
            deleted = false;
            exit;
          }

        });

        if(deleted===true){
          this.serviceRecollement.deleteLigneRecollement(element.idLigneRecollement.toString()).subscribe(
            (data) => {

            },
            (erreur) => {
              console.log('Erreur lors de la suppression de la ligne', erreur);
            }
          );
        }

      });

      this.editComModal.hide();

      this.getAllRecollement();
      this.getAllLigneRecollement();

    },
    (erreur) => {
      console.log('Erreur lors de lEdition de recollement', erreur);
    }
  );



}

initEditRecollement(inde:number){
  this.tempEditLigneRecollement=[];
  this.editRecollement = this.recollement[inde];
  console.log(this.editRecollement);
  
  this.serviceRecollement.getAllLigneRecollement().subscribe(
    (data) => {
      this.ligneRecollement = data;
      console.log(this.ligneRecollement);
      this.ligneRecollement.forEach(element => {
        if(element.recollement.numRecollement==this.editRecollement.numRecollement){
          this.tempEditLigneRecollement.push(element);
        }
      });
      this.editComModal.show();
    },
    (erreur) => {
      console.log('Erreur lors de la récuparation de la liste des lignes de recollement', erreur);
    }
  );

}

onConfirmDeleteRecollement(){
  this.getAllLigneRecollement();
  let faled:boolean=false;
  this.ligneRecollement.forEach(element => {
    if(element.recollement.numRecollement==this.suprRecollement.numRecollement){
      this.serviceRecollement.deleteLigneRecollement(element.idLigneRecollement.toString()).subscribe(
        (data) => {
          this.serviceRecollement.deleteRecollement(this.suprRecollement.numRecollement).subscribe(
            (data) => {
              this.deleteComModal.hide();
              this.getAllRecollement();
              this.getAllLigneRecollement();
            },
            (erreur) => {
              console.log('Erreur lors de la suppression de recollement', erreur);
            }
          );
        },
        (erreur) => {
          console.log('Erreur lors de la suppression dUne ligne de recollement', erreur);
          //faled=true;
        }
      );
    }
  });

  if(faled==false){
    this.serviceRecollement.deleteRecollement(this.suprRecollement.numRecollement).subscribe(
      (data) => {
        this.deleteComModal.hide();
        this.getAllRecollement();
        this.getAllLigneRecollement();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de la recollement', erreur);
      }
    );
  }

}

initPrintPdfOfRecollement(inde:number){
  const commande = this.recollement[inde];
  const doc = new jsPDF();
  let lignes = [];
  let totalHT, totalTTC, totalRemise, totalTVA;
  totalHT = 0;
  totalRemise = 0;
  totalTVA = 0;
  totalTTC = 0;
  this.ligneRecollement.forEach(element => {
    if(element.recollement.numRecollement == commande.numRecollement){
      let lig = [];
      lig.push(element.article.codeArticle);
      lig.push(element.article.libArticle);
      lig.push(element.quantiteLigneRecollement);
      lig.push(element.puligneRecollement);
      
      lig.push(element.puligneRecollement*element.quantiteLigneRecollement);
      lig.push(element.observationLigneRecollement);
      lignes.push(lig);

      totalHT += element.puligneRecollement*element.quantiteLigneRecollement;
    

    }

  });
  doc.setDrawColor(0);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(50, 20, 100, 15, 3, 3, 'FD');
  //doc.setFont("Times New Roman");
  
  doc.setFontSize(25);
  doc.text('RECOLLEMENT', 62, 30);
  doc.setFontSize(14);
  doc.text('Référence : '+commande.numRecollement, 15, 45);
  doc.text('Magasin : '+commande.magasin.libMagasin, 15, 55);
  doc.text('Description : '+commande.descriptionRecollement, 15, 65);
  doc.text('Régisseur : '+commande.regisseur.magasinier.nomMagasinier+' '+
  commande.regisseur.magasinier.prenomMagasinier, 15, 75);
  doc.text('Date : '+moment(commande.dateRecollement).format('DD/MM/YYYY'), 145, 45);
  
 
  autoTable(doc, {
    theme: 'grid',
    head: [['Article', 'Désignation', 'Quantité', 'PU', 'Montant','Observation']],
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

  this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'recollement.pdf'}));
  this.viewPdfModal.show();
}


}
