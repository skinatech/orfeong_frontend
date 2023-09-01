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
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from 'src/app/services/activate-translate.service';
import swal from 'sweetalert2';
import { ChangeChildrenService } from 'src/app/services/change-children.service';


@Component({
  selector: 'app-arc-manag-archive-location',
  templateUrl: './arc-manag-archive-location.component.html',
  styleUrls: ['./arc-manag-archive-location.component.css']
})
export class ArcManagArchiveLocationComponent implements OnInit {

  // Autorizacion de localstorage
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID = 0;
  // Nombre del formulario
  textFormView = 'Detalle'; // i18n
  textFormView2 = 'Localizacion'; // i18n
  /** Datos que solicita el ViewList */
  // Ruta a consultar en el ViewList
  reuteLoadView: string = 'gestionDocumental/expedientes/view';
  // Ruta a actualizar en el ViewList
  routeBotonUpdateView: string = '/setting/providers-update/';
  // Icono del ViewList
  initCardHeaderIcon = 'batch_prediction';
  // Ruta a redirigir
  redirectionPath = '/archiveManagement/archive-filing-index';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de archivo', 'route': '/archiveManagement' },
    { 'name': 'Archivar radicado', 'route': this.redirectionPath }
  ];
  breadcrumbRouteActive = 'Detalles';

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderTitle = 'Radicados del expediente';
  routeLoadDataTablesService: string = environment.versionApiDefault + 'gestionArchivo/gestion-archivo/view';
  routeIndIndex: string = '/documentManagement/folder-ind-index/';
  viewColumStatus: false; // Se olculta el campo status
  classMainConten: string = '';
  classContainerFluid: string = '';
  dtTitles: any = [
     { 'title': 'Número radicado', 'data': 'numeroRadicado' },
     { 'title': 'Asunto', 'data': 'asunto' },
     { 'title': 'Tipo documental', 'data': 'tipoDocumental' },
     { 'title': 'Fecha creacion', 'data': 'creacion' },
     { 'title': 'Estado', 'data': 'statusText' },
  ];


  /**  Variables Servicios*/
  dataRows: any;
  dataLocation: any;
  dataSend: any;
  // Version api
  versionApi = environment.versionApiDefault;
  // Variables de servicios
  responseServiceView: any;
  responseServiceViewErr: any;
  // Estado del expediente
  statusExpedient: any;

  constructor(private route: ActivatedRoute, public lhs: LocalStorageService, public sweetAlertService: SweetAlertService, public restService: RestService, private router: Router, public globalAppService: GlobalAppService,) { 
    this.paramiD = this.route.snapshot.paramMap.get('id'); // SE recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
    this.routeBotonUpdateView = this.routeBotonUpdateView + this.paramiD;
    this.dataSend = [
      {id: this.paramOID}
    ];
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      if (this.paramOID != 0) {
        this.getCallUrl(this.authorization);
      }
    });
  }
  
  getCallUrl(authori) {

    let params = {
      id: this.paramOID
    };

    this.restService.restGetParams( this.versionApi + this.reuteLoadView, params, authori).subscribe(
      (res) => {
        this.responseServiceView = res;
        // console.log(this.responseServiceView);
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceView, false, this.redirectionPath).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            if (this.responseServiceView) {
              this.dataRows = this.responseServiceView.data;
              this.dataLocation = this.responseServiceView.dataExpArchivo;
              this.statusExpedient = this.responseServiceView.statusExpedient;
            }
          }
        });
      }, (err) => {
        this.responseServiceViewErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceViewErr, true, this.redirectionPath).then((res) => { });
      }
    );

  }

  /**
   *
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {
   
  }

}
