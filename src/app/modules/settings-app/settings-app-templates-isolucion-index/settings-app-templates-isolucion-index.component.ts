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
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-settings-app-templates-isolucion-index',
  templateUrl: './settings-app-templates-isolucion-index.component.html',
  styleUrls: ['./settings-app-templates-isolucion-index.component.css']
})
export class SettingsAppTemplatesIsolucionIndexComponent implements OnInit {

  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
  ];
  breadcrumbRouteActive = 'Plantillas Isolución';

  youtubeVideoLink: any = 'http://isolucion.aerocivil.gov.co/Isolucion/PaginaLogin.aspx';

  constructor(public sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  ngOnInit() {
  }

  getLink(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.youtubeVideoLink);
  }

}
