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
import { isDate } from 'moment';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
import { PrixImmeuble } from '../../../models/prixImmeuble.model';
import { ValeurLocativeService } from '../../../services/definition/valeur-locative.service';
import { formatDate } from '@angular/common';
import { PointVente } from '../../../models/pointVente.model';
import { LignePointVente } from '../../../models/lignePointVente.model';
import { Correspondant } from '../../../models/Correspondant.model';

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

  ////Accueil
  tabOpeCa: DataTables.Settings = {};
  dtOpeCa: Subject<any> = new Subject<any>();
  listOp:OpCaisse[];
  Articles:Article[];
  caisses : Caisse[];
  opTypes : TypeRecette[];
  modes : ModePaiement[];
  exercices : Exercice[];
  users : Utilisateur[];
  //tabLigne:DataTables.Settings={};
  //dtLigne: Subject<OpCaisse>=new Subject<OpCaisse>();

  ///////Vente
  tabArtV: DataTables.Settings = {};
  dtArtV: Subject<any> = new Subject<any>();
  addVentGroup:FormGroup;
  line:OpCaisse[]=[];
  totalVente:number;
  totaltmp:number;
  tligne:number;
  lignesOp:LigneOpCaisse[];
////////Ajout d'article
  tabArt: DataTables.Settings = {};
  dtArt: Subject<LigneOpCaisse> = new Subject<LigneOpCaisse>();
  addArtGroup:FormGroup;
  tempLigneOpCais:LigneOpCaisse[]=[];
  lignesOfOp:LigneOpCaisse[];
  tmpOpC:OpCaisse;
  serVal:ValeurLocativeService;

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
  echeanceAPayer:Echeance[]=[];
  echeancetmp:Echeance[]=[];
  prixIm:PrixImmeuble[];
  prixEche:PrixImmeuble[]=[];
  totalLoyer:number

  ///////Imputation
  addImputGroup:FormGroup;
  correspondants:Correspondant[];
  tabLignePoint:DataTables.Settings={};
  //deEcheance:Subject<Echeance>=new Subject<Echeance>()
  pointV:PointVente[];
  lignePV:LignePointVente[]=[];
  totalPoint:number

  constructor( private servOp:OperationCaisseService, private fbuilder:FormBuilder, private router:Router) {

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
      columnDefs: [
        { targets: 0,
          visible: false },
        { targets: 1,
          visible: false }
    ],
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

  chargerImmeubles(loc:Locataire){
    this.contratLocataire=this.contrats.filter(function(contrat){
      return contrat.locataire.idLocataire===loc.idLocataire;
    });
  }

  chargerPrixImmeubles(loc:Locataire){
    this.contratLocataire=this.contrats.filter(function(contrat){
      return contrat.locataire.idLocataire===loc.idLocataire;
    });

  }

  genererEcheancier(con:Contrat){
    if(this.echeances.length!==0){
      this.echeanceAPayer=this.echeances.filter(function(echeance){
        return (echeance.contrat.numContrat===con.numContrat);
      });
    }

    var des:Date=new Date(), d:Date=new Date();
    if(this.echeanceContrat.length>0){
      this.echeanceContrat.sort(function(a,b){
        return b.idEcheance-a.idEcheance;
      });
      d=new Date(this.echeanceContrat[0].dateEcheance);
    }
    else{
      d=new Date(con.dateEffetContrat);
    }
    des=d;
    des.setMonth(des.getMonth()+1);
    var mois=new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
      "Août", "Septembre", "Octobre", "Novembre", "Décembre");

    console.log('Repère ',d, 'Echeance 1:', des);
    var i=0;
    while( des <= new Date()) {
      console.log('Passage '+i++);
          this.prixEche=this.prixIm.filter(pri=>
            pri.immeuble.codeIm===con.immeuble.codeIm && new Date(pri.dateDebPrixIm) <= des &&
            (new Date(pri.dateFinPrixIm) > des || new Date(pri.dateFinPrixIm)===null));
              if(this.prixEche.length !==0){
                const newEche=new Echeance(mois[d.getMonth()],d.getFullYear(),new Date(des),false,this.prixEche[0].prixIm,con,null);
                var existe=this.echeances.filter(function(eche){
                  return eche.contrat.numContrat===newEche.contrat.numContrat && eche.dateEcheance===newEche.dateEcheance;
                });
                if(existe.length===0){
                  this.servOp.addEcheance(newEche)
                  .subscribe(
                    data=>{
                      console.log('Enregistrement de: ', newEche);
                    },
                    err=>{
                      console.log('Erreur: ',err);
                    }
                  );
                }
                else{
                  console.log(existe[0].contrat.numContrat);
                }
            }
            else{
              console.log('boutique sans prix au '+des);
            }
      d=des;
      des.setMonth(des.getMonth()+1);
    }
    this.chargerEcheances(con);
  }

  initOpCaisse(){
    this.addVentGroup=this.fbuilder.group ({
      nVentNum:new FormControl(),
      nVentDat:new FormControl(),
      nVentCont:new FormControl(),
      nVentObs:new FormControl(),
      nVentCais:new FormControl(),
      nVentTyp:new FormControl(),
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
      addImMod:new FormControl()
    });

    this.chargerOperations();
    this.rechargerLigneOpCaisse();
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
    this.totalPoint=0;
    this.addImput.show();
    //this.chargerCorres();
    this.tmpOpC=new OpCaisse(new Date().getUTCFullYear+'-000001',new Date(),'Divers',true,'',new Date(),
    this.caisses[0],this.opTypes[0], this.modes[0],this.exercices[0],this.users[0]);
  }

  chargerOperations(){
    this.servOp.getAllOp()
    .subscribe(
      (data) => {
        this.listOp = data;
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

    /////Echances
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

  chargerEcheances(con){
    this.echeancetmp=this.echeances.filter(function(echeance){
      return (echeance.contrat.numContrat===con.numContrat && echeance.payeEcheance===false);
    });
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
    /*this.servOp.getCorresImput()
    .subscribe(
      (data)=>{
        this.correspondants=data;
      },
      (err)=>{
        console.log('correspondant: ', err);
      }
    );*/
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
  this.ChargerAccessoires();
  this.initOpCaisse();
  this.chargerOperations();
  //this.chargerLigneDuneOpCaisse(this.listOp[0]);
  }

  chargerPointNI( corres: Correspondant){

  }

  ouvreAddArt(){
    this.addArticle.show();

    this.servOp.getAllArticles()
    .subscribe(
      (data) => {
        this.Articles = data;
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

    if(trver===false) this.tempLigneOpCais.push(new LigneOpCaisse(0,artChoisi.prixVenteArticle,
      '', this.tmpOpC,artChoisi));

  }

  considererEcheance(p: number){
    {
      if(this.addLoyerGroup.value['coche']===true){
        this.totalLoyer+=p;
      }
      else{
        this.totalLoyer-=p;
        }
      console.log(this.totalLoyer);
      //,' payé: ',this.echeancetmp[n].payeEcheance);
    }
  }

  AjouteVente(){
    const newOC=new OpCaisse(this.addVentGroup.value['nVentNum'], new Date(this.addVentGroup.value['nVentDat']),
    this.addVentGroup.value['nVentCont'],true,this.addVentGroup.value['nVentObs'], new Date(),
    this.caisses[this.addVentGroup.value['nVentCais']], this.opTypes[this.addVentGroup.value['nVentTyp']],
    this.modes[this.addVentGroup.value['nVentMod']], this.exercices[0],this.users[0]);
    console.log('Exope', newOC.exercice);
    console.log('usope', newOC.utilisateur);
    this.servOp.ajouteOp(newOC)
    .subscribe(
      (data)=>{
        this.tempLigneOpCais.forEach(element => {
          console.log('Avant envoi: ', element, newOC);
          const newLine = new LigneOpCaisse(element.qteLigneOperCaisse,element.prixLigneOperCaisse,
            element.commentaireLigneOperCaisse, newOC,element.article);
          this.servOp.addOpLine(newOC, newLine)
          .subscribe(
            (data)=>{
              this.supTempLigneOpCais(this.tempLigneOpCais.indexOf(newLine));
            },
            (erreur)=>{
            console.log('Ligne échouée', erreur);
            }

          );
        });
        console.log(newOC);
      },
      (err)=>{
        console.log('Opération échouée',err);
      }
    );

    this.chargerOperations();
    this.addVentGroup.reset();
    //this.tempLigneOpCais=[];
    this.totalVente=0;
  }

  recupererTotalVente(n:number){
    console.log("ligne: "+n);
    this.tligne=this.tempLigneOpCais[n].prixLigneOperCaisse*
    this.tempLigneOpCais[n].qteLigneOperCaisse;
    this.totaltmp=this.totalVente-this.tligne;
    console.log("ligne:"+(this.tligne)+" tempon: "+(this.totaltmp)+" Total vente: "+(this.totalVente));

  }

  recalculerTotalvente(i:number){
    this.totalVente=this.totaltmp+this.tempLigneOpCais[i].prixLigneOperCaisse*
    this.tempLigneOpCais[i].qteLigneOperCaisse;
    console.log(this.totalVente);

  }

  initialiseNouveauLoyer(){
    this.chargerLocataire();
    this.addLoyer.show();
  }

  ajoutePaiement(){
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
                    this.chargerEcheances(elt.contrat);
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
                    this.chargerEcheances(elt.contrat);
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

  AjouteImputation(){
    const newOC=new OpCaisse(this.addVentGroup.value['nVentNum'], new Date(this.addVentGroup.value['nVentDat']),
    this.addVentGroup.value['nVentCont'],true,this.addVentGroup.value['nVentObs'], new Date(),
    this.caisses[this.addVentGroup.value['nVentCais']], this.opTypes[this.addVentGroup.value['nVentTyp']],
    this.modes[this.addVentGroup.value['nVentMod']], this.exercices[0],this.users[0]);
    console.log('Exope', newOC.exercice);
    console.log('usope', newOC.utilisateur);
    this.servOp.ajouteOp(newOC)
    .subscribe(
      (data)=>{
        this.tempLigneOpCais.forEach(element => {
          console.log('Avant envoi: ', element, newOC);
          const newLine = new LigneOpCaisse(element.qteLigneOperCaisse,element.prixLigneOperCaisse,
            element.commentaireLigneOperCaisse, newOC,element.article);
          this.servOp.addOpLine(newOC, newLine)
          .subscribe(
            (data)=>{
              this.supTempLigneOpCais(this.tempLigneOpCais.indexOf(newLine));
            },
            (erreur)=>{
            console.log('Ligne échouée', erreur);
            }

          );
        });
        console.log(newOC);
      },
      (err)=>{
        console.log('Opération échouée',err);
      }
    );

    this.chargerOperations();
    this.addVentGroup.reset();
    //this.tempLigneOpCais=[];
    this.totalVente=0;
  }

}
