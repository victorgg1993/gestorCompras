import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { dialogEditarProducteRecurrent } from './dialogEditarProducteRecurrent.component';
import { CheckboxModule } from 'primeng/checkbox';
import { GalleriaModule } from 'primeng/galleria';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [dialogEditarProducteRecurrent],
  imports: [
    CommonModule,
    DynamicDialogModule,
    CheckboxModule,
    GalleriaModule,
    BrowserModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    ChipsModule,
    DropdownModule,
    TabViewModule,
    TranslateModule
  ],
  exports: [dialogEditarProducteRecurrent], // Opcional: exporta el componente si planeas usarlo fuera de este módulo
})
export class DialogEditarProducteRecurrentModule {}
