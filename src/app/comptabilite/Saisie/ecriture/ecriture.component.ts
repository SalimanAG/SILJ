import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlDirective, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Compte } from '../../../../models/comptabilite/compte.model';
import { Ecriture } from '../../../../models/comptabilite/ecriture.model';
import { EcritureBlock } from '../../../../models/comptabilite/ecritureblocck.model';
import { Journal } from '../../../../models/comptabilite/journal.model';
import { LigneEcriture } from '../../../../models/comptabilite/ligne-ecriture.model';
import { EcriJour } from '../../../../models/ecrijour.model';
import { Exercice } from '../../../../models/exercice.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { UtilisateurService } from '../../../../services/administration/utilisateur.service';
import { CompteService } from '../../../../services/comptabilite/compte.service';
import { EcritureService } from '../../../../services/comptabilite/ecriture.service';
import { JournalService } from '../../../../services/comptabilite/journal.service';
import { ToolsService } from '../../../../services/utilities/tools.service';

@Component({
  selector: 'app-ecriture',
  templateUrl: './ecriture.component.html',
  styleUrls: ['./ecriture.component.css']
})
export class EcritureComponent implements OnInit {

  ecriture: Ecriture=new Ecriture('',new Date(),'','','',null,null,null);
  lignes: LigneEcriture[];
  daily: Ecriture[]=[];
  dailyTab: DataTables.Settings = {};
  dailyTrigger: Subject<Ecriture>=new Subject<any>();
  msg: String="";

  comptes: Compte[];
  cpteTab: DataTables.Settings={};
  cpteTrigger: Subject<Compte>= new Subject<Compte>();
  totalDebit:Number;
  totalCredit:Number;
  solde: Number
  journal: Journal;
  jrn: Journal;
  journaux: Journal[];
  exo: Exercice;
  ej = new EcriJour();
  pret: boolean=false

  @ViewChild('add') public add: ModalDirective;
  @ViewChild('detail') public detail: ModalDirective;
  @ViewChild('annul') public annul: ModalDirective;
  @ViewChild('addCpte') public addCpte: ModalDirective;
  @ViewChild('copy') public copy: ModalDirective;
  @ViewChild('trans') public trans: ModalDirective;
  valeur = new FormControl('');
  addGroup: FormGroup;
  annulGroup: FormGroup;
  transGroup: FormGroup;
  copyGroup: FormGroup;
  constructor(public tool: ToolsService, public builder:FormBuilder, public sec: EcritureService, public us:UtilisateurService,
    public js: JournalService, public cs: CompteService, public users: UtilisateurService,
    public exos: ExerciceService, public ts: ToastrService) {
    
    this.dailyTab= {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5,10,15,20],
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
    }

    this.journal = tool.jrn;
    this.comptes=tool.jrn.compteAutorises;    
    this.cpteTrigger.next();
   }

  ngOnInit(): void {
    
    this.js.getAutreJournaux(this.journal.codJrn).subscribe(
      dataj=>{this.journaux=dataj;}
    );

    this.exo=this.exos.exoSelectionner;
    this.exo.etatExo;
    
    this.addGroup=this.builder.group({
      dat:new FormControl(moment(new Date()).format('YYYY-MM-DDTHH:mm'), Validators.required),
      des:new FormControl(),
      refI:new FormControl(),
      refE:new FormControl()
    });
    
    this.copyGroup=this.builder.group({
      cdat:new FormControl(moment(new Date()).format('YYYY-MM-DDTHH:mm')),
      cdes:new FormControl(),
      cdest:new FormControl(),
      crefE:new FormControl()
    });
    
    this.transGroup=this.builder.group({
      tdat:new FormControl(moment(new Date()).format('YYYY-MM-DDTHH:mm')),
      tdes:new FormControl(),
      trefI:new FormControl(),
      trefE:new FormControl(),
      tdest:new FormControl()
    });

    this.annulGroup=this.builder.group({
      adat:new FormControl(moment(new Date()).format('YYYY-MM-DDTHH:mm')),
      ades:new FormControl(),
      arefI:new FormControl(),
      arefE:new FormControl()
    });
    
    this.ej.jrn= this.tool.jrn.idJrn;
    this.ej.user= this.us.connectedUser.idUtilisateur
    this.sec.getDaily(this.ej).subscribe(
      data=>{
        this.daily=data;
        this.dailyTrigger.next();
      }
    );
  }

  actualisation(){
    this.sec.getDaily(this.ej).subscribe(
      data=>{
        this.daily=data;
        $('#dailyId').dataTable().api().destroy();
        this.dailyTrigger.next();
      }
    );
  }

  fermeAdd(){
    this.totalCredit=0;
    this.totalDebit=0;
    this.lignes=[];
    this.add.hide();
  }

  initAdd(){
    this.totalCredit=0;
    this.totalDebit=0;
    this.lignes=[];
    this.add.show();
    this.addGroup.patchValue({refI:'', refE:'', des:''});
  }

  initCopy(e: Ecriture){
    this.sec.getLinesOf(e.numEcri).subscribe(
      data=>{
        this.lignes=data;
      });
    this.addGroup.patchValue({refI:e.refIntern, refE:e.refExtern, des:e.descript});
    this.totaliser();
    this.trans.show();
  }

  initSearch(){
    this.pret=true;
    if(this.pret)
      this.ts.info('Prêt pour recherche');
    else
      this.ts.info('Fin de recherche');
  }

  recherche(chain: String){
    this.ts.info(this.valeur.value);
  }

  initDoub(e: Ecriture){
    this.sec.getLinesOf(e.numEcri).subscribe(
      data=>{
        this.lignes=data;
      });
    this.addGroup.patchValue({refI:e.refIntern, refE:e.refExtern});
    this.totaliser();
    this.trans.show();
  }

  initTrans(e: Ecriture){
    this.sec.getLinesOf(e.numEcri).subscribe(
      data=>{
        this.lignes=data;
      });
    this.addGroup.patchValue({refI:e.refIntern, refE:e.refExtern, des:e.descript});
    this.totaliser();
    this.trans.show();
  }

   enleveCpte(n: number){
     this.lignes.splice((n-1),1);
     this.totaliser();
   }

   initAnnul(obj: Ecriture){
     this.ecriture=obj;
     this.msg="Annulation: "+this.ecriture.descript.toLowerCase();
     this.sec.getLinesOf(obj.numEcri).subscribe(
       data=>{
         this.lignes=data;
         this.lignes.forEach(e=>{
           if(e.debit==0){
             e.debit=e.credit;
             e.credit=0
           }
           else{
             e.credit=e.debit;
             e.debit=0;
           }
           this.annul.show();
         })
       }
     )
   }

   initDetail(obj: Ecriture){}

   initAddingCompte(){
    this.ecriture = new Ecriture('1',this.addGroup.value['dat'],this.addGroup.value['des'],this.addGroup.value['refI'],
    this.addGroup.value['refE'],this.journal,this.users.connectedUser, this.exos.exoSelectionner);
    this.ecriture.datSaisie=new Date();
     if(this.journal.compteAutorises.length == 0){
       this.cs.getACompteByTyp('E').subscribe(
         datc=>{
           this.comptes=datc;
           this.addCpte.show();
         }
       );
     }
     else{
       this.cs.getCompteEligible(this.journal.idJrn).subscribe(
         data=>{
           this.comptes=data;
           console.log(this.comptes);
           this.addCpte.show();
         }
       );
     }
   }

   debiter(n:number){
     this.lignes[n].credit=0
   }

   crediter(n:number){
     this.lignes[n].debit=0
   }

   totaliser(){
    if(this.lignes.length>0){
      this.totalCredit=this.lignes.reduce((t,l)=>t+=l.credit.valueOf(),0);
      this.totalDebit=this.lignes.reduce((t,l)=>t+=l.debit.valueOf(),0);
      this.solde=this.totalCredit.valueOf()-this.totalDebit.valueOf();
    }
   }

   editRef(){
     if(this.lignes.length>0){
       this.lignes.forEach(elt=>{
         elt.reference=this.addGroup.value['des'];
       });
     }
     
   }

   choisirCpte(c: Compte){
     const l= new LigneEcriture(0,0,0,this.addGroup.value['des'],this.ecriture,c);
     l.reference=this.ecriture.descript;
     if(this.lignes.length==0){
       this.lignes.push(l);
     }
     else{
      if(this.lignes.map(l=>l.compte).map(ct=>ct.numCpte).indexOf(c.numCpte)==-1){
        this.lignes.push(l);
      }
     }     
   }

   valideEcriture(){
    if(this.exos.exoSelectionner.etatExo){ 
      this.ecriture.datEcri=this.addGroup.value['dat'];
      this.ecriture.descript=this.addGroup.value['des'];
      this.ecriture.journal=this.journal;
      this.ecriture.refExtern=this.addGroup.value['refE'];
      this.ecriture.refIntern=this.addGroup.value['refI'];
      const b = new EcritureBlock(this.ecriture, this.lignes);
      
      this.sec.addBlock(b).subscribe(
        data=>{
          this.actualisation();
        },
        er=>{
          this.ts.error
          console.log(er);          
        }
      );
    }  
   }

   valideCopy(){
    if(this.exos.exoSelectionner.etatExo){ 
      this.ecriture.datEcri=this.addGroup.value['cdat'];
      this.ecriture.descript=this.addGroup.value['cdes'];
      this.ecriture.journal=this.journal;
      this.ecriture.refExtern=this.addGroup.value['crefE'];
      this.ecriture.refIntern=this.addGroup.value['crefI'];
      const b = new EcritureBlock(this.ecriture, this.lignes);
      
      this.sec.addBlock(b).subscribe(
        data=>{
          this.actualisation();
          this.copy.hide();
        },
        er=>{
          console.log(er);          
        }
      );
    }  
   }

   valideTrans(){
    if(this.exos.exoSelectionner.etatExo){ 
      this.ecriture.datEcri=this.transGroup.value['tdat'];
      this.ecriture.descript=this.transGroup.value['tdes'];
      this.ecriture.journal=this.transGroup.value['tdest'];
      this.ecriture.refExtern=this.transGroup.value['trefE'];
      this.ecriture.refIntern=this.transGroup.value['trefI'];
      const b = new EcritureBlock(this.ecriture, this.lignes);
      
      this.sec.addBlock(b).subscribe(
        data=>{
          this.actualisation();
          this.trans.hide();
        },
        er=>{
          console.log(er);          
        }
      );
    }  
   }

   valideAnnul(){
     
    if(this.exos.exoSelectionner.etatExo){ 
      const b = new EcritureBlock(this.ecriture, this.lignes);
      this.sec.addBlock(b).subscribe(
        data=>{
          this.actualisation();
        },
        er=>{
          console.log(er);          
        }
      );
    }  
   }

}
