import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainPageComponent } from './main-page/main-page.component';
import { UserInfoPageComponent } from './user-info-page/user-info-page.component';
import { CreateUserPageComponent } from './create-user-page/create-user-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '', component: MainPageComponent },
      { path: 'user/:id', component: UserInfoPageComponent, canActivate: [AuthGuard] },
      { path: 'create', component: CreateUserPageComponent },
    ],
  },
  { path: 'login', component: LoginPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
