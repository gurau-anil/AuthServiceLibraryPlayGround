import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { DeviceService } from './services/device.service';
import { FieldConfig, FieldType } from 'ag-assets';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  visible = false;

  @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
      console.log(window.innerWidth)
      console.log("Test")
    }
    
  constructor(private cdRef: ChangeDetectorRef, public deviceService: DeviceService){
    
  }

  formFields: FieldConfig[] = [
    { type: FieldType.Text, label: 'Name', name: 'name', placeholder: 'Enter your name', required: true },
    { type: FieldType.Email, label: 'Email', name: 'email', placeholder: 'Enter your email', required: true },
    { type: FieldType.Select, label: 'Country', name: 'country', options: ['USA', 'Canada', 'UK'], required: true },
    { type: FieldType.Radio, label: 'Gender', name: 'gender', options: ['Male', 'Female'], required: true }
  ];

  handleFormSubmit(formData: any) {
    console.log('Form data received:', formData);
  }
  
  ngOnInit(): void {
    
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
