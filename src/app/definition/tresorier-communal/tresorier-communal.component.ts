import { Component,ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tresorier-communal',
  templateUrl: './tresorier-communal.component.html',
  styleUrls: ['./tresorier-communal.component.css']
})
export class TresorierCommunalComponent implements OnInit {

  tabTresCom: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  addTresComGroup:FormGroup;
  modTresComGroup:FormGroup;

  constructor(private formBuilder:FormBuilder) {
    this.tabTresCom = {
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

    this.addTresComGroup=this.formBuilder.group({
      addNomTres:['',Validators.required],
      addPreTres:['',Validators.required],
      addTelTres:['',Validators.required],
      addLogTres:''
    });

    this.modTresComGroup=this.formBuilder.group({
      modNomTres:['',Validators.required],
      modPreTres:['',Validators.required],
      modTelTres:['',Validators.required],
      modLogTres:''
    });
   }

  ngOnInit(): void {
  }

  modifieTresCom(){
    console.log(this.modTresComGroup.value['modNomTres'],
    this.modTresComGroup.value['modPreTres'],
    this.modTresComGroup.value['modTelTres'],
    this.modTresComGroup.value['modLogTres'])

  }

  ajouteTresCom(){
    console.log(this.addTresComGroup.value['addNomTres']);
  }
  deleteTresCom(){
    console.log('Suppression confirmée');
  }

  @ViewChild('addTresCom')public addTresCom:ModalDirective;
  @ViewChild('modTresCom') public modTresCom:ModalDirective;
}
