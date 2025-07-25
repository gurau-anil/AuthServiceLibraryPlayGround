import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  constructor(protected httpClient: HttpClient) {}

  ngOnInit(){
    this.httpClient.post("https://localhost:7052/api/auth/login", {
      userName : "admin",
      password : "Dev@1234"
    }).subscribe(result=>{
      console.log(result);
    })
  }

  handleButtonClick(){
    this.httpClient.get("https://localhost:7052/api/role/all").subscribe(result=>{
      console.log(result);
    })
  }
}
