import { Pipe, PipeTransform } from '@angular/core';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Pipe({
  name: 'datePrinter',
})
export class DatePrinterPipe implements PipeTransform {
  transform(timestamp: number): string {
    if (timestamp > 0) {
      const date = new Date(timestamp);
      const _dia = this.format2Digits(date.getDate());
      const _mes = this.format2Digits(date.getMonth() + 1);

      return `${_dia}/${_mes}/${date.getFullYear()}`; // els estils del code ho trenquen però va
    }

    return 'dd/mm/aaaa';
  }

  private format2Digits(number: any) {
    return ('0' + number).slice(-2);
  }
}
