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
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-audit-log-view',
  templateUrl: './audit-log-view.component.html',
  styleUrls: ['./audit-log-view.component.css']
})
export class AuditLogViewComponent implements OnInit {

  // Autorizacion de localstorage
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  // Nombre del formulario
  textFormView = 'Detalle del registro'; // i18n
  /** Datos que solicita el ViewList */
  // Ruta a consultar en el ViewList
  reuteLoadView: string = 'configuracionApp/log/view';
  // Icono del ViewList
  initCardHeaderIcon = 'timer';
  // Ruta a redirigir
  redirectionPath = '/audit/log-audit-index';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Auditoría', 'route': '/audit' },
    { 'name': 'Registro de auditoría', 'route': this.redirectionPath }
  ];
  breadcrumbRouteActive = 'Detalles';

  constructor(private route: ActivatedRoute) {
    this.paramiD = this.route.snapshot.paramMap.get('id'); // SE recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
  }


  ngOnInit() {
  }

}
