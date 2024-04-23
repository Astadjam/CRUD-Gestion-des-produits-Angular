import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './shared/material-module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, SPINNER } from 'ngx-ui-loader';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TokenInterceptor } from './services/token.interceptor';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from './shared/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { SignupComponent } from './signup/signup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PanierComponent } from './panier/panier.component';
import { ListProductComponent } from './list-product/list-product.component';

const ngxUiLoaderConfig:NgxUiLoaderConfig = {
  text: 'Chargement...',
  textColor: 'white',
  textPosition: 'center-center',
  pbColor: 'white',
  bgsColor: 'white',
  fgsColor: 'white',
  fgsType: SPINNER.ballSpinClockwise,
  fgsSize: 100,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProductDetailsComponent,
    SignupComponent,
    PanierComponent,
    ListProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    QuillModule.forRoot(),
    SharedModule  ],
  providers: [
    provideAnimationsAsync(),
    HttpClientModule,
    {provide:HTTP_INTERCEPTORS, useClass:TokenInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor (){
    registerLocaleData(fr.default);
  }
}
