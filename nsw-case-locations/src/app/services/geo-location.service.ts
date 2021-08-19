import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuburbData } from '../models/suburbData.model';


@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {
  coordinates: any;
  constructor(private http: HttpClient) { }

  public getPosition(): Observable<GeolocationPosition > {
    console.log("Getting position")
    return new Observable(
      (observer) => {
        navigator.geolocation.watchPosition((pos: any) => {
          observer.next(pos);
        }),
          () => {
            console.log('Position is not available');
          },
        {
          enableHighAccuracy: true
        };
      });
  }


  data = <any[]>[];
  public getPostcodes(): Observable<SuburbData[]> {
    return this.data.length 
      ? of(this.data) 
      : this.http.get<SuburbData[]>("/assets/data/nsw_postcodes.json").pipe(
          map(data => { 
               //map correctly into class object
          data.forEach((obj: SuburbData, idx: number) => {
            data[idx] = new SuburbData(obj);
          })
          return data;
          })
        )
   }

   public searchPostcodes(filter: string): Observable<SuburbData[]> {
    return this.getPostcodes();
    // return this.getPostcodes().pipe(map(
    //   data => { 
    //     return this.data;
    //   }

    // ));
   }
}
