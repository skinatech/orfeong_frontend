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

import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivateTranslateService {

  languageEmit: any;
  @Output() activateLanguageChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  async activateTranslate(language) {
    this.languageEmit = language;
    await localStorage.setItem('language', this.languageEmit.data);
    this.activateLanguageChange.emit(this.languageEmit.data);
  }
}
