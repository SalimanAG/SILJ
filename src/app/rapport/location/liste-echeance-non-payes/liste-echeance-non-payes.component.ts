import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AppBreadcrumbComponent } from '@coreui/angular';
import { jsPDF } from 'jspdf';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Contrat } from '../../../../models/contrat.model';
import { Echeance } from '../../../../models/echeance.model';
import { Locataire } from '../../../../models/locataire.model';
import { LocataireService } from '../../../../services/definition/locataire.service';
import { ValeurLocativeService } from '../../../../services/definition/valeur-locative.service';
import { ContratLocationService } from '../../../../services/saisie/contrat-location.service';
import { OperationCaisseService } from '../../../../services/saisie/operation-caisse.service';
import autotable from 'jspdf-autotable';
import * as moment from 'moment';
import { PrixImmeuble } from '../../../../models/prixImmeuble.model';

@Component({
  selector: 'app-liste-echeance-non-payes',
  templateUrl: './liste-echeance-non-payes.component.html',
  styleUrls: ['./liste-echeance-non-payes.component.css']
})
export class ListeEcheanceNonPayesComponent implements OnInit {


  locataires: Locataire[];
  contrats : Contrat[];
  contLoc : Contrat[];
  echeances : Echeance[];
  echeanceAPayer : Echeance[];
  echeCont : Echeance[];
  prix : PrixImmeuble[];
  prixBout : PrixImmeuble[];

  opened:number = 0;
  clicked:number = 0;

  locaGroup: FormGroup;
  immeuGroup: FormGroup;
  @ViewChild ('appercu') public appercu : ModalDirective;
  vuePdf = null;

  constructor(public locaSer: LocataireService, public conSer: ContratLocationService, 
    public opserv : OperationCaisseService, public vls : ValeurLocativeService, public fbuilder: FormBuilder, public sanit: DomSanitizer) {

      this.locaGroup= fbuilder.group({
        loca : new FormControl(0),
        cont : new FormControl(0)
      });

      this.locaGroup= fbuilder.group({
        loca : new FormControl(0),
        cont : new FormControl(0)
      });
    
    
    this.locaSer.getAllLocataire().subscribe(
      data=>{
        this.locataires=data;
      },
      err=>{
        console.log('chargement échoué: ',err);
      }
    );

    this.conSer.getAllContrat().subscribe(
      data=>{
        this.contrats=data;
        console.log(this.contrats.length);
      },
      err=>{
        console.log('chargement échoué: ',err);
      }
    );

    this.opserv.getAllEcheances().subscribe(
      data=>{
        this.echeances=data;
      },
      err=>{
        console.log('chargement échoué: ',err);
      }
    );

    this.vls.getAllPrixImmeuble().subscribe(
      data=>{
        this.prix=data;
      },
      err=>{
        console.log('chargement échoué: ',err);
      }
    );

   }

  ngOnInit(): void {
    
  }

  filtreContrat(){
    if(this.locaGroup.value['loca']!=-1){
      this.contLoc=this.contrats.filter(c=>c.locataire.idLocataire == this.locataires[this.locaGroup.value['loca']].idLocataire);
    this.locaGroup.patchValue({cont:-1});}
  }

  affichePaiement(){
    if(this.contLoc.length>0){
      const doc=new jsPDF();
      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.setFontSize(18);
      doc.deletePage(1);
      if(this.locaGroup.value['cont']==-1){
        this.contLoc.forEach(element => {
          this.echeCont=this.echeances.filter(
            ec=>ec.contrat.numContrat==this.contLoc[this.locaGroup.value['cont']].numContrat);
            if(this.echeCont.length>0){
              this.echeCont.sort((a,b)=><any>new Date(a.dateEcheance)-<any>new Date(b.dateEcheance));
              let list=[];
              this.echeCont.forEach(e=>{
                let eche=[];
                eche.push(e.moisEcheance);
                eche.push(e.annee);
                eche.push(e.dateEcheance);
                eche.push(e.prix);
                eche.push(e.opCaisse.numOpCaisse);
                eche.push(e.opCaisse.contribuable);
                eche.push(moment(new Date(e.opCaisse.dateOpCaisse)).format('DD/MM/yyyy hh:mm'));
  
                list.push(eche);
              });doc.addPage();
              doc.text(''+doc.getNumberOfPages(),8,10);
              doc.text('Locataire : ' + this.locataires[this.locaGroup.value['loca']].identiteLocataire, 40, 20);
              doc.text('Contrat : ' + this.contLoc[this.locaGroup.value['cont']].numContrat+' Du '+
              this.contrats[this.locaGroup.value['cont']].dateEffetContrat+' Au : '+
              this.contrats[this.locaGroup.value['cont']].dateFinContrat, 45, 30);
              doc.text('Valeur locative : ' + this.contrats[this.locaGroup.value['cont']].immeuble.libIm, 50, 40);
              doc.text('Site : ' + this.contrats[this.locaGroup.value['cont']].immeuble.siteMarcher.libSite, 50, 50);
              autotable(doc, {
                theme: 'grid',
                head: [['Année', 'Mois', 'Echéance', 'Prix', 'Reçu N°', 'Date Paiement', 'Déposant']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 60 },
                body: list,
              });
              this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
              this.appercu.show();
            }
            else{
              console.log('Le locataire '+this.locataires[this.locaGroup.value['loca']].identiteLocataire+
              ' n\'a payé aucune échéance sur le contrat de location N°: '+this.contLoc[this.locaGroup.value['cont']].numContrat);
              
            }
        });
      }
      else{
        this.echeCont=this.echeances.filter(
          ec=>ec.contrat.numContrat==this.contLoc[this.locaGroup.value['cont']].numContrat);
          if(this.echeCont.length>0){
            this.echeCont.sort((a,b)=><any>new Date(a.dateEcheance)-<any>new Date(b.dateEcheance));
            let list=[];
            this.echeCont.forEach(e=>{
              let eche=[];
              eche.push(e.moisEcheance);
              eche.push(e.annee);
              eche.push(e.dateEcheance);
              eche.push(e.prix);
              eche.push(e.opCaisse.numOpCaisse);
              eche.push(e.opCaisse.contribuable);
              eche.push(moment(new Date(e.opCaisse.dateOpCaisse)).format('DD/MM/yyyy hh:mm'));

              list.push(eche);
            });
            doc.addPage();
            doc.text(''+doc.getNumberOfPages(),8,10);
            doc.text('Locataire : ' + this.locataires[this.locaGroup.value['loca']].identiteLocataire, 40, 20);
            doc.text('Contrat : ' + this.contLoc[this.locaGroup.value['cont']].numContrat+' Du '+
            this.contrats[this.locaGroup.value['cont']].dateEffetContrat+' Au : '+
            this.contrats[this.locaGroup.value['cont']].dateFinContrat, 45, 30);
            doc.text('Valeur locative : ' + this.contrats[this.locaGroup.value['cont']].immeuble.libIm, 50, 40);
            doc.text('Site : ' + this.contrats[this.locaGroup.value['cont']].immeuble.siteMarcher.libSite, 50, 50);
            autotable(doc, {
              theme: 'grid',
              head: [['Année', 'Mois', 'Echéance', 'Prix', 'Reçu N°', 'Date Paiement', 'Déposant']],
              headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
              },
              margin: { top: 60 },
              body: list,
            });
            this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
            this.appercu.show();
          }
          else{
            console.log('Le locataire '+this.locataires[this.locaGroup.value['loca']].identiteLocataire+
            ' est à jour sur le contrat de location N°: '+this.contLoc[this.locaGroup.value['cont']].numContrat);
            
          }
      }
    }
    else{
      console.log('Ce locataire ne dispose d\'aucun contrat' );
    }
    this.echeCont=this.echeances.filter(e=>
      e.contrat.numContrat == this.contrats[this.locaGroup.value['cont']].numContrat);
    if(this.echeCont.length>0){
      let list=[]
      this.echeCont.forEach(e=>{
      });
      
    }
    else{
      console.log('Aucun paiement ne correspond à ce contrat');
    }
  }
  
  genererEcheancier(con: Contrat){
    console.log(con);
    
    this.echeanceAPayer = [];
    let totalLoyer = 0;
    var dde: Date = new Date(con.dateEffetContrat);
    var mois = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
      "Août", "Septembre", "Octobre", "Novembre", "Décembre");
    var i = 0, n = 0;
    this.echeCont = this.echeances.filter(eche => eche.contrat.numContrat == con.numContrat);
    while (dde <= new Date() && (dde <= new Date(con.dateFinContrat) || con.dateFinContrat === null)) {
      var des = new Date(dde.getFullYear(), dde.getMonth() + 1, dde.getDate());
      var exist = this.echeCont.filter(function (eche) {
        return eche.moisEcheance == mois[dde.getMonth()] && eche.contrat.numContrat === con.numContrat
          && eche.payeEcheance===true;
      });
      if (exist.length === 0) {
        this.prixBout = this.prix.filter(pri =>
          (new Date(pri.dateDebPrixIm) <= new Date(dde) && new Date(pri.dateFinPrixIm) > new Date(dde)) ||
          (new Date(pri.dateDebPrixIm) <= new Date(dde) && new Date(dde) < new Date()));
        if (this.prixBout !== null) {
          const eche = new Echeance(mois[dde.getMonth()], dde.getFullYear(), des, false,
            this.prixBout[this.prixBout.length - 1].prixIm, con, null);
          this.echeanceAPayer.push(eche);
          n++;
        }
      }
      dde = des;
    }
    this.echeanceAPayer.sort((a, b) => <any>new Date(a.dateEcheance) - <any> new Date(b.dateEcheance));
  }

  afficheImpayes(){
    const doc=new jsPDF();
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(18);
    doc.deletePage(1);
    if(this.locaGroup['cont']!=-1){
      console.log(this.contLoc[this.locaGroup.value['cont']]);
      
      this.genererEcheancier(this.contLoc[this.locaGroup.value['cont']]);
      if(this.echeanceAPayer.length > 0){
        let list=[];
        this.echeanceAPayer.forEach(element => {
          let col=[];
          col.push(element.annee);
          col.push(element.moisEcheance);
          col.push(moment(new Date(element.dateEcheance)).format("DD/MM/YYYY"));
          col.push(element.prix);
          list.push(col);
        });
        doc.addPage();
        doc.text(''+doc.getNumberOfPages(),8,10);
        doc.text('Locataire : ' + this.locataires[this.locaGroup.value['loca']].identiteLocataire, 40, 20);
        doc.text('Contrat : ' + this.contLoc[this.locaGroup.value['cont']].numContrat+' Du '+
        this.contrats[this.locaGroup.value['cont']].dateEffetContrat+' Au : '+
        this.contrats[this.locaGroup.value['cont']].dateFinContrat, 45, 30);
        doc.text('Valeur locative : ' + this.contrats[this.locaGroup.value['cont']].immeuble.libIm, 50, 40);
        doc.text('Site : ' + this.contrats[this.locaGroup.value['cont']].immeuble.siteMarcher.libSite, 50, 50);
        doc.text('Point des impayés', 60, 60);
        autotable(doc, {
          theme: 'grid',
          head: [['Année', 'Mois', 'Echéance', 'Prix']],
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
          },
          margin: { top: 70 },
          body: list,
        });
        this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
        this.appercu.show();
      }
      else{
        console.log('Le locataire est à jour sur le contrat');
      }
    } 
    else{
      this.contLoc.forEach(elt => {
        this.genererEcheancier(elt);
        if(this.echeanceAPayer.length > 0){
          let list=[];
          this.echeanceAPayer.forEach(element => {
            let col=[];
            col.push(element.annee);
            col.push(element.moisEcheance);
            col.push(moment(new Date(element.dateEcheance)).format("DD/MM/YYYY"));
            col.push(element.prix);
            list.push(col);
          });
          doc.addPage();
          doc.text(''+doc.getNumberOfPages(),8,10);
          doc.text('Locataire : ' + this.locataires[this.locaGroup.value['loca']].identiteLocataire, 40, 20);
          doc.text('Contrat : ' + this.contLoc[this.locaGroup.value['cont']].numContrat+' Du '+
          this.contrats[this.locaGroup.value['cont']].dateEffetContrat+' Au : '+
          this.contrats[this.locaGroup.value['cont']].dateFinContrat, 45, 30);
          doc.text('Valeur locative : ' + this.contrats[this.locaGroup.value['cont']].immeuble.libIm, 50, 40);
          doc.text('Site : ' + this.contrats[this.locaGroup.value['cont']].immeuble.siteMarcher.libSite, 50, 50);
          doc.text('Point des impayés', 60, 60);
          autotable(doc, {
            theme: 'grid',
            head: [['Année', 'Mois', 'Echéance', 'Prix']],
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold',
            },
            margin: { top: 70 },
            body: list,
          });
          this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
          this.appercu.show();
        }
        else{
          console.log('Le locataire est à jour sur le contrat');
        }
      });
    }

  }

  manageCollapses(inde:number){
    this.opened = inde;
    this.clicked = inde;
  }

}
