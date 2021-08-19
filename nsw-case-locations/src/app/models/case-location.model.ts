

  export class CaseLocation {
      Venue: string = "";
      Address: string = "";
      Suburb: string = "";
      Date: Date;
      Time: string = "";
      Alert: string = "";
      Lon: number =0;
      Lat: number =0;
      HealthAdviceHTML: string ="";
      LastUpdatedDate: Date;
      Transmissionvenues: string ="";
      Distance:number= 0;

      public constructor(init?: Partial<CaseLocation>) {

        Object.assign(this, init);

        this.LastUpdatedDate = new Date((<any>init)["Last updated date"])
        this.Date = new Date((<any>init)["Date"])
    
      }

      getMapLink():string{
         //return "https://www.google.com/maps/place/"+encodeURIComponent(this.Address+",+"+this.Suburb)+"+NSW";
         return "https://www.google.com/maps/place/"+this.convertDMS(this.Lat, this.Lon);
         //return "https://www.google.com/maps/place/"+encodeURIComponent(this.Venue)+"/@"+this.Lat+","+this.Lon+",17z/";
      }

      convertDMS(lat: number, lng: number) {
        var latitude = this.toDegreesMinutesAndSeconds(lat);
        var latitudeCardinal = lat >= 0 ? "N" : "S";
    
        var longitude = this.toDegreesMinutesAndSeconds(lng);
        var longitudeCardinal = lng >= 0 ? "E" : "W";
    
        return latitude + "\"" + latitudeCardinal + " " + longitude + "\"" + longitudeCardinal;
    }

    toDegreesMinutesAndSeconds(coordinate: number) {
      var absolute = Math.abs(coordinate);
      var degrees = Math.floor(absolute);
      var minutesNotTruncated = (absolute - degrees) * 60;
      var minutes = Math.floor(minutesNotTruncated);
      var seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  
      return degrees + "°" + minutes + "'" + seconds;
  }


      updateDistance(userLat:number, userLon:number){
        //from https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
        var R = 6371; // km
        var dLat = this.toRad(this.Lat-userLat);
        var dLon = this.toRad(this.Lon-userLon);
        var lat1 = this.toRad(userLat);
        var lat2 = this.toRad(this.Lat);
  
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        this.Distance = R * c;
        return this.Distance;
      }

       // Converts numeric degrees to radians
    toRad(Value: number): number 
    {
        return Value * Math.PI / 180;
    }


  }




