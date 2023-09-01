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
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { GlobalAppService } from 'src/app/services/global-app.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-settings-app-times-response-index',
  templateUrl: './settings-app-times-response-index.component.html',
  styleUrls: ['./settings-app-times-response-index.component.css']
})
export class SettingsAppTimesResponseIndexComponent implements OnInit {


  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'query_builder';
  initCardHeaderTitle = 'Listado de horario laboral';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'Setting';
  /** Formulario index */
  initBotonCreateRoute: string = '/setting/times-response-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/setting/times-response-update'; // Ruta editar
  initBotonViewRoute: string = '/setting/times-response-view'; // Ruta ver

  //initBtnVersioningIndexteRoute: string = '/setting/version-trd-index'; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
  ];
  breadcrumbRouteActive = 'Horario laboral';

  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'configuracionApp/cg-tiempos-respuesta/index'; // CgTiemposRespuestaController
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'configuracionApp/cg-tiempos-respuesta/change-status';

  dtTitles: any = [
    { 'title': 'Día Inicio', 'data': 'diaInicio' },
    { 'title': 'Día Fin', 'data': 'diaFin' },
    { 'title': 'Horario Inicio', 'data': 'fechaInicio' },
    { 'title': 'Horario Finalizacion', 'data': 'fechaFin' },
    { 'title': 'Fecha de creación', 'data': 'createdate' }
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
  ];
  menuButtonsSelectOne: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'edit', title: 'Editar', action: 'edit', data: '' },
    { icon: 'remove_red_eye', title: 'Ver', action: 'view', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
  ];

  showButtonFiltrer: boolean = true;

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  
  authorization:any;
  // Respuestas Servicios
  responseServiceDelete : any;
  responseServiceDeleteErr : any;

  /** Variables para traer el texto de confirmacion */
  titleMsg: string;
  textMsg: string;
  bntCancelar: string;
  btnConfirmacion: string;
  resSerLenguage: any;

  // Acciones 
  dataStatusRadicados: any = [];
  operacion: any;

  constructor( public sweetAlertService: SweetAlertService, public restService: RestService, public globalAppService: GlobalAppService,  private router: Router, private floatingButtonService: FloatingButtonService, public lhs: LocalStorageService ) { }

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

    this.operacion = event.action;
    this.dataStatusRadicados = [];
    // Agrega los id's de los radicados para tratarlos
    let selecRadi = this.eventClickButtonSelectedData;
    if (selecRadi) {
      selecRadi.forEach(element => {
          this.dataStatusRadicados.push(element.status);
      });
    }

    switch (event.action) {
      case 'add':
        this.router.navigate(['/' + this.initBotonCreateRoute]);
      break;
      case 'edit':
        this.router.navigate(['/' + this.initBotonUpdateRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'delete':
        this.continueTransaccion('textMsgDelete');
      break;
      case 'view':
        this.router.navigate(['/' + this.initBotonViewRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'changeStatus':

          // si encuentra estados inactivos lanza el mensaje de confirmacion
          if(this.dataStatusRadicados.indexOf(0) == 0){
            this.continueTransaccion('textMsgChangeStatus');
          }else{
            this.floatingButtonService.changeStatus(this.eventClickButtonSelectedData);
          }

      break;
    }
  }

  /**
    * Mensaje de confirmación para continuar con la trasacciones
    */
   continueTransaccion(textMsgChangeStatus:string) {
  
    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {
  
      this.resSerLenguage = res;
  
      this.titleMsg = this.resSerLenguage.titleMsg
      this.textMsg = this.resSerLenguage[textMsgChangeStatus];
      this.bntCancelar = this.resSerLenguage['bntCancelarSendMail'];
      this.btnConfirmacion = this.resSerLenguage['btnConfirmar'];
  
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
  
            switch(this.operacion){
  
              case 'delete':
                  this.deleteTimeResponse(this.eventClickButtonSelectedData[0]['id']);
              break;
              case 'changeStatus':
                this.floatingButtonService.changeStatus(this.eventClickButtonSelectedData);
              break;
  
            }
  
        }
       
      });
  
    });
  
  }

  deleteTimeResponse(id){

    let data:any = {
      id: id
    };

    /**
     * Cargando true
     */
    this.sweetAlertService.sweetLoading();
    let versionApi = environment.versionApiDefault;

    this.restService.restPost(versionApi + 'configuracionApp/cg-tiempos-respuesta/delete', data, this.authorization)
      .subscribe((res) => {
        this.responseServiceDelete = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceDelete, false).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Guarda en el local storage el mensaje
            localStorage.setItem('setFlashText', this.responseServiceDelete.message);
            // Cargando false
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.responseServiceDeleteErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceDeleteErr, false).then((res) => { });
      }
    );

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


}
