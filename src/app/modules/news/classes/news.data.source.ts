import {BehaviorSubject, Observable, of} from 'rxjs';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {catchError, finalize, first, tap} from 'rxjs/operators';
import {NewsService} from '../service/news.service';

export class NewsDataSource implements DataSource<any> {

  private articles = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metaSubject = new BehaviorSubject<any>({});
  public mata$ = this.metaSubject.asObservable();

  public loading$ = this.loadingSubject.asObservable();
  empty = false;

  constructor(private articlesService: NewsService) {}

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.articles.pipe(
      tap(data => {
        this.empty = !data.length;
      })
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.articles.complete();
    this.loadingSubject.complete();
  }

  loadNews(pageNumber) {

    this.loadingSubject.next(true);

    this.articlesService.getAllNews(pageNumber)
      .pipe(
        first(),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(data => {
        this.articles.next(data.body.covidnews);
        this.metaSubject.next(data.body.length);



      });
  }
}
