import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { data } from 'jquery';
import { element } from 'protractor';
import {ModalDirective} from 'ngx-bootstrap/modal';

import { Exercice } from '../../../../models/exercice.model';
import { Magasin } from '../../../../models/magasin.model';
import { Stocker } from '../../../../models/stocker.model';
import {Inventaire} from '../../../../models/inventaire.model';
import {LigneInventaire} from '../../../../models/ligneInventaire.model';
import { CorrespondantService } from '../../../../services/definition/correspondant.service';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { InventaireService } from '../../../../services/saisie/inventaire.service';
import { UtilisateurService } from '../../../../services/administration/utilisateur.service';

@Component({
  selector: 'app-inventaire-stock',
  templateUrl: './inventaire-stock.component.html',
  styleUrls: ['./inventaire-stock.component.css']
})
export class InventaireStockComponent implements OnInit {

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();

  @ViewChild('addComModal') public addComModal: ModalDirective;

  addInventaireFormGroup:FormGroup;

  magasinlist : Magasin []= [];
  magasinInvantaireStock : Magasin;
  templateLigneInventaire : LigneInventaire [] = [];
  templateEditLigneInventaire : LigneInventaire [] = [];
  inventaire : Inventaire [] = [];

  dateInventaire = new FormControl((new Date()).toISOString().substring(0, 10));
  //numero = new FormControl('');
  magasinIventaire = new FormControl('');
  description = new FormControl('')

  constructor(private formBulder:FormBuilder, private serviceCorres: CorrespondantService,  private serviceExercice:ExerciceService,
   private serviceInventaire: InventaireService) {
    this.initDtOptions();
    this.initFormsGroup();
   }

   initFormsGroup(){
    this.addInventaireFormGroup = this.formBulder.group({
  
    });
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

  ngOnInit(): void {
    this.serviceCorres.getAllMagasin().subscribe(
      (data)=>{
        this.magasinlist = data;
        console.log("magasin list", this.magasinlist);
        
      },
      (err)=>{
        console.log('Magasin:', err)
      }
    );

    this.serviceInventaire.getAllInventaire().subscribe(
      (data)=>{
        this.inventaire = data;
        //this.dtTrigger1.next();
        console.log("inventaire list", this.magasinlist);
        
      },
      (err)=>{
        console.log('Magasin:', err)
      }
    );

  }
  afficherInventaireList(){
    this.templateLigneInventaire = [];
    this.serviceCorres.getAllStocker().subscribe(
      (data)=>{
        data.forEach((element,index) => {
          if(element.magasin.codeMagasin == this.magasinIventaire.value)
          {
            //push des lignes avec les articles présent au magasin selectionné
            this.templateLigneInventaire.push(new LigneInventaire(element.article.prixVenteArticle,element.quantiterStocker,0,'',element.article,new Inventaire('',
            new Date(),'', new Exercice('', '', new Date(), new Date(), '', false), new Magasin('',''))));
            
            console.log('LigneInventaire',this.templateLigneInventaire);
            
            
          }
          
        }); 
        this.addComModal.show();
        console.log("nnn",this.magasinIventaire.value);
        
        
      },
      (err)=>{
        console.log('Stocker:', err)
      }
    );
  }

  // liste des inventaire
  getAllInventaire(){
    this.serviceInventaire.getAllInventaire().subscribe(
      (data)=>{
        this.inventaire = data;
        this.dtTrigger1.next();
        //console.log("inventaire list", this.magasinlist);
        
      },
      (err)=>{
        console.log('Magasin:', err)
      }
    );
  }

  //Ajout de l'inventaire
  onSubmitAddInventaireFormsGroup(){

    var concernedStocker:Stocker = null

    this.serviceCorres.getAMagasinById(this.magasinIventaire.value).subscribe(
      (data)=>{
        this.magasinInvantaireStock = data;
        console.log("magasin Inventaire",  this.magasinInvantaireStock);

        const newInventaire = new Inventaire(null,this.dateInventaire.value,this.description.value,
        this.serviceExercice.exoSelectionner,this.magasinInvantaireStock); 
        console.log(this.templateLigneInventaire, newInventaire);

        //ajout de l'inventaire et des lignes inventaires
        this.serviceInventaire.addInventaire(newInventaire).subscribe(
          (data) => {
            console.log('********',data);
            
            this.templateLigneInventaire.forEach(element => {
              element.inventaire = data;
              this.serviceInventaire.addLigneInventaire(element).subscribe(
                (data2) => {
                  console.log('********',data2);
    
                },
                (erreur) => {
                  console.log('Erreur lors de la création de la ligne inventaire',erreur );
                }
              );
              // reajustement de stock au sein du magasin du correspondant
              this.serviceCorres.getAllStocker().subscribe(
                (data) => {
                  console.log('********',data);
                  data.forEach(quant =>{
                    if(element.article.codeArticle == quant.article.codeArticle && this.magasinIventaire.value == quant.magasin.codeMagasin)
                    {
                      concernedStocker = quant;
                      concernedStocker.quantiterStocker = element.stockreel;
                      this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
                        (dataStock) => {
                          console.log("QA",dataStock); 
                          
                        },
                        (erreur) => {
                          console.log('Erreur lors de la modification du Stocker pour réajustement du stock', erreur);
                        }
                      );

                    }

                  });
    
                },
                (erreur) => {
                  console.log('Erreur lors de la création de la ligne inventaire',erreur );
                }
              );
              //fin reajustement de stock au sein du magasin du correspondant
            });
            this.addInventaireFormGroup.reset();
            this.initFormsGroup();
            this.addComModal.hide();
            this.getAllInventaire();
            this.description.setValue('');
            //this.getAllPointVente();
            //this.getAllLignePointVente();
          },
          (erreur) => {
            console.log('Erreur lors de la création inventaire', erreur);
          }
        );

      },
      (err)=>{
        console.log('magasin Inventaire:', err)
      }
    );

  }


}
