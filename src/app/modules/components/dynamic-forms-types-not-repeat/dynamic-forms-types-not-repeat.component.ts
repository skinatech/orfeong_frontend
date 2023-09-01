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

import { Component, PipeTransform, Pipe } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'app-dynamic-forms-types-not-repeat',
  templateUrl: './dynamic-forms-types-not-repeat.component.html',
  styleUrls: ['./dynamic-forms-types-not-repeat.component.css']
})
export class DynamicFormsTypesNotRepeatComponent extends FieldArrayType {

  constructor() {
    super();
  }
}
