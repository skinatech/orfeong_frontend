/**
 * Que es este módulo o Archivo
 *
 * Descripcion Larga
 *
 * @category     Gestion Documental
 * @package      Orfeo NG 
 * @subpackage   XXXX 
 * @author       Skina Technologies SAS (http://www.skinatech.com)
 * @license      Mixta <https://orfeolibre.org/inicio/licencia-de-orfeo-ng/>
 * @license      LICENSE.md
 * @link         http://www.orfeolibre.org
 * @since        Archivo disponible desde la version 1.0.0
 *
 * @copyright    2023 Skina Technologies SAS
 */

import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChangeChildrenService {

  @Output() reloadComponent: EventEmitter<any> = new EventEmitter<any>();
  @Output() openFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeComponent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  changeProcess(data) {
    if(data.proccess === "reload") {
      this.reloadComponent.emit(data);
    }
  }

  /** Método para emitir la variable que controla la apertura del modal para los filtros */
  onSearchFilter(data) {
    if(data.status === true) {
      this.openFilter.emit(data);
    }
  }

  /** Método utilizado para enviar peticiones a los componentes modal */
  requestToModal(data) {
    if(data.proccess === "close") {
      this.closeComponent.emit(data);
    }
  }
}
