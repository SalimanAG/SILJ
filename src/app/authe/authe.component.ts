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

  onSubmitConnect(){
    let finded = false;
    this.serviceUser.getAllUsers().subscribe(
      (data) => {
        this.utilisateurs = data;
        this.utilisateurs.forEach(element => {
          if(element.login===this.connnectForm.value['login']
          && element.motDePass===this.connnectForm.value['mdp']){
            this.serviceUser.connectedUser = element;
            console.log(this.serviceUser.connectedUser);
            this.route.navigateByUrl('/accueil');
            finded=true;
            exit;
          }
        });

        if(finded===false){
          this.dangerModal.show()
        }
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des utilisateurs', erreur);
      }
    );


  }



}
