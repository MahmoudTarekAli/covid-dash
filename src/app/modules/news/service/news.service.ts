import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = environment.base_url;

  constructor(private http: HttpClient) {
  }


  getAllNews(
    page = 0,
    search = ''
  ): Observable<any> {
    let headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pagination', 'true');
    params = params.append('search', search.toString());
    params = params.append('limit', '10');


    // tslint:disable-next-line:max-line-length
    headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      // tslint:disable-next-line:max-line-length
    });
    return this.http.get(`${this.apiUrl}/news/${page.toString()}`, {
      params: params,
      headers: headers,
      observe: 'response'
    });
  }

  getArticle(id): Observable<any> {
    let headers = new HttpHeaders();
    // tslint:disable-next-line:max-line-length
    headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      // tslint:disable-next-line:max-line-length
    });
    return this.http.get(`${this.apiUrl}/articles/${id}`, {
      headers: headers,
      observe: 'response'
    });
  }

  AddArticle(body) {
    const headers = new HttpHeaders({
      // tslint:disable-next-line:max-line-length
    });
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<any>(`${this.apiUrl}/news`, body, {
      headers: headers,
      observe: 'response'
    });
  }

  updateArticle(body, Id) {
    return this.http.put(`${this.apiUrl}/news/${Id}`, body, {
      observe: 'response'
    });
  }

  delete(id) {
    return this.http.delete(`${this.apiUrl}/news/${id}`, {
      observe: 'response'
    });
  }
}
