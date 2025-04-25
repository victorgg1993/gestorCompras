import { Pipe, PipeTransform } from '@angular/core';
import {
  Categoria,
  Producte,
  dummyProducte,
} from '../models/proxima_compra.model';

@Pipe({
  name: 'filterCategories',
})
export class FilterCategoriesPipe implements PipeTransform {
  transform(categories: Categoria[], tags: string): Categoria[] {
    if (tags === '') {
      return categories;
    }

    let retorno: Categoria[] = [
      {
        title: 'dummy',
        categoria: '',
        productes: [dummyProducte],
      },
    ];

    for (const categoria of categories) {
      let x = this.ordenarObjetosPorCoincidencias(
        categoria.productes,
        tags.split(' ')
      );

      if (x.length > 0) {
        retorno.push({
          title: categoria.title,
          categoria: categoria.categoria,
          productes: x,
        });
      }
    }

    retorno.shift(); // ens petem el dummy
    return retorno;
  }

  private ordenarObjetosPorCoincidencias(productes: Producte[], tags: string[]) {
    const objetosConCoincidencias = [];

    for (const producte of productes) {
      let coincidencias = 0;

      for (const tag of tags) {
        // Cambiar la condición a startsWith para coincidencias al principio
        // O mantenerla como includes para coincidencias en cualquier parte
        if (producte.tags.some(t => t.startsWith(tag))) {
          coincidencias++;
        }
      }

      if (coincidencias > 0) {
        objetosConCoincidencias.push({ producte, coincidencias });
      }
    }

    objetosConCoincidencias.sort((a, b) => b.coincidencias - a.coincidencias);
    return objetosConCoincidencias.map((item) => item.producte);
  }

}
