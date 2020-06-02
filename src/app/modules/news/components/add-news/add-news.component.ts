import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {NotificationService} from '../../../../shared/services/notifications/notification.service';
import {startWith} from 'rxjs/operators';
import {of} from 'rxjs';
import {DatePipe} from '@angular/common';
import {NewsService} from '../../service/news.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss']
})
export class AddNewsComponent implements OnInit {
  public NewArticle: FormGroup;
  image: any;
  imagePreview: any;
  loading = false;
  today = new Date();

  constructor(private fg: FormBuilder,
              private datePipe: DatePipe,
              private articlesService: NewsService,
              public dialogRef: MatDialogRef<AddNewsComponent>,
              private notification: NotificationService) {
  }

  ngOnInit() {
    this.NewArticle = this.fg.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      origin: ['', Validators.required],
      link: ['', Validators.required],
      date: ['', Validators.required],
    });
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
  SaveArticle() {
    this.loading = true;

    const data = {
      title: this.NewArticle.controls.title.value,
      description: this.NewArticle.controls.description.value,
      origin: this.NewArticle.controls.origin.value,
      link: this.NewArticle.controls.link.value,
      category: 'new',
      date: this.formatDate(this.NewArticle.controls.date.value),
    };
    const formData = new FormData();
    formData.append('url_img', this.image);
    formData.append('data', JSON.stringify(data));
    if (this.NewArticle.invalid) {
      this.notification.errorNotification('please fill all data');
      this.loading = false;
      return;
    }
    this.articlesService.AddArticle(formData).subscribe(Data => {
      this.dialogRef.close();
      this.notification.successNotification('News Added');
      this.loading = false;
    }, error => {
      this.loading = false;
      this.notification.errorNotification(error.error.message);
    });
  }
  formatDate(selectedDate) {
    // tslint:disable-next-line:variable-name
    const latest_date = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    return latest_date || '';
  }
  close() {
    this.dialogRef.close();
  }
}
