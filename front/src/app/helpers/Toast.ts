import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})

export class Toast {
  constructor(private messageService: MessageService) {}

  public show(
    titol: string,
    msg: string,
    _severity: 'success' | 'info' | 'warn' | 'error' = 'success'
  ) {
    this.messageService.add({
      severity: _severity,
      summary: titol,
      detail: msg,
    });
  }
}
