

  export class SuburbData {
      id: number =0;
      locality: string = ""; //Suburb
      postcode: string = "";
      lat: number =0;
      lon: number =0;
      

      public constructor(init?: Partial<SuburbData>) {

        Object.assign(this, init);
    
      }

     

  }




