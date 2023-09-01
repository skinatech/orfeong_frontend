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
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-settings-app-templates-index',
  templateUrl: './settings-app-templates-index.component.html',
  styleUrls: ['./settings-app-templates-index.component.css']
})
export class SettingsAppTemplatesIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'widgets';
  initCardHeaderTitle = 'Listado de plantillas';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'Templates';
  /** Formulario index */
  initBotonCreateRoute: string = '/setting/templates-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/setting/templates-update'; // Ruta editar

  // Version api
  versionApi = environment.versionApiDefault;
  // Autentificacion
  authorization: string;

  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
  ];
  breadcrumbRouteActive = 'Gestión de plantillas';

  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'configuracionApp/cg-gestion-plantillas/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'configuracionApp/cg-gestion-plantillas/change-status';

  dtTitles: any = [
    { 'title': 'Plantilla', 'data': 'nombreCgPlantilla' },
    { 'title': 'Extensión', 'data': 'extencionCgPlantilla' },
    { 'title': 'Fecha creación', 'data': 'createdate' },
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
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];

  menuButtonsSelectOneActive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'edit', title: 'Editar', action: 'edit', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
    { icon: 'cloud_download', title: 'Descargar plantilla', action: 'downloadTemplate', data: '' },
  ];

  menuButtonsSelectMasive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
    { icon: 'cloud_download', title: 'Descargar plantilla', action: 'downloadTemplate', data: '' },
  ];

  menuButtonsSelectMasiveInactive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];

  showButtonFiltrer: boolean = false;
  resSerDownload: any;
  resSerDownloadErr: any;

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  constructor( private router: Router, private floatingButtonService: FloatingButtonService, public restService: RestService, public globalAppService: GlobalAppService,
    public sweetAlertService: SweetAlertService, public lhs: LocalStorageService ) { }

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
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {
    switch (event.action) {
      case 'add':
        this.router.navigate(['/' + this.initBotonCreateRoute]);
      break;
      case 'edit':
        this.router.navigate(['/' + this.initBotonUpdateRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'changeStatus':
        this.floatingButtonService.changeStatus(this.eventClickButtonSelectedData);
      break;
      case 'downloadTemplate':
        this.downLoadTemplate(this.eventClickButtonSelectedData);
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

        event.forEach(element => {
            if(element.status == 10){
              this.menuButtons = this.menuButtonsSelectOneActive;
            }else{
              this.menuButtons = this.menuButtonsSelectOne;
            }
        });

        this.eventClickButtonSelectedData = event;

      } else { // Varios registros seleccionados
        let statusActive = true;
        event.forEach(element => {
          if( element.status == 0){
            statusActive = false;
          }
        });
        // Valida si algun registro esta inactivo y envia botones como null
        if( !statusActive){
          this.menuButtons = this.menuButtonsSelectMasiveInactive;
        }else{
          this.menuButtons = this.menuButtonsSelectMasive;
        }
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /**
   * downLoadTemplate
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario
   */
  downLoadTemplate(data) {

    let dataSend = {
      ButtonSelectedData: data
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.versionApi + 'configuracionApp/cg-gestion-plantillas/descargar-plantillas', dataSend, this.authorization).subscribe((res) => {
        this.resSerDownload = res;
        //console.log(this.resSerDownload);

        this.globalAppService.resolveResponse(this.resSerDownload, false).then((res) => {
          const responseResolve = res;
          if (responseResolve == true) {
            // this.sweetAlertService.showNotification( 'success', this.resSerDownload['message'] );
            let dataFileArray = this.resSerDownload.datafile;
            dataFileArray.forEach( dataSer => {
              if ( dataSer.datafile ) {
                this.downloadFile(dataSer.datafile, dataSer.nameFile);
              }
            });
            if(typeof this.resSerDownload.notifications != 'undefined') {
              let notificationArray = this.resSerDownload.notifications;
              notificationArray.forEach( datanotificacion => {
                this.sweetAlertService.showNotification(datanotificacion['type'], datanotificacion['message'] );
              });
            }
          }
          // Cargando false
          this.sweetAlertService.sweetClose();
        });
      }, (err) => {
        this.resSerDownloadErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerDownloadErr).then((res) => { });
      }
    );

  }

  /**
   * Descarga el archivo que llega en base64
   * @param file el  en base 64
   * @param nameDownload nombre del archivo
   */
  downloadFile(file, nameDownload) {

    // console.log(file);
    const linkSource = `data:application/pdf;base64,${file}`;
    const downloadLink = document.createElement('a');

    downloadLink.href = linkSource;
    downloadLink.download = nameDownload;
    downloadLink.click();
  }

}
