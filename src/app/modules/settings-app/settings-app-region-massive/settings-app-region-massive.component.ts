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

import { Component, OnInit, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings-app-region-massive',
  templateUrl: './settings-app-region-massive.component.html',
  styleUrls: ['./settings-app-region-massive.component.css']
})
export class SettingsAppRegionMassiveComponent implements OnInit {

  public submitFormEmit = new EventEmitter<any>();

  // Nombre del formulario
  textForm = 'Proceso masivo';
  // Icono del formulario
  initCardHeaderIcon = 'add_business';
  // Autentificacion
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  paramName: string;
  paramOName: string;
  filesUploadCount: any;

  /** Las variables para mostrar la alerta informativa  */
  subMenuNotificationStatusTable: boolean = true;

  dataSend: object; // Objeto que se envia al back como parametro requestç
  redirectActive = true; // Redirecciona
  redirectionPath = '/setting/region-index'; // Ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  showButtonDowload: boolean = true;
  validateFile: any = [{ type: 'xls' }, { type: 'xlsx' }];

  /** Boton flotante */
  iconMenu: string = 'save';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
    { 'name': 'Principal y regionales', 'route': this.redirectionPath }
  ];
  breadcrumbRouteActive = 'Proceso masivo';
  /** Archivos */
  ruoteServiceDocuments: string = environment.apiUrl + environment.versionApiDefault + 'configuracionApp/regionales/load-massive-file-regional';
  routeButtonDowload: string = environment.versionApiDefault + 'configuracionApp/regionales/download-format-regional';

  constructor() { }

  ngOnInit() {
  }

}
