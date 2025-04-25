import { Injectable, OnInit } from '@angular/core';
import { Common } from './Common';
import { Toast } from './Toast';
import { environment } from '../../environments/environment';
import { HTTPService } from '../services/http.service';
import { CompresManager } from './CompresManager';
import { dummySupermercat } from '../models/common.model';
import { ProductsService } from '../services/products.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ProductManager implements OnInit {
  public categories: any = [];

  public superSeleccionat: string = dummySupermercat.name;
  public titleToastAdded = 'Afegit!';
  public bodyToastAdded = 'Producte afegit';

  constructor(
    private http: HTTPService,
    private compres: CompresManager,
    private common: Common,
    private productService: ProductsService,
    private toast: Toast,
    private translateService: TranslateService
  ) {
    this.common.superSeleccionat$.subscribe((supermercat: any) => {
      this.superSeleccionat = supermercat.name.toLocaleLowerCase();
    });

    this.compres.categories$.subscribe((data: any) => {
      this.categories = data;
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.translateTitle();
    this.translateBody();

    this.translateService.onLangChange.subscribe((event: any) => {
      this.translateTitle();
      this.translateBody();
    });
  }

  public patchProducte(producte: any) {
    this.productService
      .patchProductManual(producte)
      .then((data: any) => {
        if (data.error === false) {
          this.toast.show(this.titleToastAdded, this.bodyToastAdded);
          this.compres.afegidesUsuariSubject.next(data.data);
        }
        //
        else {
          console.error('Error servidor al insertar producte manual: ', data);
        }
      })
      .catch((err) => {
        console.error('Error insertar producte manual: ', err);
      });
  }

  // ----------------------------------------------
  public incrementDecrement(item: any, supermercats: any): void {
    item.categoria = this.getCategoria(item.producte[this.superSeleccionat].id);

    // update compres manuals
    if (item.afegitUser) {
      console.log('update compres manuals');

      this.productService
        .patchProductManual(item)
        .then((data: any) => {
          if (data.error === false) {
            console.log('increment/decrement, rebut server: ', data);
            this.compres.afegidesUsuariSubject.next(data.data);
          }
        })
        .catch((err) => {
          console.error('error increment/decrement: ', err);
        });
    }

    // update producte periòdic
    else {
      this.productService
        .updateProduct(item)
        .then((data) => {})
        .catch((err) => {
          console.error('error increment/decrement: ', err);
        });
    }
  }

  public getCategoria(_id: string): string {
    let _categories = this.categories;

    for (const categoria of _categories) {
      for (const _producte of categoria.productes) {
        if (_producte.producte[this.superSeleccionat].id == _id) {
          return categoria.title;
        }
      }
    }
    return '';
  }

  public actualitzar(producte: any): void {
    let existeix = false;
    let _cat = this.categories;

    // Actualitzar un producte que ja existeix
    for (let i = 0; i < _cat.length; i++) {
      for (let j = 0; j < _cat[i].productes.length; j++) {
        if (
          producte.producte[this.superSeleccionat].id ==
          _cat[i].productes[j].producte[this.superSeleccionat].id
        ) {
          _cat[i].productes[j].producte = producte;
          existeix = true;
          i = _cat.length; // pirem dels 2 bucles
          break;
        }
      }
    }

    // Afegir un producte que no hi és
    if (!existeix) {
      for (let i = 0; i < _cat.length; i++) {
        if (producte.categoria == _cat[i].title) {
          _cat[i].productes.push(producte);
          break;
        }
      }
    }
    this.compres.categoriesSubject.next(_cat);
  }

  // ----------------------------------------------
  translateTitle() {
    this.translateService
      .get('toast.addProduct.title')
      .subscribe((traduccion: string) => {
        this.titleToastAdded = traduccion;
      });
  }

  translateBody() {
    this.translateService
      .get('toast.addProduct.body')
      .subscribe((traduccion: string) => {
        this.bodyToastAdded = traduccion;
      });
  }
}
