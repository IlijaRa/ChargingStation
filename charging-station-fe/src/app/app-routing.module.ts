import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent, RegisterComponent } from './view';

const routes: Routes = [
  {
    path: 'login',
    // pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: 'register',
    // pathMatch: 'full',
    component: RegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
