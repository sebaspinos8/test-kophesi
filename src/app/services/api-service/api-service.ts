import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Resumen } from '../../pages-encuesta/grafica/grafica.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public url: string = "";
  constructor(private http: HttpClient) { 
   this.url = `${environment.urlBase}`
  }

  saveParticipant(data:any){
    console.log(`${this.url}/SaveParticipant`);
    return this.http.post(`${this.url}/SaveParticipant`,data);
  }

  getQuestions(){
    return this.http.get(`${this.url}/GetQuestions`);
  }

  saveAnswer(data:any){
    return this.http.post(`${this.url}/SaveAnswer`,data);
  }

  getResume(data:any){
    return this.http.post(`${this.url}/GetResume`,data);
  }

  sendResults(data:any){
    return this.http.post(`${this.url}/SendResults`,data);
  }
  

}
