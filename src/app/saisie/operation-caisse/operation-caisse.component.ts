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

  pdfToShow: any;
  //// Accueil
  timp: String[] = ['Ticket', 'Reçu'];
  stk: Stocker[];
  annulop = new OpCaisse(null, null, null, null, '', null, null, null, null, null, null);
  tabDailyOp: DataTables.Settings = {};
  dtrigDailyOp: Subject<any> = new Subject<any>();
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
  // tabLigne:DataTables.Settings={};
  dtLigne: Subject<any> = new Subject<any>();

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
  ind: number = 0;
  pointV: PointVente[];
  pointPayable: PointVente[];
  lignePV: LignePointVente[];
  pv: PointVente[];
  ImputLine: LignePointVente[] = [];
  lineOfPV: LignePointVente[];
  totalImput: number;
  total: number;

  constructor(private serCor: CorrespondantService, private serU: UtilisateurService, private serExo: ExerciceService,
    private servPV: PointVenteService,
    private servOp: OperationCaisseService, private fbuilder: FormBuilder, private router: Router,
    private sanitizer: DomSanitizer, private tst: ToastrService) {


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

    this.tabAllOp = {
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
      tabVent: new FormControl()
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
      coche: new FormControl()
    });

    this.addImputGroup = new FormGroup({
      addImCor: new FormControl(0),
      addImDat: new FormControl(moment(new Date()).format('YYYY-MM-DDTHH:mm')),
      addImCai: new FormControl(0),
      addImMod: new FormControl(0),
      addImObs: new FormControl(),
    });

    this.user = this.serU.connectedUser;
    this.chargerEcheances();
    this.rechargerLigneOpCaisse();
    this.chargerPV();
    this.ChargerAccessoires();
  }

  ngOnInit() {
    this.servOp.getAllOp()
      .subscribe(
        (data) => {
          this.listOp = data;
          this.dtrigAllOp.next();
          this.opDay = this.listOp.filter(op => op.utilisateur.idUtilisateur === this.serU.connectedUser.idUtilisateur &&
            new Date(op.dateSaisie).toLocaleDateString().substr(0, 10) === new Date().toLocaleDateString().substr(0, 10)
          );
          this.dtrigDailyOp.next();
        },
        (erreur) => {
          console.log('Opération : ' + erreur);
        }
      );
    this.initOpCaisse();

    let typs: TypeRecette[];
    this.servOp.getAllTypes().subscribe(
      data => {
        typs = data;
        if (typs.length == 0) {
          this.servOp.addATypes(new TypeRecette('P', 'Prestation')).subscribe(
            data => {
              this.servOp.addATypes(new TypeRecette('L', 'Prestation')).subscribe(
                data => {
                  this.servOp.addATypes(new TypeRecette('I', 'Prestation')).subscribe();
                }
              );
            },
            erre => {
              console.error('Erreur ajout de type: ', erre);

            }
          );
        }
      }
    );

    let mod: ModePaiement[];
    this.servOp.getAllModes().subscribe(
      data => {
        mod = data;
        if (mod.length == 0) {
          this.servOp.addAMode(new ModePaiement('E', 'Espèces')).subscribe(
            data => {
              this.servOp.addAMode(new ModePaiement('C', 'Chèque')).subscribe(
                data => {
                  this.servOp.addAMode(new ModePaiement('M', 'Monnaie mobile')).subscribe();
                }
              );
            },
            err => {
              console.error('Erreut ajout de mode : ', err);

            }
          );
        }
      }
    );

  }

  fermeSup() {
    $('#dtop').dataTable().api().destroy();
    this.dtrigDailyOp.next();
    this.detailOp.hide();
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
                    this.chargerOperations();
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
                    this.chargerOperations();
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
                                  this.chargerOperations();
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

  annulerOperation(opc: OpCaisse) {
    const op = opc;
    op.valideOpCaisse = false;
    switch (opc.typeRecette.codeTypRec) {
      case 'P': {
        const lop = this.lignesOp.filter(lop => lop.opCaisse.numOpCaisse === opc.numOpCaisse);
        let n: number = 0;
        lop.forEach(elt => {
          if (elt.livre === true) {
            this.serCor.getAllStocker().subscribe(
              (data) => {
                this.stk = data;
                const st = this.stk.find(stc => stc.article.codeArticle === elt.article.codeArticle &&
                  stc.magasin.codeMagasin === elt.magasin.codeMagasin);
                const stc = new Stocker(st.quantiterStocker + elt.qteLigneOperCaisse, st.stockDeSecuriter, st.stockMinimal,
                  st.cmup, st.article, st.magasin);
                st.quantiterStocker += elt.qteLigneOperCaisse;
                this.serCor.editAStocker(st.idStocker.toString(), stc).subscribe(
                  data => {
                    const newlc = elt;
                    elt.livre = false;
                    this.servOp.editOpLine(elt.idLigneOperCaisse, elt).subscribe(
                      datalop => {
                        n++;
                        if (n === lop.length) {
                          this.rechargerLigneOpCaisse();
                          this.servOp.editAOpCaiss(opc.numOpCaisse, op).subscribe(
                            data => {
                              this.chargerOperations();
                            },
                            erran => {
                              console.log('Annulation échouée');
                            }
                          );
                        }
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
      case 'L': {
        this.servOp.getAllEcheances()
          .subscribe(
            (data) => {
              this.echeances = data;
              this.echeances.filter(ec => ec.opCaisse.numOpCaisse === opc.numOpCaisse).forEach(elt => {
                const ech = elt;
                ech.payeEcheance = false;
                this.servOp.editEcheance(elt.idEcheance, ech).subscribe(
                  data => {
                    if (this.echeances.filter(ec => ec.opCaisse.numOpCaisse === opc.numOpCaisse).length === 0) {
                      this.servOp.editAOpCaiss(opc.numOpCaisse, op).subscribe(
                        data => {
                          this.servOp.getAllOp().subscribe(
                            dataop => {
                              console.log('Annulation effectuée avec succès');
                              this.listOp = dataop;
                              $('#dtop').dataTable().api().destroy();
                              this.dtrigAllOp.next();
                            }
                          );
                        },
                        erran => {
                          console.log('Annulation échouée');
                        }
                      );
                    }
                  }
                );
              });
            }
          );
        break;
      }
      case 'I': {
        this.servPV.getAllPointVente()
          .subscribe(
            (data) => {
              this.pointV = data;
              this.pointV.filter(pt => pt.opCaisse.numOpCaisse === opc.numOpCaisse).forEach(elt => {
                const ptv = elt;
                ptv.payerPoint = false;
                this.servPV.editPointVente(elt.numPointVente, ptv).subscribe(
                  data => {
                    if (this.pointV.filter(pt => pt.opCaisse.numOpCaisse === opc.numOpCaisse).length === 0) {
                      this.servOp.editAOpCaiss(opc.numOpCaisse, op).subscribe(
                        data => {
                          console.log('Annulation effectuée avec succès');
                          this.chargerOperations();
                        },
                        erran => {
                          console.log('Annulation échouée');
                        }
                      );
                    }
                  }
                );
              });
            }
          );
        break;
      }
    }
    this.opAnnul.hide();
  }

  rechargerLigneOpCaisse() {
    this.servOp.getAllOpLines()
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

  chargerDétailOpCaisse(opcai: OpCaisse) {
    this.rechargerLigneOpCaisse();
    console.log('nombre total de ligne: ', this.listOp.length);
    this.lignesOfOp = this.lignesOp.filter(function (ligne) {
      return ligne.opCaisse.numOpCaisse === opcai.numOpCaisse;
    });
    this.vtotal = this.lignesOfOp.reduce(function (total, ligne) {
      return total + ligne.prixLigneOperCaisse * ligne.qteLigneOperCaisse;
    }, 0);
    console.log(this.lignesOfOp.length + ' lignes concernée(s)');
  }

  initdetail(op: OpCaisse) {
    this.chargerDétailOpCaisse(op);
    this.detailOp.show();
    this.vnum = op.numOpCaisse;
    this.vcai = op.caisse.libeCaisse;
    this.dats = op.dateSaisie;
    this.vdat = op.dateOpCaisse.toLocaleDateString();
    this.vobs = op.obsOpCaisse;
    this.vcon = op.contribuable;
    this.vuse = op.utilisateur.nomUtilisateur + ' ' + op.utilisateur.prenomUtilisateur;
    this.vexo = op.exercice.libExercice;
    this.vmod = op.modePaiement.libeModPay;
    this.vtyp = op.typeRecette.libeTypRec;

  }

  chargerOperations() {
    this.servOp.getAllOp()
      .subscribe(
        (data) => {
          this.listOp = data;
          this.opDay = this.listOp.filter(op => op.utilisateur.idUtilisateur === this.serU.connectedUser.idUtilisateur &&
            new Date(op.dateSaisie).toLocaleDateString().substr(0, 10) === new Date().toLocaleDateString().substr(0, 10)
          );
        },
        (erreur) => {
          console.log('Opération : ' + erreur);
        }
      );
  }

  ChargerAccessoires() {
    // Modes de paiement
    this.servOp.getAllModes()
      .subscribe(
        (data) => {
          this.modes = data;
        },
        (err) => {
          console.log('Modes: ', err);
        }
      );

    // Affectations aux caisses
    this.servOp.getAllAffectations()
      .subscribe(
        (data) => {
          this.affectations = data;
          this.affectUser = this.affectations.filter(af =>
            af.utilisateur.idUtilisateur === this.user.idUtilisateur &&
            // new Date(af.dateDebAffecter) <= new Date() &&
            af.dateFinAffecter == null
          );
          this.caissesValides = this.affectUser.map(au => au.caisse);
        },
        (err) => {
          console.log('Affectations', err);

        }
      );

    /// Types
    this.servOp.getAllTypes()
      .subscribe(
        (data) => {
          this.opTypes = data;
        },
        (err) => {
          console.log('types erreur: ', err);
        }
      );

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

    ///// Point vente
    this.servOp.getAllPV()
      .subscribe(
        (data) => {
          this.pointV = data;
        },
        err => {
          console.log('point Vente: ', err);
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
    this.totalVente = 0;
    this.tmpOpC = new OpCaisse('0001', new Date(), 'Divers', true, '', new Date(),
      this.caissesValides[0], this.opTypes[0], this.modes[0], this.exo, this.user);
    this.addVente.show();
    this.addVentGroup.patchValue({
      nVentDat: moment(new Date()).format('DD/MM/YYYY HH:mm'),
      nVentCont: '', nVentObs: ''
    });
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

  recupererTotalVente(n: number) {
    console.log('tempon');
    this.tligne = this.tempLigneOpCais[n].qteLigneOperCaisse * this.tempLigneOpCais[n].qteLigneOperCaisse;
    console.log('Total ligne: ' + this.tligne);

  }

  recalculerTotalvente() {
    this.totalVente = 0;
    this.tempLigneOpCais.forEach(elt => {
      this.totalVente += elt.qteLigneOperCaisse * elt.prixLigneOperCaisse;
    });
  }

  AjouteVente() {
    let op: OpCaisse;
    const dat: String = this.addVentGroup.value['nVentDat'];
    const datop = new Date(Number.parseInt(dat.substr(6, 4), 10), Number.parseInt(dat.substr(3, 2), 10) - 1,
      Number.parseInt(dat.substr(0, 2), 10), Number.parseInt(dat.substr(11, 2), 10), Number.parseInt(dat.substr(14, 2), 10));

    const newOC = new OpCaisse('01', new Date(this.addVentGroup.value['nVentDat']), this.addVentGroup.value['nVentCont'],
      true, this.addVentGroup.value['nVentObs'], new Date(), this.caissesValides[this.addVentGroup.value['nVentCais']],
      new TypeRecette('P', 'Prestation'), this.modes[this.addVentGroup.value['nVentMod']], this.serExo.exoSelectionner,
      this.user);
    this.servOp.addOp(newOC)
      .subscribe(
        (data) => {
          // Chargement des opérations
          // gestion des lignes
          this.chargerOperations();
          this.tempLigneOpCais.forEach((element, index) => {
            const newLine = new LigneOpCaisse(element.qteLigneOperCaisse, element.prixLigneOperCaisse,
              element.commentaireLigneOperCaisse, data, element.article);
            this.servOp.addOpLine(data, newLine)
              .subscribe(// ajout de ligne
                (data2) => {
                  this.supTempLigneOpCais(this.tempLigneOpCais.indexOf(newLine));
                  if (this.tempLigneOpCais.length === 0) {
                    this.servOp.getAllOpLines()
                      .subscribe(
                        (data3) => {
                          this.lignesOp = data3;
                          this.addVentGroup.patchValue({
                            nVentDat: moment(new Date()).format('DD/MM/YYYY HH:mm'),
                            nVentCont: '', nVentObs: ''
                          });
                          this.imprimeTicket(data);
                          this.totalVente = 0;
                          $('#tablign').dataTable().api().destroy();
                          this.dtLigne.next();
                        },
                        (err) => {
                          console.log('Chargement de lignes: ', err);
                        }
                      );
                  }
                },
                (erre) => {
                  console.log('Ajout de ligne', erre);
                });
          });
        },
        (err) => {
          console.log('Opération échouée', err);
          op = null;
        }
      );
  }

  initLoyer() {
    this.ChargerAccessoires;
    this.chargerEcheances();
    this.chargerLocataire();
    this.totalVente = 0;
    this.addLoyer.show();
    this.tmpOpC = new OpCaisse(new Date().getUTCFullYear() + '-000001', new Date(), 'Divers', true, '', new Date(),
      this.caissesValides[0], new TypeRecette('VD', 'Prestation'), this.modes[0], this.exo, this.user);
    this.totalLoyer = 0;
    this.addLoyerGroup.patchValue({
      loyDat: moment(new Date()).format('DD/MM/YYYY HH:mm'),
      loyCont: '', loyObs: ''
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

      if (this.addLoyerGroup.value['loyCai'] !== null && this.addLoyerGroup.value['loyMod'] !== null &&
        this.addLoyerGroup.value['loyDat'] !== null) {
        const dat: String = this.addLoyerGroup.value['loyDat'];
        const datop = new Date(Number.parseInt(dat.substr(6, 4), 10), Number.parseInt(dat.substr(3, 2), 10) - 1,
          Number.parseInt(dat.substr(0, 2), 10), Number.parseInt(dat.substr(11, 2), 10), Number.parseInt(dat.substr(14, 2), 10));
        const newOC = new OpCaisse('0001', new Date(this.addLoyerGroup.value['loyDat']), this.addLoyerGroup.value['loyCon'], true,
          this.addLoyerGroup.value['loyObs'], new Date(), this.caissesValides[this.addLoyerGroup.value['loyCai']],
          new TypeRecette('L', 'Location'), this.modes[this.addLoyerGroup.value['loyMod']], this.serExo.exoSelectionner,
          this.user);
        this.servOp.addOp(newOC)
          .subscribe(
            (dataop) => {
              echeancepaye.forEach(elt => {
                if (elt.payeEcheance) {
                  if (this.echeances.find(e => e.contrat.numContrat == elt.contrat.numContrat &&
                    e.dateEcheance == elt.dateEcheance) == null) {
                  elt.opCaisse = dataop;
                  this.servOp.addEcheance(elt).subscribe(
                    dataech => {
                      j--;
                      if (j == 0) {
                        this.servOp.getAllOp().subscribe(
                          (data2) => {
                            this.listOp = data2;
                            this.servOp.getAllEcheances().subscribe(
                              datalisteop => {
                                this.echeances = datalisteop;
                                this.imprimeFacture(dataop);
                                this.addLoyerGroup.patchValue({
                                  loyDat: moment(new Date()).format('DD/MM/YYYY HH:mm'),
                                  loyLoc: -1, loyVL: -1, loyCont: '', loyObs: ''
                                });
                                this.genererEcheancier(null);
                                this.totalLoyer = 0;
                                this.opDay = this.listOp.filter(op =>
                                  op.utilisateur.idUtilisateur === this.serU.connectedUser.idUtilisateur &&
                                  new Date(op.dateSaisie).toLocaleDateString().substr(0, 10) === new Date().toLocaleDateString().substr(0, 10)
                                );
                                $('#tablign').dataTable().api().destroy();
                                this.dtLigne.next();
                              });
                          });
                      }
                    });
                }}
              });
            },
            (err) => {
              console.log('Nouvelle opération ', err);
            });
      } else {
        console.log('Vérifier que la caisse, la date, le mode et numéro du paiement sont renseignés');
      }
    } else {
      console.log('Veuillez cocher au moins une échéance à payer');
    }
    this.chargerOperations();
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
            // pri.dateFinPrixIm==null
            ((new Date(dde) >= new Date(pri.dateDebPrixIm)  &&  new Date(dde) < new Date(pri.dateFinPrixIm)) ||
            (new Date(dde) >= new Date(pri.dateDebPrixIm)  && pri.dateFinPrixIm === null ))
          );
          let p = prix.prixIm;
          if (con.immeuble.valUnit === true) {
            p=p*con.immeuble.superficie
          }
          const eche = new Echeance(mois[des.getMonth()-1], dde.getFullYear(), new Date(des), false,
          p, con, null);

          if (prix != null) {
            this.echeanceAPayer.push(eche);
            n++;
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
          this.totalLoyer += this.echeanceAPayer[p].prix.valueOf();
        } else {
        this.totalLoyer -= this.echeanceAPayer[p].prix.valueOf();
      }
    console.log(this.echeanceAPayer[p]);
  }

  /// Gestion des imputations
  initNewImput() {
    this.addImputGroup.reset();
    this.pointPayable = [];
    this.totalLoyer = 0;
    this.addImput.show();
    this.addImputGroup.patchValue({
      addImDat: moment(Date.now()).format('DD/MM/YYYY HH:mm:ss'),
      addImCor: 0, addImMod: 0, addImCai: 0
    });
    this.coi = this.pointV.filter(pp => pp.correspondant.imputableCorres === true && pp.payerPoint === false).map(pp => pp.correspondant);
  }

  fermerImput() {
    $('#dtop').dataTable().api().destroy();
    this.dtrigDailyOp.next();
    this.addImput.hide();
  }

  chargerPointNI(cor: Correspondant) {
    this.pointPayable = this.pointV.filter(pp =>
      pp.correspondant.idCorrespondant == cor.idCorrespondant && pp.payerPoint == false
    );
    this.ImputLine = [];
    this.totalImput = 0;
    this.servOp.getAllLPV()
      .subscribe(
        (data) => {
          this.lignePV = data;
          this.lineOfPV = this.lignePV.filter(lpv =>
            lpv.pointVente.correspondant.idCorrespondant === cor.idCorrespondant && lpv.pointVente.payerPoint === false);
          this.pv = [];
          this.lineOfPV.forEach(elt => {
            if (this.pv.find(p => p.numPointVente == elt.pointVente.numPointVente)) {
              this.pv.push(elt.pointVente);
            }
            const lpvp = this.ImputLine.find(limp =>
              limp.article.codeArticle == elt.article.codeArticle
            );
            if (lpvp === undefined) {
              this.ImputLine.push(new LignePointVente(elt.quantiteLignePointVente, elt.pulignePointVente, 0, 0, null,
                elt.article));
            } else {
              lpvp.quantiteLignePointVente += elt.quantiteLignePointVente;
            }
          });
          this.totalImput = this.ImputLine.reduce((tt, lin) => tt += lin.quantiteLignePointVente * lin.pulignePointVente, 0);
        },
        (err) => {
          console.log('lpv', err);
        });
  }

  ajouteImputation() {
    if (this.addImputGroup.value['addImMod'] != null && this.addImputGroup.value['addImDat'] != null &&
      this.addImputGroup.value['addImCai'] != null) {
      const dat = this.addImputGroup.value['addImDat'];
       const datop = new Date(Number.parseInt(dat.substr(6, 4), 10), Number.parseInt(dat.substr(3, 2), 10) - 1,
          Number.parseInt(dat.substr(0, 2), 10), Number.parseInt(dat.substr(11, 2), 10), Number.parseInt(dat.substr(14, 2), 10));
        const newOC = new OpCaisse('000001', new Date(this.addImputGroup.value['addimDat']),
        this.coi[this.addImputGroup.value['addImCor']].magasinier.nomMagasinier + ' ' +
        this.coi[this.addImputGroup.value['addImCor']].magasinier.prenomMagasinier, true, this.addLoyerGroup.value['addImObs'], new Date(),
        this.caissesValides[this.addImputGroup.value['addImCai']], new TypeRecette('I', 'Imputation Correspondant'),
        this.modes[this.addImputGroup.value['addImMod']], this.serExo.exoSelectionner, this.user);
      this.servOp.addOp(newOC)
        .subscribe(
          (dataOP) => {
            this.pointPayable.forEach(elt => {
              const pv = new PointVente(elt.numPointVente, elt.datePointVente, true, elt.exercice, elt.correspondant, elt.regisseur);
              pv.opCaisse = dataOP;
              this.servPV.editPointVente(elt.numPointVente, pv)
                .subscribe(
                  (data) => {
                    this.pointPayable.splice(0, 1);
                  },
                  (err) => {
                    console.log('Imputation: ', err);
                  }
                );
            });
            let i: number = this.ImputLine.length;
            this.ImputLine.forEach(elt => {
              const newline = new LigneOpCaisse(elt.quantiteLignePointVente, elt.pulignePointVente, null, dataOP,
                elt.article);
              newline.livre = true;
              // newline.magasin=n
              this.servOp.addOpLine(dataOP, newline).subscribe(
                datalip => {
                  i--;
                  if (i === 0) {
                    this.rechargerLigneOpCaisse();
                    this.imprimeTicket(dataOP);
                    this.totalImput = 0;
                    this.ImputLine = [];
                    this.addImputGroup.patchValue({
                      addimDat: moment(Date.now()).format('jj/MM/aaaa hh/mm'),
                      addImCor: -1, addImObs: 0
                    });
                  }
                });

            });
          },
          (err) => {
            (err) => {
              console.log('Imputation: ', err);
            };
          }
        );

    } else {
      console.log('pas enregistrement');
    }
    this.chargerOperations();
  }

  afficheFacture(opc: OpCaisse) {
    const fact = new jsPDF();
    fact.text('Arrondissement : ' + opc.caisse.arrondissement.nomArrondi + '\tCaisse : ' + opc.caisse.libeCaisse +
      '\nReçu N° : ' + opc.numOpCaisse + '\t\t du : ' + moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm'), 15, 30);
    // fact.text(,15,40);
    const ligne = [];
    let totalf: number = 0;
    switch (opc.typeRecette.codeTypRec) {
      default: {
        fact.text('Contribuable : ' + opc.contribuable, 15, 50);
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
          totalf += element.prixLigneOperCaisse * element.qteLigneOperCaisse;
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
        fact.text('Contrat : ' + eche[0].contrat.numContrat + '\t\tBoutique :' + eche[0].contrat.immeuble.libIm +
          '\nLocataire : ' + eche[0].contrat.locataire.identiteLocataire + '\t\tDéposant : ' + opc.contribuable, 15, 50);

        eche.forEach(element => {
          const lig = [];
          lig.push(element.moisEcheance);
          lig.push(element.annee);
          lig.push(element.prix);
          ligne.push(lig);
          totalf += element.prix.valueOf();
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
      body: [['Total', totalf]
      ],
    });
    autoTable(fact, {
      theme: 'plain',
      margin: { top: 30, left: 130 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', fontSize: 12 },
      },
      body: [['Le(La) caissier(ère)' + '\n\n\n' + this.serU.connectedUser.nomUtilisateur + ' ' +
        this.serU.connectedUser.prenomUtilisateur]]
    });
    // fact.autoPrint();
    this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', { filename: 'facture.pdf' }));
    this.appercu.show();
  }

  imprimeFacture(opc: OpCaisse) {

    const fact = new jsPDF();
    fact.text('Arrondissement : ' + opc.caisse.arrondissement.nomArrondi + '\tCaisse : ' + opc.caisse.libeCaisse +
      '\nReçu N° : ' + opc.numOpCaisse + '\t\t du : ' + moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm'), 15, 30);
    // fact.text(,15,40);
    const ligne = [];
    let total = 0;

    switch (opc.typeRecette.codeTypRec) {
      default: {
        fact.text('Contribuable : ' + opc.contribuable, 15, 50);
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
        fact.text('Contrat : ' + eche[0].contrat.numContrat + '\t\tBoutique :' + eche[0].contrat.immeuble.libIm +
          '\nLocataire : ' + eche[0].contrat.locataire.identiteLocataire + '\t\tDéposant : ' + opc.contribuable, 15, 50);
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
        0: { textColor: 0, fontStyle: 'bold', fontSize: 12 },
      },
      body: [['Le(La) caissier(ère)' + '\n\n\n' + this.serU.connectedUser.nomUtilisateur + ' ' +
        this.serU.connectedUser.prenomUtilisateur]]

    });


    fact.autoPrint();
    this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', { filename: 'facture.pdf' }));
    // this.appercu.show();
  }

  imprimeTicket(opc: OpCaisse) {
    const fact = new jsPDF('p', 'mm', [80, 900]);
    autoTable(fact, {
      theme: 'plain',
      margin: { left: -0.1, top: -1, right: 0, bottom: 1 },
      body: [
        ['Arrondissement : ' + opc.caisse.arrondissement.nomArrondi],
        ['Caisse : ' + opc.caisse.libeCaisse],
        ['Reçu N° : ' + opc.numOpCaisse + '\tDate : ' + moment(new Date(opc.dateOpCaisse)).format('DD/MM/yyyy hh:mm')],
        ['Contribuable : ' + opc.contribuable]
      ],
      bodyStyles: {
        fontSize: 8,
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
              fontSize: 8,
              cellPadding: 1,
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
