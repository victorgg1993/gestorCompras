import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Producte } from 'src/app/models/proxima_compra.model';
import { ConverterService } from 'src/app/services/converter.service';
import { HTTPService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-your-dialog-content',
  templateUrl: './dialogEditarProducteRecurrent.component.html',
  styleUrls: ['./dialogEditarProducteRecurrent.component.scss'],
})
export class dialogEditarProducteRecurrent {
  @ViewChildren('linkarevisar') linkRevisar!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  public errorCategoria = false;
  public indexTabActiva = 0;
  public disableAcceptar = true;
  public categoriaOk = false;
  public tempDiesCompra = Array(12).fill(false);
  private isEdit = false;
  public categoriasTraducidas: any = [];

  public _prod = {
    titol: '',
    pCompra: 0,
    categories: [],
    supermercat: '',
    supermercats: [],
    mesos: [],
    diesCompra: '',
    tags: [] as string[],
    categoria: '',
    producte: {
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
  };

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private converter: ConverterService,
    private http: HTTPService,
    private translateService: TranslateService
  ) {
    this._prod.supermercat = this.config.data.supermercat.toLowerCase();

    this._prod.supermercats = this.config.data.supermercats.map(
      (element: any) => {
        return element.name.toLowerCase();
      }
    );

    if (this.config.data.isEdit) {
      this.isEdit = true;
    }

    this._prod.titol = this.config.data.titol;
    this._prod.producte = this.config.data.producte;
    this._prod.mesos = this.config.data.mesos;

    this._prod.categories = this.config.data.categories;
    this._prod.pCompra = this.config.data.pCompra;
    this._prod.tags = this.config.data.tags;
    this._prod.categoria = this.config.data.categoria;

    this.categoriaOk = !!this._prod.categoria;

    this.tempDiesCompra = this.converter.compresStringToBool(
      this.config.data.diesCompra
    );

    this.indexTabActiva = this._prod.supermercats.findIndex(
      (s: any) => s === this._prod.supermercat
    );

    let index = this._prod.supermercat as keyof typeof this._prod.producte;
    this._prod.producte[index].url = this.config.data.producte[index].url;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const rutas = this._prod.categories;

    this.translateService.get(rutas).subscribe((traducciones) => {
      this.categoriasTraducidas = rutas.map((ruta) => ({
        label: traducciones[ruta],
        value: ruta,
      }));
    });
  }

  public acceptar(): void {
    if (this._prod.categoria) {
      this.errorCategoria = false;

      this._prod.diesCompra = this.converter.compresBoolToString(
        this.tempDiesCompra
      );

      this.tancar({
        acceptar: true,
        data: this._prod,
      });
    }
    //
    else {
      this.errorCategoria = true;
      this.disableAcceptar = true;
    }
  }

  public cancelar(): void {
    this.tancar({
      acceptar: false,
    });
  }

  public tancar(estructura: any): void {
    this.ref.close(estructura);
  }

  // ----------------------------------------------------
  getImatges(supermercat: any) {
    return [
      this._prod.producte[supermercat as keyof typeof this._prod.producte]
        .image,
    ];
  }

  getProductInfo() {
    let index = this._prod.supermercat as keyof typeof this._prod.producte;

    this.http
      .post(environment.URL_GET_PRODUCTE, {
        supermercat: this._prod.supermercat,
        url: this.linkRevisar.toArray()[
          this.getIndexSupermercat(this._prod.supermercat)
        ]?.nativeElement.value,
      })
      .toPromise()
      .then((data: any) => {
        if (data.error == true) {
          console.log('error: ', data);

          if (data.data == 'non-processable') {
            console.log('URL no processable. To-do: demanar dades manualment');
          }
        } else {
          this._prod.producte[index].image = data.data.url;
          this._prod.producte[index].id = data.data.product;

          this._prod.producte[index].url =
            this.linkRevisar.toArray()[
              this.getIndexSupermercat(this._prod.supermercat)
            ]?.nativeElement.value;

          this._prod.tags = [...this._prod.tags, data.data.product as string];
        }
      })
      .catch((err) => {
        console.log('error edit product recurrent: ', err);
      });
  }

  onTabChange(algo: any) {
    this._prod.supermercat = this._prod.supermercats[algo.index];
  }

  getIndexSupermercat(supermercat: any): number {
    let retorno = 0;

    for (let i = 0; i < this._prod.supermercats.length; i++) {
      if (supermercat == this._prod.supermercats[i]) {
        retorno = i;
        break;
      }
    }
    return retorno;
  }

  onCategoriaCanviada(event: any) {
    this.categoriaOk = true;
    this._prod.categoria = event.value;
  }

  isProductLoaded(prod: any): boolean {
    let producte = { ...prod };
    let elems: any[] = [];

    delete producte.producte.categoria;

    Object.values(producte.producte).forEach((product: any, index) => {
      elems.push(!!product.url);
      elems.push(!!product.image);
      elems.push(!!product.id);
    });

    // en modo edició ignorem si li falta la URL o coses així
    if (this.isEdit) {
      return true;
    }

    return !elems.includes(false);
  }

  // --------------------------------------------------------------------- getter / setter
  get unitatsSupermercat(): number {
    const supermercat = this._prod
      .supermercat as keyof typeof this._prod.producte;
    return this._prod.producte[supermercat]?.unitats ?? 0;
  }

  set unitatsSupermercat(value: number) {
    const supermercat = this._prod
      .supermercat as keyof typeof this._prod.producte;
    if (this._prod.producte[supermercat]) {
      this._prod.producte[supermercat].unitats = value;
    }
  }

  // Getter + Setter para ngModel
  get selectedUrl(): string {
    const supermercat = this._prod
      .supermercat as keyof typeof this._prod.producte;
    return this._prod.producte[supermercat]?.url ?? '';
  }

  set selectedUrl(value: string) {
    const supermercat = this._prod
      .supermercat as keyof typeof this._prod.producte;

    if (this._prod.producte[supermercat]) {
      this._prod.producte[supermercat].url = value;
    }
  }
}
