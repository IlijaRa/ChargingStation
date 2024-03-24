import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChargersComponent, LandingComponent, LoginComponent, RegisterComponent, UserComponent, UsersComponent, VehiclesComponent } from './views';
import { FooterLayoutComponent, HeaderLayoutComponent, MainLayoutComponent } from './layouts';
import { ChargersService, UsersService, VehiclesService } from './core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    UsersComponent,
    UserComponent,
    ChargersComponent,
    VehiclesComponent,

    HeaderLayoutComponent,
    MainLayoutComponent,
    FooterLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    UsersService,
    ChargersService,
    VehiclesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
