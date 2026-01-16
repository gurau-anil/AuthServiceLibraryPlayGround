import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading: boolean = false;

  /**
   *
   */
  constructor(private httpClient: HttpClient) {
    
    
  }

  handleSubmit(){
    this.httpClient.post("api/auth/login", {userName:"admin", password: "Dev@1234"}).subscribe(result=>{
      console.log(result);
    });
  }
}
