import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import {MaterialImportsModule} from '../../shared/material-imports/material-imports.module';
import {NewsComponent} from './news.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {AddNewsComponent} from './components/add-news/add-news.component';
import {UpdateNewsComponent} from './components/update-news/update-news.component';

@NgModule({
  declarations: [AddNewsComponent, NewsComponent, UpdateNewsComponent],
  imports: [
    CommonModule,
    NewsRoutingModule,
    MaterialImportsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [AddNewsComponent, UpdateNewsComponent],
  providers: [DatePipe]
})
export class NewsModule { }
