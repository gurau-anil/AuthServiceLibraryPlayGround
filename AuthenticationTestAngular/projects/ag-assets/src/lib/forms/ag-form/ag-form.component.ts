import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ag-form',
  standalone: false,
  templateUrl: './ag-form.component.html',
  styleUrl: './ag-form.component.css'
})
export class AgFormComponent {
  @Input() fields: FieldConfig[] = [];
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();
  model: any = {}; // Holds dynamic form data
  fieldTypes = FieldType;

  // Method to handle form submission
  onSubmit() {
    this.formSubmit.emit(this.model); // Emit the form model (data) to the parent
  }
}

export enum FieldType {
  Text = 'text',
  Email = 'email',
  Number = 'number',
  Select = 'select',
  Radio = 'radio',
  Checkbox = 'checkbox',
}

export interface FieldConfig {
  type: FieldType;  // Use the enum for the type
  label: string;
  name: string;
  value?: any;
  placeholder?: string;
  required: boolean;
  options?: string[];  // For select or radio button types
}

