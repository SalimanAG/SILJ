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

  pdfToShow;
  ////Accueil
  timp:String[]=['Ticket','Reçu'];
  tabOpeCa: DataTables.Settings = {};
  dtOpeCa: Subject<any> = new Subject<any>();
  listOp:OpCaisse[];
  Articles:Article[];
  caisses : Caisse[];
  opTypes : TypeRecette[];
  modes : ModePaiement[];
  exercices : Exercice[];
  users : Utilisateur[];
  datePipe: DatePipe;
  //tabLigne:DataTables.Settings={};
  //dtLigne: Subject<OpCaisse>=new Subject<OpCaisse>();

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
  dtArtV: Subject<LigneOpCaisse> = new Subject<LigneOpCaisse>();
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
  dtrigDetail:Subject<LigneOpCaisse>=new Subject<LigneOpCaisse>();

  ///////Location
  addLoyerGroup:FormGroup;
  locataires:Locataire[];
  tabEcheance:DataTables.Settings={};
  //deEcheance:Subject<Echeance>=new Subject<Echeance>()
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
  prix:PrixImmeuble[];
  totalLoyer:number

  ///////Imputation
  addImputGroup:FormGroup;
  co:Correspondant[]=[];
  coi:Correspondant[]=[];
  tabLignePoint:DataTables.Settings={};
  //deEcheance:Subject<Echeance>=new Subject<Echeance>()
  ind : number=0;
  pointV:PointVente[];
  pointPayable:PointVente[];
  lignePV:LignePointVente[];
  ImputLine:LignePointVente[]=[ ];
  lineOfPV:LignePointVente[];
  totalImput:number
  total:number;

  constructor( private serU: UtilisateurService, private servOp:OperationCaisseService, private fbuilder:FormBuilder, private router:Router,
    private sanitizer : DomSanitizer) {

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

    this.tabDetail = {
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
  }

  rechargerLigneOpCaisse(){
    this.servOp.getAllOpLines()
    .subscribe(
      (data)=>{
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

  chargerImmeubles(loc : Locataire){
    if(loc!==null){
      this.contratLocataire=this.contrats.filter(function(contrat){
        return contrat.locataire.idLocataire===loc.idLocataire;
      });
    }
  }

  chargerPrixImmeubles(imm:Immeuble){
    this.prix=this.prixIm.filter(p=>p.immeuble.codeIm===imm.codeIm);
  }

  genererEcheancier(con:Contrat){
    this.chargerEcheances();
    this.echeanceAPayer=[];
    this.totalLoyer=0;
    var dde:Date=new Date();
    if(this.echeances.length>0){
      this.echeanceContrat=this.echeances.filter(function(echeance){
        return (echeance.contrat.numContrat===con.numContrat);
      });
      if(this.echeanceContrat.length>0){
        this.echeanceContrat.sort( function(a,b){
        return Date.parse(a.dateEcheance.toLocaleDateString())-Date.parse(b.dateEcheance.toLocaleDateString());
      });
        dde=new Date(this.echeanceContrat[this.echeanceContrat.length-1].dateEcheance);
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
          var prix = this.prixIm.filter(pri=>
            pri.immeuble.codeIm===con.immeuble.codeIm && new Date(pri.dateDebPrixIm) <= dde &&
            (new Date(pri.dateFinPrixIm) > dde || new Date(pri.dateFinPrixIm)<= fa));
          if(prix.length>0){
            prix.reverse();
            const eche=new Echeance(mois[dde.getMonth()],dde.getFullYear(),des, false,prix[0].prixIm,con,null);
            this.echeanceAPayer.splice(this.echeanceAPayer.length,0,eche);
            n++;
          }
        }
        dde=des;
    }
  }

  typeImprime(typ : any){
    this.ind=typ;
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
      coche:new FormControl()
    });

    this.addImputGroup=new FormGroup({
      addImCor:new FormControl(),
      addImNum:new FormControl(),
      addImDat:new FormControl(),
      addImCai:new FormControl(),
      addImMod:new FormControl(),
      addDebIm:new FormControl(),
      addFinIm:new FormControl()
    });

    this.chargerOperations();
    this.rechargerLigneOpCaisse();
    this.chargerCorres();
    this.chargerEcheances();
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

  initNewVente(){
    this.totalVente=0;
    this.addVente.show();
    this.tmpOpC=new OpCaisse(new Date().getUTCFullYear+'-000001',new Date(),'Divers',true,'',new Date(),
    this.caisses[0],this.opTypes[0], this.modes[0],this.exercices[0],this.users[0]);
  }

  initNewImput(){
    this.totalLoyer=0;
    this.addImput.show();
    this.chargerCorres();
  }

  chargerOperations(){
    this.servOp.getAllOp()
    .subscribe(
      (data) => {
        this.listOp = data;
        //this.dtOpeCa.next();
      },
      (erreur) => {
        console.log('Opération : '+erreur);
      }
    );
  }

  ChargerAccessoires(){
    //Caisse
    this.servOp.getAllCaisses()
    .subscribe(
      (data)=>{
        this.caisses=data;
      },
      (err)=>{
        console.log('Caisses:', err)
      }
    );

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

    //Exercices
    this.servOp.getAllExos()
    .subscribe(
      (data)=>{
        this.exercices=data;
      },
      (err)=>{
        console.log('Exo: ', err);
      }
    );

    ///Utilisateurs
    this.servOp.getAllUsers()
    .subscribe(
      (data)=>{
        this.users=data;
      },
      (err)=>{
        console.log('User erreur: ', err);
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
  }

  chargerEcheances(){
    this.servOp.getAllEcheances()
    .subscribe(
      (data)=>{
        this.echeances=data;
      },
      err=>{
        console.log('Echéances: ',err);
      }
    );
  }

  chargerEcheancesContrat(con){
    this.echeancetmp=this.echeances.filter(function(echeance){
      return (echeance.contrat.numContrat===con.numContrat && echeance.payeEcheance===false);
    });
    console.log(this.echeancetmp.length);
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

  chargerCorres(){
      this.servOp.getAllCor()
        .subscribe(
          (data)=>{
            this.co=data;
          },
          (err)=>{
            console.log('Locataire erreur: ', err);
          }
        );
        this.coi=this.co.filter(function(c){
          return c.imputableCorres===true;
        });

      }

  initLoyer(){
  this.chargerLocataire();
  this.totalVente=0;
  this.addLoyer.show();
  this.tmpOpC=new OpCaisse(new Date().getUTCFullYear+'-000001',new Date(),'Divers',true,'',new Date(),
  this.caisses[0],this.opTypes[0], this.modes[0],this.exercices[0],this.users[0]);
  this.totalLoyer=0;

  }

  ngOnInit(){
    //console.log(this.datePipe.transform(new Date(),"dd/MM/yyyy"));

    this.ChargerAccessoires();
    this.initOpCaisse();
    this.servOp.getAllOp()
      .subscribe(
        (data) => {
          this.listOp = data;
          this.dtOpeCa.next();
        },
      (erreur) => {
        console.log('Opération : '+erreur);
      }
    );
  //this.chargerLigneDuneOpCaisse(this.listOp[0]);
  }

  chargerPointNI( cor: Correspondant){
    this.ImputLine=[];
    this.totalImput=0;
    this.servOp.getAllLPV()
    .subscribe(
      (data)=>{
        this.lignePV=data;
        this.lineOfPV=this.lignePV.filter(lpv=>
          lpv.pointVente.correspondant.idCorrespondant===cor.idCorrespondant && lpv.pointVente.payerPoint===false);
          console.log(this.lineOfPV);

        this.lineOfPV.forEach(elt => {
          var lpvp = this.ImputLine.find(limp=>
            limp.article.codeArticle===elt.article.codeArticle
          );
          if(lpvp===undefined){
            console.log('Rechercher:',elt);
            this.ImputLine.push(new LignePointVente(elt.quantiteLignePointVente,elt.pulignePointVente,0,0,null,
              elt.article));
          }
          else{
            lpvp.quantiteLignePointVente+=elt.quantiteLignePointVente;
            console.log('Ajout de quantité');
          }
        });
        this.totalImput=this.ImputLine.reduce((tt,lin)=>tt+=lin.quantiteLignePointVente*lin.pulignePointVente,0);
        console.log('fin du game: '+this.totalImput);
        console.log('imputation: ',this.ImputLine);
        const pp=this.ImputLine.map(pv=>pv.pointVente);
        console.log('Points concernés', pp);
      },
      (err)=>{
        console.log('lpv', err);
      }
    );

  }

  ouvreAddArt(){
    this.addArticle.show();

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

  considererEcheance(p: number){
    {
      if(this.addLoyerGroup.value['coche']===true){
        this.totalLoyer+=p;
      }
      else{
        if(this.totalLoyer>0)
         this.totalLoyer-=p;
        }
    }
  }

  valideVente():OpCaisse{
    let op:OpCaisse = null;
    const newOC=new OpCaisse(this.addVentGroup.value['nVentNum'], new Date(this.addVentGroup.value['nVentDat']),
    this.addVentGroup.value['nVentCont'],true,this.addVentGroup.value['nVentObs'], new Date(),
    this.caisses[this.addVentGroup.value['nVentCais']], new TypeRecette('VD','Vente Directe'),
    this.modes[this.addVentGroup.value['nVentMod']], this.exercices[0],this.users[0]);
    this.servOp.ajouteOp(newOC)
    .subscribe(
      (data)=>{
        this.tempLigneOpCais.forEach((element, index) => {
          const newLine = new LigneOpCaisse(element.qteLigneOperCaisse,element.prixLigneOperCaisse,
            element.commentaireLigneOperCaisse, data,element.article);
            this.servOp.addOpLine(data, newLine)
            .subscribe(
              (data2)=>{
                this.supTempLigneOpCais(this.tempLigneOpCais.indexOf(newLine));
                if(this.tempLigneOpCais.length == 0){
                  this.servOp.getAllOpLines()
                    .subscribe(
                      (data3)=>{
                        this.lignesOp=data3;
                        this.imprimeFacture(data);
                      },
                      (err)=>{
                        console.log('all lines: ',err);
                      }
                    );
                }

              },
          (erreur)=>{
          console.log('Ligne échouée', erreur);
          }
        );
        this.rechargerLigneOpCaisse();
      });
      this.chargerOperations();
      op= data;
    },
    (err)=>{
      console.log('Opération échouée',err);
    }
  );
  this.addVentGroup.reset();
  this.totalVente=0;

    return op;

  }

  AjouteVente(){
    let op:OpCaisse;
    const newOC=new OpCaisse(this.addVentGroup.value['nVentNum'], new Date(this.addVentGroup.value['nVentDat']),
    this.addVentGroup.value['nVentCont'],true,this.addVentGroup.value['nVentObs'], new Date(),
    this.caisses[this.addVentGroup.value['nVentCais']], new TypeRecette('VD','Vente Directe'),
    this.modes[this.addVentGroup.value['nVentMod']], this.exercices[0],this.users[0]);
    this.servOp.ajouteOp(newOC)
    .subscribe(
      (data)=>{
        this.tempLigneOpCais.forEach((element, index) => {
          const newLine = new LigneOpCaisse(element.qteLigneOperCaisse,element.prixLigneOperCaisse,
            element.commentaireLigneOperCaisse, data,element.article);
            this.servOp.addOpLine(data, newLine)
            .subscribe(
              (data2)=>{
                this.supTempLigneOpCais(this.tempLigneOpCais.indexOf(newLine));
                if(this.tempLigneOpCais.length == 0){
                  this.servOp.getAllOpLines()
                    .subscribe(
                      (data3)=>{
                        this.lignesOp=data3;
                        this.imprimeFacture(data);
                      },
                      (err)=>{
                        console.log('all lines: ',err);
                      }
                    );
                }
              },
          (erreur)=>{
          console.log('Ligne échouée', erreur);
          }
        );
        this.rechargerLigneOpCaisse();
      });
      this.chargerOperations();
      console.log(this.tempLigneOpCais.length);

      //if(this.tempLigneOpCais.length===0 ){
        /*switch(this.addVentGroup.value['nVTimp']){
          case "Ticket":{
            console.log("imp ticket");
            break;
          }
          case "Reçu":{*/
            /*break;
          }
          default:{
            break;
          }
        }*/
      //}
    },
    (err)=>{
      console.log('Opération échouée',err);
      op=null;
    }
  );
  this.addVentGroup.reset();
  this.totalVente=0;
    console.log(this.ind);

      //this.afficheFacture(this.valideVente(),);
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

  initialiseNouveauLoyer(){
    this.chargerLocataire();
    this.addLoyer.show();
  }

  ajoutePaiement(){
    if(this.addLoyerGroup.value['loyCai']!==null && this.addLoyerGroup.value['loyMod']!==null && this.totalLoyer>0){
    const newOC=new OpCaisse(this.addLoyerGroup.value['loyNum'], this.addLoyerGroup.value['loyDat'],
    this.addLoyerGroup.value['loyCon'],true,this.addLoyerGroup.value['loyObs'], new Date(),
    this.caisses[this.addLoyerGroup.value['loyCai']], new TypeRecette('L','Location'),
    this.modes[this.addLoyerGroup.value['loyMod']], this.exercices[0],this.users[0]);
    console.log(newOC);
    this.servOp.ajouteOp(newOC)
    .subscribe(
      (data)=>{
        this.echeanceAPayer.forEach(elt => {
          if(elt.payeEcheance){
            const newEche = new Echeance(elt.moisEcheance, elt.annee, elt.dateEcheance, true,elt.prix,elt.contrat,data);
            this.servOp.addEcheance(newEche)
            .subscribe(
              (data)=>{
                this.echeanceAPayer.splice(this.echeanceAPayer.indexOf(newEche) );
              },
              (erreur)=>{
              console.log('Ligne échouée', erreur);
              }
            );
          }
          else{
            exit;
          }
        });
        this.afficheFacture(data);
      },
      (err)=>{
        console.log('Opération échouée',err);
      }
    );

    }
    else{
      console.log('pas enregistrement');
    }
    this.chargerOperations();
  }

  initialiseNewImput(){
    //this.chargerCorres();
    this.addImput.show();
  }

  ajouteImputation(){
    if(this.addLoyerGroup.value['loyCai']!==null && this.addLoyerGroup.value['loyMod']!==null){
      console.log('enregistrement de location en cours');

      const newOC=new OpCaisse(this.addLoyerGroup.value['loyNum'], this.addLoyerGroup.value['loyDat'],
    this.addLoyerGroup.value['loyCon'],true,this.addLoyerGroup.value['loyObs'], new Date(),
    this.caisses[this.addLoyerGroup.value['loyCai']], new TypeRecette('L','Location'),
    this.modes[this.addLoyerGroup.value['loyMod']], this.exercices[0],this.users[0]);
    console.log(newOC);

      this.servOp.ajouteOp(newOC)
      .subscribe(
        (data)=>{
          this.echeancetmp.forEach(elt => {
            if(elt.payeEcheance){
              const newEche=new Echeance(elt.moisEcheance,elt.annee,elt.dateEcheance,true,elt.prix,
                elt.contrat, newOC);
                console.log('Echeance '+elt.idEcheance+' nouvelles valeurs ',newEche);
              this.servOp.editEcheance(elt.idEcheance,new Echeance(elt.moisEcheance,elt.annee,elt.dateEcheance,true,elt.prix,
                elt.contrat, newOC))
                .subscribe(
                  (data)=>{
                    this.chargerEcheancesContrat(elt.contrat);
                  },
                  (err)=>{
                    console.log('Echéance: ', err);
                  }
                );
            }
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
    fact.text("Arrondissement : "+opc.caisse.arrondissement.nomArrondi,20,30);
    fact.text("Caisse : "+opc.caisse.libeCaisse+"\tReçu N° : "+ opc.numOpCaisse+"\tDate : "+opc.dateOpCaisse.toLocaleString(),20,40);
    let ligne=[];
    this.total=0;


    switch(opc.typeRecette.codeTypRec){
      case 'VD':{
        fact.text("Contribuable : "+opc.contribuable,20,50);
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
          this.total+=element.prixLigneOperCaisse*element.qteLigneOperCaisse;
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
        console.log("location", opc.numOpCaisse);

        this.chargerEcheances();
        var eche=this.echeances.filter(function(e){
          return e.opCaisse.numOpCaisse===opc.numOpCaisse;
        });

        fact.text("Contrat : "+eche[0].contrat.numContrat+" Locataire : "+eche[0].contrat.locataire.identiteLocataire+
        "Contribuable : "+opc.contribuable,20,50);
        eche.forEach(element => {
          let lig=[];
          lig.push(element.moisEcheance);
          lig.push(element.annee);
          lig.push(element.prix);
          ligne.push(lig);
          this.total+=element.prix.valueOf();
        });
        autoTable(fact,{
          head:[['Mois','Année','Montant']],
          margin:{top:60},
          body:ligne,
        });
        break;
      }
      case 'IC':{
        console.log('Imputation');
        break;
      }
    }

    autoTable(fact,{
      theme: 'grid',
      margin: {top: 30, left : 130},
      columnStyles:{
        0:{ fillColor:[41,128,185], textColor: 255, fontStyle: 'bold'},
      },
      body: [['Total', this.total]
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

    //fact.autoPrint();

    this.pdfToShow=this.sanitizer.bypassSecurityTrustResourceUrl(fact.output('datauristring', {filename:'facture.pdf'}));
    this.appercu.show();

  }

  imprimeFacture(opc:OpCaisse){

    const fact=new jsPDF();
    fact.text("Arrondissement : "+opc.caisse.arrondissement.nomArrondi,20,30);
    fact.text("Caisse : "+opc.caisse.libeCaisse+"\tReçu N° : "+ opc.numOpCaisse+"\tDate : "+opc.dateOpCaisse.toLocaleString(),20,40);
    let ligne=[];
    let total=0;


    switch(opc.typeRecette.codeTypRec){
      case 'VD':{
        fact.text("Contribuable : "+opc.contribuable,20,50);
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
        console.log("location", opc.numOpCaisse);

        this.chargerEcheances();
        var eche=this.echeances.filter(function(e){
          return e.opCaisse.numOpCaisse===opc.numOpCaisse;
        });

        fact.text("Contrat : "+eche[0].contrat.numContrat+" Locataire : "+eche[0].contrat.locataire.identiteLocataire+
        "Contribuable : "+opc.contribuable,20,50);
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
          margin:{top:30},
          body:ligne,
        });
        break;
      }
      case 'IC':{
        console.log('Imputation');
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
      margin:{left:-0.1, top:5, right:0, bottom:1},
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

/*
    switch(opc.typeRecette.codeTypRec){
      case 'VD':{
        fact.text("Contribuable : "+opc.contribuable,20,50);
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
        console.log("location", opc.numOpCaisse);

        this.chargerEcheances();
        var eche=this.echeances.filter(function(e){
          return e.opCaisse.numOpCaisse===opc.numOpCaisse;
        });

        fact.text("Contrat : "+eche[0].contrat.numContrat+" Locataire : "+eche[0].contrat.locataire.identiteLocataire+
        "Contribuable : "+opc.contribuable,20,50);
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
          margin:{top:30},
          body:ligne,
        });
        break;
      }
      case 'IC':{
        console.log('Imputation');
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
*/

    //fact.autoPrint();

  }

}
