import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTPService } from './services/http.service';

import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { OrderListModule } from 'primeng/orderlist';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FilterCategoriesPipe } from './pipes/filter-categories.pipe';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogEditarProducteRecurrentModule } from './dialogs/dialogEditarProducteRecurrent/dialogEditarProducteRecurrent.module';
import { DatePrinterPipe } from './pipes/date-printer.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideTranslation } from './translate-loader.config'; // Configuración para TranslateLoader

@NgModule({
  declarations: [AppComponent, FilterCategoriesPipe, DatePrinterPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    AccordionModule,
    CheckboxModule,
    InputNumberModule,
    CardModule,
    OrderListModule,
    FormsModule,
    InputSwitchModule,
    HttpClientModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    DynamicDialogModule,
    DialogEditarProducteRecurrentModule,
    DropdownModule,
    TranslateModule
  ],
  providers: [HTTPService, MessageService, ConfirmationService, DialogService,
  importProvidersFrom(TranslateModule.forRoot(provideTranslation())), // Corregido aquí
],

  bootstrap: [AppComponent],
})
export class AppModule {}
