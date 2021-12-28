import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Arrondissement } from '../../../models/arrondissement.model';
import { Commune } from '../../../models/commune.model';
import { Contrat } from '../../../models/contrat.model';
import { Departement } from '../../../models/departement.model';
import { Immeuble } from '../../../models/immeuble.model';
import { Locataire } from '../../../models/locataire.model';
import { Pays } from '../../../models/pays.model';
import { Quartier } from '../../../models/quartier.model';
import { SiteMarcher } from '../../../models/siteMarcher.model';
import { TypeImmeuble } from '../../../models/typeImmeuble.model';
import { LocataireService } from '../../../services/definition/locataire.service';
import { ValeurLocativeService } from '../../../services/definition/valeur-locative.service';
import { ContratLocationService } from '../../../services/saisie/contrat-location.service';
import * as moment from  'moment';

@Component({
  selector: 'app-contrat-location',
  templateUrl: './contrat-location.component.html',
  styleUrls: ['./contrat-location.component.css']
})
export class ContratLocationComponent implements OnInit {

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  addContratFormsGroup: FormGroup;
  editContratFormsGroup: FormGroup;
  contrats:Contrat[];
  editContrat:Contrat = new Contrat('', new Date(), new Date(), 0, 0, new Immeuble('', '', '', true, 0, '', ''
  , new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))
  , new Quartier('', '', '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', ''
  , new Pays('', '', ''))))), new TypeImmeuble('','', false, false, false, false, 1, 'Jour'), new SiteMarcher('', '', ''
  , new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))), ''
  , '', true, 0, 0, '', '', ''), new Locataire('','','','',''));
  suprContrat:Contrat = new Contrat('', new Date(), new Date(), 0, 0, new Immeuble('', '', '', true, 0, '', ''
  , new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))
  , new Quartier('', '', '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', ''
  , new Pays('', '', ''))))), new TypeImmeuble('','', false, false, false, false, 1, 'Jour'), new SiteMarcher('', '', ''
  , new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))), ''
  , '', true, 0, 0, '', '', ''), new Locataire('','','','',''));
  infosContrat:Contrat = new Contrat('', new Date(), new Date(), 0, 0, new Immeuble('', '', '', true, 0, '', ''
  , new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))
  , new Quartier('', '', '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', ''
  , new Pays('', '', ''))))), new TypeImmeuble('','', false, false, false, false, 1, 'Jour'), new SiteMarcher('', '', ''
  , new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))), ''
  , '', true, 0, 0, '', '', ''), new Locataire('','','','',''));

  //Quelques listes
  locataires: Locataire[] = [];
  valeurLocatives:Immeuble[] = [];
  typeValeursLocatives:TypeImmeuble[] = [];
  valeurLocativesByType:Immeuble[] = [];
  valeurLocativesByType2:Immeuble[] = [];

  constructor(private serviceContrat:ContratLocationService, private formBulder:FormBuilder,
    private serviceLocataire:LocataireService, private serviceImmeuble:ValeurLocativeService) {
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

    this.addContratFormsGroup = formBulder.group({
      addNumContrat:['', Validators.required],
      addDateSignatureContrat:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
      addDateEffetContrat:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
      addAvanceContrat:[0, Validators.required],
      addCautionContrat:[0, Validators.required],
      addImmeuble:[0, Validators.required],
      addLocataire:[0, Validators.required],
      addIndeTypeIm:[0, Validators.required],
      addDateFinContrat:''
    });

    this.editContratFormsGroup = formBulder.group({
      editNumContrat:['', Validators.required],
      editDateSignatureContrat:[new Date(), Validators.required],
      editDateEffetContrat:[new Date(), Validators.required],
      editAvanceContrat:[0, Validators.required],
      editCautionContrat:[0, Validators.required],
      editImmeuble:[0, Validators.required],
      editLocataire:[0, Validators.required],
      editIndeTypeIm:[1, Validators.required],
      editDateFinContrat:''
    });

  }

  ngOnInit(): void {
    this.serviceContrat.getAllContrat().subscribe(
      (data) => {
        this.contrats = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste de contrat : ', erreur);
      }
    );

    this.getAllLocataire();

    this.serviceImmeuble.getAllImmeuble().subscribe(
      (data) => {
        this.valeurLocatives = data;

        this.serviceImmeuble.getAllTypeImmeuble().subscribe(
          (data1) => {
            this.typeValeursLocatives = data1;
            if(this.typeValeursLocatives.length != 0){
              this.valeurLocativesByType = [];
              this.valeurLocatives.forEach(valeurLoca => {
                if(valeurLoca.typeImmeuble.codeTypIm === data1[0].codeTypIm && valeurLoca.etatIm == false){
                  this.valeurLocativesByType.push(valeurLoca);
                }
              });
            }
          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des type de valeur locative : ', erreur);
          }
        );


      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des immeubles : ', erreur);
      }
    );



  }

  getAllContrat(){
    this.serviceContrat.getAllContrat().subscribe(
      (data) => {
        this.contrats = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger1.next();
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste de contrat : ', erreur);
      }
    );
  }

  getAllLocataire(){
    this.serviceLocataire.getAllLocataire().subscribe(
      (data) => {
        this.locataires = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des locataires : ', erreur);
      }
    );
  }

  getAllImmeuble(){
    this.serviceImmeuble.getAllImmeuble().subscribe(
      (data) => {
        this.valeurLocatives = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des immeubles : ', erreur);
      }
    );
  }

  getAllTypeImmeuble(){
    this.serviceImmeuble.getAllTypeImmeuble().subscribe(
      (data) => {
        this.typeValeursLocatives = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des type de valeur locative : ', erreur);
      }
    );
  }

  getImmeublesByCodeType(code:String){
    this.valeurLocativesByType = [];
    this.valeurLocatives.forEach(valeurLoca => {
      if(valeurLoca.typeImmeuble.codeTypIm === code && valeurLoca.etatIm == false){
        this.valeurLocativesByType.push(valeurLoca);
      }
    });
  }

  getImmeublesByCodeType2(code:String){
    this.valeurLocativesByType2 = [];
    if(code == this.editContrat.immeuble.typeImmeuble.codeTypIm) this.valeurLocativesByType2.push({...this.editContrat.immeuble});
    this.valeurLocatives.forEach(valeurLoca => {
      if(valeurLoca.typeImmeuble.codeTypIm === code && valeurLoca.etatIm == false){
        this.valeurLocativesByType2.push(valeurLoca);
      }
    });
  }

  initEditContrat(inde:number){
    this.editContrat = this.contrats[inde];
    this.getImmeublesByCodeType2(this.editContrat.immeuble.typeImmeuble.codeTypIm);
    this.editContratFormsGroup.patchValue({
      editNumContrat: this.editContrat.numContrat,
      editDateSignatureContrat: this.editContrat.dateSignatureContrat,
      editDateEffetContrat: this.editContrat.dateEffetContrat,
      editAvanceContrat: this.editContrat.avanceContrat,
      editCautionContrat: this.editContrat.cautionContrat,
      editImmeuble: this.editContrat.immeuble.codeIm,
      editLocataire: this.editContrat.locataire.idLocataire,
      editIndeTypeIm: this.editContrat.immeuble.typeImmeuble.codeTypIm,
      editDateFinContrat: this.editContrat.dateFinContrat
    });
    this.warningModal.show();
  }

  initDeleteContrat(inde:number){
    this.suprContrat = this.contrats[inde];
    this.dangerModal.show();
  }

  initInfoContrat(inde:number){
    this.infosContrat = this.contrats[inde];
    this.infoModal.show();
  }

  onSubmitAddContratFormsGroup(){
    const newContrat = new Contrat(this.addContratFormsGroup.value['addNumContrat'],
    this.addContratFormsGroup.value['addDateSignatureContrat'],
    this.addContratFormsGroup.value['addDateEffetContrat'],
    this.addContratFormsGroup.value['addAvanceContrat'],
    this.addContratFormsGroup.value['addCautionContrat'],
    this.valeurLocativesByType.find(l => l.codeIm == this.addContratFormsGroup.value['addImmeuble']),
    this.locataires.find(l => l.idLocataire == this.addContratFormsGroup.value['addLocataire']));

    newContrat.dateFinContrat = this.addContratFormsGroup.value['addDateFinContrat'];

    //console.log(newContrat, this.addContratFormsGroup.value);

    this.serviceContrat.addAContrat(newContrat).subscribe(
      (data) => {
        //this.primaryModal.hide();
        this.addContratFormsGroup.patchValue({
          addNumContrat:'',
          addAvanceContrat:0,
          addCautionContrat:0,
          addDateFinContrat:''
        })

        //Mise au fin du Contrat Effectif
        let dt:Date = new Date(Date.now());
        let dt2:Date = null;
        if(data.dateFinContrat != null) dt2 = new Date(data.dateFinContrat);

        if(dt2 != null && dt2.getFullYear() <= dt.getFullYear()
          && dt2.getMonth() <= dt.getMonth() && dt2.getDate() <= dt.getDate()){
          data.immeuble.etatIm = false;

        }
        else{
          data.immeuble.etatIm = true;
        }

        //console.log('en location ?', data.immeuble.etatIm, data.dateFinContrat, new Date(Date.now()));

        this.serviceImmeuble.editImmeuble(data.immeuble.codeIm, data.immeuble).subscribe(
          (data2) => {
            this.getAllContrat();
            this.serviceImmeuble.getAllImmeuble().subscribe(
              (data3) => {
                this.valeurLocatives = data3;
                if(this.typeValeursLocatives.length != 0){
                  this.valeurLocativesByType = [];

                  this.valeurLocatives.forEach(valeurLoca => {

                    if(valeurLoca.typeImmeuble.codeTypIm === this.typeValeursLocatives.find(l => l.codeTypIm == this.addContratFormsGroup.value['addIndeTypeIm'])?.codeTypIm && valeurLoca.etatIm == false){
                      this.valeurLocativesByType.push(valeurLoca);
                    }
                  });

                  if(this.valeurLocativesByType.length == 0) this.addContratFormsGroup.value['addImmeuble'] = null;

                  //console.log('Les valeurs',this.addContratFormsGroup.value);
                }
              },
              (erreur) => {
                console.log('Erreur lors de la récupération de la liste des immeubles', erreur);
              }
            );

          },
          (erreur) => {
            console.log('Erreur lors de la modification de lEtat de lImmeuble', erreur);
          }
        );

      },
      (erreur) => {
        console.log('Erreur lors de lAjout du contrat : ', erreur);
      }
    );

  }

  onSubmitEditContratFormsGroup(){
    //console.log('sal', this.valeurLocativesByType[this.editContratFormsGroup.value['editImmeuble']], this.editContratFormsGroup.value['editImmeuble']);
    
    const newContrat = new Contrat(this.editContratFormsGroup.value['editNumContrat'],
    this.editContratFormsGroup.value['editDateSignatureContrat'],
    this.editContratFormsGroup.value['editDateEffetContrat'],
    this.editContratFormsGroup.value['editAvanceContrat'],
    this.editContratFormsGroup.value['editCautionContrat'],
    this.valeurLocativesByType2.find(l => l.codeIm == this.editContratFormsGroup.value['editImmeuble']),
    this.locataires.find(l => l.idLocataire == this.editContratFormsGroup.value['editLocataire']));

    newContrat.dateFinContrat = this.editContratFormsGroup.value['editDateFinContrat'];

    this.serviceContrat.editAContrat(this.editContrat.numContrat, newContrat).subscribe(
      (data) => {
        this.warningModal.hide();
        let dt:Date = new Date(Date.now());
        let dt2:Date = null;
        if(data.dateFinContrat != null) dt2 = new Date(data.dateFinContrat);

        if(dt2 != null && dt2.getFullYear() <= dt.getFullYear()
          && dt2.getMonth() <= dt.getMonth() && dt2.getDate() <= dt.getDate()){
          data.immeuble.etatIm = false;

        }
        else{
          data.immeuble.etatIm = true;
        }

        this.serviceImmeuble.editImmeuble(data.immeuble.codeIm, data.immeuble).subscribe(
          (data2) => {
            this.getAllContrat();
            this.serviceImmeuble.getAllImmeuble().subscribe(
              (data3) => {
                this.valeurLocatives = data3;
                if(this.typeValeursLocatives.length != 0){
                  this.valeurLocativesByType = [];

                  this.valeurLocatives.forEach(valeurLoca => {

                    if(valeurLoca.typeImmeuble.codeTypIm === this.typeValeursLocatives.find(l => l.codeTypIm == this.editContratFormsGroup.value['editIndeTypeIm'])?.codeTypIm && valeurLoca.etatIm == false){
                      this.valeurLocativesByType.push(valeurLoca);
                    }
                  });

                  if(this.valeurLocativesByType.length == 0) this.editContratFormsGroup.value['editImmeuble'] = null;

                  //console.log('Les valeurs',this.addContratFormsGroup.value);
                }
              },
              (erreur) => {
                console.log('Erreur lors de la récupération de la liste des immeubles', erreur);
              }
            );

          },
          (erreur) => {
            console.log('Erreur lors de la modification de lEtat de lImmeuble', erreur);
          }
        );


      },
      (erreur) => {
        console.log('Erreur lors de lEdition du Contrat : ', erreur);
      }
    );

  }

  onConfirmDeleteContrat(){
    console.log(this.suprContrat.numContrat);
    this.serviceContrat.deleteAContrat(this.suprContrat.numContrat).subscribe(
      (data) => {
        this.dangerModal.hide();

        if(this.suprContrat.immeuble.etatIm == true){
          this.suprContrat.immeuble.etatIm = false;
          this.serviceImmeuble.editImmeuble(this.suprContrat.immeuble.codeIm, this.suprContrat.immeuble).subscribe(
            (data2) => {
              this.getAllContrat();
              this.serviceImmeuble.getAllImmeuble().subscribe(
                (data11) => {
                  this.valeurLocatives = data11;

                  this.serviceImmeuble.getAllTypeImmeuble().subscribe(
                    (data1) => {
                      this.typeValeursLocatives = data1;
                      if(this.typeValeursLocatives.length != 0){
                        this.valeurLocativesByType = [];
                        this.valeurLocatives.forEach(valeurLoca => {
                          if(valeurLoca.typeImmeuble.codeTypIm === data1[0]?.codeTypIm && valeurLoca.etatIm == false){
                            this.valeurLocativesByType.push(valeurLoca);
                            this.valeurLocativesByType2.push(valeurLoca);
                          }
                        });

                      }
                    },
                    (erreur) => {
                      console.log('Erreur lors de la récupération de la liste des type de valeur locative : ', erreur);
                    }
                  );


                },
                (erreur) => {
                  console.log('Erreur lors de la récupération de la liste des immeubles : ', erreur);
                }
              );


            },
            (erreur) => {
              console.log('Erreur lors de la modification de lEtat de lImmeuble', erreur);
            }
          );
        }
        else{
          this.getAllContrat();
        }

      },
      (erreur) => {
        console.log('Erreur lors de la suppression du Contrat : ', erreur);
      }
    );

  }

  onTypeImmeubleClicked1(){
    if(this.typeValeursLocatives.length != 0){
      this.getImmeublesByCodeType(this.typeValeursLocatives.find(l => l.codeTypIm == this.addContratFormsGroup.value['addIndeTypeIm'])?.codeTypIm );
    }

  }

  onTypeImmeubleClicked2(){
    if(this.typeValeursLocatives.length != 0)
    this.getImmeublesByCodeType2(this.typeValeursLocatives.find(l => l.codeTypIm == this.editContratFormsGroup.value['editIndeTypeIm'])?.codeTypIm );
  }

}
