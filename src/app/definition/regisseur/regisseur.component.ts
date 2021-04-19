import {Component, ViewChild, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { AppBreadcrumbService } from '@coreui/angular/lib/breadcrumb/app-breadcrumb.service';
import { RegisseurService } from '../../../services/definition/regisseur.service';
import { UtilisateurService } from '../../../services/administration/utilisateur.service';
import { CorrespondantService } from '../../../services/definition/correspondant.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { Router } from '@angular/router';
import { Utilisateur } from '../../../models/utilisateur.model';
import { Magasinier } from '../../../models/magasinier.model';
import { Regisseur } from '../../../models/regisseur.model';
import { Service } from '../../../models/service.model';
import { Gerer } from '../../../models/gerer.model';
import { Magasin } from '../../../models/magasin.model';

@Component({
  selector: 'app-regisseur',
  templateUrl: './regisseur.component.html',
  styleUrls: ['./regisseur.component.css']
})
export class RegisseurComponent implements OnInit {

  dtOptions1: DataTables.Settings = {};

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  dtTrigger1: Subject<any> = new Subject<any>();
  addRegFormsGroup: FormGroup;
  editRegFormsGroup: FormGroup;
  regisseur : Regisseur[];
  editReg:Regisseur = new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('','')));
  suprReg:Regisseur = new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('','')));
  infosReg:Regisseur = new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('','')));

  //Quelques listes
  utilisateur: Utilisateur[];
  magasins:Magasin[];
  magasiniers:Magasinier[];
  gerers:Gerer[];
  

  constructor(private serviceRegisseur:RegisseurService, private serviceCorres:CorrespondantService, private serviceUser:UtilisateurService,
    private formBulder:FormBuilder) { 
      this.initDtOptions();
      this.initFormsGroup();
    }

    initDtOptions(){
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
    }

    initFormsGroup(){
      this.addRegFormsGroup = this.formBulder.group({
        addCodeReg:['', Validators.required],
        addUser:[0, Validators.required],
        addNomMag:['', Validators.required],
        addPrenomMag:['', Validators.required],
        addTelMag:''
      });

      this.editRegFormsGroup = this.formBulder.group({
        editCodeReg:['', Validators.required],
        editUser:[0, Validators.required],
        editNomMag:['', Validators.required],
        editPrenomMag:['', Validators.required],
        editTelMag:''
      });
    }

  ngOnInit(): void {

    this.getAllUsers();
    this.getAllMagasin();

    this.getAllMagasinier();

    this.getAllGerer();
    //this.getAllRegisseur();

    this.serviceRegisseur.getAllRegisseur().subscribe(
      (data) => {
        this.regisseur = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des regissseur', erreur);
      }
    );
  }

   //Onglet Regisseur
   getAllRegisseur(){
    this.serviceRegisseur.getAllRegisseur().subscribe(
      (data) => {
        this.regisseur = data;
        $('#regisseurdata').dataTable().api().destroy();
         this.dtTrigger1.next();

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des régisseur', erreur);
      }
    );
  }

  getAllUsers(){
    this.serviceUser.getAllUsers().subscribe(
      (data) => {
        this.utilisateur = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des users', erreur);
      }
    );
  }

  getAllMagasin(){
    this.serviceCorres.getAllMagasin().subscribe(
      (data) => {
        this.magasins=data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des magasins', erreur);
      }
    );
  }

  getAllMagasinier(){
    this.serviceCorres.getAllMagasinier().subscribe(
      (data) => {
        this.magasiniers = data;
      },
      (erreur) => {
        console.log('Erreur lors du chargement des magasiniers', erreur);
      }
    );
  }


  getAllGerer(){
    this.serviceCorres.getAllGerer().subscribe(
      (data) => {
        this.gerers = data;
      },
      (erreur) => {
        console.log('Erreur lors du chargement de la liste des gérer : ', erreur);
      }
    );
  }

  getMagasinByCodeMagasinier(code:String){
    let result : Magasin[] = [];
    this.getAllGerer();
    this.gerers.forEach(element => {
      if(element.magasinier.numMAgasinier.toString()==code){
        result.push(element.magasin);
      }
    });

    return result;
  }

  getGererByCodeMagasinier(code:String){
    let result: Gerer[] = [];
    this.getAllGerer();
    this.gerers.forEach(element => {
      if(element.magasinier.numMAgasinier.toString()==code){
        result.push(element);
      }
    });

    return result;
  }

  initEditReg(ind:number){
    this.editReg = this.regisseur[ind];
    this.warningModal.show();
  }

  initDeleteReg(ind:number){
    this.suprReg = this.regisseur[ind];
    console.log(this.suprReg);
    this.dangerModal.show();
  }

  initInfosReg(ind:number){
    this.infosReg = this.regisseur[ind];
    this.infoModal.show();
  }

  onSubmitAddRegFormsGroup(){


    const newMagasinier = new Magasinier(this.addRegFormsGroup.value['addNomMag'],
    this.addRegFormsGroup.value['addPrenomMag'],
    this.addRegFormsGroup.value['addTelMag']
    )



    const newMagasin = new Magasin('CM', 'Caveau Mairie')

    this.serviceCorres.addAMagasinier(newMagasinier).subscribe(
      (data) => {
        this.serviceCorres.addAMagasin(newMagasin).subscribe(
          (data2) => {
            this.serviceCorres.addAGerer(new Gerer(new Date(), new Date(), data, data2)).subscribe(
              (data3) => {
                const newReg = new Regisseur(this.addRegFormsGroup.value['addCodeReg'],
                                  data,
                                  this.utilisateur[this.addRegFormsGroup.value['addUser']]);
                this.serviceRegisseur.addRegisseur(newReg).subscribe(
                  (data4) => {
                    this.addRegFormsGroup.reset();
                    this.initFormsGroup();
                    this.primaryModal.hide();
                    this.getAllRegisseur();
                    this.getAllGerer();
                  },
                  (erreur) => {
                    console.log('Erreur lors de la création du regissuer : ', erreur);
                  }
                );
              },
              (erreur) => {
                console.log('Erreur lors de la création de la relation gérer : ', erreur);
              }
            );
          },
          (erreur) => {
            console.log('Erreur lors de la création du magasin : ', erreur);
          }
        );
      },
      (erreur) => {
        console.log('Erreur lors de la création du magasinier', erreur);
      }
    );

  }

  onSubmitEditRegFormsGroup(){
 
    const newMagasinier = new Magasinier(this.editRegFormsGroup.value['editNomMag'],
    this.editRegFormsGroup.value['editPrenomMag'],
    this.editRegFormsGroup.value['editTelMag']);
    this.serviceCorres.editAMagasinier(this.editReg.magasinier.numMAgasinier.toString(),newMagasinier).subscribe(
      (data) => {
        console.log('Objet Modifier : ', data);
        this.warningModal.hide();
        this.getAllRegisseur();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
/*const newRegisseur = new Regisseur(this.editRegFormsGroup["editCodeReg"],newMagasinier,this.utilisateur[this.editRegFormsGroup["editUser"]])
    this.serviceRegisseur.editRegisseur(this.editReg.idRegisseur.toString(),newRegisseur).subscribe(
      (data) => {
        console.log('Objet Modifier : ', data);
        this.warningModal.hide();
        this.getAllRegisseur();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );*/
  
  }

  onConfirmDeleteReg(){

    let processed:boolean = true;
    let magasin = this.getMagasinByCodeMagasinier(this.suprReg.magasinier.numMAgasinier.toString());
    let gerer = this.getGererByCodeMagasinier(this.suprReg.magasinier.numMAgasinier.toString());

    this.gerers.forEach(element => {
       
      console.log('gestion ******',element.idGerer);
      if(element.magasinier.numMAgasinier == this.suprReg.magasinier.numMAgasinier)
      {
        console.log('gestion ******',element.idGerer);
      this.serviceCorres.deleteAGerer(element.idGerer.toString()).subscribe(
        (data) => {

          

          //
         // magasin.forEach(element => {
            this.serviceCorres.deleteAMagasin(element.magasin.codeMagasin).subscribe(
              (data2) => {
      
              },
              (erreur) => {
                console.log('Erreur lors de la suppression dUn magasin : ', erreur);
                processed = false;
              }
            );
         // });

         this.serviceRegisseur.deleteRegisseur(this.suprReg.idRegisseur).subscribe(
          (data) => {

            this.serviceCorres.deleteAMagasinier( this.suprReg.magasinier.numMAgasinier.toString()).subscribe(
              (data3) => {
                this.dangerModal.hide();
              },
              (erreur) => {
                console.log('Erreur lors de la suppression dUn magasinier', erreur);
                processed = false;
              }
            );
    
            this.getAllRegisseur();
            this.getAllGerer();
    
          },
          (erreur) => {
            console.log('Erreur lors de la suppression du correspondant : ', erreur);
            processed = false;
          }
        );

        },
        (erreur) => {
          console.log('Erreur lors de la suppression dUn gerer', erreur);
          processed = false;
        }
      );
    }
    });

    /*if(processed===true)
    magasin.forEach(element => {
      this.serviceCorres.deleteAMagasin(element.codeMagasin).subscribe(
        (data2) => {

        },
        (erreur) => {
          console.log('Erreur lors de la suppression dUn magasin : ', erreur);
          processed = false;
        }
      );
    });*/

    /*if(processed===true)
    this.serviceRegisseur.deleteRegisseur(this.suprReg.idRegisseur).subscribe(
      (data) => {

        this.getAllRegisseur();

      },
      (erreur) => {
        console.log('Erreur lors de la suppression du correspondant : ', erreur);
        processed = false;
      }
    );*/

    /*if(processed===true)
    this.serviceCorres.deleteAMagasinier( this.suprReg.magasinier.numMAgasinier.toString()).subscribe(
      (data3) => {
        this.dangerModal.hide();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression dUn magasinier', erreur);
        processed = false;
      }
    );*/


  }

}


