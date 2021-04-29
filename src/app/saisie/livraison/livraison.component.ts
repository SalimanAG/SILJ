import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LigneOpCaisse } from '../../../models/ligneopcaisse.model';
import { OpCaisse } from '../../../models/OpeCaisse.model';
import { OperationCaisseService } from '../../../services/saisie/operation-caisse.service';
import { Caisse } from '../../../models/caisse.model';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { data } from 'jquery';
import { element } from 'protractor';
import * as moment from 'moment';



import { Pays } from '../../../models/pays.model';
import { Departement } from '../../../models/departement.model';
import { Commune } from '../../../models/commune.model';
import { Arrondissement } from '../../../models/arrondissement.model';
import { TypeRecette } from '../../../models/type.model';
import { ModePaiement } from '../../../models/mode.model';
import { Exercice } from '../../../models/exercice.model';
import { Utilisateur } from '../../../models/utilisateur.model';
import { Article } from '../../../models/article.model';
import { Famille } from '../../../models/famille.model';
import { Service } from '../../../models/service.model';
import { Uniter } from '../../../models/uniter.model';
import { Affecter } from '../../../models/affecter.model';
import { DataTableDirective } from 'angular-datatables';

import { Gerer } from '../../../models/gerer.model';
import { TypCorres } from '../../../models/typCorres.model';
import { Correspondant } from '../../../models/Correspondant.model';
import { Magasin } from '../../../models/magasin.model';
import { Magasinier } from '../../../models/magasinier.model';
import { Regisseur } from '../../../models/regisseur.model';
import { Stocker } from '../../../models/stocker.model';
import { ExerciceService } from '../../../services/administration/exercice.service';
import { ArticleService } from '../../../services/definition/article.service';
import { CorrespondantService } from '../../../services/definition/correspondant.service';
import { UtilisateurService } from '../../../services/administration/utilisateur.service';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent implements OnInit {


  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  ligneopcaisse:LigneOpCaisse[] = [];
  ligneForOp:LigneOpCaisse[] = [];
  editligneOpCaisse:LigneOpCaisse = new LigneOpCaisse(0,0,'', new OpCaisse('', new Date(),'',true,'',new Date(), 
  new Caisse('','',new Arrondissement('', '','','', new Commune('','','','',new Departement('','',new Pays('','',''))))), 
  new TypeRecette('',''), new ModePaiement('',''),new Exercice('', '', new Date(), new Date(), '', false),
  new Utilisateur('', '', '', '', '', false, new Service('', ''))),new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  
  opCaisse:OpCaisse[]=[];
  caisses : Affecter[]=[];
  correspondant : Correspondant = new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', '')));
  utilisateur : Utilisateur [];
  correspondant1 : Correspondant [];

  //FormControl
  debut = new FormControl(moment(new Date()).format("yyyy-MM-DDTHH:mm"));
  fin = new FormControl(moment(new Date()).format("yyyy-MM-DDTHH:mm"));
  opCaisseLivre = new FormControl('');

   initialised:boolean = false;
   magasinMagasinierConnected: Magasin = null;
   articleLigneOpcaisseLivre:LigneOpCaisse = null;
  

  constructor(private servOp:OperationCaisseService, private serviceUser:UtilisateurService, private serviceCorres:
    CorrespondantService, private fbuilder:FormBuilder) {
    this.initDtOptions();
    moment.locale('fr');
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

    this.servOp.getAllOpLines().subscribe(
      (data) => {
        data.forEach((element,index) => {
          if(element.livre===false && element.article.livrableArticle===true && element.opCaisse.typeRecette.codeTypRec==="P"
          && element.opCaisse.caisse.codeCaisse===this.opCaisseLivre.value 
          &&  new Date(element.opCaisse.dateOpCaisse).valueOf()>= new Date(this.debut.value).valueOf() && new Date(element.opCaisse.dateOpCaisse).valueOf()<= new Date(this.fin.value).valueOf())
          {
            this.ligneopcaisse.push(element);
            
            console.log('verifi',this.ligneopcaisse);
            
            
          }
          console.log("xxx", new Date(this.debut.value)); 
          console.log("yyy",element.opCaisse.dateOpCaisse);
          
          

          
        }); 
        this.dtTrigger1.next();
        
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des actes livrables non livré ', erreur);
      }
    );
    
    

    this.servOp.getAllAffectations()
    .subscribe(
      (data)=>{

        data.forEach(element =>{
          if(element.utilisateur.idUtilisateur === this.serviceUser.connectedUser.idUtilisateur)
          this.caisses.push(element);
         // console.log("+-+-",this.caisses);
          
        });
        //this.caisses=data;
      },
      (err)=>{
        console.log('Caisses:', err)
      }
    );

    // Recupération du magasin de l'utilisateur connecté 

    //var magasinMagasinierConnected: Magasin = null;
    this.serviceCorres.getAllCorres().subscribe(
      (data2) => {
        
        data2.forEach(element2 => {
          if (element2.utilisateur != null && element2.utilisateur.idUtilisateur == this.serviceUser.connectedUser.idUtilisateur)
          {
              console.log("111", this.serviceUser.connectedUser.idUtilisateur);
              this.serviceCorres.getAllGerer().subscribe(
                (data3) => {
                  data3.forEach(element3 => {
                    if ( element3.magasinier.numMAgasinier === element2.magasinier.numMAgasinier)
                    {
                       console.log("Mag",element3.magasinier.numMAgasinier);
                       this.magasinMagasinierConnected = element3.magasin;
                       console.log("++++", this.magasinMagasinierConnected);
                       exit;
                      
                    }

                  });
                },
                (erreur) => {
                  console.log('Erreur lors de relation gerer', erreur);
                }
              );
              
              exit;
          }

        });

      },
      (erreur) => {
        console.log('Erreur lors de la relation utilisateur connecté', erreur);
      }
    );

  }

  chargerInformations(){

    this.ligneopcaisse = [];
    $('#actualise').dataTable().api().destroy();
    this.dtTrigger1.next();
   


    console.log('Chargement 1', this.ligneopcaisse.toString());
    
    this.servOp.getAllOpLines().subscribe(
      (data) => {
        data.forEach((element,index) => {
          if(element.livre===false && element.article.livrableArticle===true && element.opCaisse.typeRecette.codeTypRec==="P"
          &&  element.opCaisse.caisse.codeCaisse===this.opCaisseLivre.value 
          && new Date(element.opCaisse.dateOpCaisse).valueOf()>= new Date(this.debut.value).valueOf() && new Date(element.opCaisse.dateOpCaisse).valueOf()<= new Date(this.fin.value).valueOf())
          {
            this.ligneopcaisse.push(element);
            
            console.log('verifi',this.ligneopcaisse);
            
            
          }
          
        }); 

        
        
        
        
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des actes livrables non livré ', erreur);
      }
    );
    
  }

  verifierRecuperation()
  {
    
    this.chargerInformations();
   
  }

  validerLivraison(inde:number)
  {
    let exist:boolean = false;
    var concernedStocker:Stocker = null
      this.editligneOpCaisse =  this.ligneopcaisse[inde];
      this.articleLigneOpcaisseLivre = this.editligneOpCaisse;
      this.editligneOpCaisse.livre=true;
      console.log("magasin", this.magasinMagasinierConnected);
      
      this.editligneOpCaisse.magasin = this.magasinMagasinierConnected;
      this.servOp.editOpLine(this.editligneOpCaisse.idLigneOperCaisse,this.editligneOpCaisse).subscribe(
        (data) => {
          console.log(data);
          
          
          this.chargerInformations();
          
        },
        (erreur) => {
          console.log('Erreur lors de la récupération ', erreur);
        }

      );

      //essaie des vérification nécessaire
      console.log("***",this.magasinMagasinierConnected);
      console.log("+++",this.articleLigneOpcaisseLivre.article);
    
     this.serviceCorres.getAllStocker().subscribe(
        (data) => {
          data.forEach(element => {
            
            if ( element.magasin.codeMagasin == this.magasinMagasinierConnected.codeMagasin && element.article.codeArticle == this.articleLigneOpcaisseLivre.article.codeArticle)
            {
                concernedStocker = element;
                concernedStocker.quantiterStocker = concernedStocker.quantiterStocker+(-this.articleLigneOpcaisseLivre.qteLigneOperCaisse);
                this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
                  (data9) => {
                    console.log("QA",data9); 

                    //modification de la ligne operation de caisse par le magasin livreur
                    //this.articleLigneOpcaisseLivre.magasin = this.magasinMagasinierConnected;
                    
                    
                  },
                  (erreur) => {
                    console.log('Erreur lors de la modification du Stocker pour réajustement du stock', erreur);
                  }
                );
                exist = true;
                exit;
              
            }

            
           
          });

          if(exist == false)
          {
          this.serviceCorres.addAStocker(new Stocker(-this.articleLigneOpcaisseLivre.qteLigneOperCaisse, 0, 0, 0, this.articleLigneOpcaisseLivre.article, this.magasinMagasinierConnected)).subscribe(
          (data) => {
            console.log("990",data); 

            //Modiification de la ligne operation de caisse concerné par le magasin livreur
            
            
          },
          (erreur) => {
            console.log('Erreur lors de lAjout du stocker', erreur);
          }
        );
      }

        },
        (erreur) => {
         console.log('Erreur lors de relation gerer', erreur);
       }

      );

      


  }


 

}
