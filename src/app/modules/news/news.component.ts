import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator} from '@angular/material';
import {ArticlesDataSource} from './classes/articles.data.source';
import {NewsService} from './service/news.service';
import {NotificationService} from '../../shared/services/notifications/notification.service';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil, tap} from 'rxjs/operators';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {AddNewsComponent} from './components/add-news/add-news.component';
import {UpdateNewsComponent} from './components/update-news/update-news.component';

@Component({
  selector: 'app-categories',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss', '../tabel.scss']
})
export class NewsComponent implements OnInit, AfterViewInit {
  dataSource = new ArticlesDataSource(this.articlesService);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  public loadingTemplate: TemplateRef<any>;
  // @ts-ignore
  @ViewChild('customLoadingTemplate', {static: false}) customLoadingTemplate: TemplateRef<any>;
  @ViewChild('searchInput') search: ElementRef;
  categories: number;
  width: string;
  max_width: string;
  margin_left: string;
  max_height: string;
  height: string;
  constructor(private router: Router, public breakpointObserver: BreakpointObserver, public dialogRef: MatDialog, private articlesService: NewsService,
              private notification: NotificationService,
              private changeDetectorRefs: ChangeDetectorRef) {
  }

  displayedColumns: string [] = [
    'url_img',
    'title',
    'description',
    'link',
    'origin',
    'date',
    'Actions'
  ];

  id: string;
  ngOnInit() {
    this.breakpointObserver.observe(['(min-width: 375px)', '(min-width: 411px)', '(min-width: 320px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.width = '98%';
        this.max_width = '95vw';
        this.margin_left = '3%';
        this.height = '60%';
      }
    });
    this.breakpointObserver.observe(['(min-width: 765px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.width = '60%';
        this.max_width = '80vw';
        this.margin_left = '20%';
        this.height = '60%';
        this.max_height = '80%';

      }
    });
    this.breakpointObserver.observe(['(min-width: 1024px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.width = '60%';
        this.max_width = '80vw';
        this.margin_left = '30%';
        this.height = '80%';
        this.max_height = '80%';

      }
    });
    this.id = localStorage.getItem('userId');
    this.RefreshServiceData();
  }

  addNewArticle() {
    const dialogRef = this.dialogRef.open(AddNewsComponent, {
      maxWidth: this.max_width,
      maxHeight: this.max_height,
      width: this.width,
      height: this.height,
      disableClose: true,
      autoFocus: false,
      position: {
        left: this.margin_left
      }
    });
    dialogRef
      .afterClosed()
      .subscribe(next => {
        this.loadPage();
      });
    this.router.events
      .subscribe(() => {
        dialogRef.close();
      });
  }

  updateNews(element) {
    const dialogRef = this.dialogRef.open(UpdateNewsComponent, {
      maxWidth: this.max_width,
      maxHeight: this.max_height,
      width: this.width,
      height: this.height,
      data: element,
      disableClose: true,
      autoFocus: false,
      position: {
        left: this.margin_left
      }
    });
    dialogRef
      .afterClosed()
      .subscribe(() => {
        this.loadPage();
      });
    this.router.events
      .subscribe(() => {
        dialogRef.close();
      });
  }


  RefreshServiceData() {
    this.dataSource = new ArticlesDataSource(this.articlesService);
    this.dataSource.loadNews(0, this.search.nativeElement.value);
    this.dataSource.mata$.pipe(
      takeUntil(this.$destroy)
    ).subscribe(totalNumber => this.categories = totalNumber);
    this.changeDetectorRefs.detectChanges();
    if (this.loadingTemplate) {
      this.loadingTemplate = null;
    } else {
      this.loadingTemplate = this.customLoadingTemplate;
    }

  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();
    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage();
        })
      )
      .subscribe();
  }

  loadPage() {
    this.dataSource.loadNews(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
    );
  }

  delete(element) {
    Swal.fire({
      title: 'Delete News',
      text: 'Are you sure you want to delete this News "' + element.title + '"',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'No',
      cancelButtonColor: '#FF0000',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.articlesService.delete(element._id).subscribe(data => {
            if (data.status === 200) {
              this.notification.successNotification('Deleted');
              this.loadPage();
            }
          },
          error => {
            this.notification.errorNotification(error.message);

          });
      }
    });


  }

}
