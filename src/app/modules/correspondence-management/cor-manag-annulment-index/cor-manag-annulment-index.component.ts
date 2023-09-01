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
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { FloatingButtonService } from 'src/app/services/floating-button.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cor-manag-annulment-index',
  templateUrl: './cor-manag-annulment-index.component.html',
  styleUrls: ['./cor-manag-annulment-index.component.css']
})
export class CorManagAnnulmentIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'pan_tool';
  initCardHeaderTitle = 'Listado de radicados';
  route: string = 'annulment'; // Nombre del módulo donde se esta accediendo al initialList
  // Ruta a redirigir
  redirectionPath = '/correspondenceManagement/annulment-index';
  /** Formulario index */
  initBotonCreateRoute: string = '/filing/filing-create'; // Ruta del botón crear

  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión correspondencia', 'route': '/correspondenceManagement' },
  ];
  breadcrumbRouteActive = 'Anulación';

  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'radicacion/anulacion/index';

  dtTitles: any = [
    { 'title': 'Tipo radicado', 'data': 'tipoRadicado' },
    { 'title': 'Número radicado', 'data': 'numeroRadicado' },
    { 'title': 'Fecha anulación', 'data': 'fechaAnulacion' },
    { 'title': 'Observación', 'data': 'observacionAnulacion' },
    { 'title': 'Usuario', 'data': 'usuario' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [
    { icon: 'check_circle_outline', title: 'Aprobar solicitud', action: 'checkRequest', data: '' },
    { icon: 'cancel', title: 'Rechazar solicitud', action: 'cancelRequest', data: '' },
  ];
  menuButtonsSelectOneAceptacion: any = [
    { icon: 'cloud_download', title: 'Descargar pdf aceptación de anulación', action: 'downloadAnulation', data: '' },
  ];
  menuButtonsSelectMasive: any = [];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  // Version api
  versionApi = environment.versionApiDefault;
  // Autorizacion de localstorage
  authorization: string;

  // Variables para dialogo de observaciones
  statusModalMain: boolean = false;  // Muestra el componente de anexos main
  showAgenda: boolean = false;  // Muestra el input de fecha
  showReasignacion: boolean = false;  // Muestra los inputs de reasignacion
  textFormObservaHeader: string; // Titulo del botón inteligente tambien titulo del dialog observacion
  // Data a enviar de los usuariosal componente de observaciones
  dataObserva: any = [];
  operationDialogObserva: string; // operacion que se utiliza para las trasferencias
  validateStatus: any; // El primer estado del registro seleccionado

  /** Variables respuesta Servicios */
  resServices: any;
  resErrServices: any;
  resSerLenguage: any;
  /**
   * Configuración para el proceso change status de anulacion
   */
  routeChangeStatus: string;

  constructor(private router: Router, public restService: RestService, public sweetAlertService: SweetAlertService, public lhs: LocalStorageService, public globalAppService: GlobalAppService,
    private floatingButtonService: FloatingButtonService ) { }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  /**
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {

    // Agrega los id's de los radicados para tratarlos
    let selecRadi = this.eventClickButtonSelectedData;

    if ( selecRadi ) {
      selecRadi.forEach(element => {

      });
    }

    switch (event.action) {
      case 'checkRequest':
        this.confirmationCheckRequest();
        this.showAgenda = false;
        this.showReasignacion = false;
        this.routeChangeStatus = this.versionApi + 'radicacion/anulacion/acepta-anulacion';
        this.textFormObservaHeader = event.title;
        this.operationDialogObserva = event.action;
      break;
      case 'cancelRequest':
        this.showAgenda = false;
        this.showReasignacion = false;
        this.routeChangeStatus = this.versionApi + 'radicacion/anulacion/rechazo-anulacion';
        this.textFormObservaHeader = event.title;
        this.operationDialogObserva = event.action;
        this.statusModalMain = true;
      break;
      case 'downloadAnulation':
        this.transactionDownloadAnulation( this.eventClickButtonSelectedData[0].id );
      break;
    }
  }

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {
    this.validateStatus = '';
    // dataObserva es la data que retorna el componente de observaciones
    if ( dataObserva.status ) {
      // this.transactionReasing(dataObserva);
      switch ( this.operationDialogObserva ) {
        case 'checkRequest':
            // this.transactionCheckRequest(dataObserva);
            this.floatingButtonService.changeStatusAnulacion(this.eventClickButtonSelectedData, dataObserva.data, this.operationDialogObserva );
            this.validateStatusAnulacion();
        break;
        case 'cancelRequest':
          // this.transactionCancelRequest(dataObserva);
          this.floatingButtonService.changeStatusAnulacion(this.eventClickButtonSelectedData, dataObserva.data, this.operationDialogObserva );
        break;

      }
    }
    this.statusModalMain = false;

  }

  confirmationCheckRequest() {

    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // console.log( this.resSerLenguage );
      let titleMsg = this.resSerLenguage.titleMsg;
      let  textMsg = this.resSerLenguage['textMsgConfirmAnnulment'];
      let  bntCancelar = this.resSerLenguage['bntCancelar'];
      let  btnConfirmacion = this.resSerLenguage['btnConfirmacion'];

      swal({
        title: titleMsg,
        text: textMsg,
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: bntCancelar,
        confirmButtonText: btnConfirmacion,
        cancelButtonClass: 'btn btn-danger',
        confirmButtonClass: 'btn btn-success',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          // consume servicio para aceptar anulacion
          // this.transactionCheckRequest();
          this.statusModalMain = true;
        }
      });
    });
  }

  transactionCheckRequest(dataObserva) {

    let data = {
      data: dataObserva.data,
      ButtonSelectedData: this.eventClickButtonSelectedData
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPut(this.versionApi + 'radicacion/anulacion/acepta-anulacion', data, this.authorization).subscribe((res) => {

        this.resServices = res;
        this.globalAppService.resolveResponse(this.resServices, false).then((res) => {
          let responseResolveResponse = res;
          // console.log( responseResolveResponse );

          if (responseResolveResponse == true) {
            // if (this.resServices.dataFile) {
            this.downloadFile(this.resServices.dataFile, this.resServices.data);
            // }
            this.sweetAlertService.showNotification( 'success', this.resServices['message'] );
          }
          // Cargando false
          this.sweetAlertService.sweetClose();
        });

        }, (err) => {
          this.resErrServices = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
        }
    );

  }

  transactionCancelRequest(dataObserva) {

    let data = {
      data: dataObserva.data,
      ButtonSelectedData: this.eventClickButtonSelectedData
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPut(this.versionApi + 'radicacion/anulacion/rechazo-anulacion', data, this.authorization).subscribe((res) => {

        this.resServices = res;

        this.globalAppService.resolveResponse(this.resServices, false).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resServices['message'] );
          }
          // Cargando false
          this.sweetAlertService.sweetClose();
        });

        }, (err) => {
          this.resErrServices = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
        }
    );

  }

  transactionDownloadAnulation(id) {

    let params = {
      id: id
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restGetParams(this.versionApi + 'radicacion/anulacion/download-base64', params, this.authorization).subscribe(
      (res) => {

        this.resServices = res;
        this.globalAppService.resolveResponse(this.resServices, false).then((res) => {
          let responseResolveResponse = res;

          if (responseResolveResponse == true) {
            this.downloadFile(this.resServices.datafile, this.resServices.fileName);
            this.sweetAlertService.showNotification( 'success', this.resServices['message'] );
            // Cargando false
            this.sweetAlertService.sweetClose();
          }
        });

      }, (err) => {
        this.resErrServices = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
      }
    );

  }

  /**
   * Descarga el archivo que llega en base64
   * @param file el  en base 64
   * @param nameDownload nombre del archivo
   */
  downloadFile(file, nameDownload) {

    const linkSource = `data:application/octet-stream;base64,${file}`;
    const downloadLink = document.createElement('a');

    downloadLink.href = linkSource;
    downloadLink.download = nameDownload;
    downloadLink.click();
    // Cierra el loading
    // this.sweetAlertService.showNotificationClose();
  }

  /**
   *
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {

    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        // Asigna el primer estado
        this.validateStatus = this.eventClickButtonSelectedData[0].status;
        this.validateStatusAnulacion();
      } else { // Varios registros seleccionados
        this.validateStatusAnulacion();
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  validateStatusAnulacion() {

    this.eventClickButtonSelectedData.forEach(element => {

      if ( element.status == this.validateStatus ) {
        if ( this.validateStatus == environment.estadoAnulacion.Solicitud ) {
          this.menuButtons =  this.menuButtonsSelectOne;
        } else if ( this.validateStatus == environment.estadoAnulacion.Aceptacion ) {
          if (this.eventClickButtonSelectedData.length == 1) {
            this.menuButtons =  this.menuButtonsSelectOneAceptacion;
          } else {
            this.menuButtons = this.menuButtonsSelectNull;
          }
        } else {
          this.menuButtons = this.menuButtonsSelectNull;
        }

      } else {
        this.menuButtons = this.menuButtonsSelectNull;
      }
    });
  }

}
