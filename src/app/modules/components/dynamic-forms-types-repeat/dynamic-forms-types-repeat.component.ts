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

import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'app-dynamic-forms-types-repeat',
  templateUrl: './dynamic-forms-types-repeat.component.html',
  styleUrls: ['./dynamic-forms-types-repeat.component.css']
})
export class DynamicFormsTypesRepeatComponent extends FieldArrayType {
  constructor() {
    super();
  }
}
