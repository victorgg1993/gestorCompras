import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  addProduct(product: any) {}

  updateProduct(product: any) {
    return new Promise((resolve, reject) => {
      this.http
        .put(environment.URL_PRODUCTE, product)
        .toPromise()
        .then((data: any) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  patchProductManual(product: any) {
    return new Promise((resolve, reject) => {
      this.http
        .patch(environment.URL_COMPRES_MANUALS, product)
        .toPromise()
        .then((data: any) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  removeProduct(product: any) {}
}
