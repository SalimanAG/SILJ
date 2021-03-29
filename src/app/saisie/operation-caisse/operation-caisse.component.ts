import {Component, ViewChild, OnInit, ElementRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { data, valHooks } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
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
import { InstituReverse }from '../../../models/institution.model';
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
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilisateurService } from '../../../services/administration/utilisateur.service';
import { element } from 'protractor';
import { Gerer } from '../../../models/gerer.model';
import { Affecter } from '../../../models/affecter.model';
import { PointVenteService } from '../../../services/saisie/point-vente.service';
import { log } from 'console';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CorrespondantService } from '../../../services/definition/correspondant.service';
import { Stocker } from '../../../models/stocker.model';
import { Magasin } from '../../../models/magasin.model';

@Component({
  selector: 'app-operation-caisse',
  templateUrl: './operation-caisse.component.html',
  styleUrls: ['./operation-caisse.component.css']
})
export class OperationCaisseComponent implements OnInit {

  //Les fenêtres
  @ViewChild('addVente') public addVente:ModalDirective;
  @ViewChild('addArticle') public addArticle:ModalDirective;
  @ViewChild('addLoyer') public addLoyer:ModalDirective;
  @ViewChild('detailOp') public detailOp:ModalDirective;
  @ViewChild('addImput') public addImput:ModalDirective;
  @ViewChild('appercu') public appercu:ModalDirective;
  @ViewChild('opAnnul') public opAnnul:ModalDirective;
  @ViewChild('supOP') public supOP:ModalDirective;

  pdfToShow;
  ////Accueil
  timp:String[]=['Ticket','Reçu'];
  stk : Stocker[];
  annulop=new OpCaisse(null,null,null,null,'',null,null,null,null,null,null);
  tabOpeCa: DataTables.Settings = {};
  dtOpeCa: Subject<OpCaisse> = new Subject<OpCaisse>();
  listOp:OpCaisse[];
  Articles:Article[];
  affectations : Affecter[];
  affectUser : Affecter[];
  caissesValides : Caisse[]=[];
  opTypes : TypeRecette[];
  modes : ModePaiement[];
  exo : Exercice;
  exercices : Exercice[];
  users : Utilisateur[];
  user:Utilisateur;
  //tabLigne:DataTables.Settings={};
  dtLigne: Subject<any>=new Subject<any>();

  ///////Vente
  tabArtV: DataTables.Settings = {};
  dtArt: Subject<any> = new Subject<any>();
  addVentGroup:FormGroup;
  line:OpCaisse[]=[];
  totalVente:number;
  totaltmp:number;
  tligne:number;
  lignesOp:LigneOpCaisse[];
////////Ajout d'article
  tabArt: DataTables.Settings = {};
  //dtArtV: Subject<any> = new Subject<any>();
  addArtGroup:FormGroup;
  tempLigneOpCais:LigneOpCaisse[]=[];
  lignesOfOp:LigneOpCaisse[];
  tmpOpC:OpCaisse;
  serVal:ValeurLocativeService;

  today:Date=new Date();
  ////////Détail opération de caise
  vnum:String;  vdat:Date;  vcai:String;  vcon:String;  vtyp:String;
  vmod:String;  vobs:String;  vexo:String;  vuse:String;  dats:Date;
  eta:String; vtotal:number;
  detailGroup:FormGroup;
  tabDetail:DataTables.Settings={};
  //dtrigDetail:Subject<any>=new Subject<any>();
  dtElt: DataTableDirective;

  ///////Location
  montantarepartir : number=0;
  addLoyerGroup:FormGroup;
  locataires:Locataire[];
  tabEcheance:DataTables.Settings={};
  dtTrigEche: Subject<Echeance>=new Subject<Echeance>();
  contrats:Contrat[];
  contratLocataire:Contrat[]=[];
  immeubles:Immeuble[];
  immeubleContrat:Immeuble[]=[];
  echeances:Echeance[];
  echeanceContrat:Echeance[]=[];
  exist:Echeance[]=[];
  echeanceAPayer:Echeance[]=[];
  echeancetmp:Echeance[]=[];
  prixIm:PrixImmeuble[];
  prixImm:PrixImmeuble[];
  totalLoyer:number

  ///////Imputation
  addImputGroup:FormGroup;
  co:Correspondant[]=[];
  coi:Correspondant[]=[];
  tabLignePoint:DataTables.Settings={};
  //dtPV:Subject<any>=new Subject<any>()
  ind : number=0;
  pointV:PointVente[];
  pointPayable:PointVente[];
  lignePV:LignePointVente[];
  pv:PointVente[];
  ImputLine:LignePointVente[]=[];
  lineOfPV:LignePointVente[];
  totalImput:number
  total:number;

  constructor(  private serCor: CorrespondantService, private serU: UtilisateurService,private servPV: PointVenteService,
    private servOp:OperationCaisseService, private fbuilder:FormBuilder, private router:Router,
    private sanitizer : DomSanitizer, private serPV: PointVenteService) {
      this.tabOpeCa = {
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
      this.tabArtV = {
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
      this.tabArt = {
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
      this.tabEcheance = {
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

  initOpCaisse(){
    this.addVentGroup=this.fbuilder.group ({
      nVentNum:new FormControl(),
      nVentDat:new FormControl(),
      nVentCont:new FormControl(),
      nVentObs:new FormControl(),
      nVentCais:new FormControl(),
      nVTimp:new FormControl(),
      nVentMod:new FormControl(),
      nTotalV:new FormControl(),
      tabVent: new FormControl()
    });

    this.detailGroup=new FormGroup({
      vNum:new FormControl(),
      vDat:new FormControl(),
      vCai:new FormControl(),
      vTyp:new FormControl(),
      vMod:new FormControl(),
      vCon:new FormControl(),
      vObs:new FormControl()
    });

    this.addLoyerGroup=new FormGroup({
      loyLoc:new FormControl(),
      loyVL:new FormControl(),
      loyCai:new FormControl(),
      loyCon:new FormControl(),
      loyNum:new FormControl(),
      loyMod:new FormControl(),
      loyObs:new FormControl(),
      loyDat:new FormControl(),
      loyMtt:new FormControl(),
      coche:new FormControl()
    });

    this.addImputGroup=new FormGroup({
      addImCor:new FormControl(),
      addImNum:new FormControl(),
      addImDat:new FormControl(),
      addImCai:new FormControl(),
      addImMod:new FormControl(),
      addImObs:new FormControl(),
      addFinIm:new FormControl()
    });
  }

  ngOnInit(){
    this.user=this.serU.connectedUser;
    this.ChargerAccessoires();
    this.initOpCaisse();
    this.servOp.getAllOp()
      .subscribe(
        (data) => {
          this.listOp = data;
          this.dtOpeCa.next();
          this.servOp.getAllOpLines()
          .subscribe(
            (data)=>{
              this.lignesOp=data;
            },
            (err)=>{
              console.log('all lines: ',err);
            }
          );
        },
      (erreur) => {
        console.log('Opération : '+erreur);
      }
    );

    this.chargerEcheances();
    this.rechargerLigneOpCaisse();
    this.chargerPV();
  }

  supprimerOperation(){
    switch(this.annulop.typeRecette.codeTypRec){
      case 'P':{
        this.rechargerLigneOpCaisse();
        this.lignesOfOp=this.lignesOp.filter(lop=>lop.opCaisse.numOpCaisse===this.annulop.numOpCaisse);
        var i:number=this.lignesOfOp.length;
        this.lignesOfOp.forEach(elt => {
          this.servOp.deleteAOpLine(elt.idLigneOperCaisse).subscribe(
            datalop=>{
              i--;
              if(i===0){
                this.servOp.deleteAOpCaiss(this.annulop.numOpCaisse).subscribe(
                  data=>{
                    console.log("Suppression éffectuée avec succès");
                    this.rechargerLigneOpCaisse();
                  },
                  err=>{
                    console.log("La suppression a échoué");
                  }
                );
              }
            }
          );
        });
        break;
      }
      case 'L':{
        this.chargerEcheances();
        var echConc=this.echeances.filter(ec=>ec.opCaisse.numOpCaisse===this.annulop.numOpCaisse);
        var i=echConc.length;
        echConc.forEach(elt => {
          this.servOp.delEcheance(elt.idEcheance).subscribe(
            datde=>{
              i--;
              if(i===0){
                this.servOp.deleteAOpCaiss(this.annulop.numOpCaisse).subscribe(
                  data=>{
                    console.log("Suppression éffectuée avec succès");
                    this.chargerEcheances();
                  },
                  err=>{
                    console.log("La suppression a échoué");
                  }
                );
              }
            });
        });
        break;
      }
      case 'I':{
        this.rechargerLigneOpCaisse();
        this.servPV.getAllPointVente()
        .subscribe(
          (data)=>{
            this.pointV=data;
            var pv=this.pointV.filter(pt=>pt.opCaisse.numOpCaisse===this.annulop.numOpCaisse);
            var i=pv.length;
            pv.forEach(elt=>{
              var ptv=elt;
              ptv.payerPoint=false;
              this.servPV.editPointVente(elt.numPointVente,ptv).subscribe(
                data=>{
                  i--;
                  if(i===0){
                    this.lignesOfOp=this.lignesOp.filter(lop=>lop.opCaisse.numOpCaisse===this.annulop.numOpCaisse);
                    var j=this.lignesOfOp.length;
                    this.lignesOfOp.forEach(ele => {
                      this.servOp.deleteAOpLine(ele.idLigneOperCaisse).subscribe(
                        datalop=>{
                          j--;
                          if(j===0){
                            this.servOp.deleteAOpCaiss(this.annulop.numOpCaisse).subscribe(
                              data=>{
                                console.log("Suppression éffectuée avec succès");
                                this.chargerEcheances();
                              },
                              err=>{
                                console.log("La suppression a échoué");
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

  annulerOperation(opc:OpCaisse){
    var op=opc;
    op.valideOpCaisse=false;
    switch(opc.typeRecette.codeTypRec){
      case 'P':{
        var lop=this.lignesOp.filter(lop=>lop.opCaisse.numOpCaisse===opc.numOpCaisse);
        console.log(lop);
        var n:number=0;
        lop.forEach(elt => {
        if(elt.livre===true){
        this.serCor.getAllStocker().subscribe(
          (data)=>{
            this.stk=data;
              var st=this.stk.find(stc=>stc.article.codeArticle===elt.article.codeArticle &&
                stc.magasin.codeMagasin===elt.magasin.codeMagasin);
              var stc=new Stocker(st.quantiterStocker+elt.qteLigneOperCaisse, st.stockDeSecuriter, st.stockMinimal,
                st.cmup,st.article,st.magasin);
                console.log('Nstocker', stc);
              st.quantiterStocker+=elt.qteLigneOperCaisse;
              this.serCor.editAStocker(st.idStocker.toString(),stc).subscribe(
                data=>{
                  const newlc=elt;
                  elt.livre=false;
                  this.servOp.editOpLine(elt.idLigneOperCaisse,newlc).subscribe(
                    datalop=>{
                      n++;
                  if(n===lop.length){
                    this.servOp.editAOpCaiss(opc.numOpCaisse, op).subscribe(
                      data=>{
                        this.servOp.getAllOp().subscribe(
                          dataop=>{
                            console.log('Annulation effectuée avec succès');
                            this.listOp=dataop;
                            $("#datatable1").dataTable().api().destroy();
                            this.dtOpeCa.next();
                          }
                        );
                      },
                      erran=>{
                        console.log('Annulation échouée');
                      }
                    );
                  }
                    },
                    errlop=>{}
                  );

                }
              );
            });
          }
        });
        break;
      }
      case 'R':{
        this.servOp.getAllEcheances()
        .subscribe(
          (data)=>{
            this.echeances=data;
            this.echeances.filter(ec=>ec.opCaisse.numOpCaisse===opc.numOpCaisse).forEach(elt=>{
              var ech=elt;
              ech.payeEcheance=false;
              this.servOp.editEcheance(elt.idEcheance,ech).subscribe(
                data=>{
                  if(this.echeances.filter(ec=>ec.opCaisse.numOpCaisse===opc.numOpCaisse).length===0){
                    this.servOp.editAOpCaiss(opc.numOpCaisse, op).subscribe(
                      data=>{
                        this.servOp.getAllOp().subscribe(
                          dataop=>{
                            console.log('Annulation effectuée avec succès');
                            this.listOp=dataop;
                            $("#datatable1").dataTable().api().destroy();
                            this.dtOpeCa.next();
                          }
                        );
                      },
                      erran=>{
                        console.log('Annulation échouée');
                      }
                    );}
                }
              );
            });
          }
        );
        break;
      }
      case 'I':{
        this.servPV.getAllPointVente()
        .subscribe(
          (data)=>{
            this.pointV=data;
            this.pointV.filter(pt=>pt.opCaisse.numOpCaisse===opc.numOpCaisse).forEach(elt=>{
              var ptv=elt;
              ptv.payerPoint=false;
              this.servPV.editPointVente(elt.numPointVente,ptv).subscribe(
                data=>{
                  if(this.pointV.filter(pt=>pt.opCaisse.numOpCaisse===opc.numOpCaisse).length===0){
                    this.servOp.editAOpCaiss(opc.numOpCaisse, op).subscribe(
                      data=>{
                        this.servOp.getAllOp().subscribe(
                          dataop=>{
                            console.log('Annulation effectuée avec succès');
                            this.listOp=dataop;
                            $("#datatable1").dataTable().api().destroy();
                            this.dtOpeCa.next();
                          }
                        );
                      },
                      erran=>{
                        console.log('Annulation échouée');
                      }
                    );}
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

  rechargerLigneOpCaisse(){
    this.servOp.getAllOpLines()
    .subscribe(
      (data)=>{
        $('#datatable_ligneop').dataTable().api().destroy();
        this.lignesOp=data;
      },
      (err)=>{
        console.log('all lines: ',err);
      }
    );
  }

  chargerDétailOpCaisse(opcai:OpCaisse){

    this.rechargerLigneOpCaisse();
    console.log('nombre total de ligne: ',this.listOp.length);
    this.lignesOfOp=this.lignesOp.filter(function(ligne){
      return ligne.opCaisse.numOpCaisse===opcai.numOpCaisse;
    });
    this.vtotal=this.lignesOfOp.reduce(function(total, ligne){
      return total+ligne.prixLigneOperCaisse*ligne.qteLigneOperCaisse;
    },0);
    console.log(this.lignesOfOp.length+' lignes concernée(s)');
  }

  initdetail(op:OpCaisse){

    this.chargerDétailOpCaisse(op);
    this.detailOp.show();
    this.vnum=op.numOpCaisse;
    this.vcai=op.caisse.libeCaisse;
    this.dats=op.dateSaisie;
    this.vdat=op.dateOpCaisse;
    this.vobs=op.obsOpCaisse;
    this.vcon=op.contribuable;
    this.vuse=op.utilisateur.nomUtilisateur+' '+op.utilisateur.prenomUtilisateur;
    this.vexo=op.exercice.libExercice;
    this.vmod=op.modePaiement.libeModPay;
    this.vtyp=op.typeRecette.libeTypRec;

  }

  chargerOperations(){
    this.servOp.getAllOp()
    .subscribe(
      (data) => {
        this.listOp = data;
        $('#dtop').dataTable().api().destroy();
         this.dtOpeCa.next();
      },
      (erreur) => {
        console.log('Opération : '+erreur);
      }
    );
  }

  ChargerAccessoires(){
    //Modes de paiement
    this.servOp.getAllModes()
    .subscribe(
      (data)=>{
        this.modes=data;
      },
      (err)=>{
        console.log('Modes: ', err);
      }
    );

    //Affectations aux caisses
    this.servOp.getAllAffectations()
    .subscribe(
      (data)=>{
        this.affectations=data;
        this.affectUser=this.affectations.filter(af=>
          af.utilisateur.idUtilisateur===this.user.idUtilisateur && new Date(af.dateDebAffecter)<=new Date() &&
          af.dateFinAffecter==null
          );
          this.caissesValides=this.affectUser.map(au=>au.caisse);
      },
      (err)=>{
        console.log('Affectations',err);

      }
    );

    //Exercices
    this.servOp.getAllExos()
    .subscribe(
      (data)=>{
        this.exercices=data;
        this.exo=this.exercices.find(exe=>exe.etatExo==='encours');
      },
      (err)=>{
        console.log('Exo: ', err);
      }
    );

    ///Types
    this.servOp.getAllTypes()
    .subscribe(
      (data)=>{
        this.opTypes=data;
      },
      (err)=>{
        console.log('types erreur: ', err);
      }
    );

    /////Contrats
    this.servOp.getAllContrats()
    .subscribe(
      (data)=>{
        this.contrats=data;
      },
      err=>{
        console.log('contrat: ',err);
      }
    );

    /////Prix
    this.servOp.getAllPrixImmeuble()
    .subscribe(
      (data)=>{
        this.prixIm=data;
      },
      err=>{
        console.log('prix immeuble: ',err);
      }
    );

    /////Point vente
    this.servOp.getAllPV()
    .subscribe(
      (data)=>{
        this.pointV=data;
      },
      err=>{
        console.log('point Vente: ',err);
      }
    );
  }

  initAnnulOp(op: OpCaisse){
    this.annulop=op;
    this.opAnnul.show();
  }

  chargerPV(){
    this.servOp.getAllPV().subscribe(
      data=>{
        this.pointV=data;
      },
      err=>{console.log('PV erreur ', err);
      }
    );
  }
  initSUpOP(op: OpCaisse){
    this.chargerEcheances();
    this.rechargerLigneOpCaisse();
    this.annulop=op;
    this.supOP.show();
  }

//Gestion des prestations

  initNewVente(){
    this.totalVente=0;
    this.addVente.show();
    this.tmpOpC=new OpCaisse(new Date().getUTCFullYear+'-000001',new Date(),'Divers',true,'',new Date(),
    this.caissesValides[0],this.opTypes[0], this.modes[0],this.exo,this.user);
  }

  ouvreAddArt(){
    this.servOp.getAllArticles()
    .subscribe(
      (data) => {
        this.Articles = data;
        this.dtArt.next();
      },
      (erreur) => {
        console.log('Erreur : '+erreur);
      }
    );
    this.addArticle.show();
  }

  supTempLigneOpCais(i:number){
    this.tempLigneOpCais.splice(i,1);
  }

  choisirArticle(i: number){
    const artChoisi=this.Articles[i];
    let trver = false;
    this.tempLigneOpCais.forEach(element => {
      if(element.article.codeArticle===artChoisi.codeArticle){
        trver = true;
        exit;
      }
    });

    if(trver===false) {
      this.tempLigneOpCais.push(new LigneOpCaisse(0,artChoisi.prixVenteArticle, '', this.tmpOpC,artChoisi));
    }

  }

  recupererTotalVente(n:number){
    this.tligne=this.tempLigneOpCais[n].prixLigneOperCaisse*
    this.tempLigneOpCais[n].qteLigneOperCaisse;
    this.totaltmp=this.totalVente-this.tligne;
  }

  recalculerTotalvente(i:number){
    this.totalVente=this.totaltmp+this.tempLigneOpCais[i].prixLigneOperCaisse*
    this.tempLigneOpCais[i].qteLigneOperCaisse;

  }

  AjouteVente(){
    let op:OpCaisse;
    const newOC=new OpCaisse(this.addVentGroup.value['nVentNum'], new Date(this.addVentGroup.value['nVentDat']),
    this.addVentGroup.value['nVentCont'],true,this.addVentGroup.value['nVentObs'], new Date(),
    this.caissesValides[this.addVentGroup.value['nVentCais']], new TypeRecette('P','Prestation'),
    this.modes[this.addVentGroup.value['nVentMod']], this.exo,this.user);

    this.servOp.ajouteOp(newOC)
    .subscribe(
      (data)=>{
        //Chargement des opérations
        this.servOp.getAllOp().subscribe(
          (dataop)=>{
            this.listOp=dataop;
            $('#tabOP').dataTable().api().destroy();
            this.dtOpeCa.next();
            //gestion des lignes
            this.tempLigneOpCais.forEach((element, index) => {
              const newLine = new LigneOpCaisse(element.qteLigneOperCaisse,element.prixLigneOperCaisse,
                element.commentaireLigneOperCaisse, data,element.article);
              this.servOp.addOpLine(data, newLine)
              .subscribe(//ajout de ligne
                (data2)=>{
                 this.supTempLigneOpCais(this.tempLigneOpCais.indexOf(newLine));
                  if(this.tempLigneOpCais.length === 0){
                      this.servOp.getAllOpLines()
                        .subscribe(
                          (data3)=>{
                            this.lignesOp=data3;
                            $('#tablign').dataTable().api().destroy();
                            this.dtLigne.next();
                            this.imprimeTicket(data);
                          },
                          (err)=>{
                            console.log('Chargement de lignes: ',err);
                          }
                        );
                  }
                },
                (erre)=>{
                      console.log('Ajout de ligne', erre);
                });
              });
          },
          err=>{
            console.log('Chargement opération', err)
          });
      },
      (err)=>{
        console.log('Opération échouée',err);
        op=null;
      }
    );
  }

////Gestion des redevances

  initLoyer(){
    this.ChargerAccessoires
    this.chargerEcheances();
    this.chargerLocataire();
    this.totalVente=0;
    this.addLoyer.show();
    this.tmpOpC=new OpCaisse(new Date().getUTCFullYear+'-000001',new Date(),'Divers',true,'',new Date(),
    this.caissesValides[0],new TypeRecette('VD','Avente Directe'), this.modes[0],this.exo,this.user);
    this.totalLoyer=0;

  }

  initialiseNouveauLoyer(){
    this.chargerLocataire();
    this.addLoyer.show();
  }

  repartir(){
    console.log('Répartition');

    this.montantarepartir+=this.addLoyerGroup.value['loyMtt'];
    var i=0;
    do{
      this.echeanceAPayer[i].payeEcheance=true;
        this.montantarepartir-=this.echeanceAPayer[i].prix.valueOf();
    }while(this.montantarepartir>=this.echeanceAPayer[i].prix)
    $('#dtEche').dataTable().api().destroy();
    this.dtTrigEche.next();

    console.log(this.echeanceAPayer);

  }

  ajoutePaiement(){
    if(this.echeanceAPayer.some(ech=>ech.payeEcheance)){
      var echeancepaye=this.echeanceAPayer.filter(e=>e.payeEcheance===true);
      var j=this.echeanceAPayer.filter(e=>e.payeEcheance===true).length;
      console.log('caisse :',this.addLoyerGroup.value['loyCai'], 'mode: ',this.addLoyerGroup.value['loyMod'],
      this.addLoyerGroup.value['loyDat']);

      if(this.addLoyerGroup.value['loyCai']!==null && this.addLoyerGroup.value['loyMod']!==null &&
        this.addLoyerGroup.value['loyDat']!==null ){
        const newOC=new OpCaisse(this.addLoyerGroup.value['loyNum'], this.addLoyerGroup.value['loyDat'],
          this.addLoyerGroup.value['loyCon'],true,this.addLoyerGroup.value['loyObs'], new Date(),
          this.caissesValides[this.addLoyerGroup.value['loyCai']], new TypeRecette('L','Location'),
          this.modes[this.addLoyerGroup.value['loyMod']], this.exo,this.user);
        this.servOp.ajouteOp(newOC)
        .subscribe(
          (dataop)=>{
            this.echeanceAPayer.forEach(elt => {
              if(elt.payeEcheance===true){
                const newEche:Echeance = new Echeance(elt.moisEcheance, elt.annee, elt.dateEcheance, true,elt.prix,
                  elt.contrat, dataop);
                this.servOp.addEcheance(newEche)
                .subscribe(
                  (data1)=>{
                    j--;
                    if(j===0){
                      this.servOp.getAllOp()
                      .subscribe(
                        (data2) => {
                          this.listOp=data2;
                          this.servOp.getAllEcheances().subscribe(
                            datalisteop=>{
                              this.echeances=datalisteop;
                                this.servOp.getAllEcheances().subscribe(
                                dataech=>{
                                this.imprimeFacture(dataop);
                              exit;
                              });
                            });
                          },
                          (erreur) => {
                            console.log('Chargement Opération : '+erreur);
                          }
                        );
                    }
                  },
                  (erreur)=>{
                    console.log('Nouvelle échéance ', erreur);
                  }
                );
              }
            });
          },
          (err)=>{
            console.log('Nuvelle opération ',err);
          });
      }
      else{
        console.log('Vérifier que la caisse, la date, le mode et numéro du paiement sont renseignés');
        }
    }
    else{
      console.log('Veuillez cocher au moins une échéance à payer');
    }
    this.chargerOperations();
  }

  chargerImmeubles(loc : Locataire){
    if(loc!==null){
      this.contratLocataire=this.contrats.filter(function(contrat){
        return contrat.locataire.idLocataire===loc.idLocataire;
      });
    }
  }

  chargerPrixImmeubles(imm:Immeuble){
    this.prixImm=this.prixIm.filter(p=>p.immeuble.codeIm===imm.codeIm);
  }

  chargerEcheances(){
    this.servOp.getAllEcheances()
    .subscribe(
      (data)=>{
        this.echeances=data;
        $('#dteche').dataTable().api().destroy();
        this.dtTrigEche.next();
      },
      err=>{
        console.log('Echéances: ',err);
      }
    );
  }

  genererEcheancier(con:Contrat){
    //var pri=Pri
    this.chargerPrixImmeubles(con.immeuble);
    this.echeanceAPayer=[];
    this.totalLoyer=0;
    var dde:Date=new Date();
    if(this.echeances.length>0){
      this.echeanceContrat=this.echeances.filter(function(echeance){
        return (echeance.contrat.numContrat===con.numContrat);
      });
      if(this.echeanceContrat.length>0){
        this.echeanceAPayer=this.echeanceContrat.filter(ec=>ec.payeEcheance===false);
        if(this.echeanceAPayer.length>0){
          this.echeanceAPayer.sort((a,b)=>  b.idEcheance - a.idEcheance);
          dde=new Date(this.echeanceAPayer[0].dateEcheance);
        }
        else{
          this.echeanceContrat.sort((a,b)=> b.idEcheance - a.idEcheance);
        dde=new Date(this.echeanceContrat[0].dateEcheance);
        }
      }
      else{
        dde=new Date(con.dateEffetContrat);
      }
    }
    else{
      dde=new Date(con.dateEffetContrat);
    }
    var mois=new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
      "Août", "Septembre", "Octobre", "Novembre", "Décembre");
    var i=0, n=0;
    var fa=new Date(new Date().getFullYear(),11,31);

    while( dde <= fa && (dde<=new Date(con.dateFinContrat) || con.dateFinContrat===null)) {
      var des=new Date(dde.getFullYear(),dde.getMonth()+1,dde.getDate());
      var exist=this.echeanceAPayer.filter(function(eche){
        return eche.dateEcheance===des && eche.contrat.numContrat===con.numContrat;});
        if(exist.length===0){
          var prix = this.prixImm.filter(pri=>
            (new Date(pri.dateDebPrixIm) <= dde && new Date(pri.dateFinPrixIm) > dde) ||
            (new Date(pri.dateDebPrixIm) <= dde && new Date(pri.dateFinPrixIm)<fa));
          if(prix!==null){
            prix.sort(function(a,b){
              return b.idPrixIm-a.idPrixIm;
            });

            const eche=new Echeance(mois[dde.getMonth()],dde.getFullYear(),des, false,prix[0].prixIm,con,null);
            this.echeanceAPayer.splice(this.echeanceAPayer.length,0,eche);
            n++;
          }
        }
        dde=des;
    }
    this.total=0;
  }

  chargerEcheancesContrat(con){
    this.echeancetmp=this.echeances.filter(function(echeance){
      return (echeance.contrat.numContrat===con.numContrat && echeance.payeEcheance===false);
    });
    this.totalLoyer=0
  }

  chargerLocataire(){
    this.servOp.getAllLocataires()
      .subscribe(
        (data)=>{
          this.locataires=data;
        },
        (err)=>{
          console.log('Locataire erreur: ', err);
        }
      );
    }

  considererEcheance(p: number){
    console.log('coche' +this.addLoyerGroup.value['coche']);
    if(this.addLoyerGroup.value['coche']===true){
      this.totalLoyer+=p;
    }
    else{
      if(this.totalLoyer>0)
        {this.totalLoyer-=p;}
    }
    console.log(this.totalLoyer);

  }

  typeImprime(typ : any){
    this.ind=typ;
  }

  ///Gestion des imputations

  initNewImput(){
    this.addImputGroup.reset();
    this.pointPayable=[];
    this.totalLoyer=0;
    this.addImput.show();
    this.coi=this.pointV.filter(pp=>pp.correspondant.imputableCorres===true && pp.payerPoint===false).map(pp=>pp.correspondant);
  }

  chargerPointNI( cor: Correspondant){
    this.pointPayable=this.pointV.filter(pp=>
      pp.correspondant.idCorrespondant===cor.idCorrespondant && pp.payerPoint===false
    );
    console.log(this.pointPayable);

    this.ImputLine=[];
    this.totalImput=0;
    this.servOp.getAllLPV()
    .subscribe(
      (data)=>{
        this.lignePV=data;
        this.lineOfPV=this.lignePV.filter(lpv=>
          lpv.pointVente.correspondant.idCorrespondant===cor.idCorrespondant && lpv.pointVente.payerPoint===false);
          console.log(this.lineOfPV);

        this.pv=[];
        this.lineOfPV.forEach(elt => {
          if(this.pv.find(p=> p.numPointVente===elt.pointVente.numPointVente)){
            this.pv.push(elt.pointVente);
            console.log(this.pv);
          }
          var lpvp = this.ImputLine.find(limp=>
            limp.article.codeArticle===elt.article.codeArticle
          );
          if(lpvp===undefined){
            console.log('ajout: ',elt);
            this.ImputLine.push(new LignePointVente(elt.quantiteLignePointVente,elt.pulignePointVente,0,0,null,
              elt.article));
          }
          else{
            lpvp.quantiteLignePointVente+=elt.quantiteLignePointVente;
            console.log('Ajout de quantité');
          }
        });
        this.totalImput=this.ImputLine.reduce((tt,lin)=>tt+=lin.quantiteLignePointVente*lin.pulignePointVente,0);
        console.log('Fin');

        console.log('imputation: ',this.ImputLine);
        console.log('Points concernés', this.pv);
      },
      (err)=>{
        console.log('lpv', err);
      }
    );

  }

  initialiseNewImput(){
    //this.chargerCorres();
    this.addImput.show();
  }

  ajouteImputation(){
    console.log(this.pointPayable);

    console.log('numero: '+this.addImputGroup.value['addImNum']+'\nMode de paiement: '+this.addImputGroup.value['addImMod']+
    '\nDate: '+this.addImputGroup.value['addImDat']+'\nCaisse: '+ this.addImputGroup.value['addImCai']);

    if(this.addImputGroup.value['addImNum']!==null && this.addImputGroup.value['addImMod']!==null &&
    this.addImputGroup.value['addImDat']!==null && this.addImputGroup.value['addImCai']!==null){
      console.log("enregistrement d'imputation");
      const newOC=new OpCaisse(this.addImputGroup.value['addImNum'], this.addImputGroup.value['addImDat'],
      this.coi[this.addImputGroup.value['addImCor']].magasinier.nomMagasinier+' '+
      this.coi[this.addImputGroup.value['addImCor']].magasinier.prenomMagasinier,true,this.addLoyerGroup.value['addImObs'], new Date(),
      this.caissesValides[this.addImputGroup.value['addImCai']], new TypeRecette('I','Imputation Correspondant'),
      this.modes[this.addImputGroup.value['addImMod']], this.exo,this.user);
      console.log(newOC);
      this.servOp.ajouteOp(newOC)
      .subscribe(
        (dataOP)=>{
          this.pointPayable.forEach(elt=>{
            const pv=new PointVente(elt.numPointVente,elt.datePointVente,true,elt.exercice, elt.correspondant,elt.regisseur);
              pv.opCaisse=dataOP;

              this.servPV.editPointVente(elt.numPointVente,pv)
                .subscribe(
                  (data)=>{
                    this.pointPayable.splice(0,1);
                  },
                  (err)=>{
                    console.log('Imputation: ', err);
                  }
                );
          });
          var i:number=this.ImputLine.length;
          this.ImputLine.forEach(elt => {
            var newline=new LigneOpCaisse(elt.quantiteLignePointVente,elt.pulignePointVente,null,dataOP,
              elt.article);
              newline.livre=true;
              //newline.magasin=n
            this.servOp.addOpLine(dataOP,newline).subscribe(
              datalip=>{
                i--;
                if(i===0){
                  this.rechargerLigneOpCaisse();
                  this.afficheFacture(dataOP);
                }
            });

          });
        },
        (err)=>{
          (err)=>{
            console.log('Location: ', err);
          }
        }
      );

    }
    else{
      console.log('pas enregistrement');
    }
    this.chargerOperations();
  }

  afficheFacture(opc: OpCaisse){

    const fact=new jsPDF();
    fact.text("Arrondissement : "+opc.caisse.arrondissement.nomArrondi+"\tCaisse : "+opc.caisse.libeCaisse+
    "\nReçu N° : "+ opc.numOpCaisse+"\t\t du : "+opc.dateOpCaisse.toLocaleString(),15,30);
    //fact.text(,15,40);
    let ligne=[];
    let total=0;


    switch(opc.typeRecette.codeTypRec){
      default:{
        fact.text("Contribuable : "+opc.contribuable,15,50);
        this.rechargerLigneOpCaisse();
        var loptmp=this.lignesOp.filter(function(lop){
          return lop.opCaisse.numOpCaisse===opc.numOpCaisse;
        });
        loptmp.forEach(element => {
          let lig=[];
          lig.push(element.article.codeArticle);
          lig.push(element.article.libArticle);
          lig.push(element.qteLigneOperCaisse);
          lig.push(element.prixLigneOperCaisse);
          lig.push(element.prixLigneOperCaisse*element.qteLigneOperCaisse);
          lig.push(element.commentaireLigneOperCaisse);
          total+=element.prixLigneOperCaisse*element.qteLigneOperCaisse;
          ligne.push(lig);
        });
        autoTable(fact,{
          head:[['Article','Désignation','Qte','PU','Montant','Obs']],
          margin:{top:60},
          body:ligne,
        });
        break;
      }

      case 'L':{
        var eche=this.echeances.filter(e=>e.opCaisse.numOpCaisse===opc.numOpCaisse);
        fact.text("Contrat : "+eche[0].contrat.numContrat+"\t\tBoutique :"+eche[0].contrat.immeuble.libIm+
        "\nLocataire : "+eche[0].contrat.locataire.identiteLocataire+ "\t\tDéposant : "+opc.contribuable,15,50);
        eche.forEach(element => {
          let lig=[];
          lig.push(element.moisEcheance);
          lig.push(element.annee);
          lig.push(element.prix);
          ligne.push(lig);
          total+=lig[3];
        });
        autoTable(fact,{
          head:[['Mois','Année','Montant']],
          margin:{top:70},
          body:ligne,
        });

        break;
      }
    }

    autoTable(fact,{
      theme: 'grid',
      margin: {top: 30, left : 130},
      columnStyles:{
        0:{ fillColor:[41,128,185], textColor: 255, fontStyle: 'bold'},
      },
      body: [['Total', total]
    ],
    });

    autoTable(fact,{
      theme: 'plain',

      margin: {top: 30, left : 130},
      columnStyles:{
        0:{ textColor: 0, fontStyle: 'bold', fontSize: 12},
      },
      body: [["Le(La) caissier(ère)"+"\n\n\n"+this.serU.connectedUser.nomUtilisateur+" "+
        this.serU.connectedUser.prenomUtilisateur]]

    });


    fact.autoPrint();
    this.pdfToShow=this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', {filename:'facture.pdf'}));
    this.appercu.show();
  }

  imprimeFacture(opc:OpCaisse){

    const fact=new jsPDF();
    fact.text("Arrondissement : "+opc.caisse.arrondissement.nomArrondi+"\tCaisse : "+opc.caisse.libeCaisse+
    "\nReçu N° : "+ opc.numOpCaisse+"\t\t du : "+opc.dateOpCaisse.toLocaleString(),15,30);
    //fact.text(,15,40);
    let ligne=[];
    let total=0;


    switch(opc.typeRecette.codeTypRec){
      default:{
        fact.text("Contribuable : "+opc.contribuable,15,50);
        this.rechargerLigneOpCaisse();
        var loptmp=this.lignesOp.filter(function(lop){
          return lop.opCaisse.numOpCaisse===opc.numOpCaisse;
        });
        loptmp.forEach(element => {
          let lig=[];
          lig.push(element.article.codeArticle);
          lig.push(element.article.libArticle);
          lig.push(element.qteLigneOperCaisse);
          lig.push(element.prixLigneOperCaisse);
          lig.push(element.prixLigneOperCaisse*element.qteLigneOperCaisse);
          lig.push(element.commentaireLigneOperCaisse);
          total+=element.prixLigneOperCaisse*element.qteLigneOperCaisse;
          ligne.push(lig);
        });
        autoTable(fact,{
          head:[['Article','Désignation','Qte','PU','Montant','Obs']],
          margin:{top:60},
          body:ligne,
        });
        break;
      }

      case 'L':{
        var eche=this.echeances.filter(e=>e.opCaisse.numOpCaisse===opc.numOpCaisse);
        fact.text("Contrat : "+eche[0].contrat.numContrat+"\t\tBoutique :"+eche[0].contrat.immeuble.libIm+
        "\nLocataire : "+eche[0].contrat.locataire.identiteLocataire+ "\t\tDéposant : "+opc.contribuable,15,50);
        eche.forEach(element => {
          let lig=[];
          lig.push(element.moisEcheance);
          lig.push(element.annee);
          lig.push(element.prix);
          ligne.push(lig);
          total+=lig[3];
        });
        autoTable(fact,{
          head:[['Mois','Année','Montant']],
          margin:{top:70},
          body:ligne,
        });

        break;
      }
    }

    autoTable(fact,{
      theme: 'grid',
      margin: {top: 30, left : 130},
      columnStyles:{
        0:{ fillColor:[41,128,185], textColor: 255, fontStyle: 'bold'},
      },
      body: [['Total', total]
    ],
    });

    autoTable(fact,{
      theme: 'plain',

      margin: {top: 30, left : 130},
      columnStyles:{
        0:{ textColor: 0, fontStyle: 'bold', fontSize: 12},
      },
      body: [["Le(La) caissier(ère)"+"\n\n\n"+this.serU.connectedUser.nomUtilisateur+" "+
        this.serU.connectedUser.prenomUtilisateur]]

    });


    fact.autoPrint();
    this.pdfToShow=this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', {filename:'facture.pdf'}));
    //this.appercu.show();
  }

  imprimeTicket(opc:OpCaisse){

    const fact=new jsPDF("p","mm",[80,900]);
    autoTable(fact,{
      theme:'plain',
      margin:{left:-0.1, top:-1, right:0, bottom:1},
      body:[
        ["Arrondissement : "+opc.caisse.arrondissement.nomArrondi],
        ["Caisse : "+opc.caisse.libeCaisse],
        ["Reçu N° : "+ opc.numOpCaisse+"\tDate : "+opc.dateOpCaisse.toLocaleString()],
        ["Contribuable : "+opc.contribuable]
      ],
      bodyStyles:{
        fontSize:8,
        cellPadding:1,
        halign:'center',
      }
    });
    let ligne=[];
    let total=0;

    this.servOp.getAllOpLines()
    .subscribe(
      (data3)=>{
        this.lignesOp=data3;
        var loptmp=this.lignesOp.filter(function(lop){
          return lop.opCaisse.numOpCaisse===opc.numOpCaisse;
        });
        loptmp.forEach(element => {
          let lig=[];
          lig.push(element.article.codeArticle);
          lig.push(element.article.libArticle);
          lig.push(element.qteLigneOperCaisse);
          lig.push(element.prixLigneOperCaisse);
          lig.push(element.prixLigneOperCaisse*element.qteLigneOperCaisse);
          total+=element.prixLigneOperCaisse*element.qteLigneOperCaisse;
          ligne.push(lig);
        });

        autoTable(fact,{
          theme:'grid',
          headStyles:{
            fillColor:[41,128,185],
            textColor:255,
            fontStyle:'bold',
          },
          styles:{
            fontSize:8,
          },
          head:[['Article','Désignation','Qte','PU','Montant']],
          margin:{top:0, left:5, right:5},
          body:ligne,
        });

        autoTable(fact,{
          theme: 'grid',
          margin:{top:0, left:30, right:5},
          columnStyles:{
            0:{ fillColor:[41,128,185], textColor: 255, fontStyle: 'bold', fontSize:8},
          },
          body: [
            ['Total', total]
          ],
          bodyStyles:{
            fontSize:8,
            cellPadding:1,
          },
        });

        autoTable(fact,{
          theme: 'plain',
          margin:{left:-0.1, top:5, right:0},
          body: [
            ["Le(La) caissier(ère)"+"\n\n\n"+this.serU.connectedUser.nomUtilisateur+" "+
            this.serU.connectedUser.prenomUtilisateur]
          ],
          bodyStyles:{
            fontSize:8,
            cellPadding:1,
            halign:'center',
            fontStyle: 'bold'
          },

        });

        this.pdfToShow=this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', {filename:'facture.pdf'}));
        this.appercu.show();

      },
      (err)=>{
        console.log('all lines: ',err);
      }
    );
  }

}
