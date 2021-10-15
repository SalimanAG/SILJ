import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { data, error, valHooks } from 'jquery';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { from, pipe, Subject } from 'rxjs';
import { Article } from '../../../models/article.model';
import { Caisse } from '../../../models/caisse.model';
import { OpCaisse } from '../../../models/OpeCaisse.model';
import { OperationCaisseService } from '../../../services/saisie/operation-caisse.service';
import { TypeRecette } from '../../../models/type.model';
import { ModePaiement } from '../../../models/mode.model';
import { LigneOpCaisse } from '../../../models/ligneopcaisse.model';
import { Exercice } from '../../../models/exercice.model';
import { Utilisateur } from '../../../models/utilisateur.model';
import { InstituReverse } from '../../../models/institution.model';
import { exit } from 'process';
import { Locataire } from '../../../models/locataire.model';
import { Contrat } from '../../../models/contrat.model';
import { Immeuble } from '../../../models/immeuble.model';
import { Echeance } from '../../../models/echeance.model';
import { PrixImmeuble } from '../../../models/prixImmeuble.model';
import { ValeurLocativeService } from '../../../services/definition/valeur-locative.service';
import { DatePipe, formatDate } from '@angular/common';
import { PointVente } from '../../../models/pointVente.model';
import { LignePointVente } from '../../../models/lignePointVente.model';
import { Correspondant } from '../../../models/Correspondant.model';
import { Magasinier } from '../../../models/magasinier.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilisateurService } from '../../../services/administration/utilisateur.service';
import { element } from 'protractor';
import { Gerer } from '../../../models/gerer.model';
import { Affecter } from '../../../models/affecter.model';
import { PointVenteService } from '../../../services/saisie/point-vente.service';
import { log, time, timeStamp } from 'console';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CorrespondantService } from '../../../services/definition/correspondant.service';
import { Stocker } from '../../../models/stocker.model';
import { Magasin } from '../../../models/magasin.model';
import { ExerciceService } from '../../../services/administration/exercice.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ToolsService } from '../../../services/utilities/tools.service';
import { OpPrestBlock } from '../../../models/opprestlock.model';
import { OpLocBlock } from '../../../models/oployerbloc.model';
import { SearchOpCaisseDTO } from '../../../models/searchOpCaisseDTO.model';
@Component({
  selector: 'app-operation-caisse',
  templateUrl: './operation-caisse.component.html',
  styleUrls: ['./operation-caisse.component.css']
})
export class OperationCaisseComponent implements OnInit {

  // Les fenêtres
  @ViewChild('addVente') public addVente: ModalDirective;
  @ViewChild('addArticle') public addArticle: ModalDirective;
  @ViewChild('addLoyer') public addLoyer: ModalDirective;
  @ViewChild('detailOp') public detailOp: ModalDirective;
  @ViewChild('addImput') public addImput: ModalDirective;
  @ViewChild('appercu') public appercu: ModalDirective;
  @ViewChild('opAnnul') public opAnnul: ModalDirective;
  @ViewChild('recherche') public recherche: ModalDirective;
  @ViewChild('supOP') public supOP: ModalDirective;

  tittres: any[];
  lignes: any[];
  titre: any;
  pdfToShow: any;
  //// Accueil
  timp: String[] = ['Ticket', 'Reçu'];
  stk: Stocker[];
  annulop = new OpCaisse(null, null, null, null, '', null, null, null, null, null, null);
  tabDailyOp: DataTables.Settings = {};
  dtrigDailyOp: Subject<OpCaisse> = new Subject<OpCaisse>();
  tabAllOp: DataTables.Settings = {};
  dtrigAllOp: Subject<any> = new Subject<any>();
  listOp: OpCaisse[];
  opDay: OpCaisse[];
  Articles: Article[];
  affectations: Affecter[];
  affectUser: Affecter[];
  caissesValides: Caisse[] = [];
  opTypes: TypeRecette[];
  modes: ModePaiement[];
  exo: Exercice;
  exercices: Exercice[];
  users: Utilisateur[];
  user: Utilisateur;
  annulGroup: FormGroup;
  dtLigne: Subject<any> = new Subject<any>();

  annulations: OpCaisse[];

  /////// Vente
  tabArtV: DataTables.Settings = {};
  dtArt: Subject<Article> = new Subject<Article>();
  addVentGroup: FormGroup;
  line: OpCaisse[] = [];
  totalVente: number;
  totaltmp: number;
  tligne: number;
  lignesOp: LigneOpCaisse[];
  //////// Ajout d'article
  tabArt: DataTables.Settings = {};
  // dtArtV: Subject<any> = new Subject<any>();
  addArtGroup: FormGroup;
  tempLigneOpCais: LigneOpCaisse[] = [];
  lignesOfOp: LigneOpCaisse[];
  echancesOfOp: Echeance[];
  tmpOpC: OpCaisse;
  serVal: ValeurLocativeService;

  today: Date = new Date();
  //////// Détail opération de caise
  vnum: String; vdat: String; vcai: String; vcon: String; vtyp: String;
  vmod: String; vobs: String; vexo: String; vuse: String; dats: Date;
  eta: String; vtotal: number;
  detailGroup: FormGroup;
  tabDetail: DataTables.Settings = {};
  // dtrigDetail:Subject<any>=new Subject<any>();
  dtElt: DataTableDirective;

  /////// Location
  montantarepartir: number = 0;
  addLoyerGroup: FormGroup;
  locataires: Locataire[];
  tabEcheance: DataTables.Settings = {};
  dtTrigEche: Subject<Echeance> = new Subject<Echeance>();
  contrats: Contrat[];
  contratLocataire: Contrat[] = [];
  immeubles: Immeuble[];
  immeubleContrat: Immeuble[] = [];
  echeances: Echeance[];
  echeanceContrat: Echeance[] = [];
  exist: Echeance[] = [];
  echeanceAPayer: Echeance[] = [];
  echeancetmp: Echeance[] = [];
  prixIm: PrixImmeuble[];
  prixImm: PrixImmeuble[];
  totalLoyer: number;

  /////// Imputation
  addImputGroup: FormGroup;
  co: Correspondant[] = [];
  coi: Correspondant[] = [];
  tabLignePoint: DataTables.Settings = {};
  // dtPV:Subject<any>=new Subject<any>()
  caisses: Caisse[];
  ind: number = 0;
  pointV: PointVente[];
  pointVentOfCorrespondant: PointVente[];
  pointPayable: PointVente[];
  pointVenteSelected: PointVente[] = [];
  lignePV: LignePointVente[];
  pv: PointVente[];
  ImputLine: LignePointVente[] = [];
  lineOfPV: LignePointVente[];
  totalImput: number;
  total: number;
  deb=new Date(new Date().getFullYear(), new Date().getMonth(),
    new Date().getDate(),0,0);

    //Léo
    magasinierImpList: Correspondant[] = [];

  constructor(private serCor: CorrespondantService, private serU: UtilisateurService, public outil: ToolsService,
    private serExo:ExerciceService, private servPV: PointVenteService, private servOp: OperationCaisseService,
    private fbuilder: FormBuilder, private router: Router, private sanitizer: DomSanitizer, private tst: ToastrService,
  ) {
    this.pdfToShow=sanitizer.bypassSecurityTrustResourceUrl('/');

    this.exo = serExo.exoSelectionner;
    moment.locale('fr');


    this.tabDailyOp = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: 'Affichage de _MENU_ lignes par page',
        zeroRecords: 'Aucune ligne trouvée - Desolé',
        info: 'Affichage de la page _PAGE_ sur _PAGES_',
        infoEmpty: 'Pas de ligne trouvée',
        infoFiltered: '(Filtré à partie de _MAX_ lignes)',
        search: 'Rechercher',
        loadingRecords: 'Chargement en cours...',
        paginate: {
          first: 'Début',
          last: 'Fin',
          next: 'Suivant',
          previous: 'Précédent'
        }
      }
    };

    this.tabArtV = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: 'Affichage de _MENU_ lignes par page',
        zeroRecords: 'Aucune ligne trouvée - Desolé',
        info: 'Affichage de la page _PAGE_ sur _PAGES_',
        infoEmpty: 'Pas de ligne trouvée',
        infoFiltered: '(Filtré à partie de _MAX_ lignes)',
        search: 'Rechercher',
        loadingRecords: 'Chargement en cours...',
        paginate: {
          first: 'Début',
          last: 'Fin',
          next: 'Suivant',
          previous: 'Précédent'
        }
      }
    };

    this.tabArt = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: 'Affichage de _MENU_ lignes par page',
        zeroRecords: 'Aucune ligne trouvée - Desolé',
        info: 'Affichage de la page _PAGE_ sur _PAGES_',
        infoEmpty: 'Pas de ligne trouvée',
        infoFiltered: '(Filtré à partie de _MAX_ lignes)',
        search: 'Rechercher',
        loadingRecords: 'Chargement en cours...',
        paginate: {
          first: 'Début',
          last: 'Fin',
          next: 'Suivant',
          previous: 'Précédent'
        }
      }
    };

    this.tabEcheance = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: 'Affichage de _MENU_ lignes par page',
        zeroRecords: 'Aucune ligne trouvée - Desolé',
        info: 'Affichage de la page _PAGE_ sur _PAGES_',
        infoEmpty: 'Pas de ligne trouvée',
        infoFiltered: '(Filtré à partie de _MAX_ lignes)',
        search: 'Rechercher',
        loadingRecords: 'Chargement en cours...',
        paginate: {
          first: 'Début',
          last: 'Fin',
          next: 'Suivant',
          previous: 'Précédent'
        }
      }
    };

  }

  initOpCaisse() {
    this.addVentGroup = this.fbuilder.group({
      nVentNum: new FormControl('C2021-00001'),
      nVentDat: new FormControl(moment(new Date()).format('YYYY-MM-DDTHH:mm')),
      nVentCais: new FormControl(0),
      nVentMod: new FormControl(0),
      nVentCont: new FormControl(),
      nVentObs: new FormControl(),
      nTotalV: new FormControl(),
      tabVent: new FormControl(),
      depotVent: new FormControl(),
      monnaiVent: new FormControl(),
      reliqVent: new FormControl()
    });

    this.detailGroup = new FormGroup({
      vNum: new FormControl(),
      vDat: new FormControl(),
      vCai: new FormControl(),
      vTyp: new FormControl(),
      vMod: new FormControl(),
      vCon: new FormControl(),
      vObs: new FormControl()
    });

    this.addLoyerGroup = new FormGroup({
      loyLoc: new FormControl(-1),
      loyVL: new FormControl(-1),
      loyCai: new FormControl(0),
      loyCon: new FormControl(),
      loyMod: new FormControl(0),
      loyObs: new FormControl(),
      loyDat: new FormControl(moment(new Date()).format('YYYY-MM-DDTHH:mm')),
      loyMtt: new FormControl(''),
      loyRel: new FormControl(''),
      coche: new FormControl(),
      avce: new FormControl(''),
      loyMon: new FormControl('')
    });

    this.addImputGroup = new FormGroup({
      addImCor: new FormControl(0),
      addImDat: new FormControl(moment(new Date()).format('DD/MM/YYYY HH:mm')),
      addImCai: new FormControl(0),
      addImMod: new FormControl(0),
      addImObs: new FormControl(),
      addImPv: new FormControl(),
      imputDep: new FormControl(0),
      imputMon: new FormControl(),
      imputRel: new FormControl()
    });

    this.annulGroup = new FormGroup({
      motif: new FormControl(),
    });

    this.user = this.serU.connectedUser;

    this.chargerEcheances();
    this.rechargerLigneOpCaisse();
    this.chargerPV();
    this.ChargerAccessoires();
    this.chargerModes();
    this.chargerCaisse();

  }

  ngOnInit() {
    this.initOpCaisse();
    let typs: TypeRecette[];
    this.serCor.getAllCorrespondantImputable().subscribe(
      (data : any )=> {
        this.magasinierImpList = data

      }
    );

    let searchOpCaisseDTO = new SearchOpCaisseDTO;
    searchOpCaisseDTO.startDate = moment(new Date()).format('YYYY-MM-DD');
    searchOpCaisseDTO.endDate = moment(new Date()).format('YYYY-MM-DD');
 
     this.servOp.getAllOpCaisseOfDay(searchOpCaisseDTO).subscribe(
         (data) => {
           console.log('op caisse du jour ==>');
           console.log(data);
           this.listOp = data;
           this.opDay = data;
        
           this.dtrigDailyOp.next();
         },
         (erreur) => {
           console.log('Opération : ' + erreur);
         }
       );
  }

  chargerDailyOp() {
      let searchOpCaisseDTO = new SearchOpCaisseDTO;
      searchOpCaisseDTO.startDate = moment(new Date()).format('YYYY-MM-DD');
      searchOpCaisseDTO.endDate = moment(new Date()).format('YYYY-MM-DD');
   
       this.servOp.getAllOpCaisseOfDay(searchOpCaisseDTO).subscribe(
           (data) => {
             console.log('op caisse du jour ==>');
             console.log(data);
             this.listOp = data;
             this.opDay = data;
             $('#dtop').dataTable().api().destroy();
             this.dtrigDailyOp.next();
           },
           (erreur) => {
             console.log('Opération : ' + erreur);
           }
         );
  }

  chargerModes() {
    this.servOp.getAllModes().subscribe(
      data => {
        this.modes = data;
      },
      err => {
        console.error('Erreure de chargement : ', err);

      });
  }

  initAnnulations() {

  }

  fermeSup() {
    $('#dtop').dataTable().api().destroy();
    this.dtrigDailyOp.next();
    this.detailOp.hide();
  }

  chargerAnnulation() {
    this.servOp.getOpAnnulees().subscribe(
      (datan)=>{
        this.annulations = datan;
    });
  }

  initRecherche() { }

  supprimerOperation() {
    switch (this.annulop.typeRecette.codeTypRec) {
      case 'P': {
        this.rechargerLigneOpCaisse();
        this.lignesOfOp = this.lignesOp.filter(lop => lop.opCaisse.numOpCaisse === this.annulop.numOpCaisse);
        let i: number = this.lignesOfOp.length;
        this.lignesOfOp.forEach(elt => {
          this.servOp.deleteAOpLine(elt.idLigneOperCaisse).subscribe(
            datalop => {
              i--;
              if (i === 0) {
                this.rechargerLigneOpCaisse();
                this.servOp.deleteAOpCaiss(this.annulop.numOpCaisse).subscribe(
                  data => {
                    this.chargerDailyOp();
                    console.log('Suppression éffectuée avec succès');
                  },
                  err => {
                    console.log('La suppression a échoué');
                  }
                );
              }
            }
          );
        });
        break;
      }
      case 'L': {
        const echConc = this.echeances.filter(ec => ec.opCaisse.numOpCaisse === this.annulop.numOpCaisse);
        let i = echConc.length;
        echConc.forEach(elt => {
          this.servOp.delEcheance(elt.idEcheance).subscribe(
            datde => {
              this.chargerEcheances();
              i--;
              if (i === 0) {
                this.servOp.deleteAOpCaiss(this.annulop.numOpCaisse).subscribe(
                  data => {
                    this.chargerDailyOp();
                    console.log('Suppression éffectuée avec succès');
                  },
                  err => {
                    console.log('La suppression a échoué');
                  }
                );
              }
            });
        });
        break;
      }
      case 'I': {
        this.rechargerLigneOpCaisse();
        this.servPV.getAllPointVente()
          .subscribe(
            (data) => {
              this.pointV = data;
              const pv = this.pointV.filter(pt => pt.opCaisse.numOpCaisse === this.annulop.numOpCaisse);
              let i = pv.length;
              pv.forEach(elt => {
                const ptv = elt;
                ptv.payerPoint = false;
                this.servPV.editPointVente(elt.numPointVente, ptv).subscribe(
                  data => {
                    this.chargerPV();
                    i--;
                    if (i === 0) {
                      this.lignesOfOp = this.lignesOp.filter(lop => lop.opCaisse.numOpCaisse === this.annulop.numOpCaisse);
                      let j = this.lignesOfOp.length;
                      this.lignesOfOp.forEach(ele => {
                        this.servOp.deleteAOpLine(ele.idLigneOperCaisse).subscribe(
                          datalop => {
                            j--;
                            if (j === 0) {
                              this.rechargerLigneOpCaisse();
                              this.servOp.deleteAOpCaiss(this.annulop.numOpCaisse).subscribe(
                                data => {
                                  this.chargerDailyOp();
                                  console.log('Suppression éffectuée avec succès');
                                },
                                err => {
                                  console.log('La suppression a échoué');
                                }
                              );
                            }
                          }
                        );
                      });
                    }
                  }
                );
              });
            }
          );
        break;
      }
    }
    this.supOP.hide();
  }

  fermerAnnulation() {
    $('#dtop').dataTable().api().destroy();
    this.dtrigDailyOp.next();
    this.opAnnul.hide();
  }

  annulerOperation() {
    this.annulop.valideOpCaisse = false;
    this.annulop.annulMotif = this.annulGroup.value['motif'];
    this.annulop.datAnnul = new Date();
    this.annulop.auteurAnnul = this.user;
    this.servOp.editAOpCaiss(this.annulop.numOpCaisse, this.annulop).subscribe(
      data => {
        this.chargerDailyOp();
        switch (this.annulop.typeRecette.codeTypRec) {
          case 'L': {
            let echeancesOp = this.echeances.filter(e => e.opCaisse.numOpCaisse == this.annulop.numOpCaisse)
            echeancesOp.forEach(elt => {
              elt.payeEcheance = false;
              this.servOp.editEcheance(elt.idEcheance, elt).subscribe(
                (datae) => {
                },
                (erre) => {
                  console.log(erre);
                  this.annulop.valideOpCaisse = true;
                  this.annulop.annulMotif = null
                  this.annulop.datAnnul = null
                  this.annulop.auteurAnnul = null
                  this.servOp.editAOpCaiss(this.annulop.numOpCaisse, this.annulop).subscribe(
                    dataAnAn => {
                      this.tst.warning('Lannullation a échoué');
                    }
                  )
                }
              )
            })
            break;
          }
          case 'P': {
        const lop = this.lignesOp.filter(lop => lop.opCaisse.numOpCaisse === this.annulop.numOpCaisse);
        lop.forEach(elt => {
          if (elt.livre == true) {
            console.log('lig op editing: ', elt);


            this.serCor.getAllStocker().subscribe(
              (data) => {
                this.stk = data;
                const st = this.stk.find(stc => stc.article.codeArticle === elt.article.codeArticle &&
                  stc.magasin.codeMagasin === elt.magasin.codeMagasin);
            console.log('Ligne stocké concerné: ',st);
                const stc = new Stocker(st.quantiterStocker + elt.qteLigneOperCaisse, st.stockDeSecuriter, st.stockMinimal,
                  st.cmup, st.article, st.magasin);
                st.quantiterStocker += elt.qteLigneOperCaisse;
                this.serCor.editAStocker(st.idStocker.toString(), stc).subscribe(
                  data => {
                    const newlc = elt;
                    elt.livre = false;
                    this.servOp.editOpLine(elt.idLigneOperCaisse, elt).subscribe(
                      datalop => {
                      },
                      errlop => { }
                    );
                  }
                );
              });
          }
        });
        break;
      }
        }
      },
      (err) => { console.log('Annulation échouée', err); }
    );
    this.opAnnul.hide();
  }

  rechargerLigneOpCaisse() {
    this.servOp.getAllValideLines()
      .subscribe(
        (data) => {
          $('#datatable_ligneop').dataTable().api().destroy();
          this.lignesOp = data;
        },
        (err) => {
          console.log('all lines: ', err);
        }
      );
  }

  chargerDétailOpCaisse(opc: OpCaisse) {

    switch (opc.typeRecette.codeTypRec) {
      case 'L': {
        this.titre = 'Facture de loyer N° : ' + opc.numOpCaisse + ' du ' +
          moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm') + '\nDéposant : ' +
          opc.contribuable;
        this.tittres = ['Mois', 'Année', 'Loyer'];
        this.servOp.getEcheanceByOp(opc.numOpCaisse).subscribe(
          (datae) => {
            this.echancesOfOp = datae;
            this.vtotal = this.echancesOfOp.reduce(function (total, ligne) {
              return total + ligne.prix.valueOf();}, 0);
          }
        )
        break;
      }
      default: {
        this.titre = 'Facture de caisse N° : ' + opc.numOpCaisse + ' du ' +
          moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm') + '\nContribuable : ' +
          opc.contribuable;
        this.tittres = ['Codes', 'Libellé', 'Qte', 'Pu', 'Montant'];
        this.servOp.getLineByOp(opc.numOpCaisse).subscribe(
          (data) => {
            this.lignesOfOp = data;
            this.vtotal = this.lignesOfOp.reduce(function (total, ligne) {
              return total + ligne.prixLigneOperCaisse * ligne.qteLigneOperCaisse;
            }, 0);
          }
        )
        break;
      }
    }
  }

  initdetail(op: OpCaisse) {
    this.chargerDétailOpCaisse(op);
    this.detailOp.show();
    this.vnum = op.numOpCaisse;
    this.vcai = op.caisse.libeCaisse;
    this.dats = op.dateSaisie;
    this.vdat = moment(new Date(op.dateOpCaisse)).format('DD/MM/yyyy HH:mm');
    this.vobs = op.obsOpCaisse;
    this.vcon = op.contribuable;
    this.vuse = op.utilisateur.nomUtilisateur + ' ' + op.utilisateur.prenomUtilisateur;
    this.vexo = op.exercice.libExercice;
    this.vmod = op.modePaiement.libeModPay;
    this.vtyp = op.typeRecette.libeTypRec;

  }

  chargerCaisse() {
    this.servOp.getUserCaisse(this.user.idUtilisateur).subscribe(
      data => {
        this.caisses = data.map(d => d.caisse);

      }
    );

  }

  ChargerAccessoires() {

    ///// Contrats
    this.servOp.getAllContrats()
      .subscribe(
        (data) => {
          this.contrats = data;
        },
        err => {
          console.log('contrat: ', err);
        }
      );

    ///// Prix
    this.servOp.getAllPrixImmeuble()
      .subscribe(
        (data) => {
          this.prixIm = data;
        },
        err => {
          console.log('prix immeuble: ', err);
        }
      );

  }

  initAnnulOp(op: OpCaisse) {
    this.annulop = op;
    this.opAnnul.show();
  }

  chargerPV() {
    this.servOp.getAllPV().subscribe(
      data => {
        this.pointV = data;
      },
      err => {
        console.log('PV erreur ', err);
      }
    );
  }

  initSUpOP(op: OpCaisse) {
    this.chargerEcheances();
    this.rechargerLigneOpCaisse();
    this.annulop = op;
    this.supOP.show();
  }

  // Gestion des prestations
  initNewVente() {
    this.chargerModes();
    this.servOp.getUserCaisse(this.user.idUtilisateur).subscribe(
      data => {
        this.caisses = data.map(d => d.caisse);
        this.total = 0;
        this.tempLigneOpCais = [];
        /*;*/
        this.addVentGroup.patchValue({
          nVentDat: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
          nVentCont: '', nVentObs: '',nVentCais: 0, nVentMod: 0
        });
        this.tmpOpC = new OpCaisse('0001', new Date(), 'Divers', true, '', new Date(),
          this.caisses[0],
          new TypeRecette('P', 'Prestation'),
          this.modes[0], this.exo, this.user)
        this.addVente.show();

      }
    );

  }

  fermeVente() {
    $('#dtop').dataTable().api().destroy();
    this.dtrigDailyOp.next();
    this.addVente.hide();
  }

  ouvreAddArt() {
    this.servOp.getAllArticles()
      .subscribe(
        (data) => {
          this.Articles = data;
          $('#dt1').dataTable().api().destroy();
          this.dtArt.next();
        },
        (erreur) => {
          console.log('Erreur : ' + erreur);
        }
      );
    this.addArticle.show();
  }

  supTempLigneOpCais(i: number) {
    this.tempLigneOpCais.splice(i, 1);
    this.recalculerTotalvente();
  }

  choisirArticle(i: number) {
    const artChoisi = this.Articles[i];
    let trver = false;
    this.tempLigneOpCais.forEach(element => {
      if (element.article.codeArticle === artChoisi.codeArticle) {
        trver = true;
        exit;
      }
    });

    if (trver === false) {
      this.tempLigneOpCais.push(new LigneOpCaisse(0, artChoisi.prixVenteArticle, '', this.tmpOpC, artChoisi));
    }

  }

  recalculerTotalvente() {
    this.total = this.tempLigneOpCais.reduce((t, l) =>
      t += l.qteLigneOperCaisse * l.prixLigneOperCaisse, 0);
      this.recalculerReliquat();
  }

  recalculerReliquat(){
    this.addVentGroup.patchValue({reliqVent:this.addVentGroup.value['depotVent']-this.total-this.addVentGroup.value['monnaiVent']});
  }

  AjouteVente() {
    let op: OpCaisse;
    const dat: String = this.addVentGroup.value['nVentDat'];
    const datop = new Date(Number.parseInt(dat.substr(6, 4), 10), Number.parseInt(dat.substr(3, 2), 10) - 1,
      Number.parseInt(dat.substr(0, 2), 10), Number.parseInt(dat.substr(11, 2), 10), Number.parseInt(dat.substr(14, 2), 10));

    const newOC = new OpCaisse('01', new Date(this.addVentGroup.value['nVentDat']), this.addVentGroup.value['nVentCont'],
      true, this.addVentGroup.value['nVentObs'], new Date(), this.caisses[this.addVentGroup.value['nVentCais']],
      new TypeRecette('P', 'Prestation'), this.modes[this.addVentGroup.value['nVentMod']], this.serExo.exoSelectionner,
      this.user);
    newOC.annulMotif = null;
    newOC.mttRem = this.addVentGroup.value['depotVent'];
    newOC.monnai = this.addVentGroup.value['monnaiVent'];
    newOC.reliquat= this.addVentGroup.value['reliqVent'];
    console.log(newOC);

    this.servOp.addVente(new OpPrestBlock(newOC, this.tempLigneOpCais))
      .subscribe(
        (data) => {
          this.chargerDailyOp();
          this.imprimeTicket(data);
          this.tempLigneOpCais = [];
          this.addVentGroup.patchValue({
            nVentDat: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            nVentCont: '', nVentObs: '',nVentCais: 0, nVentMod: 0
          });

        },
        (err) => {
          console.log('Opération échouée', err);
          op = null;
        }
      );
  }

  afficheAvance(c: Contrat){
    console.log(c);
    
    this.addLoyerGroup.patchValue({avce:c.avanceContrat});
  }

  recalculerReliquatLoy(){
    this.addLoyerGroup.patchValue({loyRel:this.addLoyerGroup.value['avce']+this.addLoyerGroup.value['loyMtt']-this.total-this.addLoyerGroup.value['loyMon']});
  }

  initLoyer() {
    this.ChargerAccessoires;
    this.chargerEcheances();
    this.chargerLocataire();
    this.chargerModes();
    this.chargerCaisse();
        this.total = 0;
        this.addLoyer.show();
        this.tmpOpC = new OpCaisse(new Date().getUTCFullYear() + '-000001', new Date(), 'Divers', true, '', new Date(),
          this.caissesValides[0], new TypeRecette('VD', 'Prestation'), this.modes[0], this.exo, this.user);
        this.totalLoyer = 0;
        this.addLoyerGroup.patchValue({
          loyDat: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
          loyCont: '', loyObs: '', loyMod: 0, loyCai: 0
        });

    this.echeanceAPayer = [];
    this.dtTrigEche.next();

  }

  fermerLoyer() {
    $('#dtop').dataTable().api().destroy();
    $('#dteche').dataTable().api().destroy();
    this.dtrigDailyOp.next();
    this.addLoyer.hide();
  }

  ajoutePaiement() {
    if (this.echeanceAPayer.some(ech => ech.payeEcheance)) {
      const echeancepaye = this.echeanceAPayer.filter(e => e.payeEcheance === true);
      let j = this.echeanceAPayer.filter(e => e.payeEcheance === true).length;
      console.log(echeancepaye);


      if (this.addLoyerGroup.value['loyCai'] !== null && this.addLoyerGroup.value['loyMod'] !== null &&
        this.addLoyerGroup.value['loyDat'] !== null) {
        const dat: String = this.addLoyerGroup.value['loyDat'];
        const datop = new Date(Number.parseInt(dat.substr(6, 4), 10), Number.parseInt(dat.substr(3, 2), 10) - 1,
          Number.parseInt(dat.substr(0, 2), 10), Number.parseInt(dat.substr(11, 2), 10), Number.parseInt(dat.substr(14, 2), 10));
        const newOC = new OpCaisse('0001', new Date(this.addLoyerGroup.value['loyDat']), this.addLoyerGroup.value['loyCon'], true,
          this.addLoyerGroup.value['loyObs'], new Date(), this.caisses[this.addLoyerGroup.value['loyCai']],
          new TypeRecette('L', 'Location'), this.modes[this.addLoyerGroup.value['loyMod']], this.serExo.exoSelectionner,
          this.user);
        newOC.annulMotif = null;

        newOC.mttRem= this.addLoyerGroup.value['loyMtt'];
        newOC.monnai= this.addLoyerGroup.value['loyMon'];
        console.log(newOC);
        const bloc = new OpLocBlock(newOC, echeancepaye, this.addLoyerGroup.value['loyRel']);
        this.servOp.addLoyer(bloc).subscribe(
          data => {
            this.afficheFacture(data);
          },
          err => {
            console.log('Enregistrement échoué du paiement',err);

          }
        )
      } else {
        console.log('Vérifier que la caisse, la date, le mode et numéro du paiement sont renseignés');
      }
    } else {
      console.log('Veuillez cocher au moins une échéance à payer');
    }
    this.chargerDailyOp();
  }

  chargerImmeubles(loc: Locataire) {
    if (loc != null) {
      this.contratLocataire = this.contrats.filter(function (contrat) {
        return contrat.locataire.idLocataire === loc.idLocataire;
      });
    }
  }

  chargerPrixImmeubles(imm: Immeuble) {
    this.prixImm = this.prixIm.filter(p => p.immeuble.codeIm === imm.codeIm);
  }

  chargerEcheances() {
    this.servOp.getAllEcheances()
      .subscribe(
        (data) => {
          this.echeances = data;
        },
        err => {
          console.log('Echéances: ', err);
        }
      );
  }

  genererEcheancier(con: Contrat) {
    this.total=0
    if (con == null) {
      this.echeanceAPayer = [];
    } else {
      this.chargerPrixImmeubles(con.immeuble);
      let fa : Date;
      if (con.dateFinContrat == null) {
        fa = new Date(new Date().getFullYear(), 11, 31);
      } else {
        fa = new Date(con.dateFinContrat);
      }

      this.echeanceAPayer = [];
      this.totalLoyer = 0;
      let dde: Date = new Date(con.dateEffetContrat);
      const mois = new Array('Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
        'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre');
      const i = 0;
      // var fa = new Date();
        const des = new Date(dde.getFullYear(), dde.getMonth() + 1, dde.getDate());
        let n = 0;
      this.echeanceContrat = this.echeances.filter(eche => eche.contrat.numContrat === con.numContrat);
      while (des <= fa ) {
        n++;
        const exist = this.echeanceContrat.filter(function (eche) {
          return eche.contrat.numContrat === con.numContrat && eche.moisEcheance === mois[dde.getMonth()]
            && eche.annee === dde.getFullYear();
        });
        if (exist.length === 0) {
          const prix = this.prixImm.find(pri => pri.immeuble.codeIm === con.immeuble.codeIm &&
            ((new Date(dde) >= new Date(pri.dateDebPrixIm)  &&  new Date(dde) < new Date(pri.dateFinPrixIm))
            || (new Date(dde) >= new Date(pri.dateDebPrixIm)  && pri.dateFinPrixIm === null ))
          );

          if (prix != null) {
            let p = prix.prixIm;
            if (con.immeuble.valUnit === true) {
              p=p*con.immeuble.superficie
            } else {
              p = prix.prixIm;
            }
            const eche = new Echeance(mois[dde.getMonth()], dde.getFullYear(), new Date(des), false,
            p, con, null);
            this.echeanceAPayer.push(eche);
            n++;
          } else {
             alert('Il n\'y a pa de prix pour l\'échéance du ' + mois[des.getMonth() - 1] + ' ' +
               dde.getFullYear());
            break;
          }
        }
        dde = des;
        des.setMonth(des.getMonth() + 1);
      }
    }

    this.echeanceAPayer.sort((a, b) => a.dateEcheance.valueOf() - b.dateEcheance.valueOf());
    $('#dteche').dataTable().api().destroy();
    this.dtTrigEche.next();
    this.totalLoyer = 0;
  }

  chargerEcheancesContrat(con) {
    this.echeancetmp = this.echeances.filter(function (echeance) {
      return (echeance.contrat.numContrat == con.numContrat && echeance.payeEcheance == false);
    });
    this.totalLoyer = 0;
  }

  chargerLocataire() {
    this.servOp.getAllLocataires()
      .subscribe(
        (data) => {
          this.locataires = data;
        },
        (err) => {
          console.log('Locataire erreur: ', err);
        }
      );
  }

  considererEcheance(p: number) {
    if (this.echeanceAPayer[p].payeEcheance) {
      if (p > 0 && !this.echeanceAPayer[p - 1].payeEcheance) {
        alert('Veuillez payer les premières échéances');
        this.addLoyerGroup.patchValue({ coche: false })
      }
    } else {
      if (p > 0 && this.echeanceAPayer[p + 1].payeEcheance) {
        alert('Veuillez payer les premières échéances');
        this.addLoyerGroup.patchValue({ coche: false })
      }
    }
        this.echeanceAPayer.sort((a, b) => a.dateEcheance.valueOf() - b.dateEcheance.valueOf());
        $('#dteche').dataTable().api().destroy();
        this.dtTrigEche.next();
    this.total=this.echeanceAPayer.filter(e=>e.payeEcheance).reduce((t,e)=>t+=e.prix.valueOf(),0)
  }
  

  /// Gestion des imputations
  initNewImput() {
    this.addImputGroup.reset();
    this.pointPayable = [];
    this.totalLoyer = 0;
    this.addImput.show();
    this.addImputGroup.patchValue({
      addImDat: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
      addImCor: 0, addImMod: 0, addImCai: 0, addImPv: 0,
    });
    this.coi = this.pointV.filter(pp => pp.correspondant.imputableCorres === true && pp.payerPoint === false).map(pp => pp.correspondant);
  }

  fermerImput() {
    $('#dtop').dataTable().api().destroy();
   // this.dtrigDailyOp.next();
    this.addImput.hide();
  }

  chargerPointNI() {
    console.log(this.addImputGroup.value['addImPv']);
    
    //this.ImputLine = [];
    this.totalImput = 0;
    this.servPV.getAllLignePointVenteByNumPointVente(this.addImputGroup.value['addImPv'].toString()).subscribe(
        (data : any) => {
          this.ImputLine = data ;
          console.log(data);
          /*this.ImputLine.forEach(elet =>{
            this.totalImput +=elet.pulignePointVente*elet.quantiteLignePointVente;
          });*/
          this.total=data.reduce((t,l)=>t+=l.pulignePointVente*l.quantiteLignePointVente,0);
          this.recalculerReliquatImput();
        },
        (err) => {
          console.log('Locataire erreur: ', err);
        }
      );
  }

  recalculerReliquatImput(){
    this.addImputGroup.patchValue({imputRel:this.addImputGroup.value['imputDep']-this.total-this.addImputGroup.value['imputMon']});
  }

  ajouteImputation() {
    if (this.addImputGroup.value['addImMod'] != null && this.addImputGroup.value['addImDat'] != null &&
      this.addImputGroup.value['addImCai'] != null) {
      const dat = this.addImputGroup.value['addImDat'];
       const datop = new Date(Number.parseInt(dat.substr(6, 4), 10), Number.parseInt(dat.substr(3, 2), 10) - 1,
          Number.parseInt(dat.substr(0, 2), 10), Number.parseInt(dat.substr(11, 2), 10), Number.parseInt(dat.substr(14, 2), 10));
        const newOC = new OpCaisse('000001', new Date(this.addImputGroup.value['addImDat']),
        this.magasinierImpList[this.addImputGroup.value['addImCor']].magasinier.nomMagasinier + ' ' +
        this.magasinierImpList[this.addImputGroup.value['addImCor']].magasinier.prenomMagasinier, true, this.addImputGroup.value['addImObs'],new Date( Date.now()),
        this.caisses[this.addImputGroup.value['addImCai']], new TypeRecette('I', 'Imputation Correspondant'),
          this.modes[this.addImputGroup.value['addImMod']], this.serExo.exoSelectionner, this.user);
          newOC.mttRem=this.addImputGroup.value['imputDep'];
          newOC.monnai=this.addImputGroup.value['imputMon'];
          newOC.reliquat=this.addImputGroup.value['imputRel'];
          

          this.servPV.addImputation(newOC, this.addImputGroup.value['addImPv'].toString() ).subscribe(
            (data : any) => {
              console.log('data lines ==>');
              console.log(data);
              this.fermerImput();
              this.afficheFacture(data);
              
            },
            (err) => {
              console.log('Locataire erreur: ', err);
            }
          );

          let searchOpCaisseDTO = new SearchOpCaisseDTO;
          searchOpCaisseDTO.startDate = moment(new Date()).format('YYYY-MM-DD');
          searchOpCaisseDTO.endDate = moment(new Date()).format('YYYY-MM-DD');
       
           this.servOp.getAllOpCaisseOfDay(searchOpCaisseDTO).subscribe(
               (data) => {
                 console.log('op caisse du jour ==>');
                 console.log(data);
                 this.listOp = data;
                 this.opDay = data;
              
                 //this.dtrigDailyOp.next();
               },
               (erreur) => {
                 console.log('Opération : ' + erreur);
               }
             );

          
          
     

    } else {
      console.log('pas enregistrement');
    }
    this.chargerDailyOp();
  }

  chargerDetailOp(opc: OpCaisse) {
    this.lignes = [];
    this.total = 0;
    let lines
    switch (opc.typeRecette.codeTypRec) {
      case 'L': {
        this.titre = 'Facture de loyer N° : ' + opc.numOpCaisse + ' du ' +
          moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm') + '\nDéposant : ' +
          opc.contribuable;
        this.tittres = ['Mois', 'Année', 'Loyer'];
        break;
      }
      case 'P': {
        this.titre = 'Facture de caisse N° : ' + opc.numOpCaisse + ' du ' +
          moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm') + '\nContribuable : ' +
          opc.contribuable;
        this.tittres = ['Codes', 'Libellé', 'Qte', 'Pu', 'Montant'];
        this.servOp.getLineByOp(opc.numOpCaisse).subscribe(
          (data) => {
            lines = data;
            lines.forEach(element => {
              let lig = [];
              lig.push(element.article.codeArticle);
              lig.push(element.article.libArticle);
              lig.push(element.qteLigneOperCaisse);
              lig.push(element.prixLigneOperCaisse);
              lig.push(element.prixLigneOperCaisse * element.qteLigneOperCaisse);
              lig.push(element.commentaireLigneOperCaisse);
              this.total+= element.qteLigneOperCaisse * element.prixLigneOperCaisse
              this.lignes.push(lig);
            });
            //this.total = lines.reduce((t, l) => t += l.qteLigneOperCaisse * l.prixLigneOperCaisse, 0);
          }
        )
        break;
      }
      case 'I': {
        this.tittres = ['Codes', 'Libellé', 'Qte', 'Pu', 'Montant'];
        break;
      }
    }
    const fact = new jsPDF();
      fact.addImage(this.outil.entete, 5, 5, 190, 25);
      autoTable(fact, {
        theme: 'plain',
        margin: { left: 5, top: 30, right: 5, bottom: 1 },
        body: [[this.titre]],
        bodyStyles: {
          fontSize: 15,
          cellPadding: 1,
          halign: 'center',
        }
      });
  console.log(this.lignes);

      autoTable(fact, {
        head: [this.tittres],
        margin: { top: 60 },
        body: [this.lignes],
      });

      autoTable(fact, {
        theme: 'grid',
        margin: { top: 30, left: 130 },
        columnStyles: {
          0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        },
        body: [['Total', this.total]],
      });
      console.log('Total facture: '+ this.total);

      autoTable(fact, {
        theme: 'plain',
        margin: { top: 30, left: 130 },
        columnStyles: {
          0: { textColor: 0, fontStyle: 'bold', fontSize: 12, halign:'justify' },
        },
        body: [['Le(La) caissier(ère)' + '\n \n \n' + this.serU.connectedUser.nomUtilisateur + ' ' +
          this.serU.connectedUser.prenomUtilisateur]]
      });
      this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', { filename: 'facture.pdf' }));
      this.appercu.show();
  }


  afficheFacture(opc: OpCaisse) {
    const fact = new jsPDF();
    const lig= [];
    switch (opc.typeRecette.codeTypRec) {
      case 'L': {
        this.titre = 'Facture de loyer N° : ' + opc.numOpCaisse + ' du ' +
          moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm') + '\nDéposant : ' +
          opc.contribuable;
        this.tittres = ['Mois', 'Année', 'Echéance', 'Loyer'];
        this.servOp.getEcheanceByOp(opc.numOpCaisse).subscribe(
          data => {
              if (data.length > 0) {
              this.total = data.reduce((d, e) => d += e.prix.valueOf(), 0);
              data.forEach(elt => {
                const col = [];
                col.push(elt.moisEcheance);
                col.push(elt.annee);
                col.push(moment(new Date(elt.dateEcheance)).format('DD/MM/YYYY'));
                col.push(elt.prix);
                lig.push(col)
              });

              fact.addImage(this.outil.entete, 5, 5, 190, 25);
              autoTable(fact, {
                theme: 'plain',
                margin: { left: 5, top: 30, right: 5, bottom: 1 },
                body: [[this.titre]],
                bodyStyles: {
                  fontSize: 15,
                  cellPadding: 1,
                  halign: 'center',
                }
              });

              autoTable(fact, {
                head: [this.tittres],
                margin: { top: 60 },
                body: lig,
              });
              autoTable(fact, {
                theme: 'grid',
                margin: { top: 30, left: 130 },
                columnStyles: {
                  0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                },
                body: [['Total', this.total]],
              });

              autoTable(fact, {
                theme: 'grid',
                margin: { top: 0, left: 30, right: 5 },
                columnStyles: {
                  0: { textColor: 255, fontStyle: 'bold', fontSize: 8 },
                },
                body: [
                  ['Montant perçu: \t'+ opc.mttRem,'Monnaie rendue: \t'+ opc.monnai,'\tReliquat restant: '+ opc.reliquat]
                ],
                bodyStyles: {
                  fontSize: 8,
                  cellPadding: 1,
                },
              });

              autoTable(fact, {
                theme: 'plain',
                margin: { top: 30, left: 130 },
                columnStyles: {
                  0: { textColor: 0, fontStyle: 'bold', fontSize: 12, halign:'justify' },
                },
                body: [['Le(La) caissier(ère)' + '\n \n \n' + this.serU.connectedUser.nomUtilisateur + ' ' +
                  this.serU.connectedUser.prenomUtilisateur]]
              });
                this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', { filename: 'facture.pdf' }));
    this.appercu.show();
            }
          }
        )
        break;
      }
      case 'P': {
        this.titre = 'Facture de caisse N° : ' + opc.numOpCaisse + ' du ' +
          moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm') + '\nContribuable : ' +
          opc.contribuable;
        this.tittres = ['Codes', 'Libellé', 'Qte', 'Pu', 'Montant'];
        this.servOp.getLineByOp(opc.numOpCaisse).subscribe(
          (data) => {
              if (data.length > 0) {
              this.total = data.reduce((d, e) => d += e.qteLigneOperCaisse*e.prixLigneOperCaisse.valueOf(), 0);
              data.forEach(elt => {
                const col = [];
                col.push(elt.article.codeArticle);
                col.push(elt.article.libArticle);
                col.push(elt.qteLigneOperCaisse);
                col.push(elt.prixLigneOperCaisse);
                col.push(elt.prixLigneOperCaisse*elt.qteLigneOperCaisse);
                lig.push(col)
              });

              fact.addImage(this.outil.entete, 5, 5, 190, 25);
              autoTable(fact, {
                theme: 'plain',
                margin: { left: 5, top: 30, right: 5, bottom: 1 },
                body: [[this.titre]],
                bodyStyles: {
                  fontSize: 15,
                  cellPadding: 1,
                  halign: 'center',
                }
              });

              autoTable(fact, {
                head: [this.tittres],
                margin: { top: 60 },
                body: lig,
              });
              autoTable(fact, {
                theme: 'grid',
                margin: { top: 30, left: 130 },
                columnStyles: {
                  0: { textColor: 255, fontStyle: 'bold' },
                },
                body: [['Total', this.total]],
              });

              autoTable(fact, {
                theme: 'grid',
                margin: { top: 0, left: 30, right: 5 },
                columnStyles: {
                  0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                },
                body: [
                  ['Montant perçu: \t'+ opc.mttRem,'Monnaie rendue: \t'+ opc.monnai,'\tReliquat restant: '+ opc.reliquat]
                ],
                bodyStyles: {
                  fontSize: 8,
                  cellPadding: 1,
                },
              });

              autoTable(fact, {
                theme: 'plain',
                margin: { top: 30, left: 130 },
                columnStyles: {
                  0: { textColor: 0, fontStyle: 'bold', fontSize: 12, halign:'justify' },
                },
                body: [['Le(La) caissier(ère)' + '\n \n \n' + this.serU.connectedUser.nomUtilisateur + ' ' +
                  this.serU.connectedUser.prenomUtilisateur]]
              });
                this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', { filename: 'facture.pdf' }));
    this.appercu.show();
            }
          }
        )
        break;
      }
      
      case 'I': {
        this.titre = 'Facture de reversement N° : ' + opc.numOpCaisse + ' du ' +
          moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm') + '\nCorrespondant : ' +
          opc.contribuable;
        this.tittres = ['Codes', 'Libellé', 'Qte', 'Pu', 'Montant'];
        this.servOp.getLignePVByOp(opc.numOpCaisse).subscribe(
          (data) => {
            console.log(data);
              if (data.length > 0) {
              this.total = data.reduce((d, e) => d += e.quantiteLignePointVente*e.pulignePointVente.valueOf(), 0);
              data.forEach(elt => {
                const col = [];
                col.push(elt.article.codeArticle);
                col.push(elt.article.libArticle);
                col.push(elt.quantiteLignePointVente);
                col.push(elt.pulignePointVente);
                col.push(elt.pulignePointVente*elt.quantiteLignePointVente);
                lig.push(col)
              });

              fact.addImage(this.outil.entete, 5, 5, 190, 25);
              autoTable(fact, {
                theme: 'plain',
                margin: { left: 5, top: 30, right: 5, bottom: 1 },
                body: [[this.titre]],
                bodyStyles: {
                  fontSize: 15,
                  cellPadding: 1,
                  halign: 'center',
                }
              });

              autoTable(fact, {
                head: [this.tittres],
                margin: { top: 60 },
                body: lig,
              });
              autoTable(fact, {
                theme: 'grid',
                margin: { top: 30, left: 130 },
                columnStyles: {
                  0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                },
                body: [['Total', this.total]],
              });
              autoTable(fact, {
                theme: 'plain',
                margin: { top: 30, left: 130 },
                columnStyles: {
                  0: { textColor: 0, fontStyle: 'bold', fontSize: 12, halign:'justify' },
                },
                body: [['Le(La) caissier(ère)' + '\n \n \n' + this.serU.connectedUser.nomUtilisateur + ' ' +
                  this.serU.connectedUser.prenomUtilisateur]]
              });
                this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', { filename: 'facture.pdf' }));
    this.appercu.show();
            }
          }
        )
        break;
      }
    }
  }

  //change 
  showPointVente(corres : Correspondant){
    this.pointVentOfCorrespondant = null;
 
    /*if (corres.idCorrespondant == undefined ) {

      this.servPV.getAllPointVenteNonPayByCorrespondant(this.magasinierImpList[0].idCorrespondant).subscribe(
        (data : any )=> {
          console.log(data);
          this.pointVentOfCorrespondant = data;
        }
      );
      
    }
    else*/  if(corres != null || corres != undefined){
      this.servPV.getAllPointVenteNonPayByCorrespondant(corres.idCorrespondant).subscribe(
        (data : any )=> {
          console.log(data);
          this.pointVentOfCorrespondant = data;
          
        }
      );

    }
  }

  imprimeFacture(opc: OpCaisse) {
    const fact = new jsPDF();fact.addImage(this.outil.entete, 5, 5, 190, 25);
    let titre: String;
    const ligne = [];
    let total = 0;

    switch (opc.typeRecette.codeTypRec) {
      default: {
        titre = 'Facture de caisse N° : ' + opc.numOpCaisse +
          ' du : ' + moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm') + '\nContribuable : ' + opc.contribuable;
        autoTable(fact, {
          theme: 'plain',
          margin: { left: 5, top: 30, right: 5, bottom: 1 },
          body: [
            [titre.toString()]
          ],
          bodyStyles: {
            fontSize: 15,
            cellPadding: 1,
            halign: 'center',
          }
        });
        this.rechargerLigneOpCaisse();
        const loptmp = this.lignesOp.filter(function (lop) {
          return lop.opCaisse.numOpCaisse === opc.numOpCaisse;
        });
        loptmp.forEach(element => {
          const lig = [];
          lig.push(element.article.codeArticle);
          lig.push(element.article.libArticle);
          lig.push(element.qteLigneOperCaisse);
          lig.push(element.prixLigneOperCaisse);
          lig.push(element.prixLigneOperCaisse * element.qteLigneOperCaisse);
          lig.push(element.commentaireLigneOperCaisse);
          total += element.prixLigneOperCaisse * element.qteLigneOperCaisse;
          ligne.push(lig);
        });
        autoTable(fact, {
          head: [['Article', 'Désignation', 'Qte', 'PU', 'Montant', 'Obs']],
          margin: { top: 60 },
          body: ligne,
        });
        break;
      }

      case 'L': {
        const eche = this.echeances.filter(e => e.opCaisse.numOpCaisse === opc.numOpCaisse);
        titre = '\nContrat de location N° : ' + eche[0].contrat.numContrat +
          '\nBoutique :' + eche[0].contrat.immeuble.libIm +

          '\nFacture de loyer N° : ' + opc.numOpCaisse + ' du ' +
          moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm') +
          '\nLocataire : ' + eche[0].contrat.locataire.identiteLocataire +
          '\nDéposant : ' + opc.contribuable;
        autoTable(fact, {
          theme: 'plain',
          margin: { left: 5, top: 30, right: 5, bottom: 1 },
          body: [
            [titre.toString()]
          ],
          bodyStyles: {
            fontSize: 15,
            cellPadding: 1,
            halign: 'center',
          }
        });
        eche.forEach(element => {
          const lig = [];
          lig.push(element.moisEcheance);
          lig.push(element.annee);
          lig.push(element.prix);
          ligne.push(lig);
          total += element.prix.valueOf();
        });
        autoTable(fact, {
          head: [['Mois', 'Année', 'Montant']],
          margin: { top: 70 },
          body: ligne,
        });

        break;
      }
    }

    autoTable(fact, {
      theme: 'grid',
      margin: { top: 30, left: 130 },
      columnStyles: {
        0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      },
      body: [['Total', total]
      ],
    });
    autoTable(fact, {
      theme: 'plain',
      margin: { top: 30, left: 130 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', fontSize: 12, halign:'justify' },
      },
      body: [['Le(La) caissier(ère)' + '\n \n \n' + this.serU.connectedUser.nomUtilisateur + ' ' +
        this.serU.connectedUser.prenomUtilisateur]]
    });
    fact.autoPrint();
    this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', { filename: 'facture.pdf' }));
    // this.appercu.show();
  }

  imprimeTicket(opc: OpCaisse) {
    const fact = new jsPDF('p', 'mm', [80, 900]);
    fact.addImage(this.outil.entete, 0, 0, 80, 13);
    autoTable(fact, {
      theme: 'plain',
      margin: { left: -0.1, top: 15, right: 0, bottom: 1 },
      body: [
        ['Ticket N° : ' + opc.numOpCaisse + ' du : ' +
          moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm') + '\nContribuable : '
          + opc.contribuable]
      ],
      bodyStyles: {
        fontSize: 12,
        cellPadding: 1,
        halign: 'center',
      }
    });
    const ligne = [];
    let total = 0;

    this.servOp.getAllOpLines()
      .subscribe(
        (data3) => {
          this.lignesOp = data3;
          const loptmp = this.lignesOp.filter(function (lop) {
            return lop.opCaisse.numOpCaisse === opc.numOpCaisse;
          });
          loptmp.forEach(element => {
            const lig = [];
            lig.push(element.article.codeArticle);
            lig.push(element.article.libArticle);
            lig.push(element.qteLigneOperCaisse);
            lig.push(element.prixLigneOperCaisse);
            lig.push(element.prixLigneOperCaisse * element.qteLigneOperCaisse);
            total += element.prixLigneOperCaisse * element.qteLigneOperCaisse;
            ligne.push(lig);
          });

          autoTable(fact, {
            theme: 'grid',
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold',
            },
            styles: {
              fontSize: 8,
            },
            head: [['Article', 'Désignation', 'Qte', 'PU', 'Montant']],
            margin: { top: 0, left: 5, right: 5 },
            body: ligne,
          });

          autoTable(fact, {
            theme: 'grid',
            margin: { top: 0, left: 30, right: 5 },
            columnStyles: {
              0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            },
            body: [
              ['Total', total]
            ],
            bodyStyles: {
              fontSize: 8,
              cellPadding: 1,
            },
          });
          autoTable(fact, {
            theme: 'plain',
            margin: { left: -0.1, top: 5, right: 0 },
            body: [
              ['Le(La) caissier(ère)' + '\n\n\n' + this.serU.connectedUser.nomUtilisateur + ' ' +
                this.serU.connectedUser.prenomUtilisateur]
            ],
            bodyStyles: {
              fontSize: 10,
              //cellPadding: ,
              halign: 'center',
              fontStyle: 'bold'
            },

          });

          this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', { filename: 'facture.pdf' }));
          this.appercu.show();

        },
        (err) => {
          console.log('all lines: ', err);
        }
      );
  }

}
