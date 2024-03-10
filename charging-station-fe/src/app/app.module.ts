import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent, LoginComponent, RegisterComponent } from './views';
import { FooterLayoutComponent, HeaderLayoutComponent, MainLayoutComponent } from './layouts';

@NgModule({
  declarations: [
    AppComponent,
    
    LoginComponent,
    RegisterComponent,
    LandingComponent,

    HeaderLayoutComponent,
    MainLayoutComponent,
    FooterLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
