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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings-app-templates-create',
  templateUrl: './settings-app-templates-create.component.html',
  styleUrls: ['./settings-app-templates-create.component.css']
})
export class SettingsAppTemplatesCreateComponent implements OnInit {

  // Nombre del formulario
  textForm = 'Cargar plantilla';
  // Icono del formulario
  initCardHeaderIcon = 'widgets';
  // Autentificacion
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  paramName: string;
  paramOName: string;
  filesUploadCount: any;

  statusNameFile = true;
  labelNameFile = 'Nombre plantilla';
  placeHolderNameFile = 'Ingrese nombre de la plantilla';

  /** Las variables para mostrar la alerta informativa  */
  subMenuNotificationStatus: boolean = true;
  subMenuNotificationMessage: string = 'notificationHeaderUploadTRD';

  dataSend: object; // Objeto que se envia al back como parametro request
  redirectActive: boolean = true; // redirecciona
  redirectionPath = '/setting/templates-index'; // Ruta a redirigir en caso de no poseer permisos para realizar la accion
  showButtonDowload: boolean = false; // Muestra el boton para descargar formato
  validateFile: any = [{ type: 'docx' }, { type: 'odt' }];

  /** Boton flotante */
  iconMenu: string = 'save';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
    { 'name': 'Gestión de plantillas', 'route': this.redirectionPath },
  ];
  breadcrumbRouteActive = 'Crear';

  maxlengthNameFile = 80;
  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  /** Archivos */
  ruoteServiceDocuments: string = environment.apiUrl + environment.versionApiDefault + 'configuracionApp/cg-gestion-plantillas/create';
  constructor() { }

  ngOnInit() {
  }

}
