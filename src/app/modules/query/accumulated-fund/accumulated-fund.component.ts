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

import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { RestService } from "src/app/services/rest.service";
import { GlobalAppService } from "src/app/services/global-app.service";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Component({
  selector: "app-accumulated-fund",
  templateUrl: "./accumulated-fund.component.html",
  styleUrls: ["./accumulated-fund.component.css"],
})
export class AccumulatedFundComponent implements OnInit {
  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = "description";
  initCardHeaderTitle = "Listado de radicados";
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = "QueryAccumulatedFund";
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = "/query/accumulated-fund";
  /** Formulario index */
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  viewColumStatus = false; // Oculta la columna de status del initial list
  /** BreadcrumbOn  */
  breadcrumbOn = [{ name: "Consulta", route: "/query" }];
  breadcrumbRouteActive = "Consulta fondo acumulado";
  // Configuraciones para datatables
  routeLoadDataTablesService: string = this.versionApi + "radicacion/consultas-fondo-acumulado/index";

  dtTitles = [
    { title: "No. de Orden", data: "id" },
    { title: "Código", data: "codigo" },
    { title: "Nombre de la serie, subserie  o asunto", data: "nombre" },
    { title: "Fecha Incial", data: "fechaInicial" },
    { title: "Fecha Final", data: "fechaFinal" },
    { title: "Caja", data: "caja" },
    { title: "Carpeta", data: "carpeta" },
    { title: "Tomo", data: "tomo" },
    { title: "Serial", data: "serial" },
    { title: "CD", data: "cd" },
    { title: "No. folios o peso en Kb", data: "folios" },
    { title: "Soporte", data: "soporte" },
    { title: "Frecuen cia de consulta", data: "frecuencia" },
    { title: "Observaciones", data: "observaciones" },
  ];

  nameDocument: string;

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull = [];
  menuButtonsSelectOne = [{ icon: "cloud_download", title: "Descargar", action: "download", data: "" }];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData = [];

  constructor(
    private sweetAlertService: SweetAlertService,
    private restService: RestService,
    private globalAppService: GlobalAppService,
    private lhs: LocalStorageService
  ) {
    this.eventClickButtonSelectedData = [];
  }

  ngOnInit() {
    this.getTokenLS();
  }

  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  selectedRowsReceiveData(event) {
    this.eventClickButtonSelectedData = event;
    console.log(event);

    this.menuButtons = this.menuButtonsSelectNull;
    if (event.length > 0) {
      if (event.length === 1) {
        this.menuButtons = this.menuButtonsSelectOne;
      } else {
        this.menuButtons = this.menuButtonsSelectNull;
      }
    }
  }

  menuReceiveData(event) {
    switch (event.action) {
      case "download":
        this.nameDocument = this.eventClickButtonSelectedData[0]["url"];
        this.dowloadDocument(this.eventClickButtonSelectedData[0]["url"]);
        break;
    }
  }

  dowloadDocument(nameDocument) {
    const data = {
      ButtonSelectedData: {
        0: {
          id: nameDocument,
        },
      },
    };

    this.sweetAlertService.sweetLoading();
    this.restService
      .restPut(
        `${environment.versionApiDefault}radicacion/consultas-fondo-acumulado/descargar-documento`,
        data,
        this.authorization
      )
      .subscribe(
        (responseApi) => {
          this.globalAppService.resolveResponse(responseApi, false).then((responseGlobal) => {
            if (responseGlobal == true) {
              this.downloadFile(responseApi.datafile, responseApi.fileName);
              this.sweetAlertService.showNotification("success", responseApi["message"]);
            }
            this.sweetAlertService.sweetClose();
          });
        },
        (err) => this.globalAppService.resolveResponseError(err)
      );
  }

  /**
   * Descarga el archivo que llega en base64
   * @param file el  en base 64
   * @param nameDownload nombre del archivo
   */
  downloadFile(file, nameDownload) {
    const linkSource = `data:application/octet-stream;base64,${file}`;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = nameDownload;
    downloadLink.click();
  }
}
