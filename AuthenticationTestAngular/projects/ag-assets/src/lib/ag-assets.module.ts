import { NgModule } from '@angular/core';
import { AgAssetsComponent } from './ag-assets.component';
import { AgFormComponent } from './forms/ag-form/ag-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';

const registerAndExportComponents = [AgFormComponent]

@NgModule({
  declarations: [
    AgAssetsComponent,
    ...registerAndExportComponents
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule, MatCheckboxModule, MatButtonModule
  ],
  exports: [
    AgAssetsComponent,
    ...registerAndExportComponents
  ]
})
export class AgAssetsModule { }
