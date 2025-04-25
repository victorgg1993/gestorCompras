import { Subject, Observable } from 'rxjs';
import { Supermercat } from '../models/common.model';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class Common {
  constructor() {
  }

  // aqui es posen els afegits per l'usuari ( aquestes son les úniques que guardarà el servidor )
  public superSeleccionat: Supermercat = { name: 'Carrefour', code: 'crf' };
  public superSeleccionatSubject = new Subject<Supermercat[]>();
  public superSeleccionat$: Observable<Supermercat[]> =
    this.superSeleccionatSubject.asObservable();
}
