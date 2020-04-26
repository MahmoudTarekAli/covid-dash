import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  TranslateModule,
  TranslateLoader,
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';

import {AppRoutingModule} from '../app.routing';
import {SharedModule} from '../shared/shared.module';
import {UserlayoutComponent} from './userlayout/userlayout.component';
import {JwtInterceptor} from './interceptor/JwtInterceptor';
import {AuthService} from '../modules/auth/services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  declarations: [UserlayoutComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function (router: Router) {
        return new JwtInterceptor(router);
      },
      useClass: JwtInterceptor,
      multi: true,
      deps: [Router]
    }
  ],
  exports: [RouterModule, TranslateModule]
})
export class CoreModule {
}
