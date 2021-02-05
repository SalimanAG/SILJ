import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { OpCaisse } from '../../../models/OpeCaisse.model';
import { OperationCaisseService } from '../../../services/saisie/operation-caisse.service';


@Component({
  selector: 'app-operation-caisse',
  templateUrl: './operation-caisse.component.html',
  styleUrls: ['./operation-caisse.component.css']
})
export class OperationCaisseComponent implements OnInit {

  dtListOpeCa: DataTables.Settings = {};
  dtOpeCa: Subject<any> = new Subject<any>();
  dtArticleV: DataTables.Settings = {};
  dtArtV: Subject<any> = new Subject<any>();
  dtListArt: DataTables.Settings = {};
  dtArt: Subject<any> = new Subject<any>();
  addVentGroup:FormGroup;
  opera:OpCaisse[];

  constructor(private opServ:OperationCaisseService, private fbuilder:FormBuilder, private router:Router) {

  }

  initForm(){
    this.addVentGroup=this.fbuilder.group({
      addVentCais:['',Validators.required],
      addVentDate:['',Validators.required],
      addVentNum:['',Validators.required],
      addVentTyp:['',Validators.required],
      addVentMod:['',Validators.required],
      addVentCont:['',Validators.required],
      addVentObs:['',Validators.required]
    }
    )
  }

  ngOnInit(): void {
    this.opServ.getAllOp()
    .subscribe(
      (data) => {
        this.opera = data;
        this.dtOpeCa.next();
      },
      (erreur) => {
        console.log('Erreur : '+erreur);
      }
    );
    console.log('ertyu')
  }

  AjouteVente(){
    console.log(this.addVentGroup.value['addVentCais'],
    this.addVentGroup.value['addVentDate'],
    this.addVentGroup.value['addVentNum'],
    this.addVentGroup.value['addVentTyp'],
    this.addVentGroup.value['addVentMod'],
    this.addVentGroup.value['addVentCont'],
    this.addVentGroup.value['addVentObs']);

    console.log('jfjfjfjjfjfjf');

  }

  @ViewChild('addVente') public addVente: ModalDirective;

}
