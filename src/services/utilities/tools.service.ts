import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor() { }

  public addDayToDate(date:Date, days:number):Date{

    let nbr:number = 0;
    nbr = days*24*60*60*1000;
    return new Date(new Date(date).valueOf()+nbr);
  }

}
