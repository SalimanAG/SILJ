import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Utilisateur } from '../../models/utilisateur.model';
import { UtilisateurService } from '../../services/administration/utilisateur.service';

@Component({
  selector: 'app-authe',
  templateUrl: './authe.component.html',
  styleUrls: ['./authe.component.css']
})
export class AutheComponent implements OnInit {

  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  connnectForm:FormGroup;
  utilisateurs:Utilisateur[]
  confirmation:boolean = false;
  messageErreur:String = '';

  constructor(private serviceUser:UtilisateurService, private route:Router, private formBulder:FormBuilder) {
    this.connnectForm = formBulder.group({
      login:['', Validators.required],
      mdp:['', Validators.required],
      mdp2:''
    });
   }

  ngOnInit(): void {

  }

  getAllUtilisateur(){
    this.serviceUser.getAllUsers().subscribe(
      (data) => {
        this.utilisateurs = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des utilisateurs', erreur);
      }
    );
  }

  showConfirmation(){
    this.serviceUser.getAllUsers().subscribe(
      (data) => {
        this.utilisateurs = data;
        //console.log('data', data);
        this.confirmation = false;
        data.forEach(element => {

          if(element.login == this.connnectForm.value['login'] && element.askMdp1erLance == true){
            this.confirmation = true;
            //console.log('Element', element);
            return;
          }

          //console.log('confirmation', this.confirmation);

        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des utilisateurs', erreur);
      }
    );
  }

  onSubmitConnect(){
    if(this.confirmation == false){
      let finded = false;
      this.serviceUser.getAllUsers().subscribe(
        (data) => {
          this.utilisateurs = data;
          this.utilisateurs.forEach(element => {
            if(element.login===this.connnectForm.value['login']
            && element.motDePass===this.connnectForm.value['mdp']){

              //console.log(this.serviceUser.connectedUser);
              if(element.activeUtilisateur == true){
                this.serviceUser.connectedUser = element;
                this.serviceUser.isAuth = true;
                this.route.navigateByUrl('/accueil');
              }
              else{
                this.messageErreur = "Votre Compte Utilisateur est INACTIF. Veuillez bien demander à votre administrateur de vous l'Activer";
                this.dangerModal.show()
              }

              finded=true;
              exit;
            }
          });

          if(finded===false){
            this.messageErreur = "Nom d'Utilisateur ou Mot de passe Incorrete";
            this.dangerModal.show()
          }
        },
        (erreur) => {
          console.log('Erreur lors de la récupération de la liste des utilisateurs', erreur);
        }
      );
    }
    else{
      if(this.connnectForm.value['mdp']===this.connnectForm.value['mdp2']){
        this.serviceUser.getAllUsers().subscribe(
          (data) => {
            this.utilisateurs = data;
            this.utilisateurs.forEach(element => {
              if(element.login===this.connnectForm.value['login']){
                element.motDePass = this.connnectForm.value['mdp'];
                element.askMdp1erLance = false;
                //console.log('Elémént à envoier', element);
                this.serviceUser.editAUser(element.idUtilisateur.toString(), element).subscribe(
                  (data2) => {
                    if(element.activeUtilisateur == true){
                      this.serviceUser.connectedUser = data2;
                      this.serviceUser.isAuth = true;
                      this.route.navigateByUrl('/accueil');
                    }
                    else{
                      this.messageErreur = "Mot de Passe Modifié avec Succès.\nMais votre Compte Utilisateur est INACTIF. Veuillez bien vouloir demander à votre administrateur de vous l'Activer";
                      this.dangerModal.show()
                    }
                  },
                  (erreur) => {
                    console.log('Erreur lors de lEdition de lUtilisateur');
                  }
                );

                exit;
              }
            });


          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des utilisateurs', erreur);
          }
        );

      }
      else{
        this.messageErreur = "Erreur de Confirmation de Mot de Passe";
        this.dangerModal.show()
      }
    }



  }



}
