import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';


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
  agForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.agForm = this.fb.group({});
  }
  ngOnInit(): void {
    // this.addFields();
    this.createForm();
  }

  get fieldsArray() {
    return this.agForm.get('fields') as FormArray;
  }

  createForm(){
    const formGroup: any ={};
    this.fields.forEach(field=>{
      formGroup[field.name] = [field.value || '', field.required? [Validators.required] : []]
    });

    this.agForm = this.fb.group(formGroup);
  }


  addFields(): void {
    this.fields.forEach((field) => {
      const control = this.createFormControl(field);
      this.fieldsArray.push(control);
    });
  }

  createFormControl(field: any) {
    const validators = field.required ? [Validators.required] : [];
    if (field.type === this.fieldTypes.Email) {
      validators.push(Validators.email); // Add email validation for email field
    }

    switch (field.type) {
      case this.fieldTypes.Select:
        return this.fb.control('', validators);
      case this.fieldTypes.Radio:
        return this.fb.control('', validators);
      case this.fieldTypes.Checkbox:
        return this.fb.control(false, validators); // For checkbox (boolean values)
      case this.fieldTypes.Number:
      case this.fieldTypes.Text:
        return this.fb.control('', validators); // Basic text input
      default:
        return this.fb.control('', validators); // Default case
    }
  }
  // Method to handle form submission
  submitForm() {
    if(this.agForm.valid){
      this.formSubmit.emit(this.model); // Emit the form model (data) to the parent
    }
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
  required?: boolean;
  options?: string[];  // For select or radio button types
}

