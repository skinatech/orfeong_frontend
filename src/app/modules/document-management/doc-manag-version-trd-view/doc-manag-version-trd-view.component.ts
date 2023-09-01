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

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doc-manag-version-trd-view',
  templateUrl: './doc-manag-version-trd-view.component.html',
  styleUrls: ['./doc-manag-version-trd-view.component.css']
})
export class DocManagVersionTrdViewComponent implements OnInit {

  // Ruta para consultar
  reuteLoadView: string = 'gestionDocumental/trd-tmp/view';
  // Ruta a redirigir
  redirectionPath = '/documentManagement/version-trd-index';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión documental', 'route': '/documentManagement' },
    { 'name': 'Versionamiento TRD', 'route': this.redirectionPath }
  ];
  breadcrumbRouteActive = 'Detalles';

  constructor() { }

  ngOnInit() {
  }

}