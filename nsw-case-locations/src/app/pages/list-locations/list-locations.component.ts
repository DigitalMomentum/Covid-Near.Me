import { Component, OnInit } from '@angular/core';
import { SuburbData } from 'src/app/models/suburbData.model';
import { GeoLocationService } from 'src/app/services/geo-location.service';

@Component({
  selector: 'app-list-locations',
  templateUrl: './list-locations.component.html',
  styleUrls: ['./list-locations.component.less']
})
export class ListLocationsComponent implements OnInit {
  locations: SuburbData[] = [];
  constructor(private geoLocationService: GeoLocationService) {
    this.geoLocationService.getPostcodes().subscribe((data)=>{
      this.locations = data;

    
    });

   }

  ngOnInit(): void {
  }

  sortBy(prop: string) {
    return this.locations.sort((a, b) => a.locality > b.locality ? 1 : a.locality === b.locality ? 0 : -1);
  }

}
