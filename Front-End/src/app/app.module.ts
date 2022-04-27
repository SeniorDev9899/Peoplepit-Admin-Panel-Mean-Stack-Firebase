import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ActionObjectScreenComponent } from './components/action-object-screen/action-object-screen.component';
import { FieldMultiAutocompleteComponent } from './components/fields/field-multi-autocomplete/field-multi-autocomplete.component';
import { FieldMultiselectComponent } from './components/fields/field-multiselect/field-multiselect.component';
import { FieldSingleselectComponent } from './components/fields/field-singleselect/field-singleselect.component';
import { FieldNumberComponent } from './components/fields/field-number/field-number.component';
import { FieldSimpletextComponent } from './components/fields/field-simpletext/field-simpletext.component';
import { FieldSingleAutocompleteComponent } from './components/fields/field-single-autocomplete/field-single-autocomplete.component';
import { FieldDateComponent } from './components/fields/field-date/field-date.component';
import { SectionComponent } from './components/section/section.component';
import { MenuComponent } from './components/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { ActionListComponent } from './components/actions/action-list/action-list.component';
import { ActionRectangleComponent } from './components/actions/action-rectangle/action-rectangle.component';

import { ObjectService } from './services/object.service';
import { ObjectAdminComponent } from './components/admin/object-admin/object-admin.component';

import { ModalModule } from './components/_modal';
import { FieldAdminComponent } from './components/admin/field-admin/field-admin.component';
import { ContainerAdminComponent } from './components/admin/container-admin/container-admin.component';
import { ActionAdminComponent } from './components/admin/action-admin/action-admin.component';
@NgModule({
  declarations: [
    AppComponent,
    ActionObjectScreenComponent,
    FieldMultiAutocompleteComponent,
    FieldMultiselectComponent,
    FieldSingleselectComponent,
    FieldNumberComponent,
    FieldSimpletextComponent,
    FieldSingleAutocompleteComponent,
    FieldDateComponent,
    SectionComponent,
    MenuComponent,
    HeaderComponent,
    ActionListComponent,
    ActionRectangleComponent,
    ObjectAdminComponent,
    FieldAdminComponent,
    ContainerAdminComponent,
    ActionAdminComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatGridListModule,
    ModalModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ObjectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
