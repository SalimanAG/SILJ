import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { jsPDF } from 'jspdf';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { from } from 'rxjs';
import { Arrondissement } from '../../../../models/arrondissement.model';
import { Caisse } from '../../../../models/caisse.model';
import { Echeance } from '../../../../models/echeance.model';
import { LigneOpCaisse } from '../../../../models/ligneopcaisse.model';
import { OpCaisse } from '../../../../models/OpeCaisse.model';
import { TypeRecette } from '../../../../models/type.model';
import { CaisseService } from '../../../../services/administration/caisse.service';
import { CommuneService } from '../../../../services/definition/commune.service';
import { OperationCaisseService } from '../../../../services/saisie/operation-caisse.service';
import  autoTable  from 'jspdf-autotable'
import { timeStamp } from 'console';
import { ModePaiement } from '../../../../models/mode.model';
import { LignePointVente } from '../../../../models/lignePointVente.model';
import { ToastrService } from 'ngx-toastr';
import { ToolsService } from '../../../../services/utilities/tools.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-point-caisse',
  templateUrl: './point-caisse.component.html',
  styleUrls: ['./point-caisse.component.css']
})
export class PointCaisseComponent implements OnInit {

  opened:number = 0;
  clicked:number = 0;

  deb=new Date(new Date().getFullYear(), new Date().getMonth(),
    new Date().getDate(),0,0);

  arrondissements : Arrondissement[];
  caisses : Caisse[];
  caiArr : Caisse[];
  opcaisse : OpCaisse[];
  ligOpc : LigneOpCaisse[];
  echeances : Echeance[];
  typeop : TypeRecette[];
  modes : ModePaiement[];
  lpv: LignePointVente[];
  pcaisse: any[] = [];
  preCai:number; impCai: number; locCai: number; cais:number; tArr: number;
  tPrest:number; tImp: number; tLoc: number; tcaisse:number; ttampon:number;
  col=[]; lig=[];

  @ViewChild ('appercu') public appercu : ModalDirective;
  vuePdf;

  pcGroup : FormGroup;
  constructor(public fBuilder : FormBuilder, public comServ : CommuneService,
    public caiSer: CaisseService, public opServ : OperationCaisseService,
    public sanit: DomSanitizer, public tst: ToastrService, public outils: ToolsService) {
    this.vuePdf=sanit.bypassSecurityTrustResourceUrl('/');
    this.pcGroup=fBuilder.group({
      arrPC: new FormControl(-1),
      caiPC: new FormControl(-1),
      debPC: new FormControl(moment(this.deb).format('YYYY-MM-DDTHH:mm')),
      finPC: new FormControl(moment(new Date()).format('YYYY-MM-DDTHH:mm'))
    });
  }

  ngOnInit(): void {
    this.comServ.getAllArrondissement().subscribe(
      data=>{
        this.arrondissements=data;
      },
      era=>{
        console.log(era);
      }
    );

    this.caiSer.getAllCaisse().subscribe(
      data=>{
        this.caisses=data;
      },
      erca=>{
        console.log(erca);
      }
    );

    this.opServ.getAllOp().subscribe(
      data=>{
        this.opcaisse=data;
      },
      erop=>{
        console.log(erop);
      }
    );

    this.opServ.getAllModes().subscribe(
      data=>{
        this.modes=data;
      },
      erop=>{
        console.log(erop);
      }
    );

    this.opServ.getAllOpLines().subscribe(
      data=>{
        this.ligOpc=data;
      },
      erlop=>{
        console.log(erlop);
      }
    );

    this.opServ.getAllEcheances().subscribe(
      data=>{
        this.echeances=data;
      },
      erec=>{
        console.log(erec);
      }
    );

    this.opServ.getAllTypes().subscribe(
      data=>{
        this.typeop=data;
      },
      erec=>{
        console.log(erec);
      }
    );

  }

  filtre(){
    if(this.pcGroup.value['arrPC']!=-1){
      this.caiArr=this.caisses.filter(c=>c.arrondissement.codeArrondi==this.arrondissements[this.pcGroup.value['arrPC']].codeArrondi);
    }
    else{
      this.caiArr=this.caisses;
    }
  }

  pointUneCaisse(c: Caisse, d1: Date, d2: Date) {
    this.pcaisse = [];
    let colonne: any[];
    this.modes.forEach(m => {
      let smod=0
      colonne = [];
      this.typeop.forEach(t => {
        let stypmod = 0;
        switch (t.codeTypRec) {
          case 'P': {
            stypmod = this.ligOpc.filter(
              lo => lo.opCaisse.caisse.codeCaisse === c.codeCaisse && lo.opCaisse.dateSaisie >= d1 &&
                lo.opCaisse.typeRecette.codeTypRec === 'P' && lo.opCaisse.dateSaisie <= d2 &&
                lo.opCaisse.modePaiement.codeModPay === m.codeModPay).reduce((s, l) =>
                  s += l.prixLigneOperCaisse.valueOf() * l.qteLigneOperCaisse, 0);
            smod += stypmod;
          } break;
          case 'L': {
            stypmod = this.echeances.filter(
              lo => lo.opCaisse.caisse.codeCaisse === c.codeCaisse && lo.opCaisse.dateSaisie >= d1 &&
                 lo.opCaisse.dateSaisie <= d2 &&
                lo.opCaisse.modePaiement.codeModPay === m.codeModPay).reduce((s, l) =>
                  s += l.prix.valueOf(), 0);
            smod += stypmod;
          } break;
          case 'I': {
            stypmod = this.ligOpc.filter(
              lo => lo.opCaisse.caisse.codeCaisse === c.codeCaisse && lo.opCaisse.dateSaisie >= d1 &&
                lo.opCaisse.typeRecette.codeTypRec === t.codeTypRec && lo.opCaisse.dateSaisie <= d2 &&
                lo.opCaisse.modePaiement.codeModPay === m.codeModPay).reduce((s, l) =>
                  s += l.prixLigneOperCaisse.valueOf() * l.qteLigneOperCaisse, 0);
            smod += stypmod;
          } break;
        }
        colonne.push(stypmod);
      });
      this.tcaisse+=smod
      colonne.push(smod);
      this.pcaisse.push(colonne);
    });
    this.col=[];
    this.ttampon=this.tcaisse
  }

  generer(){
    this.lig=[];
    this.tPrest=0;
    this.tImp=0;
    this.tLoc=0;
    this.tcaisse=0;

    const doc=new jsPDF();
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(18);
    doc.deletePage(1);

    if(this.pcGroup.value['arrPC']!=-1){
      if(this.pcGroup.value['caiPC']!=-1){
        this.pointUneCaisse(this.caiArr[this.pcGroup.value['caiPC']],
          this.pcGroup.value['debPC'], this.pcGroup.value['finPC']  );
      if(this.tcaisse>0){
          doc.addPage();
            doc.addImage(this.outils.entete,'jpeg',5,5,180,20);
            autoTable(doc, {
              theme: 'plain',
              margin: { top: 25, left: 30, right: 25,},
              body: [
                [
                  this.caiArr[this.pcGroup.value['caiPC']].libeCaisse.toString() +
                  '\nPoint de caisse du ' + moment(new Date(this.pcGroup.value['debPC'])).format('DD/MM/YYYY HH:mm') +
                  ' au '+ moment(new Date(this.pcGroup.value['finPC'])).format('DD/MM/YYYY HH:mm')]
                ],
                bodyStyles: {
                  fontSize: 14,
                  cellPadding: 1,
                  halign:'center'
              },
            });

        for (let m = 0; m <= this.modes.length; m++){
          this.col = [];
          if (m < this.modes.length) {
              this.col.push(this.modes[m].libeModPay);
            for (let t = 0; t <= this.typeop.length; t++){
              this.col.push(this.pcaisse[m][t]);
            }
          } else {
            //let s = 0;
            this.col.push('Total');
            this.typeop.forEach(t => {
              switch (t.codeTypRec) {
                case 'I': {
                  this.tst.info(this.ligOpc.filter(l => l.opCaisse.dateOpCaisse >= this.pcGroup.value['debPC'] &&
                    l.opCaisse.dateOpCaisse <= this.pcGroup.value['finPC'] && l.opCaisse.typeRecette.codeTypRec == t.codeTypRec &&
                    l.opCaisse.caisse.codeCaisse == this.caiArr[this.pcGroup.value['caiPC']].codeCaisse).length+' ligne(s) d\''+t.libeTypRec)
                  this.col.push(this.ligOpc.filter(l => l.opCaisse.dateOpCaisse >= this.pcGroup.value['debPC'] &&
                    l.opCaisse.dateOpCaisse <= this.pcGroup.value['finPC'] && l.opCaisse.typeRecette.codeTypRec == t.codeTypRec &&
                    l.opCaisse.caisse.codeCaisse == this.caiArr[this.pcGroup.value['caiPC']].codeCaisse).reduce((s, l) =>
                      s += l.prixLigneOperCaisse * l.qteLigneOperCaisse, 0));
                  break;
                }
                case 'L': {
                  this.col.push(this.echeances.filter(l => l.opCaisse.dateOpCaisse >= this.pcGroup.value['debPC'] &&
                    l.opCaisse.dateOpCaisse <= this.pcGroup.value['finPC'] && l.opCaisse.typeRecette.codeTypRec == t.codeTypRec &&
                    l.opCaisse.caisse.codeCaisse == this.caiArr[this.pcGroup.value['caiPC']].codeCaisse).reduce((s, l) =>
                    s+=l.prix.valueOf(),0));
                  break;
                }
                case 'P': {
                  this.col.push(this.ligOpc.filter(l => l.opCaisse.dateOpCaisse >= this.pcGroup.value['debPC'] &&
                    l.opCaisse.dateOpCaisse <= this.pcGroup.value['finPC'] && l.opCaisse.typeRecette.codeTypRec == t.codeTypRec &&
                    l.opCaisse.caisse.codeCaisse == this.caiArr[this.pcGroup.value['caiPC']].codeCaisse).reduce((s, l) =>
                      s += l.prixLigneOperCaisse * l.qteLigneOperCaisse, 0));
                  break;
                }
              }
            });
              this.col.push(this.tcaisse);
          }
          this.lig.push(this.col);
        }

          autoTable(doc, {
            theme: 'grid',
            head: [['Caisse','Imputation','Location','Prestation','Total']],

            margin: { top: 40 },
            body: this.lig,
          });
          autoTable(doc, {
            theme: 'grid',
            margin: { top: 0, left: 30, right: 25},
            columnStyles: {
              0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            },
            body: [
              ['Total caisse : ',this.tcaisse]
            ],
            bodyStyles: {
              fontSize: 8,
              cellPadding: 1,
            },
          });
          this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(
            doc.output('datauristring', { filename: 'paiement.pdf' }));
          this.appercu.show();
        }
        else {
          this.tst.info('Il n\'y a pas de données à imprimer')
        }
      }
      else{
        this.tArr=0
        this.caiArr=this.caisses.filter(c=>c.arrondissement.codeArrondi==
          this.arrondissements[this.pcGroup.value['arrPC']].codeArrondi
          );
        if (this.caiArr.length > 0) {
          this.tArr = 0;
          this.caiArr.forEach(c => {
            this.tcaisse = 0;
            this.pointUneCaisse(c,  this.pcGroup.value['debPC'], this.pcGroup.value['finPC']  );
            if (this.tcaisse > 0) {
              if(this.tArr == 0){
                doc.addPage();
                doc.addImage(this.outils.entete, 'jpeg', 10, 5, 190, 25);
                autoTable(doc, {
                theme: 'plain',
                margin: { top: 30, left: 0, right: 0,},
                body: [
                  ['Point de caisse du ' + moment(new Date(this.pcGroup.value['debPC'])).format('DD/MM/YYY HH:mm') + ' au ' +
                    moment(new Date(this.pcGroup.value['finPC'])).format('DD/MM/YYY HH:mm')
                  ]
                ],
                bodyStyles: {
                  fontSize: 14,
                  cellPadding: 1,
                  halign:'center'
                },
                });
              }
              autoTable(doc, {
                theme: 'plain',
                margin: { top: 0, left: 30, right: 25,},
                body: [
                  [c.libeCaisse.toString()]
                ],
                bodyStyles: {
                  fontSize: 17,
                  cellPadding: 1,
                  halign:'center'
                },
              });
            this.tArr += this.tcaisse;

            for (let m = 0; m <= this.modes.length; m++){
              this.col = [];
              if (m < this.modes.length) {
                  this.col.push(this.modes[m].libeModPay);
                for (let t = 0; t <= this.typeop.length; t++){
                  this.col.push(this.pcaisse[m][t]);
                }
              } else {
                //let s = 0;
                this.col.push('Total');
                this.typeop.forEach(t => {
                  switch (t.codeTypRec) {
                    case 'I': {
                      this.col.push(this.ligOpc.filter(l => l.opCaisse.dateOpCaisse >= this.pcGroup.value['debPC'] &&
                        l.opCaisse.dateOpCaisse <= this.pcGroup.value['finPC'] && l.opCaisse.typeRecette.codeTypRec == t.codeTypRec &&
                        l.opCaisse.caisse.arrondissement.codeArrondi == this.arrondissements[this.pcGroup.value['arrPC']].codeArrondi).reduce((s, l) =>
                        s+=l.prixLigneOperCaisse*l.qteLigneOperCaisse,0));
                      break;
                    }
                    case 'L': {
                      this.col.push(this.echeances.filter(l => l.opCaisse.dateOpCaisse >= this.pcGroup.value['debPC'] &&
                        l.opCaisse.dateOpCaisse <= this.pcGroup.value['finPC'] && l.opCaisse.typeRecette.codeTypRec == t.codeTypRec &&
                        l.opCaisse.caisse.arrondissement.codeArrondi == this.arrondissements[this.pcGroup.value['arrPC']].codeArrondi).reduce((s, l) =>
                        s+=l.prix.valueOf(),0));
                      break;
                    }
                    case 'P': {
                      this.col.push(this.ligOpc.filter(l => l.opCaisse.dateOpCaisse >= this.pcGroup.value['debPC'] &&
                        l.opCaisse.dateOpCaisse <= this.pcGroup.value['finPC'] && l.opCaisse.typeRecette.codeTypRec == t.codeTypRec &&
                        l.opCaisse.caisse.arrondissement.codeArrondi == this.arrondissements[this.pcGroup.value['arrPC']].codeArrondi).reduce((s, l) =>
                          s += l.prixLigneOperCaisse * l.qteLigneOperCaisse, 0));
                      break;
                    }
                  }
                });
                  this.col.push(this.tcaisse);
              }
              this.lig.push(this.col);
            }
             autoTable(doc, {
            theme: 'grid',
            head: [['Caisse', 'Imputation', 'Location','Prestation']],
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold',
            },
            margin: { top: 40 },
            body: this.lig,
          });
        }
          }
          );
          if(this.tArr>0){
            this.col=[];
            this.col.push('Total');
            this.col.push(this.tPrest);
            this.col.push(this.tLoc);
            this.col.push(this.tImp);
            this.lig.push(this.col)
            this.col=[];

          autoTable(doc, {
            theme: 'grid',
            margin: { top: 0, left: 50, right: 50},
            columnStyles: {
              0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            },
            body: [
              ['Total Arrondissement : ',this.tArr]
            ],
            bodyStyles: {
              fontSize: 8,
              cellPadding: 1,
            },
          });
          this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(
            doc.output('datauristring', { filename: 'paiement.pdf' }));
          this.appercu.show();
          }
          else {
            this.tst.info('Il n\'y a pas de données à imprimer');
          }
        }
      }
    }
    else {
      doc.addPage();
      doc.addImage(this.outils.entete, 'jpeg', 10, 5, 200, 25);
      var presA=0;
      var presA=0;
      var impA=0;
      var locA=0;
      this.tcaisse = 0
      if (this.arrondissements.length > 0) {
        this.arrondissements.forEach(A => {
          this.tArr = 0;
          this.caiArr = this.caisses.filter(c => c.arrondissement.codeArrondi == A.codeArrondi);
          if (this.caiArr.length > 0) {

          }
        });
      }
      this.arrondissements.forEach(a => {

        this.tPrest=0;
        this.tImp=0;
        this.tLoc=0;
        this.caiArr=this.caisses.filter(c=>c.arrondissement.codeArrondi==
          a.codeArrondi
          );
        if(this.caiArr.length>0){
          this.caiArr.forEach(c => {
            this.preCai=0;
            this.impCai=0
            this.locCai=0
          this.pointUneCaisse(c, this.pcGroup.value['debPC'], this.pcGroup.value['finPC']  );
          if(this.cais>0){
            if(this.ttampon == 0 ){
              doc.addPage();
              doc.text('Point de la caisse du '+moment(this.pcGroup.value['debPC']).
              format('DD/MM/YYYY HH:mm')+' au '+moment(this.pcGroup.value['finPC']).
              format('DD/MM/YYYY HH:mm'),20,20)
            }
            console.log('TC:',this.cais+' TI :',this.tImp+" TP",this.tPrest+' TL',this.tLoc);

            this.tArr+=this.cais;
            this.tcaisse+=this.cais;
            this.tImp+=this.impCai;
            this.tPrest+=this.preCai;
            this.tLoc+=this.locCai;

            impA+=this.impCai;
            presA+=this.preCai;
            locA+=this.locCai;
            }
          });
            if(this.tArr > 0){

              this.col=[];
              this.col.push(a.nomArrondi);
              this.col.push(this.tPrest);
              this.col.push(this.tLoc);
              this.col.push(this.tImp);
              this.col.push(this.tArr);
              this.lig.push(this.col);
            }
            if(this.arrondissements.indexOf(a) ==
              this.arrondissements.length-1){
                this.col=[];
                this.col.push('Total');
                this.col.push(presA);
                this.col.push(locA);
                this.col.push(impA);
                this.col.push(this.tcaisse);
                this.lig.push(this.col);
              }
        }
      });
      if(this.tcaisse>0){
        console.log('impression');

        autoTable(doc, {
          theme: 'grid',
          head: [['Arrondissement', 'Imputation', 'Location','Prestation', 'total']],
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
          },
          margin: { top: 40 },
          body: this.lig,
        });
        autoTable(doc, {
          theme: 'grid',
          margin: { top: 0, left: 30, right: 25},
          columnStyles: {
            0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
          },
          body: [
            ['Total mobilisé: ',this.tcaisse]
          ],
          bodyStyles: {
            fontSize: 8,
            cellPadding: 1,
          },
        });
      }
        this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(
          doc.output('datauristring', { filename: 'paiement.pdf' }));
        this.appercu.show();
      this.tst.info('Toutes les caisses')
    }
  }

  pointEche() {

    //this.opServ.getCaiss(this.caiArr[this.pcGroup.value['caiPC']].codeCaisse.toString(),
//      'E', new Date(this.pcGroup.value['debPC']), new Date(this.pcGroup.value['finPC'])).subscribe(
        //data => {
//          let l = data;
 //       console.log('Total Location perçue: ');
///        }
//      )
  }

  manageCollapses(inde:number){
    this.opened = inde;
    this.clicked = inde;
  }

}
