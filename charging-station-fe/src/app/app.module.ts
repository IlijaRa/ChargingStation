import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChargersComponent, LandingComponent, LoginComponent, RegisterComponent, UserAddEditComponent, UsersComponent, VehicleAddEditComponent, VehiclesComponent } from './views';
import { FooterLayoutComponent, HeaderLayoutComponent, MainLayoutComponent } from './layouts';
import { AuthsService, ChargersService, UsersService, VehiclesService } from './core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    UsersComponent,
    UserAddEditComponent,
    ChargersComponent,
    VehiclesComponent,
    VehicleAddEditComponent,

    HeaderLayoutComponent,
    MainLayoutComponent,
    FooterLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule
  ],
  providers: [
    AuthsService,
    UsersService,
    ChargersService,
    VehiclesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
