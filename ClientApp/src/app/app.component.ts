import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'ClientApp';
  baseUrl = "";
  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }
  ngOnInit(): void {
    this.getForecast();
  }

  getForecast() {
    this.httpClient.get(`${this.baseUrl}WeatherForecast`).subscribe(result => {
      console.log(result);
    })
  }
}
