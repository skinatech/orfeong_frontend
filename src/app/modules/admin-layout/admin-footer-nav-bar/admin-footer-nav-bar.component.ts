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
  selector: 'app-admin-footer-nav-bar',
  templateUrl: './admin-footer-nav-bar.component.html',
  styleUrls: ['./admin-footer-nav-bar.component.css']
})
export class AdminFooterNavBarComponent implements OnInit {

  test: Date = new Date();

  constructor() { }

  ngOnInit() {
  }

}
