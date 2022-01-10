import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { AuthGuard } from './services/auth.guard';

IndexComponent
const routes: Routes = [
  {
    path: 'index',
    component :IndexComponent,
    canActivate:[AuthGuard]
  },


  {path: 'login',component :LoginComponent},
  {path: 'crear',component :CreateUserComponent},
{path: '**', redirectTo: 'index'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
