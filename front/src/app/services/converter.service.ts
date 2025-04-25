import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  constructor() {}

  public compresStringToBool(stringDiesCompra: string): boolean[] {
    let retorno = [false];

    for (const el of stringDiesCompra.split('-')) {
      retorno.push(el == '1' ? true : false);
    }

    retorno.shift(); // treiem el primer false perquè s'ha posat per a que no es queixi TS
    return retorno;
  }

  public compresBoolToString(arrBools: boolean[]): string {
    let retorno = [];

    for (const elem of arrBools) {
      retorno.push(elem ? '1' : '0');
    }

    return retorno.join('-');
  }
}
