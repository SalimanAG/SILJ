import { Component,ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { EINPROGRESS } from 'constants';
import { data } from 'jquery';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Gerer } from '../../../models/gerer.model';
import { Magasin } from '../../../models/magasin.model';
import { Magasinier } from '../../../models/magasinier.model';
import { TresCom } from '../../../models/tresorier.model';
import { Utilisateur } from '../../../models/utilisateur.model';
import { UtilisateurService } from '../../../services/administration/utilisateur.service';
import { CorrespondantService } from '../../../services/definition/correspondant.service';
import { TresorierCommunalService } from '../../../services/definition/tresorier-communal.service';

@Component({
  selector: 'app-tresorier-communal',
  templateUrl: './tresorier-communal.component.html',
  styleUrls: ['./tresorier-communal.component.css']
})
export class TresorierCommunalComponent implements OnInit, OnDestroy {

  tabTresCom: DataTables.Settings = {};
  tresoriers:TresCom[];
  dTriTres: Subject<any> = new Subject<any>();
  addTresComGroup:FormGroup;
  modTresComGroup:FormGroup;
  users : Utilisateur[];
  tresmani:TresCom=new TresCom(null,new Magasinier(null,null,null),new Utilisateur(null,null,null,null,null,null,null,null));

  @ViewChild('addTresCom')public addTresCom:ModalDirective;
  @ViewChild('modTresCom') public modTresCom:ModalDirective;
  @ViewChild('delTresCom') public delTresCom:ModalDirective;

  numUseTres:string;
  numMagTres : string;
  idgTres : number;

  constructor(private formBuilder:FormBuilder, private servTC:TresorierCommunalService,
    private serviceCorres:CorrespondantService, private servUser: UtilisateurService) {
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
      addUseTres:[''],
      addCodTres:['',Validators.required]
    });

    this.modTresComGroup=this.formBuilder.group({
      modNomTres:['',Validators.required],
      modPreTres:['',Validators.required],
      modTelTres:['',Validators.required],
      modUseTres:['',Validators.required],
      modCodTres:['',Validators.required]
    });

    this.servUser.getAllUsers().subscribe(
      data=>{
        this.users=data;
        console.log(this.users);

      },
      (err)=>{
        console.log('Chargement de trésoriers non réussi', err);
      }
    );

  }

   initAddTres(){
     this.addTresComGroup.reset();
    this.addTresCom.show();
   }

  ngOnInit(): void {
    this.servTC.getAllTresCom().subscribe(
      data=>{
        this.tresoriers=data
      },
      (err)=>{
        console.log('Chargement de trésoriers non réussi', err);
      }
    );
  }

  ngOnDestroy():void{}

  initmod(i:number){
    this.tresmani=this.tresoriers[i];
    this.modTresComGroup=this.formBuilder.group({
      modNomTres:[this.tresoriers[i].magasinier.nomMagasinier,Validators.required],
      modPreTres:[this.tresoriers[i].magasinier.prenomMagasinier,Validators.required],
      modTelTres:[this.tresoriers[i].magasinier.telMagasinier,Validators.required],
      modUseTres:[this.users.indexOf(this.tresoriers[i].utilisateur)],
      modCodTres:[this.tresoriers[i].idRp,Validators.required]
    });
    this.modTresCom.show();
  }

  modifieTresCom(){
    if(this.tresmani.magasinier.prenomMagasinier!=this.modTresComGroup.value['modPreTres'] ||
    this.tresmani.magasinier.nomMagasinier!=this.modTresComGroup.value['modNomTres']||
    this.tresmani.magasinier.telMagasinier!=this.modTresComGroup.value['modTelTres']){
      var newMag=new Magasinier(this.modTresComGroup.value['modNomTres'],this.modTresComGroup.value['modPreTres'],
      this.modTresComGroup.value['modTelTres']);
      this.serviceCorres.addAMagasinier(newMag).subscribe(
        datam=>{
          const newtc=new TresCom(this.modTresComGroup.value['modCodTres'],datam,
          this.users[this.modTresComGroup.value['modUseTres']]);
          console.log(this.tresmani.idRp,newtc);
          this.servTC.editTresCom(this.tresmani.idRp,newtc).subscribe(
            data=>{
              console.log('Modification éffectuée');
              this.modTresCom.hide();
            },
            err=>{
              console.log('Modification échouée',err);
            });
        },
        errm=>{console.log('Modification échouée pour magasinier',errm);}
      );
    }
    else{
      const newtc=new TresCom(this.modTresComGroup.value['modCodTres'],this.tresmani.magasinier,
          this.users[this.modTresComGroup.value['modUseTres']]);
          console.log(this.tresmani.idRp,newtc);
          this.servTC.editTresCom(this.tresmani.idRp,newtc).subscribe(
            data=>{
              console.log('Modification éffectuée');
              this.modTresCom.hide();
            },
            err=>{
              console.log('Modification échouée',err);
            });
    }
    this.chargerTresoriers();
    this.modTresCom.hide();
  }

  ajouteTresCom(){
    console.log(this.addTresComGroup.value['addUseTres']);
    this.serviceCorres.getAMagasinById('CT').subscribe(
      (datamg)=>{
        var ct=datamg;
        if(ct===null){
          console.log("Le magasin trésor n'existe pas");
          this.serviceCorres.addAMagasin(new Magasin('CT','Caveau Trésor')).subscribe(
            datamag=>{
              this.serviceCorres.addAMagasinier(new Magasinier(this.addTresComGroup.value['addNomTres'],
              this.addTresComGroup.value['addPreTres'],this.addTresComGroup.value['addTelTres'])).subscribe(
                datamaga=>{
                  this.servTC.addATresCom(new TresCom(this.addTresComGroup.value['addCodTres'],datamaga,this.users[this.addTresComGroup.value['addUseTres']]))
                  .subscribe(
                    datatres=>{
                      this.servTC.getAllTresCom().subscribe(
                        datalist=>{
                          this.serviceCorres.addAGerer(new Gerer(new Date(),null,datamaga,new Magasin('CT','Caveau Trésor')))
                          .subscribe(
                            datag=>{
                              console.log("Ajout réussi de gérer");
                            },
                            errg=>{
                              console.log("Ajout échoué de gérer");

                            }
                          );
                          this.tresoriers=datalist;
                          this.dTriTres.next();
                        },
                        errlist=>{
                          console.log('impossible de charger la liste des trésoriers communaux',errlist);
                        }
                      );
                    },
                    errtres=>{
                      console.log('Imposible d\'ajouter le trésorier communal',errtres);
                    }
                  );
                },
                errmaga=>{
                  console.log('Imposible de créer le magasinier', errmaga);
                }
              );
            },
            errMag=>{
            console.log('Impossible de créer le caveau trésor', errMag);
            }
          );
        }
        else{
          this.serviceCorres.getAllGerer().subscribe(
            datag=>{
              var gerer=datag;
              var ligneGerer=gerer.find(g=>g.magasin.codeMagasin==='CT' && g.dateFinGerer===null);
              ligneGerer.dateFinGerer=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1);
              this.serviceCorres.editAGerer(ligneGerer.idGerer.toString(),ligneGerer).subscribe(
                datanl=>{
                  this.serviceCorres.addAMagasinier(new Magasinier(this.addTresComGroup.value['addNomTres'],
            this.addTresComGroup.value['addPreTres'],this.addTresComGroup.value['addTelTres'])).subscribe(
            datamaga=>{
              var ntres=new TresCom(this.addTresComGroup.value['addCodTres'],datamaga,
              this.users[this.addTresComGroup.value['addUseTres']]);
              console.log(ntres);
              this.servTC.addATresCom(ntres).subscribe(
                datatres=>{
                  this.servTC.getAllTresCom().subscribe(
                    datalist=>{
                      this.serviceCorres.addAGerer(new Gerer(new Date(),null,datamaga,new Magasin('CT','Caveau Trésor')))
                      .subscribe(
                        datag=>{
                          console.log("Ajout réussi de gérer");
                        },
                        errg=>{
                          console.log("Ajout échoué de gérer");

                        }
                      );
                      this.tresoriers=datalist;
                      this.dTriTres.next();
                    },
                    errlist=>{
                      console.log('impossible de charger la liste des trésoriers communaux',errlist);
                    }
                  );
                },
                errtres=>{
                  console.log('Imposible d\'ajouter le trésorier communal',errtres);
                }
              );
            },
            errmaga=>{
              console.log('Imposible de créer le magasinier', errmaga);
            }
          );
                }
              );
            }
          );
        }
      },
      err=>{
        console.log('Action annulée', err);
      }
    );
    this.chargerTresoriers();
    this.addTresCom.hide();
  }

  initDel(tre: TresCom){
    this.tresmani=tre;
    this.delTresCom.show();
  }

  deleteTresCom(){
    this.numMagTres = this.tresmani.magasinier.numMAgasinier.toString();
    this.servTC.deleteTresCom(this.tresmani.idRp).subscribe(
      datat=>{
        this.serviceCorres.getAllGerer().subscribe(
          datalg=>{
            var gerer=datalg;
            var idgere=gerer.find(ger=>ger.magasinier.numMAgasinier.toString()===this.numMagTres).idGerer.toString();
            if(idgere!==null){
              this.serviceCorres.deleteAGerer(idgere).subscribe(
                datasg=>{
                  this.serviceCorres.deleteAMagasinier(this.numMagTres).subscribe(
                    datam=>{
                    console.log('Suppression réussie');
                    this.chargerTresoriers();
                  },
                  errmg=>{
                    console.log('Suppression échouée du magasinier', errmg );
                  });
                },
                errge=>{
                  console.log('Suppression échouée de la relation gérer',errge);
                }
              );
            }
            else{
              this.serviceCorres.deleteAMagasinier(this.numMagTres).subscribe(
                datam=>{
                console.log('Suppression réussie');
              },
              errmg=>{
                console.log('Suppression échouée du magasinier', errmg );
              });
            }
          }
        );
      },
      errt=>{
        console.log('Suppression échouée du trésorier communal', errt);
      }
    );
    this.chargerTresoriers();
    this.delTresCom.hide();
  }

  chargerTresoriers(){
    this.servTC.getAllTresCom().subscribe(
      data=>{
        this.tresoriers=data;
        $('#dtTres').dataTable().api().destroy();
        this.dTriTres.next();
      }
    );
  }
}
