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
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslateService } from "@ngx-translate/core";
import { ActivateTranslateService } from "src/app/services/activate-translate.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ActivatedRoute } from "@angular/router";
import { ConvertParamsBase64Helper } from "src/app/helpers/convert-params-base64.helper";
import { environment } from "src/environments/environment";
import { RestService } from "src/app/services/rest.service";
import { GlobalAppService } from "src/app/services/global-app.service";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { MatDialog } from "@angular/material/dialog";
import { SendMailComponent } from "../../components/send-mail/send-mail.component";

@Component({
  selector: "app-query-old-orfeo-view",
  templateUrl: "./query-old-orfeo-view.component.html",
  styleUrls: ["./query-old-orfeo-view.component.css"],
})
export class QueryOldOrfeoViewComponent implements OnInit {
  authorization: string;
  paramId: string;
  paramIdConvert: number;

  breadcrumbOn = [
    { name: "Consulta", route: "/query" },
    { name: "Consulta orfeo antiguo", route: "/query/query-old-orfeo" },
  ];
  breadcrumbRouteActive = "Detalles";

  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;
  numberLimitHistory: number;
  numberLimitHistoryMin = 5;
  statusSeeMoreHistory = false;
  statusSeeHistory = true;
  routeLoadDataTablesService = `${environment.versionApiDefault}radicacion/consultas-orfeo-antiguo/index-documentos`;
  dataRowsDetails = [];
  dataRowsHistory = [];
  dtTitles: any = [
    { title: "Usuario", data: "usuario" },
    { title: "Descripción", data: "descripcion" },
    { title: "Fecha", data: "fecha" },
    { title: "Documento", data: "documento" },
  ];

  menuButtonsNotSelectDocuments = [{ icon: "email", title: "Envío por correo", action: "send-mail", data: "" }];
  menuButtonsSelectDocuments = [{ icon: "cloud_download", title: "Descargar", action: "download", data: "" }];
  menuButtonsSelectDocumentsPdf = [
    { icon: "remove_red_eye", title: "Ver", action: "view", data: "" },
    { icon: "cloud_download", title: "Descargar", action: "download", data: "" },
  ];
  menuButtons = this.menuButtonsNotSelectDocuments;

  eventSelectedRowsReceiveData = [];

  statusModalviewPdf = false;
  nameDocument: string;
  ruoteServiceDownloadFile = "radicacion/consultas-orfeo-antiguo/descargar-documento";

  constructor(
    private route: ActivatedRoute,
    private activateTranslateService: ActivateTranslateService,
    private translate: TranslateService,
    private lhs: LocalStorageService,
    private restService: RestService,
    private globalAppService: GlobalAppService,
    private sweetAlertService: SweetAlertService,
    public dialog: MatDialog
  ) {
    this.paramId = this.route.snapshot.paramMap.get("id");
    this.paramIdConvert = ConvertParamsBase64Helper(this.paramId);
  }

  ngOnInit() {
    this.getTokenLS();
  }

  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      if (this.paramIdConvert != 0) {
        this.getCallUrlView(res);
      }
    });
  }

  getCallUrlView(authorization) {
    const params = {
      id: this.paramIdConvert,
    };

    this.restService
      .restGetParams(`${environment.versionApiDefault}radicacion/consultas-orfeo-antiguo/view`, params, authorization)
      .subscribe(
        (responseApi) => {
          this.globalAppService.resolveResponse(responseApi, false).then((responseGlobal) => {
            if (responseGlobal) {
              this.dataRowsDetails = responseApi.data;
              if (responseApi.dataHistorial) {
                this.dataRowsHistory = responseApi.dataHistorial;
                if (responseApi.dataHistorial.length > this.numberLimitHistoryMin) {
                  this.statusSeeMoreHistory = true;
                  this.numberLimitHistory = this.numberLimitHistoryMin;
                }
              }
            }
          });
        },
        (err) => this.globalAppService.resolveResponseError(err)
      );
  }

  menuReceiveData(event) {
    switch (event.action) {
      case "download":
        this.nameDocument = this.eventSelectedRowsReceiveData[0]["documento"];
        this.dowloadDocument(this.eventSelectedRowsReceiveData[0]["documento"]);
        break;
      case "view":
        this.nameDocument = this.eventSelectedRowsReceiveData[0]["documento"];
        this.statusModalviewPdf = true;
        break;
      case "send-mail":
        const data = {
          id: this.paramId,
        };
        this.openDialog(SendMailComponent, "95%", data);
        break;
    }
  }

  openDialog(file, width, data) {
    const dialogRef = this.dialog.open(file, {
      disableClose: true,
      width: width,
      data: data,
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  selectedRowsReceiveData(event) {
    this.eventSelectedRowsReceiveData = event;
    if (event.length === 1) {
      if (event.extension === "pdf") {
        this.menuButtons = this.menuButtonsSelectDocumentsPdf;
      } else {
        this.menuButtons = this.menuButtonsSelectDocuments;
      }
    } else {
      if (event.length === 0) {
        this.menuButtons = this.menuButtonsNotSelectDocuments;
      } else {
        this.menuButtons = null;
      }
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
        `${environment.versionApiDefault}radicacion/consultas-orfeo-antiguo/descargar-documento`,
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

  closePdfModal(data) {
    this.statusModalviewPdf = false;
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

  seeMoreAndLess(status, module) {
    if (status) {
      switch (module) {
        case "History":
          this.numberLimitHistory = this.dataRowsHistory.length;
          break;
      }
    } else {
      switch (module) {
        case "History":
          this.numberLimitHistory = this.numberLimitHistoryMin;
          break;
      }
    }
    switch (module) {
      case "History":
        this.statusSeeHistory = !this.statusSeeHistory;
        break;
    }
  }

  detectLanguageChange() {
    this.subscriptionTranslateService$ = this.activateTranslateService.activateLanguageChange.subscribe((language) => {
      this.languageReceive = language;
      this.translate.setDefaultLang(this.languageReceive);
    });
  }

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }
}
