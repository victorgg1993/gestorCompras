import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  constructor(private http: HttpClient) {}

  get(url: string): Observable<any> {
    return this.http.get(url);
  }

  post(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders();
    // No Content-Type header for file upload
    return this.http.post(url, data, { headers });
  }

  postFile(url: string, data: FormData): Observable<any> {
    // Use FormData for file upload
    return this.http.post(url, data);
  }

  put(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(url, data, { headers });
  }

  delete(url: string, data: any): Observable<any> {
    return this.http.delete(url, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
  }
}
