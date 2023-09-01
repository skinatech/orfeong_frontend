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

@Component({
  selector: 'app-query-folder-adi-view',
  templateUrl: './query-folder-adi-view.component.html',
  styleUrls: ['./query-folder-adi-view.component.css']
})
export class QueryFolderAdiViewComponent implements OnInit {

  // Autorizacion de localstorage
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  // Nombre del formulario
  textFormView = 'Detalle del expediente'; // i18n
  /** Datos que solicita el ViewList */
  // Ruta a consultar en el ViewList
  reuteLoadView: string = 'consultas/expedientes-adi/view';
  // Icono del ViewList
  initCardHeaderIcon = 'folder';
  // Ruta a redirigir
  redirectionPath = '/query/folder-adi-index';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Consulta', 'route': '/query' },
    { 'name': 'Expedientes ADI', 'route': this.redirectionPath }
  ];
  breadcrumbRouteActive = 'Detalles';
  dtCollapStatus = true; // muestra las columnas del view

  /**
   * Configuración para el botón flotante
   */
  /** Variable que controla botón flotante */
  menuButtonsSelectOne: any = [];
  dataDocumentos: any = [];
  menuButtons: any = this.menuButtonsSelectOne;
  iconMenu: string = 'menu';
  statusMenuButton = false;
  itemCardSelected: boolean = false; // Variable para saber si el item de una tarjeta esta seleccionado
  /** Variables para el modal pdf */
  statusModalviewPdf: boolean = false;
  ruoteServiceDownloadFile: string = 'consultas/expedientes-adi/download-document';
  paramsDownload: any; // Esta variable toma el valor del id del documento seleccionado y lo pasa opción de descaga
  // Version api
  versionApi = environment.versionApiDefault;

  resServicesDownload: any;
  resServicesDownloadErr: any;

  constructor(private route: ActivatedRoute, public lhs: LocalStorageService, public sweetAlertService: SweetAlertService, public restService: RestService, private router: Router,
    public globalAppService: GlobalAppService) {
    this.paramiD = this.route.snapshot.paramMap.get('id'); // SE recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
    // this.routeBotonUpdateView = this.routeBotonUpdateView + this.paramiD;
  }

  ngOnInit() {
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  /** Toma la información emitida desde el componente de documentos */
  actionsDocsButton(params) {
    this.statusMenuButton = true; // Muestra el boton

    this.menuButtons = []; // se le asigna un array vacio

    if (params.focus) {
      params.menuButtonsSelect.forEach( element => {
        if ( element.action == 'Ver' || element.action == 'Descargar' ) {
          this.menuButtons.push(element);
        }
      });
    } else {
      this.menuButtons = [];
    }

    this.paramsDownload = params.id;
    // Asigma la información al servicio
    this.dataDocumentos = params.dataDoc;
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  public menuReceiveData(event) {


    switch (event.action) {

      case 'Ver':
        this.statusModalviewPdf = true;
      break;
      case 'Descargar':
        this.dowloadDocuments(this.paramsDownload);
      break;
    }
  }

  /**
   * Función que cierra el modal de visor de documentos
   * @param data
   */
  closePdfModal(data) {
    this.statusModalviewPdf = false;
  }


  /**
   * Función para descargar archivos
   */
  dowloadDocuments(idDocuments) {

    let data = {
      ButtonSelectedData: {
          0: {
            id: idDocuments
          }
      }
    };

    if ( this.dataDocumentos ) {
      data['ButtonSelectedData'][0] = this.dataDocumentos;
    }

     this.sweetAlertService.sweetLoading();

      this.restService.restPut(this.versionApi + this.ruoteServiceDownloadFile, data, this.authorization).subscribe((res) => {

          this.resServicesDownload = res;
          this.globalAppService.resolveResponse(this.resServicesDownload, false).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.downloadFile(this.resServicesDownload.datafile, this.resServicesDownload.fileName);
              this.sweetAlertService.showNotification( 'success', this.resServicesDownload['message'] );
            }
            // Cargando false
            this.sweetAlertService.sweetClose();
          });
        }, (err) => {
          this.resServicesDownloadErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesDownloadErr).then((res) => { });
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
  }

}
