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

import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { SweetAlertService } from "../../../services/sweet-alert.service";
import { RestService } from "../../../services/rest.service";
import { GlobalAppService } from "../../../services/global-app.service";

import { TranslateService } from "@ngx-translate/core";
import { ActivateTranslateService } from "../../../services/activate-translate.service";
import { LocalStorageService } from "../../../services/local-storage.service";
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: "app-advanced-index",
  templateUrl: "./advanced-index.component.html",
  styleUrls: ["./advanced-index.component.css"],
})
export class AdvancedIndexComponent implements OnInit, OnDestroy {
  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = "sticky_note_2";
  initCardHeaderTitle = "Listado de documentos";
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = "AdvancedQuery";
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = "/query/advanced-index";
  /** Formulario index */
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  viewColumStatus = false; // Oculta la columna de status del initial list
  /** BreadcrumbOn  */
  breadcrumbOn = [{ name: "Consulta", route: "/query" }];
  breadcrumbRouteActive = "Consulta avanzada";
  // Configuraciones para datatables
  routeLoadDataTablesService: string = this.versionApi + "radicacion/consultas/index";
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;

  dtTitles: any = [
    { title: "Tipo documental", data: "tipodocumental" },
    { title: "Fecha carga", data: "fechaCarga" },
    { title: "Nombre documento", data: "nombreDocumento" },
    { title: "Extension", data: "extensionDocumento" },
    { title: "Número radicado", data: "numero" },
    { title: "Asunto", data: "asunto" },
    { title: "Dependencia", data: "dependencia" },
    { title: "Usuario tramitador", data: "usuario" },
  ];

  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [];

  menuButtonsSelectMasive: any = [];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  resServicesDownload: any;
  resServicesDownloadErr: any;

  /** Variables para el modal pdf */
  statusModalviewPdf: boolean = false;

  ruoteServiceView: string = "radicacion/consultas/content-document";
  ruoteServiceDownload: string;

  resSerDownload: any;
  resSerDownloadErr: any;

  statusTextModal: boolean = false; // estado del modal de texto
  initCardHeaderIconMod = "sticky_note_2";
  initCardHeaderTitleMod: string;
  dataText: string; // data con el texto a mostrar

  paramsDownload: any; // Esta variable toma el valor del id del documento seleccionado y lo pasa opción de descaga

  constructor(
    private router: Router,
    public restService: RestService,
    public globalAppService: GlobalAppService,
    public sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService,
    public lhs: LocalStorageService
  ) {}

  ngOnInit() {
    /** Detectando si se ejecuta cambio de idioma */
    this.detectLanguageChange();

    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  detectLanguageChange() {
    this.subscriptionTranslateService$ = this.activateTranslateService.activateLanguageChange.subscribe((language) => {
      this.languageReceive = language;
      this.translate.setDefaultLang(this.languageReceive);
    });
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {
    switch (event.action) {
      case "view":
        this.paramsDownload = this.eventClickButtonSelectedData[0].id;
        this.statusModalviewPdf = true;
        break;

      case "download":
        this.dowloadDocuments(this.eventClickButtonSelectedData);
        break;

      case "contenido":
        this.initCardHeaderIcon = event.icon;
        this.initCardHeaderTitle = event.title;
        this.contentDocuments(this.eventClickButtonSelectedData);
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
      if (event.length == 1) {
        // Un registro seleccionado

        this.eventClickButtonSelectedData = event;
        this.ruoteServiceDownload = event[0].routeDownload;

        switch (this.eventClickButtonSelectedData[0].extensionDocumento) {
          case "pdf":
            this.menuButtonsSelectOne = [
              { icon: "remove_red_eye", title: "Ver", action: "view", data: "" },
              { icon: "get_app", title: "Descargar", action: "download", data: "" }, // description
              { icon: "description", title: "Contenido", action: "contenido", data: "" },
            ];
            break;

          default:
            this.menuButtonsSelectOne = [
              { icon: "get_app", title: "Descargar", action: "download", data: "" },
              { icon: "description", title: "Contenido", action: "contenido", data: "" },
            ];
            break;
        }

        this.menuButtons = this.menuButtonsSelectOne;
      } else {
        // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectMasive;
      }
    } else {
      // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  // VIEW
  closePdfModal(data) {
    this.statusModalviewPdf = false;
    this.statusTextModal = false;
  }

  // DOWNLOAD
  dowloadDocuments(selectdata) {
    let data = {
      ButtonSelectedData: {
        0: {
          data: selectdata,
          id: selectdata[0].id,
        },
      },
    };

    this.sweetAlertService.showNotificationLoading();

    this.restService.restPut(this.versionApi + this.ruoteServiceDownload, data, this.authorization).subscribe(
      (res) => {
        this.resSerDownload = res;

        this.globalAppService.resolveResponse(this.resSerDownload, false).then((res) => {
          const responseResolveResponse = res;
          this.sweetAlertService.showNotificationClose();
          if (responseResolveResponse == true) {
            // this.sweetAlertService.showNotification( 'success', this.resSerDownload['message'] );
            let dataFileArray = this.resSerDownload.datafile;
            if (this.resSerDownload.datafile) {
              // Valida tiene documento
              if (this.resSerDownload.fileName) {
                this.downloadFile(this.resSerDownload.datafile, this.resSerDownload.fileName);
              }
            }
          }
          // Cargando false
          // this.sweetAlertService.sweetClose();
        });
      },
      (err) => {
        this.resSerDownloadErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerDownloadErr).then((res) => {
          this.sweetAlertService.showNotificationClose();
        });
      }
    );
  }

  downloadFile(file, nameDownload) {
    const linkSource = `data:application/octet-stream;base64,${file}`;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = nameDownload;
    downloadLink.click();
  }

  // CONTENT
  contentDocuments(selectdata) {
    let data = {
      id: selectdata[0].id,
      tablaOcrDatos: selectdata[0].tablaOcrDatos,
    };

    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.versionApi + this.ruoteServiceView, data, this.authorization).subscribe(
      (res) => {
        this.resServicesDownload = res;
        this.globalAppService.resolveResponse(this.resServicesDownload, false).then((res) => {
          let responseResolveResponse = res;
          // console.log(this.resServicesDownload);
          this.statusTextModal = true;
          this.dataText = this.resServicesDownload.data;
          // this.sweetAlertService.showContentDocs(this.resServicesDownload.data);
          // Cargando false
          this.sweetAlertService.sweetClose();
        });
      },
      (err) => {
        this.resServicesDownloadErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resServicesDownloadErr).then((res) => {});
      }
    );
  }

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }
}
