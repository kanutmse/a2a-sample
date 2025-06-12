export class HotelServiceClient {



  constructor(private host : string){}




    async getCurrentReservationById(): Promise<any> {
      const response = await fetch(`${this.host}/reservation/001`, {
        method: "GET",
      });
    
        return response.json();
      }

}