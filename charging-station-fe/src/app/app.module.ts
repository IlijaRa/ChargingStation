import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChargersComponent, LandingComponent, LoginComponent, RegisterComponent, UserAddEditComponent, UserComponent, UsersComponent, VehiclesComponent } from './views';
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

@NgModule({
  declarations: [
    AppComponent,
    
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    UsersComponent,
    UserComponent,
    UserAddEditComponent,
    ChargersComponent,
    VehiclesComponent,

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
    ReactiveFormsModule
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
