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
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-doc-manag-dependencies-index',
  templateUrl: './doc-manag-dependencies-index.component.html',
  styleUrls: ['./doc-manag-dependencies-index.component.css']
})
export class DocManagDependenciesIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'dns';
  initCardHeaderTitle = 'Listado de dependencias';
  route: string = 'Dependencies'; // Nombre del módulo donde se esta accediendo al initialList
  /** Formulario index */
  initBotonCreateRoute: string = '/documentManagement/dependencies-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/documentManagement/dependencies-update'; // Ruta editar
  initBotonViewRoute: string = '/documentManagement/dependencies-view'; // Ruta ver
  initBotonVersionViewRoute: string = '/documentManagement/dependencies-version-view'; // Ruta ver TRD activa
  initBotonVersionEditRoute: string = '/documentManagement/dependencies-version-edit'; // Ruta Editar TRD activa
  // Ruta para descargar formato de cuadro documental
  downloadDocumentaryBoxRoute: string = 'gestionDocumental/trd-dependencias/download-classification';
  // Ruta para descargar formato TRD
  downloadTRDRoute: string = 'gestionDocumental/trd/download-trd-file';

  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión documental', 'route': '/documentManagement' },
  ];
  breadcrumbRouteActive = 'Dependencias';

  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'gestionDocumental/trd-dependencias/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'gestionDocumental/trd-dependencias/change-status';

  dtTitles: any = [
    { 'title': 'Código dependencia', 'data': 'codigoGdTrdDependencia' },
    { 'title': 'Nombre dependencia', 'data': 'nombreGdTrdDependencia' },
    { 'title': 'Regional', 'data': 'nombreCgRegional' },
    { 'title': 'Unidad administrativa', 'data': 'codigoGdTrdDepePadre' },
    { 'title': 'Fecha creación', 'data': 'creacionGdTrdDependencia' },
    { 'title': 'TRD cargada', 'data': 'haveTrdActiva' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'picture_in_picture_alt', title: 'Descargar TRDs', action: 'downloadTRD', data: '' }
  ];
  menuButtonsSelectOne: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'edit', title: 'Editar', action: 'edit', data: '' },
    { icon: 'remove_red_eye', title: 'Ver', action: 'view', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
    { icon: 'speaker_notes', title: 'Ver TRD activa', action: 'editTrd', data: '' },
    { icon: 'speaker_notes_off', title: 'Versionamiento TRD', action: 'versionViewTrd', data: '' },
    { icon: 'picture_in_picture', title: 'Descargar clasificación documental', action: 'downloadDocumentaryBox', data: '' },
    { icon: 'picture_in_picture_alt', title: 'Descargar TRD', action: 'downloadTRD', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
    { icon: 'picture_in_picture', title: 'Descargar clasificación documental', action: 'downloadDocumentaryBox', data: '' },
    { icon: 'picture_in_picture_alt', title: 'Descargar TRD', action: 'downloadTRD', data: '' },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  // Version api
  versionApi = environment.versionApiDefault;
  // Autorizacion de localstorage
  authorization: string;
  /** Variables para descarga de archivos */
  resSerDownload: any;
  resSerDownloadErr: any;

  constructor( private router: Router, private floatingButtonService: FloatingButtonService, private authService: AuthService,
    public restService: RestService, public lhs: LocalStorageService, public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService ) { }

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
    // Data a enviar de las dependencias
    let dataIdDepe: any = [];
    if ( selecDepe ) {
      selecDepe.forEach(element => {
        if ( dataIdDepe.indexOf(element.id) < 0 ) {
          dataIdDepe.push(element.id);
        }
      });
    }

    switch (event.action) {
      case 'add':
        this.router.navigate(['/' + this.initBotonCreateRoute]);
      break;
      case 'edit':
        this.router.navigate(['/' + this.initBotonUpdateRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'view':
        this.router.navigate(['/' + this.initBotonViewRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'changeStatus':
        this.floatingButtonService.changeStatus(this.eventClickButtonSelectedData);
      break;
      case 'editTrd':
          this.router.navigate(['/' + this.initBotonVersionEditRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'versionViewTrd':
          this.router.navigate(['/' + this.initBotonVersionViewRoute + '/' + this.eventClickButtonSelectedData[0]['data'][1]]);
      break;
      case 'downloadDocumentaryBox':
        this.downloadFiles( dataIdDepe, this.downloadDocumentaryBoxRoute );
      break;
      case 'downloadTRD':
        if (dataIdDepe.length == 0){
          dataIdDepe.push(0);
        }
        this.downloadFiles( dataIdDepe, this.downloadTRDRoute );
      break;

    }
  }

  /**
   * function that receives dependency ids parameters
   * @params idDepe Id's de las dependencias
   */
  downloadFiles( idDepe, ruta ) {

    let data = {
      id: idDepe
    };

    // Cargando true
    this.sweetAlertService.showNotificationLoading();

    /** Se reasigna el valor para enviar la estructura correcta al backend */
    this.restService.restPost( this.versionApi + ruta, data, this.authorization)
      .subscribe((res) => {
        this.resSerDownload = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerDownload, false ).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Cargando false
            this.sweetAlertService.showNotificationClose();
            // console.log( this.resSerDownload );
            // Envio a descargar
            this.downloadFile( this.resSerDownload.datafile, this.resSerDownload.data );

          }
        });
      }, (err) => {
        this.resSerDownloadErr = err;
        this.sweetAlertService.showNotificationClose();
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerDownloadErr, false ).then((res) => { });
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
    this.sweetAlertService.showNotificationClose();
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
