import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Exercice } from '../../models/exercice.model';
import { ExerciceService } from '../../services/administration/exercice.service';

@Component({
  selector: 'app-exercice',
  templateUrl: './exercice.component.html',
  styleUrls: ['./exercice.component.css']
})
export class ExerciceComponent implements OnInit {

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  addExoFormsGroup: FormGroup;
  editExoFormsGroup: FormGroup;
  exercices:Exercice[];
  editExo:Exercice = new Exercice('', '', new Date(), new Date(), '',false);
  suprExo:Exercice = new Exercice('', '', new Date(), new Date(), '',false);
  selectedExo :Exercice;//= new Exercice('', '', new Date(), new Date(), '',false);


  constructor(private serviceExo:ExerciceService, private formBulder:FormBuilder) {
    this.dtOptions1 = {
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

    this.addExoFormsGroup = this.formBulder.group({
      addCodeExercice:['', Validators.required],
      addLibExercice:['', Validators.required],
      addDateDebut:[new Date(), [Validators.required]],
      addDateFin:[new Date(), [Validators.required]],
      addEtatExo:'Exercice Non Cloturé',
      addExoSelectionner:false
    });

    this.editExoFormsGroup = this.formBulder.group({
      editCodeExercice:['', Validators.required],
      editLibExercice:['', Validators.required],
      editDateDebut:[new Date(), [Validators.required]],
      editDateFin:[new Date(), [Validators.required]],
      editEtatExo:'Exercice Non Cloturé',
      editExoSelectionner:false
    });



  }

  ngOnInit(): void {
    this.serviceExo.getAllExo().subscribe(
      (data) => {
        this.exercices = data;
        if(this.selectedExo==undefined){
          this.selectedExo = this.exercices[this.exercices.length-1];
           this.serviceExo.exoSelectionner = this.selectedExo ;
        }
        //console.log(this.exercices);
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des exos', erreur);
      }
    );
  }

  getAllExo(){
    this.serviceExo.getAllExo().subscribe(
      (data) => {
        this.exercices = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger1.next();
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des exos', erreur);
      }
    );
  }


  initEditExo(inde:number){
    this.editExo = this.exercices[inde];
    this.warningModal.show();
  }

  initDeleteExo(inde:number){
    this.suprExo = this.exercices[inde];
    this.dangerModal.show();
  }

  onSubmitAddExoFormsGroup(){
    const newExo = new Exercice(this.addExoFormsGroup.value['addCodeExercice'], this.addExoFormsGroup.value['addLibExercice'],
    this.addExoFormsGroup.value['addDateDebut'], this.addExoFormsGroup.value['addDateFin'],
    this.addExoFormsGroup.value['addEtatExo'], this.addExoFormsGroup.value['addExoSelectionner']);
    this.serviceExo.addAExo(newExo).subscribe(
      (data) => {
        this.primaryModal.hide();
        this.addExoFormsGroup.patchValue({
          addCodeExercice:'',
          addLibExercice:'',
          addDateDebut:'',
          addDateFin:''
        });
        this.getAllExo();
      },
      (erreur) => {
        console.log('Erreur dAjout Exo : ', erreur);
      }
    );

  }

  onSubmitEditExoFormsGroup(){
    const newExo = new Exercice(this.editExoFormsGroup.value['editCodeExercice'], this.editExoFormsGroup.value['editLibExercice'],
    this.editExoFormsGroup.value['editDateDebut'], this.editExoFormsGroup.value['editDateFin'],
    this.editExoFormsGroup.value['editEtatExo'], this.editExoFormsGroup.value['editExoSelectionner']);
    this.serviceExo.editAExo(this.editExo.codeExercice, newExo).subscribe(
      (data) => {
        this.warningModal.hide();
        this.getAllExo();
      },
      (erreur) => {
        console.log('Erreur lors de l\'édition : ', erreur);
      }
    );

  }

  onConfirmDeleteExo(){
    this.serviceExo.deleteAExo(this.suprExo.codeExercice).subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllExo();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de lExo : ', erreur);
      }
    );

  }

  onSelectExoCliked(inde:number){
    this.selectedExo = this.exercices[inde];
    this.serviceExo.exoSelectionner = this.exercices[inde];
    this.getAllExo();
  }

}
