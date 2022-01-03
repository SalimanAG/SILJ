import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as xlsx from 'xlsx';
import * as moment from  'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ArticleService } from '../../services/definition/article.service';
import { ValeurLocativeService } from '../../services/definition/valeur-locative.service';
import { ContratLocationService } from '../../services/saisie/contrat-location.service';
import { Uniter } from '../../models/uniter.model';
import { exit } from 'process';
import { Famille } from '../../models/famille.model';
import { Article } from '../../models/article.model';
import { CommuneService } from '../../services/definition/commune.service';
import { Commune } from '../../models/commune.model';
import { Arrondissement } from '../../models/arrondissement.model';
import { Quartier } from '../../models/quartier.model';
import { SiteMarcher } from '../../models/siteMarcher.model';
import { TypeImmeuble } from '../../models/typeImmeuble.model';
import { Immeuble } from '../../models/immeuble.model';
import { PrixImmeuble } from '../../models/prixImmeuble.model';
import { LocataireService } from '../../services/definition/locataire.service';
import { Locataire } from '../../models/locataire.model';
import { Contrat } from '../../models/contrat.model';
import { ToastrService } from 'ngx-toastr';
import { Tools2Service } from '../../services/utilities/tools2.service';

@Component({
  selector: 'app-importation-exportation',
  templateUrl: './importation-exportation.component.html',
  styleUrls: ['./importation-exportation.component.css']
})
export class ImportationExportationComponent implements OnInit {

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};

  dtTrigger1: Subject<any> = new Subject<any>();

  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;


  opened:number = 0;
  clicked:number = 0;
  repport1FormsGroup: FormGroup;
  repport2FormsGroup: FormGroup;
  repport3FormsGroup: FormGroup;
  file: File;
  arrayBuffer:any;
  feuille:any;
  eventt:any;
  trigerred:boolean = false;

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

  constructor(private formBulder:FormBuilder, private serviceArticle:ArticleService,
     private serviceImmeuble:ValeurLocativeService, private serviceContrat:ContratLocationService,
     private serviceCommune:CommuneService, private serviceLocataire:LocataireService,
     private toastr: ToastrService) {
    moment.locale('fr');

    this.repport1FormsGroup = this.formBulder.group({
      rep1Element:0,
      rep1File:''
    });

    this.initDtOptions();
  }

  ngOnInit(): void {
  }

  manageCollapses(inde:number){
    this.opened = inde;
    this.clicked = inde;
  }

  getFile(event: any) {
    this.eventt = event;
    this.file = event.target.files[0];

    //console.log('event', event);
    //console.log('fichier', this.file);
    if(this.file !== undefined && this.file !== null) this.extraireDonnerFichier();

  }

  extraireDonnerFichier(){

    let fileReader = new FileReader();

    fileReader.onload = (e) => {

      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();

      //console.log('arraybuffer', this.arrayBuffer);
      //console.log('data', data);

      for (let i = 0; i !== data.length; i++) {
        arr[i] = String.fromCharCode(data[i]);
      }

      //console.log('Array', arr);

      const bstr = arr.join('');

      const workbook = xlsx.read(bstr, { type: 'binary', cellDates: true });
      //console.log('classeur', workbook);
      const first_sheet_name = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[first_sheet_name];
      this.feuille = xlsx.utils.sheet_to_json(worksheet, { raw: true, header: 1 });
      if(this.trigerred == false){
        this.dtTrigger1.next();
      }
      else{
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
      }

      this.toastr.success('Fichier Chargé avec Succès', 'Importation');

      //console.log('worksheet', worksheet);
      //console.log('sheet en JSON', this.feuille);

    };

    fileReader.readAsArrayBuffer(this.file);
  }

  onRep1ElementChange(){

    //this.dtTrigger1.unsubscribe();
    /*if(this.trigerred == false){
      this.dtTrigger1.next();
    }
    else{
      $('#dataTable1').dataTable().api().destroy();
      this.dtTrigger1.next();
    }*/
  }

  showFileContent(){
    this.viewPdfModal.show();

  }



  onRep1GenerateClicked(){

    if(this.repport1FormsGroup.value['rep1Element'] == 0){
      //Il s'agit d'uniter
      console.log(this.feuille);
      let inde:number = 0;
      for(const element of this.feuille) {
        inde++;
        if(element[0] != undefined && element[1] != undefined){
          let uniter = new Uniter(element[0], element[1]);
          (function(i, serviceArticle, toastr, nbrLigne){
            serviceArticle.addAUniter(uniter).subscribe(
              (data) => {
                if(data == null){
                  console.log('le code de la ligne '+i+' existe déjà');
                  //this.toastr.error('le code de la ligne '+inde+' existe déjà', 'Importation d\'unité');
                }

                if(i == nbrLigne){
                  console.log('Fin de lImportation, Importation réuissir');
                  toastr.success('Importation éffectuée avec Succès', 'Importation d\'unité');
                }

              },
              (erreur) => {
                console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                toastr.error('Erreur lors de l\'Ajout de la ligne '+(i)+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation d\'unité');
                return 1;
              }
            );

          })(inde, this.serviceArticle, this.toastr, this.feuille.length);

        }
        else {
          console.log('Erreur à la ligne '+inde+'Code ou libellé de Unité invalide');
          this.toastr.error('Erreur à la ligne '+(inde)+' Code ou libellé de Unité invalide', 'Importation d\'unité');
          return;
        }


      }

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 1){
      //Il s'agit de famille
      let inde:number = 0;
      for (const element of this.feuille) {
        if(element[0] != undefined && element[1] != undefined){
          inde++;
          let famille = new Famille(element[0], element[1]);

          (function(i, serviceArticle, toastr, nbrLigne){
            serviceArticle.addAFamille(famille).subscribe(
              (data) => {
                if(data == null){
                  console.log('le code de la ligne '+i+' existe déjà');

                }

                if(i == nbrLigne){
                  console.log('Fin de lImportation, Importation réuissir');
                  toastr.success('Importation éffectuée avec Succès', 'Importation de Famille');
                }

              },
              (erreur) => {
                console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                toastr.error('Erreur lors de lAjout de la ligne '+i+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Famille');

                return 1;
              }
            );

          })(inde, this.serviceArticle, this.toastr, this.feuille.length);

        }
        else {
          console.log('Erreur à la ligne '+inde+'Code ou libellé de Famille invalide');
          this.toastr.error('Erreur à la ligne '+inde+'Code ou libellé de Famille invalide', 'Importation de Famille');
          exit;
        }


      }

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 2){
      //Il s'agit d'Article

      this.serviceArticle.getAllFamille().subscribe(
        (data1) => {
          this.serviceArticle.getAllUniter().subscribe(
            (data2) => {
              let inde:number = 0;
               for (const element of this.feuille) {
                  inde++;
                  if(element[0] != undefined && element[1] != undefined && typeof element[2] == 'number'
                    && typeof element[4] == 'boolean' && typeof element[5] == 'boolean'
                    && typeof element[6] == 'boolean' && typeof element[7] == 'boolean'
                    && typeof element[8] != 'undefined' && typeof element[9] != 'undefined'){
                      let famill:Famille = null;
                      let unit:Uniter = null;
                      let finded1 = false;
                      let finded2 = false;
                      for(const element1 of data1) {
                        if(element1.codeFamille == element[8]){
                          famill = element1;
                          finded1 = true;
                          break;
                        }
                      }

                      if(!finded1){
                        console.log('Le code de Famille à la ligne '+inde+' nExiste pas. Importation interrompu.');
                        this.toastr.error('Le code de Famille à la ligne '+inde+' n\'Existe pas. Importation interrompu.', 'Importation d\'Article');
                        return;
                      }

                      for(const element2 of data2) {
                        if(element2.codeUniter == element[9]){
                          unit = element2;
                          finded2 = true;
                          break;
                        }

                      }

                      if(!finded2){
                        console.log('Le code dUnité à la ligne '+inde+' nExiste pas. Importation interrompu.');
                        this.toastr.error('Le code dUnité à la ligne '+inde+' n\'Existe pas. Importation interrompu.', 'Importation d\'Article');
                        return;
                      }

                    let article = new Article(element[0], element[1], element[6], element[5], element[4],
                      element[7], element[2], element[3], famill, unit);

                      (function(i, serviceArticle, toastr, nbrLigne){
                        serviceArticle.addArticle(article).subscribe(
                          (data) => {
                            if(data == null){
                              console.log('le code de la ligne '+i+' existe déjà');

                            }

                            if(i == nbrLigne){
                              console.log('Fin de lImportation, Importation réuissir');
                              toastr.success('Importation éffectuée avec Succès', 'Importation d\'Article');
                            }

                          },
                          (erreur) => {
                            console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                            toastr.error('Erreur lors de l\'Ajout de la ligne '+i+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation d\'Article');
                            return 1;
                          }
                        );

                      })(inde, this.serviceArticle, this.toastr, this.feuille.length);



                    }
                  else {
                    console.log('Erreur à la ligne '+inde+'invalidité dUne information');
                    this.toastr.error('Erreur à la ligne '+inde+'. Invalidité d\'Une information', 'Importation d\'Article');
                    return;
                  }


              }


            },
            (erreur) => {
              console.log('Erreur lors de la récupération des Unités', erreur);
              this.toastr.error('Erreur lors de la récupération des Unités'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation d\'Article');
            }
          );
        },
        (erreur) => {
          console.log('Erreur lors de la récupération des familles', erreur);
          this.toastr.error('Erreur lors de la récupération des familles'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation d\'Article');
        }
      );

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 3){
      //Il s'agit d'Arrondissement
      this.serviceCommune.getAllCommune().subscribe(
        (data1) => {

          let inde:number = 0;

          for(const element of this.feuille) {
            inde++;
            if(element[0] != undefined && element[1] != undefined && element[4] != undefined){
              let commu:Commune = null;
              let finded1:boolean = false;

              for (const element1 of data1) {
                if(element1.codeCommune == element[4]){
                  commu = element1;
                  finded1 = true;
                  break;
                }
              }

              if(!finded1){
                console.log('Le code de Commune à la ligne '+(inde+1)+' nExiste pas. Importation interrompue.');
                this.toastr.error('Le code de Commune à la ligne '+(inde+1)+' n\'Existe pas. Importation interrompue.', 'Importation d\'Arrondissement');
                return;
              }

              let arrondissement = new Arrondissement(element[0], element[1], element[2], element[3], commu);

              (function(i, serviceCommune, toastr, nbrLigne){
                serviceCommune.addArrondissement(arrondissement).subscribe(
                  (data) => {
                    if(data == null){
                      console.log('le code de la ligne '+(i)+' existe déjà');
                    }

                    if(i == nbrLigne){
                      console.log('Fin de lImportation, Importation réuissir');
                      toastr.success('Importation éffectuée avec Succès', 'Importation d\'Arrondissement');
                    }

                  },
                  (erreur) => {
                    console.log('Erreur lors de lAjout de la ligne '+(i), erreur);
                    toastr.error('Erreur lors de l`\'Ajout de la ligne '+(i)+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation d\'Arrondissement');
                    return 1;
                  }
                );

              })(inde, this.serviceCommune, this.toastr, this.feuille.length);

            }
            else {
              console.log('Erreur à la ligne '+(inde+1)+'Code ou libellé ou Code Commune de lArrondissement est invalide');
              this.toastr.error('Erreur à la ligne '+(inde+1)+'. Code ou libellé ou Code Commune de l\'Arrondissement est invalide'+'. Importation interrompu.', 'Importation d\'Arrondissement');
              return;
            }


          }


        },
        (erreur) => {
          console.log('Erreur lors de la récupération des communes', erreur);
          this.toastr.error('Erreur lors de la récupération des communes'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation d\'Arrondissement');
        }
      );

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 4){
      //Il s'agit de Quartier
      this.serviceCommune.getAllArrondissement().subscribe(
        (data1) => {
          let inde:number = 0;
          for( const element of this.feuille) {

            inde++;
            if(element[0] != undefined && element[1] != undefined && element[4] != undefined){
              let arron:Arrondissement = null;
              let finded1:boolean = false;

              for(const element1 of data1) {
                if(element1.codeArrondi == element[4]){
                  arron = element1;
                  finded1 = true;
                  break;
                }
              }

              if(!finded1){
                console.log('Le code de Arrondissement à la ligne '+(inde+1)+' nExiste pas. Importation interrompue.');
                return;
              }

              let quartier = new Quartier(element[0], element[1], element[2], element[3], arron);

              (function(i, serviceCommune, toastr, nbrLigne){
                serviceCommune.addQuartier(quartier).subscribe(
                  (data) => {
                    if(data == null){
                      console.log('le code de la ligne '+(i)+' existe déjà');
                    }

                    if(i == nbrLigne){
                      console.log('Fin de lImportation, Importation réuissir');
                      toastr.success('Importation éffectuée avec Succès', 'Importation de Quartier');
                    }

                  },
                  (erreur) => {
                    console.log('Erreur lors de lAjout de la ligne '+(i), erreur);
                    toastr.error('Erreur lors de l`\'Ajout de la ligne '+(i)+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Quartier');
                    return 1;
                  }
                );

              })(inde, this.serviceCommune, this.toastr, this.feuille.length);

            }
            else {
              console.log('Erreur à la ligne '+inde+'Code ou libellé ou Code Arrondissement du Quartier est invalide');
              this.toastr.error('Erreur à la ligne '+(inde)+'Code ou libellé ou Code Arrondissement du Quartier est invalide');
              return;
            }

          }


        },
        (erreur) => {
          console.log('Erreur lors de la récupération des Arrondissements', erreur);
          this.toastr.error('Erreur lors de la récupération des Arrondissements'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Quartier');
        }
      );

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 5){
      //Il s'agit de Site
      this.serviceCommune.getAllArrondissement().subscribe(
        (data1) => {
          let inde:number = 0;
          for(const element of this.feuille ) {
            inde++;
            if(element[0] != undefined && element[1] != undefined && element[3] != undefined){
              let arron:Arrondissement = null;
              let finded1:boolean = false;

              for(const element1 of data1){
                if(element1.codeArrondi == element[3]){
                  arron = element1;
                  finded1 = true;
                  break;
                }
              }

              if(!finded1){
                console.log('Le code de Arrondissement à la ligne '+(inde)+' nExiste pas. Importation interrompue.');
                this.toastr.error('Le code d\'Arrondissement à la ligne '+(inde)+' n\'existe pas.', 'Importation de Site');
                return;
              }

              let sit = new SiteMarcher(element[0], element[1], element[2], arron);

              (function(i, serviceCommune, toastr, nbrLigne){
                serviceCommune.addSiteMarcher(sit).subscribe(
                  (data) => {
                    if(data == null){
                      console.log('le code de la ligne '+(i)+' existe déjà');
                    }

                    if(i == nbrLigne){
                      console.log('Fin de lImportation, Importation réuissir');
                      toastr.success('Importation éffectuée avec Succès', 'Importation de Site');
                    }

                  },
                  (erreur) => {
                    console.log('Erreur lors de lAjout de la ligne '+(i), erreur);
                    toastr.error('Erreur lors de l`\'Ajout de la ligne '+(i)+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Site');
                    return 1;
                  }
                );

              })(inde, this.serviceCommune, this.toastr, this.feuille.length);

            }
            else {
              console.log('Erreur à la ligne '+inde+'Code ou libellé ou Code Arrondissement du Site est invalide');
              this.toastr.error('Erreur à la ligne '+inde+'Code ou libellé ou Code Arrondissement du Site est invalide', 'Importation de Site');
              return;
            }

          }


        },
        (erreur) => {
          console.log('Erreur lors de la récupération des Arrondissements', erreur);
          this.toastr.error('Erreur lors de la récupération des Arrondissements'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Site');
        }
      );

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 6){
      //Il s'agit des valeurs Locatives
      let liste: Immeuble[] = [];

      this.serviceCommune.getAllQuartier().subscribe(
        (data1) => {

          this.serviceCommune.getAllSiteMarcher().subscribe(
            (data2) => {

              this.serviceImmeuble.getAllTypeImmeuble().subscribe(
                (data3) => {
                  this.serviceCommune.getAllArrondissement().subscribe(
                    (data4) => {
                      let inde:number = 0;
                      for(const element of this.feuille){
                        inde++;
                        if(element[0] != undefined && element[1] != undefined && element[2] != undefined
                          && typeof element[3] == 'number' && element[9] != undefined
                          && element[7] != undefined 
                          && (element[12] == undefined || (typeof element[12] == 'boolean'))
                          && typeof element[13] == 'number' && typeof element[14] == 'number'){
                          let quartier:Quartier = null;
                          let arrondi:Arrondissement = null;
                          let site:SiteMarcher = null;
                          let typImme:TypeImmeuble = null;
                          let finded1:boolean = false;
                          let finded2:boolean = false;
                          let finded3:boolean = false;
                          let finded4:boolean = false;
                          let nbrNull: number = 0;

                          if(element[6]){
                            for(const element1 of data1){
                              if(element1.codeQuartier == element[6]){
                                quartier = element1;
                                finded1 = true;
                                break;
                              }
                            }
  
                            if(!finded1){
                              console.log('Le code de Quartier à la ligne '+(inde+1)+' nExiste pas. Importation interrompue.');
                              this.toastr.error('Le code de Quartier à la ligne '+(inde)+' n\'existe pas', 'Importation de Valeur Locative');
                              return;
                            }
                            nbrNull++;
                          }
                          
                          if (element[8]) {
                            for(const element2 of data2) {
                              if(element2.codeSite == element[8]){
                                site = element2;
                                finded2 = true;
                                break;
                              }
                            }
  
                            if(!finded2){
                              console.log('Le code de Site à la ligne '+(inde+1)+' nExiste pas. Importation interrompue.');
                              this.toastr.error('Le code de Site à la ligne '+(inde)+' n\'existe pas', 'Importation de Valeur Locative');
                              return;
                            }
                            nbrNull++;
                          }

                          if(nbrNull == 0){
                            console.log('Le code de Site et du Quartier sont tous non-renseignés à la ligne '+(inde)+' \n Veuillez renseigner une au moins. Importation interrompue.');
                            this.toastr.error('Le code de Site et du Quartier sont tous non-renseignés à la ligne '+(inde)+' \n Veuillez renseigner une au moins', 'Importation de Valeur Locative');
                            return;
                          }

                          for(const element3 of data3){
                            if(element3.codeTypIm == element[7]){
                              typImme = element3;
                              finded3 = true;
                              break;
                            }
                          }

                          if(!finded3){
                            console.log('Le code de Type Immeuble à la ligne '+(inde+1)+' nExiste pas. Importation interrompue.');
                            this.toastr.error('Le code de Type Valeur Locative à la ligne '+(inde)+' n\'existe pas', 'Importation de Valeur Locative');
                            return;
                          }

                          /*for(const element4 of data4){
                            if(element4.codeArrondi== element[9]){
                              arrondi = element4;
                              finded4 = true;
                              break;
                            }
                          }

                          if(!finded4){
                            console.log('Le code d\'arrondissement à la ligne '+(inde+1)+' nExiste pas. Importation interrompue.');
                            this.toastr.error('Le code d\'arrondissement à la ligne '+(inde)+' n\'existe pas', 'Importation de Valeur Locative');
                            return;
                          }*/

                          let valeurLoca:Immeuble = new Immeuble(element[0], element[1], element[2], false, element[3], element[4], element[5], quartier ? quartier.arrondissement : site.arrondissement, quartier, typImme, site, element[10], element[11], element[12], element[13], element[14], element[15], element[16], element[17]);

                          liste.push(valeurLoca);

                        }
                        else {
                          console.log('Erreur à la ligne '+(inde+1)+'. Une Informationn de la Valeur Locative est invalide');
                          this.toastr.error('Erreur à la ligne '+(inde)+'. Une Informationn de la Valeur Locative est invalide', 'Importation de Valeur Locative');
                          return;
                        }

                      }

                      
                      this.serviceImmeuble.addListImmeuble(liste).subscribe(
                        (data) => {
                          
                            console.log('Fin de lImportation, Importation réuissir');
                            this.toastr.success('Importation éffectuée avec Succès', 'Importation de Valeur Locative');
                          
                        },
                        (erreur) => {
                          console.log('Erreur lors de lAjout de la ligne ', erreur);
                          this.toastr.error('Erreur lors de l`\'Ajout des Valeurs locatives \n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Valeur Locative');
                          return 1;
                        }
                      );

                      
                    },
                    (erreur) => {
                      console.log('Erreur lors de la récupération des Arrondissements', erreur);
                      this.toastr.error('Erreur lors de la récupération des Arrondissements'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Valeur Locative');
                    }

                  );


                },
                (erreur) => {
                  console.log('Erreur lors de la récupération des Types Immeubles', erreur);
                  this.toastr.error('Erreur lors de la récupération des Types de Valeur Locative'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Valeur Locative');
                }
              );

            },
            (erreur) => {
              console.log('Erreur lors de la récupération des Sites', erreur);
              this.toastr.error('Erreur lors de la récupération des Sites'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Valeur Locative');
            }
          );

        },
        (erreur) => {
          console.log('Erreur lors de la récupération des quartiers', erreur);
          this.toastr.error('Erreur lors de la récupération des Quartiers'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Valeur Locative');
        }
      );

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 7){
      //Il s'agit des Prix de valeurs locative
      let liste: PrixImmeuble[] = [];

      this.serviceImmeuble.getAllTypeImmeuble().subscribe(
        (data1) => {

          let inde:number = 0;
          for(const element of this.feuille) {
            inde++;
            if(element[0] != undefined && typeof element[1] == 'number' && typeof element[2] == 'object'
              && typeof element[2].getDate() == 'number'){
              let typImme:TypeImmeuble = null;

              let finded1:boolean = false;

              for(const element1 of data1) {
                if(element1.codeTypIm == element[0]){
                  typImme = element1;
                  finded1 = true;
                  break;
                }
              }

              if(!finded1){
                console.log('Le code de Valeur Locative à la ligne '+(inde+1)+' nExiste pas. Importation interrompue.');
                this.toastr.error('Le code de Valeur Locative à la ligne '+(inde)+' n\'existe pas', 'Importation de Prix de Valeur Locative');
                return;
              }

              let PrixValeurLoca:PrixImmeuble = new PrixImmeuble(-1, element[2], element[3], element[1], typImme);

              liste.push(PrixValeurLoca);

            }
            else {
              console.log('Erreur à la ligne '+(inde+1)+'. Une Informationn sur le Prix de la Valeur Locative est invalide');
              this.toastr.error('Erreur à la ligne '+(inde)+'. Une Information sur le Prix de la Valeur Locative est invalide', 'Importation de Prix de Valeur Locative');
              return;
            }


          }

          
            this.serviceImmeuble.addListPrixImmeuble(liste).subscribe(
              (data) => {
                
                console.log('Fin de lImportation, Importation réuissir');
                this.toastr.success('Importation éffectuée avec Succès', 'Importation de Prix de Valeur Locative');

              },
              (erreur) => {
                console.log('Erreur lors de lAjout de la ligne ', erreur);
                this.toastr.error('Erreur lors de l`\'Ajout des prix de Valeur Locative\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Prix de Valeur Locative');
                return 1;
              }
            );


        },
        (erreur) => {
          console.log('Erreur lors de la récupération de la liste des valeurs locatives', erreur);
          this.toastr.error('Erreur lors de la récupération des Valeurs Locative'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Prix de Valeur Locative');
        }
      );

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 8){
      //Il s'agit des Locataires
      let inde:number = 0;
      let liste: Locataire [] = [];
      for(const element of this.feuille){
        inde++;
        if(typeof element[1] != 'undefined'){

          let locataire:Locataire = new Locataire (element[1], element[3], element[2], element[0], element[4], element[5]);
          liste.push(locataire);

        }
        else {
          console.log('Erreur à la ligne '+(inde+1)+'. Une Informationn sur le Locataire est invalide');
          this.toastr.error('Erreur à la ligne '+(inde)+'. Une Information sur le Locataire est invalide', 'Importation de Prix de Valeur Locative');
          return;
        }

      }

      this.serviceLocataire.addListALocataire(liste).subscribe(
        (data) => {
          
          this.toastr.success('Importation éffectuée avec Succès', 'Importation de Prix de Valeur Locative');

        },
        (erreur) => {
         
          this.toastr.error('Erreur lors de l`\'Ajout des Locataires \n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Prix de Valeur Locative');
          return 1;
        }
      );


    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 9){
      //Il s'agit des Contrats de Location
      let liste: Contrat[] = [];
      this.serviceLocataire.getAllLocataire().subscribe(
        (data2) => {
          this.serviceImmeuble.getAllImmeuble().subscribe(
            (data1) => {

                let inde:number = 0;
                for(const element of this.feuille) {
                  inde++;
                  if(element[0] != undefined && element[1] != undefined && element[2] != undefined
                    && typeof element[3] == 'number' && typeof element[4] == 'number'
                    && typeof element[5] == 'object' && typeof element[6] == 'object'
                    && typeof element[5].getDate() == 'number' && typeof element[6].getDate() == 'number'
                    && (element[7] == undefined || (typeof element[7] == 'object' && typeof element[7].getDate() == 'number'))){

                    

                        let locataire:Locataire = null;
                        let immeuble:Immeuble = null;
                        let finded1:boolean = false;
                        let finded2:boolean = false;

                        for(const element1 of data1) {
                          if(element1.codeIm == element[2]){
                            immeuble = element1;
                            finded1 = true;
                            break;
                          }
                        }

                        if(!finded1 || immeuble.etatIm == true){
                          console.log('Le code de Valeur Locative à la ligne '+(inde+1)+' nExiste pas Ou cette Valeur est en location selon une ligne déjà analyser. Importation interrompue.');
                          this.toastr.error('Le code de Valeur Locative à la ligne '+(inde)+' n\'existe pas OU cette Valeur est en location selon une ligne déjà analysé', 'Importation de Contrat de Location');
                          return;
                        }

                        for(const element2 of data2) {
                          if(element2.idLocataire == element[1] || element[1] == element2.numContibuable || element[1] == element2.ifuLocataire || element[1] == element2.telLocataire){
                            locataire = element2;
                            finded2 = true;
                            break;
                          }
                        }

                        if(!finded2){
                          console.log('Le code de Locataire à la ligne '+(inde+1)+' nExiste pas. Importation interrompue.');
                          this.toastr.error('Le code de Locataire à la ligne '+(inde)+' n\'existe pas', 'Importation de Contrat de Location');
                          return;
                        }

                        let contrat:Contrat = new Contrat(element[0], element[5], element[6], element[3], element[4], immeuble, locataire);

                        //Mise au fin du Contrat Effectif
                        let dt:Date = new Date(Date.now());
                        let dt2:Date = null;
                        if(contrat.dateFinContrat != null) dt2 = new Date(contrat.dateFinContrat);

                        if(dt2 != null && dt2.getFullYear() <= dt.getFullYear()
                          && dt2.getMonth() <= dt.getMonth() && dt2.getDate() <= dt.getDate()){
                          data1[data1.findIndex(l => l.codeIm == contrat.immeuble.codeIm)].etatIm = false;

                        }
                        else{
                          data1[data1.findIndex(l => l.codeIm == contrat.immeuble.codeIm)].etatIm = true;
                        }

                        liste.push(contrat);


                  }
                  else {
                    console.log('Erreur à la ligne '+(inde+1)+'. Une Informationn du Contrat de Location est invalide');
                    this.toastr.error('Erreur à la ligne '+(inde)+'. Une Information Contrat de Location est invalide', 'Importation de Prix de Valeur Locative');
                    return;
                  }

                }


                  this.serviceContrat.addListAContrat(liste).subscribe(
                    (data) => {
                        data1.forEach(elementDat1 => {
                          this.serviceImmeuble.editImmeuble(elementDat1.codeIm, elementDat1).subscribe(
                            (data11) => {
  
                            },
                            (erreur) => {
                              console.log('Erreur lors de la modification de lEtat de lImmeuble',elementDat1, erreur);
                              this.toastr.error('Erreur lors de la modification de l\'Etat de l\'Immeuble de la ligne '+elementDat1.codeIm+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Contrat de Location');
                              
                            }
                          );

                        });

                        this.toastr.success('Importation éffectuée avec Succès', 'Importation de Contrat de Location');

                      },
                    (erreur) => {
                      console.log('Erreur lors de lAjout de la ligne ', erreur);
                      this.toastr.error('Erreur lors de l`\'Ajout des contrats'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Contrat de Location');
                      return 1;
                    }

                    
                  );

                
            },
            (erreur) => {
              console.log('Erreur lors de la récupération de la liste des valeurs locatives', erreur);
              this.toastr.error('Erreur lors de la récupération de la liste des Valeurs Locative'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Contrat de Location');
              return;
            }
          );

        },
        (erreur) => {
          console.log('Erreur lors de la récupération de la liste des Locataires', erreur);
          this.toastr.error('Erreur lors de la récupération de la liste des Locataires'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Contrat de Location');
        }
      );


    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 10){
      //Il s'agit des Types de Valeur Locative
      let liste: TypeImmeuble[] = [];
      let inde:number = 0;
      for(const element of this.feuille) {
        inde++;
        if(element[0] != undefined && element[1] != undefined
          && typeof element[2] == 'boolean' && typeof element[3] == 'boolean'
          && typeof element[4] == 'boolean' && typeof element[5] == 'boolean'
          && typeof element[6] == 'number'){

          if(!Tools2Service.typePeriodes.find(l => l.code == element[6])){
            console.log('Le code de Périodicité à la ligne '+(inde+1)+' nExiste pas. Importation interrompue.');
            this.toastr.error('Le code de Périodicité à la ligne '+(inde)+' n\'existe pas', 'Importation de Type de Valeur Locative');
            return;
          }

          let typeImmeuble:TypeImmeuble = new TypeImmeuble(element[0], element[1], element[2], element[3], element[4], element[5], element[7], Tools2Service.typePeriodes.find(l => l.code == element[6]).name);

          liste.push(typeImmeuble);


        }
        else {
          console.log('Erreur à la ligne '+(inde+1)+'. Une Informationn du Type de VAleur Locative est invalide');
          this.toastr.error('Erreur à la ligne '+(inde)+'. Une Information du Types de Valeur Locative est invalide', 'Importation de Prix de Valeur Locative');
          return;
        }

      }


        this.serviceImmeuble.addListTypeImmeuble(liste).subscribe(
          (data) => {
              
            this.toastr.success('Importation éffectuée avec Succès', 'Importation de Type de Valeur Locative');

          },
          (erreur) => {
            console.log('Erreur lors de lAjout de la ligne ', erreur);
            this.toastr.error('Erreur lors de l`\'Ajout des Types de Valeur Locative'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Type de Valeur Locative');
            return 1;
          }

          
        );


    }


  }



}
