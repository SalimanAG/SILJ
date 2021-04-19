import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { Article } from '../../../../models/article.model';
import { DemandeApprovisionnement } from '../../../../models/demandeApprovisionnement.model';
import { Exercice } from '../../../../models/exercice.model';
import { Famille } from '../../../../models/famille.model';
import { LigneDemandeAppro } from '../../../../models/ligneDemandeAppro.model';
import { Uniter } from '../../../../models/uniter.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { DemandeApproService } from '../../../../services/saisie/demande-appro.service';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { UtilisateurService } from '../../../../services/administration/utilisateur.service';

@Component({
  selector: 'app-demande-approvisionnement',
  templateUrl: './demande-approvisionnement.component.html',
  styleUrls: ['./demande-approvisionnement.component.css']
})
export class DemandeApprovisionnementComponent  implements OnInit {

  //Commune
  @ViewChild('addComModal') public addComModal: ModalDirective;
  @ViewChild('editComModal') public editComModal: ModalDirective;
  @ViewChild('deleteComModal') public deleteComModal: ModalDirective;
  @ViewChild('addArticle1') public addArticle1: ModalDirective;
  @ViewChild('addArticle2') public addArticle2: ModalDirective;
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;


  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();


  demandeAppros:DemandeApprovisionnement[];
  addDemandeApproFormGroup:FormGroup;
  editDemandeApproFormGroup:FormGroup;
  editDemandeAppro:DemandeApprovisionnement = new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false));
  suprDemandeAppro:DemandeApprovisionnement = new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false));

  ligneDemandeAppros:LigneDemandeAppro[];
  editLigneDemandeAppro:LigneDemandeAppro = new LigneDemandeAppro(0, new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')),
  new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false)));
  suprLigneDemandeAppro:LigneDemandeAppro = new LigneDemandeAppro(0, new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')),
  new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false)));

  tempAddLigneDemandeAppro:LigneDemandeAppro[] = [];
  tempEditLigneDemandeAppro:LigneDemandeAppro[] = [];
  tempDeleteLigneDemandeAppro:LigneDemandeAppro[] = [];

  exercices:Exercice[] = [];
  articles:Article[] = [];

  pdfToShow = null;

  constructor(public serviceExercice:ExerciceService, private serviceArticle:ArticleService, private serviceDemandeAppro:DemandeApproService,
    private formBulder:FormBuilder, private sanitizer: DomSanitizer, private serviceUser: UtilisateurService) {

      this.initDtOptions();
      this.initFormsGroup();

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

    this.addDemandeApproFormGroup = this.formBulder.group({
      addNumDA:'',
      addDateDA:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required]
    });

    this.editDemandeApproFormGroup = this.formBulder.group({
      editNumDA:['', Validators.required],
      editDateDA:[new Date(), Validators.required]
    });


  }

  ngOnInit(): void {



    this.getAllLigneDemandeAppro();
    this.getAllExercice();

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


    this.serviceDemandeAppro.getAllDemandeAppro().subscribe(
      (data) => {
        this.demandeAppros = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des demandes dAppro', erreur);
      }
    );

  }

  getAllDemandeAppro(){
    this.serviceDemandeAppro.getAllDemandeAppro().subscribe(
      (data) => {
        this.demandeAppros = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des demandes dAppro', erreur);
      }
    );
  }

  getAllLigneDemandeAppro(){
    this.serviceDemandeAppro.getAllLigneDemandeAppro().subscribe(
      (data) => {
        this.ligneDemandeAppros = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de demande dAppro', erreur)
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

  getAllArticle(){
    this.serviceArticle.getAllArticle().subscribe(
      (data) => {
        this.articles = data;
        $('#dataTable2').dataTable().api().destroy();
        this.dtTrigger2.next();
        $('#dataTable3').dataTable().api().destroy();
        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );
  }





  onShowAddArticleModalAddingCommande(){
    this.addArticle1.show();
    this.getAllArticle();
  }

  onShowAddArticleModalEditingCommande(){
    this.addArticle2.show();
    this.getAllArticle();
  }

  addArticleForAddingOfComm1(inde:number){
    let exist:boolean = false;
    this.tempAddLigneDemandeAppro.forEach(element => {
      if(element.article.codeArticle==this.articles[inde].codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempAddLigneDemandeAppro.push(new LigneDemandeAppro(0, this.articles[inde],
        new DemandeApprovisionnement('', '', this.serviceExercice.exoSelectionner)));
    }


  }

  addArticleForEditingOfComm1(inde:number){
    let exist:boolean = false;

    this.tempEditLigneDemandeAppro.forEach(element => {
      if(element.article.codeArticle==this.articles[inde].codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempEditLigneDemandeAppro.push(new LigneDemandeAppro(0, this.articles[inde],
        new DemandeApprovisionnement('', '', this.serviceExercice.exoSelectionner)));
    }

  }

  popArticleAddingOfComm1(inde:number){
    this.tempAddLigneDemandeAppro.splice(inde, 1);
  }

  popArticleEditingOfComm1(inde:number){
    this.tempEditLigneDemandeAppro.splice(inde, 1);
  }

  initEditCommande(inde:number){

    this.tempEditLigneDemandeAppro = [];
    this.editDemandeAppro = this.demandeAppros[inde];
    this.serviceDemandeAppro.getAllLigneDemandeAppro().subscribe(
      (data) => {
        this.ligneDemandeAppros = data;
        this.ligneDemandeAppros.forEach(element => {
          if(element.appro.numDA == this.editDemandeAppro.numDA){
            this.tempEditLigneDemandeAppro.push(element);
          }
        });
        this.editComModal.show();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de demande dAppro', erreur);
      }
    );

  }

  initDeleteCommande(inde:number){

    this.suprDemandeAppro = this.demandeAppros[inde];
    this.deleteComModal.show();
  }

  onSubmitAddCommandeFormsGroup(){

    const newDemAppro = new DemandeApprovisionnement(this.addDemandeApproFormGroup.value['addNumDA'],
      this.addDemandeApproFormGroup.value['addDateDA'],
      this.serviceExercice.exoSelectionner);

    this.serviceDemandeAppro.addADemandeAppro(newDemAppro).subscribe(
      (data) => {
        this.tempAddLigneDemandeAppro.forEach((element, inde) => {
          element.appro = data;
          this.serviceDemandeAppro.addALigneDemandeAppro(element).subscribe(
            (data2) => {
              this.tempAddLigneDemandeAppro.splice(inde);
            },
            (erreur) => {
              console.log('Erreur lors de lAjout dUne Ligne de Demande DAppro', erreur);
            }
          );
        });

        this.addComModal.hide();
        this.getAllLigneDemandeAppro();
        this.getAllDemandeAppro();
      },
      (erreur) => {
        console.log('Erreur lors de la création de la demande Appro', erreur);
      }
    );


  }

  onSubmitEditCommandeFormsGroup(){

    const newDemAppro = new DemandeApprovisionnement(this.editDemandeApproFormGroup.value['editNumDA'],
      this.editDemandeApproFormGroup.value['editDateDA'],
      this.serviceExercice.exoSelectionner);

      let oldDemandApproLines:LigneDemandeAppro[] = [];

      this.ligneDemandeAppros.forEach(element => {
        if(element.appro.numDA==this.editDemandeAppro.numDA){
          oldDemandApproLines.push(element);
        }
      });

    this.serviceDemandeAppro.editADemandeAppro(this.editDemandeAppro.numDA, newDemAppro).subscribe(
      (data) => {

        //Pour ajout et ou modification des lignes
        this.tempEditLigneDemandeAppro.forEach(element => {
          let added:boolean = true;
          oldDemandApproLines.forEach(element2 => {
            if(element.article.codeArticle==element2.article.codeArticle){
              added = false;
              element.appro = data;

              this.serviceDemandeAppro.editALigneDemandeAppro(element2.idLigneDA.toString(), element).subscribe(
                (data2) => {

                },
                (erreur) => {
                  console.log('Erreur lors de la modification de ligne de Demande Appro', erreur);
                }
              );
              exit;
            }
          });

          if(added===true){
            element.appro = data;
            this.serviceDemandeAppro.addALigneDemandeAppro(element).subscribe(
              (data3) => {

              },
              (erreur) => {
                console.log('Erreur lors de la création dUne nouvelle ligne pour lEdition', erreur)
              }
            );
          }

        });


        //Pour suppression des lignes suprimés
        oldDemandApproLines.forEach(element => {
          let deleted:boolean = true;
          this.tempEditLigneDemandeAppro.forEach(element2 => {

            if(element.article.codeArticle==element2.article.codeArticle){
              deleted = false;
              exit;
            }

          });

          if(deleted===true){
            this.serviceDemandeAppro.deleteALigneDemandeAppro(element.idLigneDA.toString()).subscribe(
              (data) => {

              },
              (erreur) => {
                console.log('Erreur lors de la suppression de la ligne', erreur);
              }
            );
          }

        });

        this.editComModal.hide();
        this.getAllDemandeAppro();
        this.getAllLigneDemandeAppro();

      },
      (erreur) => {
        console.log('Erreur lors de la Modification de la Demande Appro', erreur);
      }
    );

  }

  onConfirmDeleteCommande(){

    this.serviceDemandeAppro.getAllLigneDemandeAppro().subscribe(
      (data) => {
        this.ligneDemandeAppros = data;
        let faled2:boolean=false;

        this.ligneDemandeAppros.forEach(element => {
          if(element.appro.numDA==this.suprDemandeAppro.numDA){
            this.serviceDemandeAppro.deleteALigneDemandeAppro(element.idLigneDA.toString()).subscribe(
              (data2) => {
                this.serviceDemandeAppro.deleteADemandeAppro(this.suprDemandeAppro.numDA).subscribe(
                  (data3) => {
                    this.deleteComModal.hide();
                    this.getAllDemandeAppro();
                    this.getAllLigneDemandeAppro();
                  },
                  (erreur) => {
                    console.log('Erreur lors de la suppression de la Demande Appro', erreur);
                  }
                );
              },
              (erreur) => {
                console.log('Erreur lors de la suppression dUne ligne de Demande Appro', erreur);

              }
            );
          }
        });

        this.serviceDemandeAppro.deleteADemandeAppro(this.suprDemandeAppro.numDA).subscribe(
          (data2) => {
            this.deleteComModal.hide();
            this.getAllDemandeAppro();
            this.getAllLigneDemandeAppro();
          },
          (erreur) => {
            console.log('Erreur lors de la suppression de la Demande Appro', erreur);
          }
        );

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de demande dAppro', erreur)
      }
    );


  }

  initPrintPdfOfAnDemAppro(inde:number){
    const demandeAppro = this.demandeAppros[inde];
    const doc = new jsPDF();
    let lignes = [];
    let totalTTC = 0;

    this.serviceDemandeAppro.getAllLigneDemandeAppro().subscribe(
      (data) => {
        this.ligneDemandeAppros = data;

        this.ligneDemandeAppros.forEach(element => {
          if(element.appro.numDA == demandeAppro.numDA){
            let lig = [];
            lig.push(element.article.codeArticle);
            lig.push(element.article.libArticle);
            lig.push(element.quantiteDemandee);
            lig.push(element.article.prixVenteArticle);
            lig.push(element.article.prixVenteArticle*element.quantiteDemandee);
            lignes.push(lig);

            totalTTC += element.article.prixVenteArticle*element.quantiteDemandee;

          }

        });
        moment.locale('fr');
        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
        //doc.setFont("Times New Roman");
        doc.setFontSize(18);
        doc.text('DEMANDE APPROVISIONNEMENT', 53, 30);
        doc.setFontSize(14);
        doc.text('Référence : '+demandeAppro.numDA, 15, 45);
        doc.text('Date : '+moment(new Date(demandeAppro.dateDA.toString())).format('DD/MM/YYYY'), 152, 45);
        autoTable(doc, {
          theme: 'grid',
          head: [['Article', 'Désignation', 'Quantité', 'PU', 'Montant']],
          headStyles:{
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold' ,
        },
          margin: { top: 70 },
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
            ['Total', totalTTC]
          ]
          ,
        });

        autoTable(doc, {
          theme: 'plain',
          margin: { top: 100, left:130 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'center' },

          },
          body: [
            ['Le Régisseur\n\n\n\n\n'+this.serviceUser.connectedUser.nomUtilisateur+' '+this.serviceUser.connectedUser.prenomUtilisateur]
          ]
          ,
        });
        //doc.autoPrint();
        //doc.output('dataurlnewwindow');

        this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'demandeAppro.pdf'}));
        this.viewPdfModal.show();

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de demande dAppro', erreur)
      }
    );

  }

}
