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
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';

@Component({
  selector: 'app-settings-app-templates-update',
  templateUrl: './settings-app-templates-update.component.html',
  styleUrls: ['./settings-app-templates-update.component.css']
})
export class SettingsAppTemplatesUpdateComponent implements OnInit {

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
  routeIndexOne = 'configuracionApp/cg-gestion-plantillas/index-one'; // Ruta a buscar el id
  redirectActive: boolean = true; // redirecciona
  redirectionPath = '/setting/templates-index'; // Ruta a redirigir en caso de no poseer permisos para realizar la accion
  showButtonDowload: boolean = false; // Muestra el boton para descargar formato
  validateFile: any = [{ type: 'doc' }, { type: 'docx' }, { type: 'odt' }];

  /** Boton flotante */
  iconMenu: string = 'save';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
    { 'name': 'Gestión de plantillas', 'route': this.redirectionPath },
  ];
  breadcrumbRouteActive = 'Actualizar';

  maxlengthNameFile = 80;
  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  /** Archivos */
  ruoteServiceDocuments: string = environment.apiUrl + environment.versionApiDefault + 'configuracionApp/cg-gestion-plantillas/update';
  constructor(public sweetAlertService: SweetAlertService, public restService: RestService, public lhs: LocalStorageService, private router: Router,
    private route: ActivatedRoute, public globalAppService: GlobalAppService) {
    // Se recibe el id
    this.paramiD = this.route.snapshot.paramMap.get('id');
    // Se pasa al html como componete para que reciba el ID
    this.paramOID = ConvertParamsBase64Helper(this.paramiD);
  }

  ngOnInit() {
  }

}
