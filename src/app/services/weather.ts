import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class Weather {
  apiKey: string = 'e26d8fe71d7b92269a54cd6ae14ff08e';
  URI: string = `https://api.openweathermap.org/data/3.0/weather?appid=${this.apiKey}&units=metric&q=`;

  constructor(private http:HttpClient){}
}
