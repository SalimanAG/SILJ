import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilisateurService } from './utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private serviceUser:UtilisateurService, private router:Router) { }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot)
  :Observable<boolean> | Promise<boolean> | boolean {
    if(this.serviceUser.isAuth === true){
      return true;
    }
    else {
      this.router.navigateByUrl('/auth');
    }
  }

}
