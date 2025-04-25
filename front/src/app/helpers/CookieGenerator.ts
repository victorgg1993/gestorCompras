import { Injectable } from '@angular/core';
import { dummySupermercat } from '../models/common.model';
import { Common } from './Common';

@Injectable({
  providedIn: 'root',
})
export class CookieGenerator {
  public superSeleccionat: string = dummySupermercat.name;

  constructor(private common: Common) {
    this.common.superSeleccionat$.subscribe((supermercat: any) => {
      this.superSeleccionat = supermercat.name.toLocaleLowerCase();
    });
  }

  public generar(sup: string, proxCompr: any): string {
    let _retorno = '';

    switch (sup) {
      case 'mercadona':
        _retorno = this.generarCodiMercadona(proxCompr);
        break;

      case 'carrefour':
        _retorno = this.generarCodiCarrefour(proxCompr);
        break;
    }

    return _retorno;
  }

  private generarCodiCarrefour(vistaProximaCompra: any): string {
    let _prods = [];

    for (const elem of vistaProximaCompra) {
      _prods.push({
        id: elem.producte[this.superSeleccionat].id.padEnd(10, '0'), // el tamany sempre son 10 chars. Sino s'ha d'omplir amb 0s
        ud: elem.producte[this.superSeleccionat].unitats,
      });
    }

    let text = `function comprarItem(item) {
  const formData = new URLSearchParams();
  formData.append('redirection_url', '/supermercado/mis-productos');
  formData.append('is_redirection', 'true');

  const url =
    '/cloud-api/carts-api-form/v1/carts/current/items/' +
    item.id +
    '?quantity=' +
    item.ud +
    '&ean=&site=food&cut_id=&added_from=all-products-purchase&offer_id=';

  fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then((data) => {
      console.log('item "' + item.id + '" ok. Status code: '+ data.status + ', ok? ' + data.ok );
    })
    .catch((error) => {
      console.error('Error petició item ' + item + ': ', error);
    });
}

let items = ${JSON.stringify(_prods, null, 2)};

let _i = 0;
let _size = items.length;
let punteroInterval = setInterval(() => {
  console.log('Afegit: ', _i+1, ' de ', _size);
  comprarItem(items[_i]);

  //   -1 perquè el call es fa adalt
  if (_i >= items.length - 1) {
    alert('Tots els productes han estat afegits');
    clearInterval(punteroInterval);
  } else {
    _i++;
  }
}, 2000);`;

    return text;
  }

  private generarCodiMercadona(vistaProximaCompra: any): string {
    let arr = [];

    for (const prod of vistaProximaCompra) {
      arr.push(
        `xc${prod.producte[this.superSeleccionat].id}a${
          prod.producte[this.superSeleccionat].unitats
        }ab`
      );
    }

    return "document.cookie = 'cesta=" + arr.join('') + "';";
  }
}
