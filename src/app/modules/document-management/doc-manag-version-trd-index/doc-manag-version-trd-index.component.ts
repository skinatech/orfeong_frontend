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
import { FloatingButtonService } from 'src/app/services/floating-button.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import swal from 'sweetalert2';

import { ChangeChildrenService } from '../../../services/change-children.service';

@Component({
  selector: 'app-doc-manag-version-trd-index',
  templateUrl: './doc-manag-version-trd-index.component.html',
  styleUrls: ['./doc-manag-version-trd-index.component.css']
})
export class DocManagVersionTrdIndexComponent implements OnInit {
  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'bookmarks';
  initCardHeaderTitle = 'Listado de versionamientos TRD temporales';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'Version';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/documentManagement/version-trd-index';
  /** Formulario index */
  initBotonViewRoute: string = '/documentManagement/version-trd-view'; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión documental', 'route': '/documentManagement' },
    // { 'name': 'Versionamiento TRD TMP', 'route': '/documentManagement/upload-trd-index' }
  ];
  breadcrumbRouteActive = 'Versionamiento TRD TMP';
  // Data a enviar de las dependencias
  dataIdDepe: any = [];
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'gestionDocumental/trd-tmp/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'configuracionApp/cg-trd/change-status';

  dtTitles: any = [
    { 'title': 'Dependencia', 'data': 'nombreGdTrdDependenciaTmp' },
    { 'title': 'Serie', 'data': 'nombreGdTrdSerieTmp' },
    { 'title': 'Subserie', 'data': 'nombreGdTrdSubserieTmp' },
    { 'title': 'Tipo documental', 'data': 'nombreTipoDocumentalTmp' },
    { 'title': 'Fecha creación', 'data': 'creacionGdTrdTmp' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [
  ];
  menuButtonsSelectOne: any = [
    { icon: 'check_circle_outline', title: 'Aceptar versionamiento', action: 'accept', data: '' },
    { icon: 'remove_red_eye', title: 'Ver versionamiento', action: 'view', data: '' },
    { icon: 'delete_forever', title: 'Eliminar versionamiento', action: 'delete', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'check_circle_outline', title: 'Aceptar versionamiento', action: 'accept', data: '' },
    { icon: 'remove_red_eye', title: 'Ver versionamiento', action: 'view', data: '' },
    { icon: 'delete_forever', title: 'Eliminar versionamiento', action: 'delete', data: '' },
  ];
  // Variables para el formulario de observacion
  showObservation: boolean = false; // Muestra formulario de observacion
  // textFormObserva: string = 'Observación para aceptar versionamiento'; // Titulo del formulario
  dataSendObserva: any; // Data para enviar al formulario

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;

  /** Variables para traer el texto de confirmacion */
  titleMsg: string;
  textMsg: string;
  bntCancelar: string;
  btnConfirmacion: string;
  resSerLenguage: any;

  constructor( private router: Router, private floatingButtonService: FloatingButtonService, private authService: AuthService, public sweetAlertService: SweetAlertService,
    public restService: RestService, public globalAppService: GlobalAppService, public lhs: LocalStorageService, private changeChildrenService: ChangeChildrenService)  { }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {

    // Agrega los id's de dependencia para tratarlos
    let selecDepe = this.eventClickButtonSelectedData;
    if ( selecDepe ) {
      selecDepe.forEach(element => {
        if ( this.dataIdDepe.indexOf(element.idGdTrdDependenciaTmp) < 0 ) {
          this.dataIdDepe.push(element.idGdTrdDependenciaTmp);
        }
      });
    }

    switch (event.action) {
      case 'accept':
        // Muestra el componente de observacion
        this.showObservation = true;
        this.dataSendObserva = this.eventClickButtonSelectedData[0]['data'][0];
      break;
      case 'view':

        localStorage.setItem( environment.dataIdDepe, this.authService.encryptAES(this.dataIdDepe, false) );
        this.router.navigate(['/' + this.initBotonViewRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'delete':
        this.deleteVersioning();
      break;
    }
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
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectMasive;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {

    // dataObserva es la data que retorna el componente de observaciones
    if ( dataObserva.status ) {

      let data = {
        id: this.dataIdDepe,
        observacion: dataObserva.data.observacion
      };

      // Cargando true
      this.sweetAlertService.sweetLoading();

      /** Se reasigna el valor para enviar la estructura correcta al backend */
      this.restService.restPost( this.versionApi + 'gestionDocumental/trd-tmp/accept-version', data, this.authorization)
        .subscribe((res) => {
          this.resSerFormSubmit = res;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerFormSubmit, true, this.redirectionPath ).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              
              this.sweetAlertService.showNotification('success', this.resSerFormSubmit.message);
              // Cargando false
              this.sweetAlertService.sweetClose();
              // Regargar la data
              this.changeChildrenService.changeProcess({ proccess: 'reload' });
            }
          });
        }, (err) => {
          this.resSerFormSubmitErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, true, this.redirectionPath ).then((res) => { });
        }
      );
    }
    this.showObservation = false;
  }

  deleteVersioning() {

    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // console.log( this.resSerLenguage );
      this.titleMsg = this.resSerLenguage.titleMsg;
      this.textMsg = this.resSerLenguage['textMsg'];
      this.bntCancelar = this.resSerLenguage['bntCancelar'];
      this.btnConfirmacion = this.resSerLenguage['btnEliminacion'];

      swal({
        title: this.titleMsg,
        text: this.textMsg,
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: this.bntCancelar,
        confirmButtonText: this.btnConfirmacion,
        cancelButtonClass: 'btn btn-danger',
        confirmButtonClass: 'btn btn-success',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          /** Se asigna el valor del id del usuario que se está actualizando */

          let data = {
            id: this.dataIdDepe
          };
          // Cargando true
          this.sweetAlertService.sweetLoading();

          this.restService.restPut( this.versionApi + 'gestionDocumental/trd-tmp/delete', data, this.authorization)
            .subscribe((res) => {
              this.resSerFormSubmit = res;

              // Evaluar respuesta del servicio
              this.globalAppService.resolveResponse(this.resSerFormSubmit, true, this.redirectionPath ).then((res) => {
                let responseResolveResponse = res;
                if (responseResolveResponse == true) {
                  
                  this.sweetAlertService.showNotification('success', this.resSerFormSubmit.message);
                  // Cargando false
                  this.sweetAlertService.sweetClose();
                  // Regargar la data
                  this.changeChildrenService.changeProcess({ proccess: 'reload' });
                }
              });
            }, (err) => {
              this.resSerFormSubmitErr = err;
              // Evaluar respuesta de error del servicio
              this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, true, this.redirectionPath ).then((res) => { });
            }
          );
        }
      });
    });

  }
}
