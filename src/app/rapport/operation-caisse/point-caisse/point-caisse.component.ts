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
  preCai:number; impCai: number; locCai: number; cais:number; tArr: number;
  tPrest:number; tImp: number; tLoc: number; tcaisse:number; ttampon:number;
  col=[]; lig=[];
  
  @ViewChild ('appercu') public appercu : ModalDirective;
  vuePdf = null;

  pcGroup : FormGroup;
  constructor(public fBuilder : FormBuilder, public comServ : CommuneService, 
    public caiSer: CaisseService, public opServ : OperationCaisseService, 
    public sanit: DomSanitizer) { 
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

  pointUneCaisse(c : Caisse, d1: Date, d2 :Date){
    
    this.col=[];
    this.ttampon=this.tcaisse
    this.preCai=0;
    this.locCai=0;
    this.impCai=0;
    console.log(this.opcaisse.length);
    
    var op = this.opcaisse.filter(opc=>opc.caisse.codeCaisse == c.codeCaisse && 
      opc.dateOpCaisse >= d1 && opc.dateOpCaisse <= d2
       );
    op.forEach(elt => {
      console.log(elt);
      
      switch(elt.typeRecette.codeTypRec){
        case 'P':{
          var lop=this.ligOpc.filter(l=> l.opCaisse.numOpCaisse == 
            elt.numOpCaisse);
          this.preCai+=lop.reduce((tpc,l)=>tpc+=l.prixLigneOperCaisse.valueOf()*
          l.qteLigneOperCaisse,0);
          break;
        }
        case 'I':{
          var lop=this.ligOpc.filter(l=> l.opCaisse.numOpCaisse == elt.numOpCaisse);
          this.impCai+=lop.reduce((tpc,l)=>tpc+=l.prixLigneOperCaisse.valueOf()*
          l.qteLigneOperCaisse,0);
          break;
        }
        case 'L':{
          var e=this.echeances.filter(l=> l.opCaisse.numOpCaisse == elt.numOpCaisse);
          this.locCai+=e.reduce((tpc,l)=>tpc+=l.prix.valueOf(),0);
          break;
        }
      }
    });
    this.cais = this.preCai+this.impCai+this.locCai;
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
        console.log('Point de la caisse ',this.caiArr[this.pcGroup.value['caiPC']]);
        this.pointUneCaisse(this.caiArr[this.pcGroup.value['caiPC']], 
          this.pcGroup.value['debPC'], this.pcGroup.value['finPC']  );
          console.log('Du '+this.pcGroup.value['debPC']+' au '+this.pcGroup.value['finPC']+
          this.cais, this.ttampon, this.tcaisse, );
          
          
        if(this.cais>0){
          if(this.ttampon == 0 ){
            doc.addPage();
            doc.text('Point de la caisse du '+moment(this.pcGroup.value['debPC']).
            format('DD/MM/YYYY HH:mm')+' au '+moment(this.pcGroup.value['finPC']).
            format('DD/MM/YYYY HH:mm')+'\n'+
            this.caiArr[this.pcGroup.value['caiPC']].libeCaisse,20,20)
          }
          
          
          this.col.push(this.preCai);
          this.col.push(this.locCai);
          this.col.push(this.impCai);
          this.lig.push(this.col);
          
          autoTable(doc, {
            theme: 'grid',
            head: [['Prestation', 'Location', 'Imputation']],
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
              ['Total caisse : ',this.cais]
            ],
            bodyStyles: {
              fontSize: 8,
              cellPadding: 1,
            },
          });
          this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(
            doc.output('datauristring', { filename: 'paiement.pdf' }));
            console.log('Avant impression du point d\'une caisse');
            
          this.appercu.show();
        }
      }
      else{
        this.tArr=0
        this.caiArr=this.caisses.filter(c=>c.arrondissement.codeArrondi==
          this.arrondissements[this.pcGroup.value['arrPC']].codeArrondi
          );
        if(this.caiArr.length>0){
          this.caiArr.forEach(c => {
          this.pointUneCaisse(c,  this.pcGroup.value['debPC'], this.pcGroup.value['finPC']  );
          if(this.cais>0){
            if(this.ttampon == 0 ){
              doc.addPage();
              doc.text('Point de la caisse du '+moment(this.pcGroup.value['debPC']).
              format('DD/MM/YYYY HH:mm')+' au '+moment(this.pcGroup.value['finPC']).
              format('DD/MM/YYYY HH:mm')+'\n'+
              this.arrondissements[this.pcGroup.value['arrPC']].nomArrondi,20,20)
            }
            this.col=[];
            this.col.push(c.libeCaisse);
            this.col.push(this.preCai);
            this.col.push(this.locCai);
            this.col.push(this.impCai);
            this.lig.push(this.col);
            
            this.tArr+=this.cais;
            this.tImp+=this.impCai;
            this.tPrest+=this.preCai;
            this.tLoc+=this.locCai;
            }
          });
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
            head: [['Caisse','Prestation', 'Location', 'Imputation']],
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
        }
      }
    }
    else{
      var presA=0;
      var presA=0;
      var impA=0;
      var locA=0;
      this.tcaisse=0
      this.arrondissements.forEach(a => {
        this.tArr=0;
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
              console.log('Total Arrondissement: ',a.nomArrondi, this.tArr);
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
          head: [['Arrondissement','Prestation', 'Location', 'Imputation', 'total']],
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
        this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(
          doc.output('datauristring', { filename: 'paiement.pdf' }));
        this.appercu.show();
      }
    }
  }

  manageCollapses(inde:number){
    this.opened = inde;
    this.clicked = inde;
  }

}
