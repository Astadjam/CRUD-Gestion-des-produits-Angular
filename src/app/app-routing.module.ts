import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RouterGuardService } from './services/router-guard.service';
import { SignupComponent } from './signup/signup.component';
import { ListProductComponent } from './list-product/list-product.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'category/:categoryId', component: ListProductComponent},
  {
    path: 'shopstore',
    loadChildren:() => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [RouterGuardService]
   },
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
