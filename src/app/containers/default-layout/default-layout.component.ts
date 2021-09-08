import {Component} from '@angular/core';
import {RegisseurHabilitation} from "../../../models/habilitation/regisseur-habilitation";
import { CaissierHabilitation } from '../../../models/habilitation/caissier-habilitation';
import { LiveurHabilitation } from '../../../models/habilitation/livreur-habilitation';
import { AdminHabilitation } from '../../../models/habilitation/admin-habilitation';
import { DefaultHabilitation } from '../../../models/habilitation/default-habilitation';


import { UtilisateurService } from '../../../services/administration/utilisateur.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
   navItems;

 
  
  //public navItems = navItems;
  //public navIdatas = navIdata;
  public texte:String = "PERFORA GPC";

  constructor(private serviceUser:UtilisateurService) { }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  ngOnInit(): void {
    let not_valid_user:boolean = false;

    console.log('User connected', this.serviceUser.connectedUser);
    const serviceCode = this.serviceUser.connectedUser?.service.codeService;
  if (this.serviceUser.connectedUser != null) {

    switch (serviceCode) {
      case 'S1':
        this.navItems = CaissierHabilitation.navIdata; 
        break;
      case 'S2':
        this.navItems = RegisseurHabilitation.navIdata; 
        break;
      case 'S3':
        this.navItems = LiveurHabilitation.navIdata; 
        break;
      case 'S4':
        this.navItems = AdminHabilitation.navIdata; 
        break;
      default:
        this.navItems = DefaultHabilitation.navIdata;
        break;
    }
    
  }
  else{
    
    not_valid_user = true;
  }
   

    

  }

}