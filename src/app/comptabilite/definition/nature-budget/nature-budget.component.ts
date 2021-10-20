import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { TypeBudget } from '../../../../models/comptabilite/typebudget.model';
import { BudgetService } from '../../../../services/comptabilite/budget.service';

@Component({
  selector: 'app-nature-budget',
  templateUrl: './nature-budget.component.html',
  styleUrls: ['./nature-budget.component.css']
})
export class NatureBudgetComponent implements OnInit {

  @ViewChild('add') public add: ModalDirective;
  @ViewChild('edit') public edit: ModalDirective;
  @ViewChild('del') public del: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  budgTab: DataTables.Settings = {};
  budgTrigger: Subject<TypeBudget> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  addGroup: FormGroup;
  editGroup: FormGroup;
  natures:TypeBudget[];
  adding:TypeBudget = new TypeBudget(0, '', '');
  editing:TypeBudget = new TypeBudget(0, '', '' );
  delbdg:TypeBudget = new TypeBudget(0, '', '');

  constructor(private builder: FormBuilder, private bg:BudgetService) {

    this.budgTab = {
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
      addLib:['', Validators.required]
    });

    this.editGroup = this.builder.group({
      editCod:[this.editing.codTypBdg, Validators.required],
      editLib:[this.editing.libTypBdg, Validators.required]
    });
  }

  ngOnInit(): void {
    this.bg.getAllTypeBudget().subscribe(
      (data) => {
        this.natures = data;    
        console.log(this.natures[0].codTypBdg);
            
        this.budgTrigger.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Frs', erreur);
      }
    );
  }

  actualise(){
    this.bg.getAllTypeBudget().subscribe(
      (data) => {
        this.natures = data;
        $('#budgId').dataTable().api().destroy();
        this.budgTrigger.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Frs', erreur);
      }
    );
  }

  initAdd(){
        this.add.show();
  }
  
  initEdit(inde:number){
    this.editing=this.natures[inde];
    this.editGroup.patchValue({
      editCod:this.editing.codTypBdg, editLib:this.editing.libTypBdg});
    this.edit.show();
  }

  initDelete(inde:number){
    this.delbdg = this.natures[inde];
    this.del.show();
  }

  onSubmitAdd(){
    const newTyp = new TypeBudget(0, this.addGroup.value['addCod'], this.addGroup.value['addLib']);
    this.bg.addATypeBudget(newTyp).subscribe(
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
    const newNat= new TypeBudget(this.editing.idTypBdg, this.editGroup.value['editCod'], this.editGroup.value['editLib']);
    console.log('Anncienne nature ',this.editing);
    
    this.editing.codTypBdg = this.editGroup.value['editCod'];
    this.editing.libTypBdg= this.editGroup.value['editLib'];
    console.log('Nouvelle nature ',this.editing);
    this.bg.editATypeBudget(this.editing.idTypBdg, this.editing).subscribe(
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
    this.bg.deleteATypeBudget(this.delbdg.idTypBdg.toString()).subscribe(
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
