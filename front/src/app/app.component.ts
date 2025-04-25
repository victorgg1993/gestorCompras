import { Component, OnInit } from '@angular/core';
import { HTTPService } from './services/http.service';
import { environment } from '../environments/environment';
import {
  Producte,
  dummyCategory,
  dummyProducte,
} from './models/proxima_compra.model';
import { ConfirmationService } from 'primeng/api';
import { Clipboard } from '@angular/cdk/clipboard';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { dialogEditarProducteRecurrent } from './dialogs/dialogEditarProducteRecurrent/dialogEditarProducteRecurrent.component';
import { ConverterService } from './services/converter.service';
import { DialogManager } from './helpers/DialogManager';
import { Common } from './helpers/Common';
import { CompresManager } from './helpers/CompresManager';
import { CookieGenerator } from './helpers/CookieGenerator';
import { Toast } from './helpers/Toast';
import { ProductManager } from './helpers/ProductManager';
import { dummySupermercat } from './models/common.model';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'Compra online';

  // -------------------------------------------------- helpers
  public dialogManager = new DialogManager();

  // --------------------------------------------------
  public checked = false;
  public dateUltimaCompra = 0; // ve del servidor
  public textInputCategories = '';
  public idProducteAfegir = '';
  public ref: DynamicDialogRef | undefined;
  public titolsCategories: string[] = [];
  public superSeleccionat: string = dummySupermercat.name;
  public supermercats = [];
  public mesos = [];
  public numCompresDone = 0;
  public ultimNumCompra = 0;
  public idiomasSoportados = ['cat', 'es', 'en'];
  public idiomaSeleccionado = 'es';

  public titleToastCookie = '';
  public bodyToastCookie = '';
  public titleToastAdd = '';
  public bodyToastAdd = '';
  public titleToastAddError = '';
  public bodyToastAddError = '';
  public titleRemoveProduct = '';
  public bodyRemoveProduct = '';
  public bodyPurchaseProduct = '';
  public titlePurchaseProduct = '';

  // -------------------------------------------------- aqui estan tots els que es mostraran
  vistaProximaCompra: Producte[] = [dummyProducte];

  constructor(
    public compres: CompresManager,
    public common: Common,

    private http: HTTPService,
    private dialogConfirm: ConfirmationService,
    private clipboard: Clipboard,
    private dialogService: DialogService,
    private converter: ConverterService,
    private toast: Toast,
    private product: ProductManager,
    private cookie: CookieGenerator,
    private translateService: TranslateService,
    private productService: ProductsService
  ) {
    this.translateService.addLangs(this.idiomasSoportados);

    this.evCompresAuto();
    this.evCompresManuals();
    this.evSuperSeleccionat();

    this.httpGetSessio();
    this.httpGetCategories();
  }

  ngOnInit(): void {
    this.setLanguage();

    // Primer cop
    this.getTranslations();

    // Canvis
    this.translateService.onLangChange.subscribe((event: any) => {
      this.getTranslations();
    });
  }

  // -------------------------------------------------- peticions http
  public httpGetSessio(): void {
    this.http.get(environment.URL_SESSIO).subscribe((data: any) => {
      this.compres.numCompraActual = data.numSetmana;
      this.compres.pCompra = data.numSetmana;
      this.ultimNumCompra = data.numSetmana;
      this.dateUltimaCompra = data.dateUltimaCompra;
      this.numCompresDone = data.numCompresDone;
    });
  }

  public httpGetCategories(): void {
    let _categories = [dummyCategory];
    let _supermercats = [];
    let _mesos = [];

    this.http
      .get(environment.URL_CATEGORIES)
      .toPromise()
      .then((data: any) => {
        _categories = data.categories;
        _supermercats = data.supermercats;
        _mesos = data.mesos;

        for (const categoria of _categories) {
          this.titolsCategories.push(categoria.title);
        }

        this.httpGetCompresManuals();

        this.compres.categoriesSubject.next(_categories);
        this.compres.supermercatsSubject.next(_supermercats);
        this.compres.mesosSubject.next(_mesos);
      })
      .catch((err) => {
        console.log('Error url categories: ', err);
      });
  }

  public httpGetCompresManuals(): void {
    this.http
      .get(environment.URL_COMPRES_MANUALS)
      .toPromise()
      .then((data: any) => {
        // compres manuals
        this.compres.afegidesUsuariSubject.next(data);

        // aprofitem i generem les automàtiques. No és lo millor que això vagi aquí
        this.compres.generarCompresAutomatiques();
      })
      .catch((err) => {});
  }

  public getCompra(nCompra: any) {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.URL_COMPRA}?compra=${nCompra}`)
        .toPromise()
        .then((data: any) => {
          if (data.error == false) {
            resolve(data);
          }
          //
          else {
            reject(data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  // -------------------------------------------------- eventos
  public evCompresAuto() {
    this.compres.automatiques$.subscribe((data: any) => {
      // this.automatiques = data;
      let reb = this.compres.pintarProxima();
      this.vistaProximaCompra = reb;
    });
  }

  public evCompresManuals() {
    this.compres.afegidesUsuari$.subscribe((data: any) => {
      let x = [];

      for (const elem of data) {
        x.push({
          ...elem,
          afegitUser: true,
        });
      }

      this.compres.mesos$.subscribe((_mesos: any) => {
        this.mesos = _mesos;
      });

      this.compres.supermercats$.subscribe((supers: any) => {
        this.supermercats = supers;
      });

      this.compres.afegidesUsuari = x;
      let reb = this.compres.pintarProxima();
      this.vistaProximaCompra = reb;
    });
  }

  public evSuperSeleccionat() {
    this.common.superSeleccionat$.subscribe((supermercat: any) => {
      this.superSeleccionat = supermercat.name.toLocaleLowerCase();
    });
  }

  // -------------------------------------------------- Compra
  public compraSeguent(): void {
    this.compres.incrementar();

    if (this.compres.pCompra < this.compres.numCompraActual) {
      this.getCompra(this.compres.pCompra)
        .then((data: any) => {
          this.compres.automatiquesSubject.next(
            this.compres.reconstruct(data.data)
          );
        })
        .catch((err) => {
          console.log('reject server compraSeguent(): ', err);
        });
    }
    //
    else {
      this.compres.generarCompresAutomatiques();
    }
  }

  // to-do: has de demanar el llistat al server ja que no pots sapiguer les manuals
  public compraAnterior(): void {
    this.compres.decrementar();

    this.getCompra(this.compres.pCompra)
      .then((data: any) => {
        this.compres.automatiquesSubject.next(
          this.compres.reconstruct(data.data.compra)
        );
      })
      .catch((err) => {
        console.log('reject server compraAnterior(): ', err);
        this.compres.pCompra++;
      });
  }

  public ferCompra() {
    this.dialogConfirm.confirm({
      header: this.titlePurchaseProduct,
      message: this.bodyPurchaseProduct,
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.acceptFerCompra(),
      reject: () => {},
    });
  }

  public acceptFerCompra(): void {
    let _data = {
      nCompra: this.compres.pCompra,
      supermercat: this.superSeleccionat,
      compra: this.vistaProximaCompra,
    };

    this.http
      .post(environment.URL_COMPRA, _data)
      .toPromise()
      .then((data: any) => {
        if (data.error == true) {
          this.toast.show(this.titleToastAddError, data.data, 'error');
        }
        //
        else {
          this.generarCookie(this.superSeleccionat);

          this.dateUltimaCompra = data.data.date;
          this.compres.pCompra = data.data.nCompra;

          this.compres.generarCompresAutomatiques();
          this.compres.afegidesUsuari = []; // esborrar compres manuals de la ram ( en un futur es podria fer una petició get(?) )
          let reb = this.compres.pintarProxima();
          this.vistaProximaCompra = reb;
        }
      })
      .catch((err) => {
        this.toast.show(
          this.titleToastAddError,
          'Error al fer la compra, revisa la consola',
          'error'
        );
        console.log('Error al fer la compra:', err);
      });
  }

  // -------------------------------------------------- Producte
  public afegirProducte(): void {
    this.ref = this.dialogService.open(dialogEditarProducteRecurrent, {
      header: 'Afegir producte',
      data: {
        pCompra: this.compres.pCompra,
        categories: this.titolsCategories,
        supermercat: this.superSeleccionat,
        supermercats: this.supermercats,
        mesos: this.mesos,
        diesCompra: '0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0',
        tags: [],
        producte: {
          categoria: '',
          mercadona: {
            id: '',
            image: '',
            unitats: 0,
            url: '',
          },
          carrefour: {
            id: '',
            image: '',
            unitats: 0,
            url: '',
          },
        },
      },
    });

    this.ref.onClose.subscribe((ret: any) => {
      // coses que no volem enviar:
      try {
        if (ret.data) {
          delete ret.data.categories;
          delete ret.data.mesos;
          delete ret.data.supermercats;
          delete ret.data.supermercat;
          delete ret.data.pCompra;

          if (ret.acceptar) {
            this.http
              .put(environment.URL_PRODUCTE, ret.data)
              .toPromise()
              .then((res: any) => {
                if (res.error == false) {
                } else {
                  console.error("error a l'afegir producte");
                  // if (_toastError) {
                  this.toast.show(
                    this.titleToastAddError,
                    this.bodyToastAddError,
                    'error'
                  );
                  // }
                }
              });
          }
        }
      } catch (error) {}
    });
  }

  /**
   * Afegir un producte en compres manuals
   * @param producte
   */
  public insertarProducte(producte: any): void {
    producte.incrementDecrement = false;

    producte.supermercat = this.superSeleccionat; // li cal per a sapiguer quines unitats incrementar
    this.product.patchProducte(producte);
  }

  /**
   * Incrementa / decrementa el número d'un proucte de la columna central
   * @param item
   */
  public incrementDecrementProducte(item: any): void {
    item.incrementDecrement = true;
    this.product.incrementDecrement(item, this.supermercats);
  }

  public getTotal(): number {
    let retorno = 0;

    for (const el of this.vistaProximaCompra as any) {
      retorno += el.producte[this.superSeleccionat].unitats;
    }

    return retorno;
  }

  public editarProducte(
    producte: any,
    _toastOk?: any,
    _toastError?: any
  ): void {
    this.ref = this.dialogService.open(dialogEditarProducteRecurrent, {
      data: {
        ...producte,
        pCompra: this.compres.pCompra,
        categories: this.titolsCategories,
        categoria: this.product.getCategoria(
          producte.producte[this.superSeleccionat].id
        ),
        supermercat: this.superSeleccionat,
        supermercats: this.supermercats,
        mesos: this.mesos,
        isEdit: true,
        titol: producte.titol,
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      try {
        if (data.acceptar) {
          // coses que no es volen enviar al back
          delete data.data.categories;
          delete data.data.pCompra;
          delete data.data.supermercat;
          delete data.data.supermercats;
          delete data.data.mesos;

          this.http
            .put(environment.URL_PRODUCTE, data.data)
            .toPromise()
            .then((res: any) => {
              if (res.error == false) {
                // this.product.actualitzar(data.data);
                this.compres.generarCompresAutomatiques();
                this.httpGetCategories();

                this.toast.show(
                  this.titleToastAdd,
                  this.bodyToastAdd,
                  'success'
                );
              }
              //
              else {
                this.toast.show(
                  this.titleToastAddError,
                  this.bodyToastAddError,
                  'error'
                );
              }
            });
        }
      } catch (error) {}
    });
  }

  public eliminarProducte(producte: any): void {
    this.dialogConfirm.confirm({
      header: this.titleRemoveProduct,
      message: this.bodyRemoveProduct,
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.acceptEliminarProducte(producte),
      reject: () => {},
    });
  }

  public acceptEliminarProducte(producte: any): void {
    this.http
      .delete(environment.URL_COMPRES_MANUALS, {
        id: producte.producte[this.superSeleccionat].id,
        supermercat: this.superSeleccionat,
      })
      .toPromise()
      .then((data) => {
        this.compres.afegidesUsuariSubject.next(data);
      })
      .catch((err) => {
        console.log('Error acceptFunc(): ', err);
      });
  }

  // -------------------------------------------------- idioma
  setLanguage() {
    const lang =
      localStorage.getItem('lang') || this.translateService.getDefaultLang();
    this.translateService.use(lang);
    this.idiomaSeleccionado = lang;
  }

  cambiarIdioma(codigo: any) {
    this.translateService.use(codigo.value);
    this.idiomaSeleccionado = codigo.value;
    localStorage.setItem('lang', codigo.value);
  }

  getTranslations() {
    this.translateTitleCookie();
    this.translateBodyCookie();
    this.translateTitleAdd();
    this.translateBodyAdd();
    this.translateTitleAddError();
    this.translateBodyAddError();
    this.translateTitleRemove();
    this.translateBodyRemove();
    this.translatePurchaseTitle();
    this.translatePurchaseBody();
  }

  translateTitleCookie() {
    this.translateService
      .get('toast.cookie.title')
      .subscribe((traduccion: string) => {
        this.titleToastCookie = traduccion;
      });
  }

  translateBodyCookie() {
    this.translateService
      .get('toast.cookie.body')
      .subscribe((traduccion: string) => {
        this.bodyToastCookie = traduccion;
      });
  }

  translateTitleAdd() {
    this.translateService
      .get('toast.addProduct.ok.title')
      .subscribe((traduccion: string) => {
        this.titleToastAdd = traduccion;
      });
  }

  translateBodyAdd() {
    this.translateService
      .get('toast.addProduct.ok.body')
      .subscribe((traduccion: string) => {
        this.bodyToastAdd = traduccion;
      });
  }

  translateTitleAddError() {
    this.translateService
      .get('toast.addProduct.error.title')
      .subscribe((traduccion: string) => {
        this.titleToastAddError = traduccion;
      });
  }

  translateBodyAddError() {
    this.translateService
      .get('toast.addProduct.error.body')
      .subscribe((traduccion: string) => {
        this.bodyToastAddError = traduccion;
      });
  }

  translateTitleRemove() {
    this.translateService
      .get('toast.remove.title')
      .subscribe((traduccion: string) => {
        this.titleRemoveProduct = traduccion;
      });
  }

  translateBodyRemove() {
    this.translateService
      .get('toast.remove.body')
      .subscribe((traduccion: string) => {
        this.bodyRemoveProduct = traduccion;
      });
  }

  translatePurchaseTitle() {
    this.translateService
      .get('toast.purchasePopup.title')
      .subscribe((traduccion: string) => {
        this.titlePurchaseProduct = traduccion;
      });
  }

  translatePurchaseBody() {
    this.translateService
      .get('toast.purchasePopup.body')
      .subscribe((traduccion: string) => {
        this.bodyPurchaseProduct = traduccion;
      });
  }

  // --------------------------------------------------
  public onSupermercatCanviat(event: any) {
    this.common.superSeleccionatSubject.next(event);
  }

  public generarCookie(supermercat: string): void {
    this.toast.show(this.titleToastCookie, this.bodyToastCookie);

    this.clipboard.copy(
      this.cookie.generar(supermercat, this.vistaProximaCompra)
    );
  }

  getSupermercatImage(producte: any): string {
    return (
      producte.producte[this.superSeleccionat as keyof typeof producte.producte]
        ?.image || ''
    );
  }
}
