import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { AuthComponent } from './auth.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialImportsModule} from '../../shared/material-imports/material-imports.module';
import {RegisterComponent} from './register/register.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MaterialImportsModule,
  ],
  declarations: [
    AuthComponent,
    RegisterComponent,
  ],
  exports: [
  ],
  providers: [
  ]

})

export class AuthModule { }
