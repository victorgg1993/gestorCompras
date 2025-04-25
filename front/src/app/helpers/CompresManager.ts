import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  dummyProducte,
  Producte,
  Categoria,
  dummyCategory,
} from '../models/proxima_compra.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CompresManager {
  public automatiques = [];
  public numCompraActual = 0; // fixe
  public pCompra = 0; // es mou amb el següent / anterior

  private NUM_MAX = 24;

  // -------------------------------------------------- mesos
  public mesosSubject = new BehaviorSubject<any[]>([]);
  public mesos$: Observable<any[]> = this.mesosSubject.asObservable();

  // -------------------------------------------------- supermercats
  public supermercatsSubject = new BehaviorSubject<any[]>([]);
  public supermercats$: Observable<any[]> =
    this.supermercatsSubject.asObservable();

  // -------------------------------------------------- categories
  public categoriesSubject = new BehaviorSubject<Categoria[]>([dummyCategory]);
  public categories$: Observable<Categoria[]> =
    this.categoriesSubject.asObservable();

  // -------------------------------------------------- compres automàtiques
  public automatiquesSubject = new BehaviorSubject<Producte[]>([dummyProducte]);
  public automatiques$: Observable<Producte[]> =
    this.automatiquesSubject.asObservable();

  // -------------------------------------------------- compres afegides user ( son les úniques que guarda el server )
  public afegidesUsuari: Producte[] = [];
  public afegidesUsuariSubject = new Subject<Producte[]>();
  public afegidesUsuari$: Observable<Producte[]> =
    this.afegidesUsuariSubject.asObservable();

  // --------------------------------------------------
  constructor() {
    this.automatiques$.subscribe((data: any) => {
      this.automatiques = data;
    });

    this.afegidesUsuari$.subscribe((data: any) => {
      this.afegidesUsuari = data;
    });
  }

  public generarArrayCompraAutomatica(catSub: any, pCompra: any): Producte[] {
    let _arrRet: any = [];
    let _categories = catSub.getValue();

    for (const categoria of _categories) {
      for (const producte of categoria.productes) {
        if (producte.diesCompra.split('-')[pCompra] == '1') {
          _arrRet.push(producte);
        }
      }
    }
    return _arrRet;
  }

  public generarCompresAutomatiques(): void {
    this.automatiquesSubject.next(
      this.generarArrayCompraAutomatica(this.categoriesSubject, this.pCompra)
    );
  }

  public pintarProxima() {
    let vProxCompr = [];

    // si ve del server,  no mostrem les afegides per l'usuari ara
    if (this.pCompra < this.numCompraActual) {
      vProxCompr = [...this.automatiques];
    }
    //
    else {
      vProxCompr = [...this.afegidesUsuari, ...this.automatiques];
    }

    vProxCompr.sort((a: any, b: any) => {
      return a.titol.toLowerCase().localeCompare(b.titol.toLowerCase());
    });

    return vProxCompr;
  }

  public decrementar(): void {
    this.pCompra--;

    if (this.pCompra < 0) {
      this.pCompra = 0;
    }
  }

  public incrementar(): void {
    this.pCompra++;

    if (this.pCompra == this.NUM_MAX) {
      this.pCompra = 0;
    }
  }

  /**
   * El server no guarda tota la info del producte. Amb aquest mètode ho reconstrueix a partir de l'ID
   */
  public reconstruct(compres: any): any {
    let ret: any = [];
    const allProducts = this.getProductsFromCategories(
      this.categoriesSubject.getValue()
    );

    compres.productes.forEach((producto: any) => {
      for (const _prod of allProducts) {
        if (_prod.producte[compres.supermercat].id == producto.id) {
          _prod.producte[compres.supermercat].unitats = producto.unitats;
          ret.push(_prod);
        }
      }
    });

    return ret;
  }

  public getProductsFromCategories(categories: any): any {
    let retorno: any = [];

    for (const categoria of categories) {
      for (const producte of categoria.productes) {
        retorno.push(producte);
      }
    }

    return retorno;
  }
}
