import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Compte } from '../../../../models/comptabilite/compte.model';
import { Journal } from '../../../../models/comptabilite/journal.model';
import { NatureJournal } from '../../../../models/comptabilite/nature-journal.model';
import { CompteService } from '../../../../services/comptabilite/compte.service';
import { JournalService } from '../../../../services/comptabilite/journal.service';
import { NatureJournalService } from '../../../../services/comptabilite/nature-journal.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit {

  @ViewChild('add') public add: ModalDirective;
  @ViewChild('edit') public edit: ModalDirective;
  @ViewChild('del') public del: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  jrnTab: DataTables.Settings = {};
  jrnTrigger: Subject<Journal> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  addGroup: FormGroup;
  editGroup: FormGroup;
  journaux: Journal[];
  adding:Journal = new Journal(0, '', '',null,null, null);
  editing:Journal = new Journal(0, '', '',null,null, null );
  sup:Journal = new Journal(0, '', '',null,null,null);
  comptes: Compte[];
  natures: NatureJournal[];

  constructor(private builder: FormBuilder,public comSer: CompteService,public nas: NatureJournalService,
    private jouse:JournalService) {

    this.jrnTab = {
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

    this.addGroup = this.builder.group({
      addCod:['', Validators.required],
      addLib:['', Validators.required],
      addComAut:[],
      addConAut:[],
      addNat:[]
    });

    this.editGroup = this.builder.group({
      editCod:['', Validators.required],
      editLib:['', Validators.required],
      editComAut:[],
      editConAut:[],
      editNat:[]
    });
  }

  ngOnInit(): void {

    this.jouse.getAllJournal().subscribe(
      (data) => {
        this.journaux = data;
        this.jrnTrigger.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Frs', erreur);
      }
    );
    
    this.nas.getAllNatureJournal().subscribe(
      data=>{
        this.natures=data;
      }
    )
  }

  actualise(){
    this.jouse.getAllJournal().subscribe(
      (data) => {
        this.journaux = data;
        $('#jrnId').dataTable().api().destroy();
        this.jrnTrigger.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Frs', erreur);
      }
    );
  }

  initAdd(){
    this.comSer.getAllCompte().subscribe(
      data=>{
        this.comptes=data;
        this.add.show();
      }
    )
  }

  initEdit(inde:number){        
    this.comSer.getAllCompte().subscribe(
      data=>{
        this.editing=this.journaux[inde];
        this.comptes=data;
        let ca=[];
        this.editing.compteAutorises.forEach(elt=>{
          ca.push(this.comptes.map(c=>c.idCpte).indexOf(elt.idCpte));
        });
        console.log(ca);
        this.editGroup.patchValue({
          editNat: this.natures.map(n=>n.idNat).indexOf(this.editing.natJrn.idNat), editComAut: ca,
          editCod:this.editing.codJrn, editLib:this.editing.libJrn, 
          editConAut:this.comptes.map(c=>c.idCpte).indexOf(this.editing.autoContrepart.idCpte)})
        this.editing = this.journaux[inde];
        this.edit.show();
      }
    );
  }

  initDelete(inde:number){
    this.sup = this.journaux[inde];
    this.del.show();
  }

  onSubmitAdd(){
    const obj = new Journal(0, this.addGroup.value['addCod'], this.addGroup.value['addLib'],
    this.addGroup.value['addComAut'], this.comptes[this.addGroup.value['addConAut']], this.natures[this.addGroup.value['addNat']]);
    console.log(obj);
    this.jouse.addAJournal(obj).subscribe(
      (data) => {
        //this.primaryModal.hide();
        this.addGroup.reset();
        this.actualise();
      },
      (erreur) => {
        console.log('Erreur lors de l\'enrégistrement', erreur);
      }
    );

  }

  onSubmitEdit(){
    let c:[]=this.editGroup.value['editComAut'];
    let ca:Compte[]=[];

    c.forEach(i=>{
      ca.push(this.comptes[i]);
    });
    console.log(ca);
    
    
    let obj =new Journal(0, this.editGroup.value['editCod'], this.editGroup.value['editLib'], ca,
      this.comptes[this.editGroup.value['editConAut']], this.natures[this.editGroup.value['editNat']]);
    console.log(obj);
    this.jouse.editAJournal(this.editing.idJrn.toString(), obj).subscribe(
      (data) => {
        this.edit.hide();
        this.actualise();
      },
      (erreur) => {
        console.log('Erreur lors de la modification : ', erreur);
      }
    );

  }

  onConfirmDelete(){
    this.jouse.deleteAJournal(this.sup.idJrn.toString()).subscribe(
      (data) => {
        this.del.hide();
        this.actualise();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression : ', erreur);
      }
    );

  }


}
