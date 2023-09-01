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
  selector: 'app-doc-manag-upload-trd',
  templateUrl: './doc-manag-upload-trd.component.html',
  styleUrls: ['./doc-manag-upload-trd.component.css']
})
export class DocManagUploadTrdComponent implements OnInit {

  // Nombre del formulario
  textForm = 'Carga TRD';
  // Icono del formulario
  initCardHeaderIcon = 'settings_applications';
  // Autentificacion
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  paramName: string;
  paramOName: string;
  filesUploadCount: any;

  /** Las variables para mostrar la alerta informativa  */
  subMenuNotificationStatus: boolean = true;
  subMenuNotificationMessage: string = 'notificationHeaderUploadTRD';

  dataSend: object; // Objeto que se envia al back como parametro request
  redirectActive = true; // redirecciona
  redirectionPath = '/documentManagement/dependencies-index'; // Ruta a redirigir en caso de no poseer permisos para realizar la accion
  showButtonDowload: boolean = false; // Muestra el boton para descargar formato
  validateFile: any = [{ type: 'xls' }, { type: 'xlsx' }];

  /** Boton flotante */
  iconMenu: string = 'save';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión documental', 'route': '/documentManagement' },
  ];
  breadcrumbRouteActive = 'Carga TRD';
  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  /** Archivos */
  ruoteServiceDocuments: string = environment.apiUrl + environment.versionApiDefault + 'gestionDocumental/trd/load-trd-file';

  timerShowNotification: number = 9000; // Tiempo de visualización de la notificacion en pantalla

  constructor() { }

  ngOnInit() {
  }

}
