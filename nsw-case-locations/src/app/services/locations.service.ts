import { Injectable } from '@angular/core';
import { Observable, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import {CaseLocation} from "../models/case-location.model";


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": "c31z" })
};

@Injectable({
  providedIn: 'root'
})
export class LocationsService {



  constructor(private http: HttpClient) { }

  getCaseLocations(): Observable<CaseLocation[]>{
    var d = new Date();
    return this.http.get<CaseLocation[]>(
      "https://data.nsw.gov.au/data/dataset/0a52e6c1-bc0b-48af-8b45-d791a6d8e289/resource/f3a28eed-8c2a-437b-8ac1-2dab3cf760f9/download/covid-case-locations-"+
        d.getFullYear().toString()+
        d.getMonth().toString()+
        d.getDay().toString()+
        "-"+
        d.getHours().toString()+
        d.getMinutes().toString()+
        ".json", 
      httpOptions
    )
    .pipe(
      map((data: any)=>{
             //map correctly into class object
          data.data.monitor.forEach((obj: CaseLocation, idx: number) => {
            data.data.monitor[idx] = new CaseLocation(obj);
          })
          return data.data.monitor;
      }))
    ;
  }

}
