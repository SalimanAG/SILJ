import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { element } from 'protractor';
import { Subject } from 'rxjs';
import { Approvisionnement } from '../../../../models/approvisionnement.model';
import { Article } from '../../../../models/article.model';
import { DemandeApprovisionnement } from '../../../../models/demandeApprovisionnement.model';
import { Exercice } from '../../../../models/exercice.model';
import { Famille } from '../../../../models/famille.model';
import { LigneAppro } from '../../../../models/ligneAppro.model';
import { LigneDemandeAppro } from '../../../../models/ligneDemandeAppro.model';
import { PlageNumArticle } from '../../../../models/plageNumArticle.model';
import { Uniter } from '../../../../models/uniter.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { BonApproService } from '../../../../services/saisie/bon-appro.service';
import { DemandeApproService } from '../../../../services/saisie/demande-appro.service';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-bon-approvisionnement',
  templateUrl: './bon-approvisionnement.component.html',
  styleUrls: ['./bon-approvisionnement.component.css']
})
export class BonApprovisionnementComponent  implements OnInit {


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

  //Pour Appro
  approvisionnements:Approvisionnement[];
  editAppro:Approvisionnement = new Approvisionnement('', '', new Date(), new Exercice('', '', new Date(), new Date(), '', false));
  suprAppro:Approvisionnement = new Approvisionnement('', '', new Date(), new Exercice('', '', new Date(), new Date(), '', false));
  addApproFormsGroup:FormGroup;
  editApproFormsGroup:FormGroup;
  concernedDemandeAppro:DemandeApprovisionnement = new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false));

  ligneAppros:LigneAppro[] = [];
  tempAddLigneAppro:LigneAppro[] = [];
  tempEditLigneAppro:LigneAppro[] = [];
  tempDeleteLigneAppro:LigneAppro[] = [];

  plageNumArticles:PlageNumArticle[] = [];
  tempAddPlageNumArticle:PlageNumArticle[] = [];
  tempEditPlageNumArticle:PlageNumArticle[] = [];
  tempDeletePlageNumArticle:PlageNumArticle[] = [];

  oldApproLines:LigneAppro[] = [];
  oldPlageNumArtLines:PlageNumArticle[] = [];

  pdfToShow = null;

  constructor(public serviceExercice:ExerciceService, private serviceArticle:ArticleService, private serviceDemandeAppro:DemandeApproService,
    private formBulder:FormBuilder, private serviceBonAppro:BonApproService, private sanitizer:DomSanitizer) {

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

    this.addApproFormsGroup = this.formBulder.group({
      addNumAppro:['', Validators.required],
      addDescriptionAppro:'',
      addDateAppro:['', Validators.required],
      addDemandeAppro:[0, Validators.required]
    });

    this.editApproFormsGroup = this.formBulder.group({
      editNumAppro:['', Validators.required],
      editDescriptionAppro:'',
      editDateAppro:['', Validators.required],
      editDemandeAppro:[0, Validators.required]
    });

  }

  ngOnInit(): void {

    this.getAllLigneDemandeAppro();
    this.getAllExercice();
    this.getAllLigneAppro();
    this.getAllPlageNumArticle();

    this.serviceBonAppro.getAllAppro().subscribe(
      (data) => {
        this.approvisionnements = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Appro', erreur);
      }
    );

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

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des demandes dAppro', erreur);
      }
    );

  }

  onConcernedDemandeApproSelected(){
    if(this.demandeAppros.length!=0){
      this.concernedDemandeAppro = this.demandeAppros[this.addApproFormsGroup.value['addDemandeAppro']];
    }


  }

  getAllAppro(){
    this.serviceBonAppro.getAllAppro().subscribe(
      (data) => {
        this.approvisionnements = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Appro', erreur);
      }
    );
  }

  getAllLigneAppro(){
    this.serviceBonAppro.getAllLigneAppro().subscribe(
      (data) => {
        this.ligneAppros = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes dAppro', erreur);
      }
    );
  }

  getAllPlageNumArticle(){
    this.serviceBonAppro.getAllPlageNumArticle().subscribe(
      (data) => {
        this.plageNumArticles = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des plages de Numérotation', erreur);
      }
    );
  }

  getAllDemandeAppro(){
    this.serviceDemandeAppro.getAllDemandeAppro().subscribe(
      (data) => {
        this.demandeAppros = data;

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
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );
  }

  popALigneOfPlageNumArticle1(inde:number){

    this.tempAddPlageNumArticle.splice(inde, 1);
  }

  popALigneOfPlageNumArticle2(inde:number){

    this.tempEditPlageNumArticle.splice(inde, 1);
  }



  onShowAddArticleModalAddingCommande(){
    this.tempAddLigneDemandeAppro = [];

    this.serviceDemandeAppro.getAllLigneDemandeAppro().subscribe(
      (data) => {
        this.ligneDemandeAppros = data;
        this.ligneDemandeAppros.forEach(element => {

          if(element.appro.numDA == this.concernedDemandeAppro.numDA){
            this.tempAddLigneDemandeAppro.push(element);
          }
        });

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de demande dAppro', erreur)
      }
    );


    this.addArticle1.show();

  }

  onShowAddArticleModalEditingCommande(){
    this.tempEditLigneDemandeAppro = [];

    this.serviceDemandeAppro.getAllLigneDemandeAppro().subscribe(
      (data) => {
        this.ligneDemandeAppros = data;
        this.ligneDemandeAppros.forEach(element => {

          if(element.appro.numDA == this.concernedDemandeAppro.numDA){
            this.tempEditLigneDemandeAppro.push(element);
          }
        });

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de demande dAppro', erreur)
      }
    );


    this.addArticle2.show();

  }

  addArticleForAddingOfComm1(inde:number){
    let exist:boolean = false;
    this.tempAddLigneAppro.forEach(element => {
      if(element.ligneDA.article.codeArticle==this.tempAddLigneDemandeAppro[inde].article.codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempAddLigneAppro.push(new LigneAppro(this.tempAddLigneDemandeAppro[inde].quantiteDemandee, this.tempAddLigneDemandeAppro[inde].article.prixVenteArticle,
        new Approvisionnement('', '', new Date(), this.serviceExercice.exoSelectionner),
        this.tempAddLigneDemandeAppro[inde])
        );

      this.tempAddPlageNumArticle.push(new PlageNumArticle('0', '0', null, null, this.tempAddLigneAppro[this.tempAddLigneAppro.length-1]));

    }


  }

  addArticleForEditingOfComm1(inde:number){
    let exist:boolean = false;
    this.tempEditLigneAppro.forEach(element => {
      if(element.ligneDA.article.codeArticle==this.tempEditLigneDemandeAppro[inde].article.codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempEditLigneAppro.push(new LigneAppro(this.tempEditLigneDemandeAppro[inde].quantiteDemandee, this.tempEditLigneDemandeAppro[inde].article.prixVenteArticle,
        new Approvisionnement('', '', new Date(), this.serviceExercice.exoSelectionner),
        this.tempEditLigneDemandeAppro[inde])
        );

      console.log('Element',this.tempEditLigneAppro[this.tempEditLigneAppro.length-1]);

      this.tempEditPlageNumArticle.push(new PlageNumArticle('0', '0', null, null, this.tempEditLigneAppro[this.tempEditLigneAppro.length-1]));

      console.log('Element2', this.tempEditPlageNumArticle[this.tempEditPlageNumArticle.length-1]);

    }

  }

  popArticleAddingOfComm1(inde:number){
    this.tempAddLigneAppro.splice(inde, 1);
  }

  popArticleEditingOfComm1(inde:number){
    console.log('old', this.tempEditLigneAppro);
    this.tempEditLigneAppro.forEach((element, index) => {
      console.log(index, element);
    });
    console.log('Element à enlever', inde, this.tempEditLigneAppro[inde]);
    this.tempEditLigneAppro.splice(inde, 1);
    console.log('new',this.tempEditLigneAppro);
  }

  initAddAppro(){
    this.addComModal.show();
    if(this.demandeAppros.length!=0){
      this.concernedDemandeAppro = this.demandeAppros[0];
    }
  }

  initEditCommande(inde:number){


    this.tempEditLigneAppro = [];
    this.tempEditPlageNumArticle = [];
    this.editAppro = this.approvisionnements[inde];
    this.ligneAppros.forEach(element => {
      if(element.appro.numAppro == this.editAppro.numAppro){
        this.concernedDemandeAppro = element.ligneDA.appro;
        exit;
      }
      else{
        this.concernedDemandeAppro = this.demandeAppros[this.demandeAppros.length-1];
      }
    });

    this.serviceBonAppro.getAllLigneAppro().subscribe(
      (data) => {
        this.ligneAppros = data;
        this.ligneAppros.forEach(element => {
          if(element.appro.numAppro == this.editAppro.numAppro){
            this.tempEditLigneAppro.push(element);
            this.serviceBonAppro.getAllPlageNumArticle().subscribe(
              (data2) => {
                this.plageNumArticles = data2;
                this.plageNumArticles.forEach(element2 => {
                  if(element.idLigneAppro == element2.ligneAppro.idLigneAppro){
                    this.tempEditPlageNumArticle.push(element2);
                  }
                });
              },
              (erreur) => {
                console.log('Erreur lors de la récupération de la liste des plages', erreur);
              }
            );

          }
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes dAppro', erreur);
      }
    );

    this.oldApproLines = [];
    this.oldPlageNumArtLines = [];

    this.ligneAppros.forEach(element => {
      if(element.appro.numAppro == this.editAppro.numAppro){
        this.oldApproLines.push(element);
      }
    });

    this.plageNumArticles.forEach(element => {
      if(element.ligneAppro.appro.numAppro == this.editAppro.numAppro){
        this.oldPlageNumArtLines.push(element);
      }
    });

    this.editComModal.show();

    console.log(this.tempEditLigneAppro);

  }

  onAddAPlageNumArticleClicked1(inde:number){
    this.tempAddPlageNumArticle.push(new PlageNumArticle('0', '0', null, null, this.tempAddLigneAppro[inde]));
  }

  onAddAPlageNumArticleClicked2(inde:number){
    this.tempEditPlageNumArticle.push(new PlageNumArticle('0', '0', null, null, this.tempEditLigneAppro[inde]));
  }

  initDeleteCommande(inde:number){

    this.suprAppro = this.approvisionnements[inde];
    this.deleteComModal.show();
  }

  onSubmitAddCommandeFormsGroup(){

    const newAppro = new Approvisionnement(this.addApproFormsGroup.value['addNumAppro'],
    this.addApproFormsGroup.value['addDescriptionAppro'], this.addApproFormsGroup.value['addDateAppro'],
    this.serviceExercice.exoSelectionner);

    this.serviceBonAppro.addAAppro(newAppro).subscribe(
      (data) => {

        this.tempAddLigneAppro.forEach(element => {
          element.appro = data;
          this.serviceBonAppro.addALigneAppro(element).subscribe(
            (data2) => {

              this.tempAddPlageNumArticle.forEach(element2 => {
                if(element2.ligneAppro.ligneDA.idLigneDA == data2.ligneDA.idLigneDA){

                  element2.ligneAppro = data2;
                  this.serviceBonAppro.addAPlageNumArticle(element2).subscribe(
                    (data3) => {

                    },
                    (erreur) => {
                      console.log('Erreur lors de lAjout dUne plage de numéro dArticle', erreur);
                    }
                  );
                }
              });

            },
            (erreur) => {
              console.log('Erreur lors de lAjout dUne ligne dAppro', erreur);
            }
          );
        });

        this.addComModal.hide();
        this.getAllLigneAppro();
        this.getAllAppro();
        this.getAllPlageNumArticle();

      },
      (erreur) => {
        console.log('Erreur lors de lAjout de lAppro', erreur);
      }
    );



  }

  onSubmitEditCommandeFormsGroup(){

    const newAppro = new Approvisionnement(this.editApproFormsGroup.value['editNumAppro'],
    this.editApproFormsGroup.value['editDescriptionAppro'], this.editApproFormsGroup.value['editDateAppro'],
    this.serviceExercice.exoSelectionner);



    this.serviceBonAppro.editAAppro(this.editAppro.numAppro, newAppro).subscribe(
      (data) => {

        //Traitement des lignes d'Appro à ajouter et ou modifier
        this.tempEditLigneAppro.forEach(element => {
          let added:boolean = true;

          this.oldApproLines.forEach(element2 => {
            if(element.ligneDA.article.codeArticle == element2.ligneDA.article.codeArticle){
              added = false;
              this.serviceBonAppro.editALigneAppro(element2.idLigneAppro.toString(), element).subscribe(

                (data12) => {
                  this.tempEditPlageNumArticle.forEach(element3 => {
                    //filtrage important
                    if(element3.ligneAppro.ligneDA.idLigneDA === data12.ligneDA.idLigneDA){
                      let exis:boolean=false;

                      this.oldPlageNumArtLines.forEach(element4 => {
                        if(element3.idPlage === element4.idPlage){
                          exis = true;
                          this.serviceBonAppro.editAPlageNumArticle(element4.idPlage.toString(), element3).subscribe(
                            (data2) => {

                            },
                            (erreur) => {
                              console.log('Erreur lors de Ledition dUne plage', erreur);
                            }
                          );
                          exit;
                        }
                      });

                      if(exis == false){
                        console.log('Baddd');
                        element3.ligneAppro = data12;
                        this.serviceBonAppro.addAPlageNumArticle(element3).subscribe(
                          (data3) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de la création dUne plage de num', erreur);
                          }
                        );
                      }

                      //Suppression de ces lignes qui ont été supprimées par l'User
                      this.oldPlageNumArtLines.forEach(element4 => {
                        if(element4.ligneAppro.idLigneAppro == data12.idLigneAppro){
                          let maint:boolean = false;
                          this.tempEditPlageNumArticle.forEach(element5 => {
                            if(element4.idPlage === element5.idPlage){
                              maint = true;
                              exit;
                            }
                          });

                          if(maint == false){
                            this.serviceBonAppro.deleteAPlageNumArticle(element4.idPlage.toString()).subscribe(
                              (data4) => {

                              },
                              (erreur) => {
                                console.log('Erreur lors de la suppression dUne plage', erreur);
                              }
                            );
                          }
                        }


                      });

                    }
                  });
                },
                (erreur) => {
                  console.log('Erreur lors de la modification dUne ligne dAppro', erreur);
                }
              );
              exit;
            }
          });

          if(added==true){
            element.appro = data;
            console.log('+', element);
            this.serviceBonAppro.addALigneAppro(element).subscribe(
              (data9) => {
                console.log('liste', this.tempEditPlageNumArticle);
                this.tempEditPlageNumArticle.forEach(element3 => {
                  if(element3.ligneAppro.ligneDA.article.codeArticle == data9.ligneDA.article.codeArticle){
                    console.log('++', element3);
                    element3.ligneAppro = data9;
                    console.log('+++', element3);
                    this.serviceBonAppro.addAPlageNumArticle(element3).subscribe(
                      (data2) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de lAjout dUne nouvelle plage', erreur);
                      }
                    );
                  }
                });
              },
              (erreur) => {
                console.log('Erreur lors de la création dUne ligne dAppro', erreur);
              }
            );
          }


        });


        //Traitement des lignes de plages de numérotation à ajouter et ou modifier


        this.oldApproLines.forEach(element => {
          let mainte:boolean = false;
          this.tempEditLigneAppro.forEach(element2 => {
            if(element.idLigneAppro === element2.idLigneAppro){
              mainte = true;
              exit;
            }
          });

          if(mainte == false){
            this.oldPlageNumArtLines.forEach(element3 => {
              if(element3.ligneAppro.idLigneAppro === element.idLigneAppro){
                this.serviceBonAppro.deleteAPlageNumArticle(element3.idPlage.toString()).subscribe(
                  (data7) => {
                    this.serviceBonAppro.deleteALigneAppro(element.idLigneAppro.toString()).subscribe(
                      (data8) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de suppression dUne ligne dAppro', erreur);
                      }
                    );
                  },
                  (erreur) => {
                    console.log('Erreur lors de la suppression dUne plage', erreur);
                  }
                );



              }
            });

            this.serviceBonAppro.deleteALigneAppro(element.idLigneAppro.toString()).subscribe(
              (data8) => {

              },
              (erreur) => {
                console.log('Erreur lors de suppression dUne ligne dAppro', erreur);
              }
            );

          }

        });

        this.editComModal.hide();
        this.getAllAppro();
        this.getAllLigneAppro(),
        this.getAllPlageNumArticle();

      },
      (erreur) => {
        console.log('Erreur lors de la Modification de lAppro', erreur);
      }
    );


  }

  onConfirmDeleteCommande(){

    this.serviceBonAppro.getAllPlageNumArticle().subscribe(
      (data) => {
        this.plageNumArticles = data;
        this.serviceBonAppro.getAllLigneAppro().subscribe(
          (data2) => {
            this.ligneAppros = data2;
            //suppression pour les lignes d'Appro ayant de plage et qui concernent l'Appro
            this.plageNumArticles.forEach(element => {
              if(element.ligneAppro.appro.numAppro == this.suprAppro.numAppro){
                this.serviceBonAppro.deleteAPlageNumArticle(element.idPlage.toString()).subscribe(
                  (data3) => {
                    this.serviceBonAppro.deleteALigneAppro(element.ligneAppro.idLigneAppro.toString()).subscribe(
                      (data4) => {
                        this.serviceBonAppro.deleteAAppro(this.suprAppro.numAppro).subscribe(
                          (data5) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de la suppression du Bon dAppro', erreur);
                          }
                        );
                      },
                      (erreur) => {
                        console.log('Erreur lors de la suppression dUne ligne dAppro', erreur);
                      }
                    );
                  },
                  (erreur) => {
                    console.log('Erreur lors de la suppression dUne plage', erreur);
                  }
                );
              }

            });

            //suppression pour les lignes d'Appro n'ayant pas de plage d'Appro
            this.ligneAppros.forEach(element => {
              if(element.appro.numAppro == this.suprAppro.numAppro){
                this.serviceBonAppro.deleteALigneAppro(element.idLigneAppro.toString()).subscribe(
                  (data3) => {
                    this.serviceBonAppro.deleteAAppro(this.suprAppro.numAppro).subscribe(
                      (data4) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de la suppression de lAppro', erreur);
                      }
                    );
                  },
                  (erreur) => {
                    console.log('Erreur lors de la suppression dUne ligne dAppro', erreur);
                  }
                );
              }
            });

            //suppression pour un appro n'ayant pas de ligne
            this.serviceBonAppro.deleteAAppro(this.suprAppro.numAppro).subscribe(
              (data33) => {
                console.log('+++', data33);

              },
              (erreur) => {
                console.log('Erreur lors de la suppression de lAppro', erreur);
              }
            );

            this.deleteComModal.hide();
            this.getAllAppro();
            this.getAllLigneAppro();
            this.getAllPlageNumArticle();

          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des lignes dAppro', erreur);
          }
        );
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des plages', erreur);
      }
    );



  }

  initPrintToPdfOfAnAppro(inde:number){
    const appro = this.approvisionnements[inde];
    let approDemAppro = new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false));
    const doc = new jsPDF();
    let lignes = [];
    let plages:PlageNumArticle[] = [];
    let totalTTC;
    totalTTC = 0;

    this.plageNumArticles.forEach(element => {
      if(element.ligneAppro != null && element.ligneAppro.appro.numAppro == appro.numAppro){
        plages.push(element);
      }
    });


    this.ligneAppros.forEach(element => {
      if(element.appro.numAppro == appro.numAppro){
        let lig = [];
        approDemAppro = element.ligneDA.appro;
        lig.push(element.ligneDA.article.codeArticle);
        lig.push(element.ligneDA.article.libArticle);
        lig.push(element.quantiteLigneAppro);
        lig.push(element.puligneAppro);
        lig.push(element.puligneAppro*element.quantiteLigneAppro);
        let pla:String = '';
        let num:number = 0;
        plages.forEach((element2, index) => {

          if(element2.ligneAppro.idLigneAppro == element.idLigneAppro){

            if(num == 0){
              pla = pla.concat(''+element2.numDebPlage+' à '+element2.numFinPlage+' ');
              num = index;
            }
            else{
              pla = pla.concat('| '+element2.numDebPlage+' à '+element2.numFinPlage+' ');

            }
          }
        });
        lig.push(pla);
        lignes.push(lig);
        totalTTC += element.puligneAppro*element.quantiteLigneAppro;

      }

    });
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 20, 120, 15, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(22);
    doc.text('BON APPROVISIONNEMENT', 57, 30);
    doc.setFontSize(14);
    doc.text('Référence : '+appro.numAppro, 15, 45);
    doc.text('Date : '+appro.dateAppro, 152, 45);
    doc.text('Demande d\'Appro N° : '+approDemAppro.numDA+'\tDu\t'+approDemAppro.dateDA, 15, 55);
    doc.text('Description : '+appro.descriptionAppro, 15, 65);
    autoTable(doc, {
      head: [['Article', 'Désignation', 'Quantité', 'PU', 'Montant', 'Plage(s)']],
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
        ['Total TTC', totalTTC]
      ]
      ,
    });
    //doc.autoPrint();
    this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'bonAppro.pdf'}));
    this.viewPdfModal.show();
  }

}
