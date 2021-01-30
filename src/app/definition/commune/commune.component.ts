import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-commune',
  templateUrl: './commune.component.html',
  styleUrls: ['./commune.component.css']
})
export class CommuneComponent implements OnInit {
  pays = {
    code: '',
    libelle: ''
  };
  
  constructor() { }

  ngOnInit(): void {
  }

  savePays(): void {
    const data = {
      code: this.pays.code,
      libelle: this.pays.libelle
    };

    this.communeService.create(data)
      .subscribe(
        response => {
          console.log(response);
          //this.submitted = true;
          //this.router.navigate(['/tutorials']);
        },
        error => {
          console.log(error);
        });
  }

  //Commune
  @ViewChild('addCommuneModal') public addCommuneModal: ModalDirective;
  @ViewChild('editCommuneModal') public editCommuneModal: ModalDirective;
  @ViewChild('deleteCommuneModal') public deleteCommuneModal: ModalDirective;

  //Pays
  @ViewChild('addPaysModal') public addPaysModal: ModalDirective;
  @ViewChild('editPaysModal') public editPaysModal: ModalDirective;
  @ViewChild('deletePaysModal') public deletePaysModal: ModalDirective;

  //Departement
  @ViewChild('addDepartementModal') public addDepartementModal: ModalDirective;
  @ViewChild('editDepartementModal') public editDepartementModal: ModalDirective;
  @ViewChild('deleteDepartementModal') public deleteDepartementModal: ModalDirective;

  //Arrondissement
  @ViewChild('addArrondModal') public addArrondModal: ModalDirective;
  @ViewChild('editArrondModal') public editArrondModal: ModalDirective;
  @ViewChild('deleteArrondModal') public deleteArrondModal: ModalDirective;

  //Arrondissement
  @ViewChild('addQuartierModal') public addQuartierModal: ModalDirective;
  @ViewChild('editQuartierModal') public editQuartierModal: ModalDirective;
  @ViewChild('deleteQuartierModal') public deleteQuartierModal: ModalDirective;

  //Arrondissement
  @ViewChild('addServiceModal') public addServiceModal: ModalDirective;
  @ViewChild('editServiceModal') public editServiceModal: ModalDirective;
  @ViewChild('deleteServiceModal') public deleteServiceModal: ModalDirective;


}
