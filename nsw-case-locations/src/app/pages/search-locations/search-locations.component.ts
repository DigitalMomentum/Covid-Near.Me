import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { CaseLocation } from '../../models/case-location.model';
import { GeoLocationService } from '../../services/geo-location.service';
import { LocationsService } from '../../services/locations.service';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { SuburbData } from '../../models/suburbData.model';

@Component({
  selector: 'app-search-locations',
  templateUrl: './search-locations.component.html',
  styleUrls: ['./search-locations.component.less']
})
export class SearchLocationsComponent implements OnInit {
  locations:CaseLocation[] = [];
  locationsFiltered:CaseLocation[] = [];
  displayedColumns: string[] = ['Distance', 'Suburb', 'Venue', 'Date', 'Map', 'LastUpdatedDate'];
  dataSource: MatTableDataSource<CaseLocation> = new MatTableDataSource();
  searchType:string= "myLocation";
  sortBy = {type: 'Distance', reverse: false};
  lastDataRefresh!: Date;

  distanceField = new FormControl();
  radius = "5";

  currentLat = 0;
  currentLng = 0;

  myGpsPos:GeolocationPosition|null = null;


  @ViewChild(MatSort) sort!: MatSort;


  selectedPostcode: any;
  myControl = new FormControl();
  options: SuburbData[] = [
  ];
  filteredOptions!: Observable<SuburbData[]>;

  constructor(private caseLocations: LocationsService, private geoLocationService: GeoLocationService){

    this.geoLocationService.getPostcodes().subscribe((data)=>{
      this.options = data;
    });

   
   
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.postcode),
      map(name => name ? this._filter(name) : this.options.slice(0,20))
    );
  }

  ngAfterViewInit() {

    // this.sort.direction = 'asc';
    // this.sort.active = "Distance";
    // this.dataSource.sort = this.sort;
    this.distanceField.setValue(5);
 
    



   // this.geoLocationService.getPosition().subscribe((pos: any)=>{

        this.caseLocations.getCaseLocations().subscribe((data: any)=>{
          this.lastDataRefresh = new Date();
          // data.forEach((item:CaseLocation)=>{
          //   item.updateDistance(pos.coords.latitude, pos.coords.longitude)
          // });
          // for(var i =0; i < data.length; i++){
          //   data[i].updateDistance(pos.coords.latitude, pos.coords.longitude);
          // }

       // console.log(data[0].distance);

       

        this.locations = data;

        var settings:any = localStorage.getItem("searchSettings");
        if(settings != null){
          settings = JSON.parse(settings);
          this.radius = settings.radius;
          this.sortBy = settings.sortBy;
          this.searchType =settings.searchType;
          this.selectedPostcode =settings.selectedPostcode;

          if(this.searchType == "myLocation"){
            this.onGpsSearch();
          }else if(this.searchType == "postcode"){
            this.onPostcodeSelected(this.selectedPostcode);
          }
        }
      
       // this.updateDistances(pos.coords.latitude, pos.coords.longitude);
        //this.dataSource.data = this.locations.filter(item => item.Distance < +this.radius);
       // this.applyFilter();

     });
   // })
  }

  updateDistances(lat: number, lon: number){

    //Note: This is bad duplicated logic. Pleas fix me

    if(new Date() > new Date(this.lastDataRefresh.getTime() + 10 * 60000)){//10 minutes
      console.log("Getting new data")
      //Its been a while since out last refresh, so grab new data first 
      this.caseLocations.getCaseLocations().subscribe((data: any)=>{
        this.lastDataRefresh = new Date();
        this.locations.forEach((item:CaseLocation)=>{
          item.updateDistance(lat, lon);
        });
    
        this.currentLat = lat;
        this.currentLng = lon;
      });
    }else{
      console.log("stale data")
      this.locations.forEach((item:CaseLocation)=>{
        item.updateDistance(lat, lon);
      });
  
      this.currentLat = lat;
      this.currentLng = lon;
    }
    

   
  }

  applyFilter(
    //event: Event
    ) {
     console.log("applyfilter")
   // const filterValue = (event.target as HTMLInputElement).value;
   // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.data = this.locations.filter(item => item.Distance < +this.radius);
      this.locationsFiltered = this.locations.filter(item => item.Distance < +this.radius);


      localStorage.setItem("searchSettings", JSON.stringify({

        radius: this.radius,
        sortBy: this.sortBy,
        searchType: this.searchType,
        selectedPostcode: this.selectedPostcode,
        
      }));
  }



  // private _filter(value: string): Observable<SuburbData[]> {
  //   const filterValue = value.toLowerCase();


  //  return this.geoLocationService.searchPostcodes(filterValue);/*.pipe(map((data)=>{
  //   return data;
  //  }));*/
  // }

  // displayFn(suburb: SuburbData): string {
  //   return suburb && suburb.postcode ? suburb.postcode.toString() : '';
  // }


  displayFn(suburb: SuburbData): string {
    return suburb && suburb.postcode ? suburb.postcode : '';
  }

  private _filter(val: string): SuburbData[] {
    console.log(val)
    if (val && val.length >= 3) {
   // const filterValue = val.toLowerCase();

    return this.options.filter(option => option.postcode.toLowerCase().includes(val));
    }else{
      return [];
    }
  }


  onPostcodeSelected(suburb: SuburbData){
    console.log("onpostcodeSelected")
    this.selectedPostcode = suburb;
    this.updateDistances(suburb.lat, suburb.lon);
    this.applyFilter();
  }
  

  _gpsWaiting = false;
  onGpsSearch(){
    console.log("onGps")
    this._gpsWaiting = true;

    if(this.myGpsPos != null){
      //Use existing Pos
      this.updateDistances(this.myGpsPos.coords.latitude, this.myGpsPos.coords.longitude);
      this.applyFilter();
      return;
    }

    this.geoLocationService.getPosition().pipe(map((pos)=>{
      console.log("waiting", this._gpsWaiting);
      if(this._gpsWaiting){
      console.log("gps subscribe");
      this.selectedPostcode = null;
      this.myGpsPos =pos;
      this.updateDistances(pos.coords.latitude, pos.coords.longitude);
      this.applyFilter();
      this._gpsWaiting = false;
      }
    })).subscribe();
  }
}
