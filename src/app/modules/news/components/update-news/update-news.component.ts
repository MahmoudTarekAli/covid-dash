import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsService} from '../../service/news.service';
import {NotificationService} from '../../../../shared/services/notifications/notification.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-news.component.html',
  styleUrls: ['./update-news.component.scss']
})
export class UpdateNewsComponent implements OnInit {
  public updateArticle: FormGroup;
  image: any;
  imagePreview: any;
  loading = false;
  today = new Date();
  constructor( private fg: FormBuilder,
               private dialogRef: MatDialog,
               private datePipe: DatePipe,
               @Inject(MAT_DIALOG_DATA) public article: any,
               private notificationService: NotificationService,
               private articlesService: NewsService
  ) { }

  ngOnInit() {
    this.updateArticle = this.fg.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      origin: ['', Validators.required],
      category: ['', Validators.required],
      link: ['', Validators.required],
      date: ['', Validators.required],
    });
    this.setCategoryValues();
  }
  setCategoryValues() {
    this.updateArticle.controls.title.setValue(this.article.title);
    this.updateArticle.controls.description.setValue(this.article.description);
    this.updateArticle.controls.origin.setValue(this.article.origin);
    this.updateArticle.controls.category.setValue(this.article.category);
    this.updateArticle.controls.link.setValue(this.article.link);
    this.updateArticle.controls.date.setValue(this.article.date);
    this.imagePreview = this.article.url_img;

  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
    }
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  UpdateArticles() {
    this.loading = true;
    const data = {
      title: this.updateArticle.controls.title.value,
      description: this.updateArticle.controls.description.value,
      origin: this.updateArticle.controls.origin.value,
      link: this.updateArticle.controls.link.value,
      category: this.updateArticle.controls.category.value,
      date: this.formatDate(this.updateArticle.controls.date.value),
    };
    const formData = new FormData();
    formData.append('image', this.image);
    formData.append('data', JSON.stringify(data));
    if (this.updateArticle.invalid) {
      this.notificationService.errorNotification('please fill all data');
      this.loading = false;
      return;
    }
    this.articlesService.updateArticle(formData, this.article._id).subscribe(Data => {
      if (Data.status === 200) {
        this.notificationService.successNotification(`News Updated`);
        this.loading = false;
        this.dialogRef.closeAll();
      }
    }, err => {
      this.loading = false;
      this.notificationService.errorNotification(err.error.message);
    });

  }
  formatDate(selectedDate) {
    // tslint:disable-next-line:variable-name
    const latest_date = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    return latest_date || '';
  }

  close() {
    this.dialogRef.closeAll();
  }
}
