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

import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

export interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-md-table',
  templateUrl: './md-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdTableComponent {
  @Input()
  public title: string;

  @Input()
  public subtitle: string;

  @Input()
  public cardClass: string;

  @Input()
  public data: TableData;

  constructor() { }
}
