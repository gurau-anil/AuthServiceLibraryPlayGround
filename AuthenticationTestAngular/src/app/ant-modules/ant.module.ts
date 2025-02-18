import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { IconsProviderModule } from '../icons-provider.module';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzDrawerModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
  ],
  exports:[
    NzDrawerModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
  ],
  providers:[
    provideNzI18n(en_US),
  ]
})
export class AntModules { }
