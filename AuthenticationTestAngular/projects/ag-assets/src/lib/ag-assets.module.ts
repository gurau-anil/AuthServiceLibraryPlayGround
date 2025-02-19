import { NgModule } from '@angular/core';
import { AgAssetsComponent } from './ag-assets.component';
import { AgFormComponent } from './forms/ag-form/ag-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const registerAndExportComponents = [AgFormComponent]

@NgModule({
  declarations: [
    AgAssetsComponent,
    ...registerAndExportComponents
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    AgAssetsComponent,
    ...registerAndExportComponents
  ]
})
export class AgAssetsModule { }
