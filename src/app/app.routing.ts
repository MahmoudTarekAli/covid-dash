import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserlayoutComponent } from './core/userlayout/userlayout.component';
import {CanActivateViaAuthGuard} from './modules/auth/auth-guard/auth.guard';
import {CanActivateAdminGuard} from './modules/auth/auth-guard/adminAuth.guard';


export const routes: Routes = [
  {
    path: '',
    component: UserlayoutComponent,
    canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'news',
        pathMatch: 'full'
      },
      {
        path: 'news',
        loadChildren: './modules/news/news.module#NewsModule',
        canActivate: [CanActivateAdminGuard],
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: './modules/auth/auth.module#AuthModule'
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
