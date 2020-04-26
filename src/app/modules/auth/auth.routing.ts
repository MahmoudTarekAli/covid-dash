import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {RegisterComponent} from './register/register.component';

export const AuthRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: RegisterComponent,
        data: { num: 1 }
    },
];


@NgModule({
    imports: [
        RouterModule.forChild(AuthRoutes),
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
