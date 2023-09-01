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

import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ConvertParamsBase64Helper } from "src/app/helpers/convert-params-base64.helper";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { RestService } from "src/app/services/rest.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { environment } from "src/environments/environment";
import { GlobalAppService } from "src/app/services/global-app.service";
import { TransaccionesService } from "src/app/services/transacciones.service";
import { FloatingButtonService } from "src/app/services/floating-button.service";
import { MatDialog } from "@angular/material/dialog";
import swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { ActivateTranslateService } from "../../../services/activate-translate.service";
import { FilingCreateDetailResolutionComponent } from "../filing-create-detail-resolution/filing-create-detail-resolution.component";
import { ChangeChildrenService } from "../../../services/change-children.service";
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: "app-filing-view",
  templateUrl: "./filing-view.component.html",
  styleUrls: ["./filing-view.component.css"],
})
export class FilingViewComponent implements OnInit, OnDestroy {
  // Autorizacion de localstorage
  authorization: string;
  // Data user tramitador
  dataUserTramitador: any;
  // Data del expediente
  idExpediente: any;
  numeroRadicado: any;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;
  // Nombre del formulario
  textFormView = "Detalle del Radicado"; // i18n
  dtCollapStatus = true;
  /** Datos que solicita el ViewList */
  // Ruta a consultar en el ViewList
  reuteLoadView: string = "radicacion/radicados/view";
  reuteLoadViewHistorico: string = "radicacion/radicados/historical-filing";
  // Ruta a actualizar en el ViewList
  routeBotonUpdateView: string = "/filing/filing-update/";
  // Icono del ViewList
  initCardHeaderIcon = "description";
  // Ruta a redirigir
  redirectionPath = "/filing/filing-index/false";
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { name: "Radicación", route: "/filing" },
    { name: "Radicación estándar", route: "/filing/filing-index/false" },
  ];
  breadcrumbRouteActive = "Detalles";

  textFormAttachment = "Cargar anexos";
  maxRowsFilesAttachment: number = 5;
  showButtonCleanAttachment: boolean = true;
  showButtonClearAttachment: boolean = true;

  statusMenuButton: boolean = true;

  /** Variable que controla botón flotante */
  menuButtonsSelectOne: any = [
    // { icon: 'save', title: 'Guardar', action: 'save', data: '' },
  ];
  menuButtons: any = this.menuButtonsSelectOne;

  statusRadicado: boolean = true; // Muestra el historico y los documentos
  statusModalMain: boolean = false; // Muestra el componente de anexos main
  showAgenda: boolean = false; // Muestra el input de fecha

  // Version api
  versionApi = environment.versionApiDefault;

  /** Variables respuesta Servicios */
  resServices: any;
  resServicesErr: any;
  resServicesOperaciones: any;
  resServicesOperacionesErr: any;
  resErrServices: any;
  resServicesSoliVobo: any;
  resServicesSoliVoboErr: any;
  resServicesVobo: any;
  resServicesVoboErr: any;
  resServicesReasign: any;
  resServicesReasignErr: any;
  resServicesAnnulment: any;
  resServicesAnnulmentErr: any;
  resServicesDiscardConsecutive: any;
  resServicesDiscardConsecutiveErr: any;
  resServicesCopyInfo: any;
  resServicesCopyInfoErr: any;
  resServicesFinalizeFiling: any;
  resServicesFinalizeFilingErr: any;
  resServicesReturnFiling: any;
  resServicesReturnFilingErr: any;
  resServicesSchedule: any;
  resServicesScheduleErr: any;
  resServicesSendEmailCli: any;
  resServicesSendEmailCliErr: any;
  resServicesDownload: any;
  resServicesDownloadErr: any;
  resServicesDownloadDocumentPackage: any;
  resServicesDownloadDocumentPackageErr: any;
  resSerIncludeFiles: any;
  resSerIncludeFilesErr: any;
  resSerShippingReady: any;
  resSerShippingReadyErr: any;
  resSerPublicDoc: any;
  resSerPublicDocErr: any;
  resSerPrintStickers: any;
  resSerPrintStickersErr: any;
  resSerWithdrawal: any;
  resSerWithdrawalErr: any;
  resSerExcludeExp: any;
  resSerExcludeExpErr: any;
  resServicesSkinaScan: any;
  resServicesSkinaScanErr: any;
  
  /*** Config para los modales  ***/
  fileDownload: any;
  statusViewPdf: boolean = false;

  /** Variables para internacionalizacion */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  statusModalUploadFile: boolean = false; // Muestra el componente de Envio de Documentos
  eventClickButtonSelectedData: any;
  ruoteServiceDocuments: string =
    environment.apiUrl + environment.versionApiDefault + "radicacion/transacciones/upload-file";
  // Ruta para la carga del documento firmado físicamente
  routeServiceUploadSignedDocument = `${
    environment.apiUrl + this.versionApi
  }radicacion/documentos/upload-signed-document`;

  statusModalIncludeInFile: boolean = false; // Status del modal incluir en expediente

  showReasignacion: boolean = false; // Muestra los inputs de reasignacion
  showVOBO: boolean = false; // Muestra los inputs de VOBO (Visto bueno)
  showCopyInformaded: boolean = false; // Muestra los inputs de copiar informado
  textFormObservaHeader: string = ""; // Titulo del botón inteligente tambien titulo del dialog observacion
  operationDialogObserva: string; // operacion que se utiliza para las trasferencias

  @Input() messageUnderConstruction = "funcionalidad en construcción";

  /** Data seleccionada en la tabla principal */
  @Input() dataIdRadicados: any = [];

  // Estados que controlar mostrar o no los botones de ver y eliminar
  statusActionDocDelete: boolean = false;
  statusActionDocView: boolean = false;

  /** Variables para traer el texto de confirmacion */
  titleMsg: string;
  textMsg: string;
  bntCancelar: string;
  btnConfirmacion: string;
  resSerLenguage: any;
  paramsDownload: any; // Esta variable toma el valor del id del documento seleccionado y lo pasa opción de descaga
  dataDocumentos: any; // Data de los documentos que seleccionan

  /**
   * Configuración para el botón flotante
   */
  iconMenu: string = "menu";

  nameCollapsOne: string = "Trazabilidad";
  nameCollapsTwo: string = "Documentos";

  /** Variables para el modal pdf */
  statusModalviewPdf: boolean = false;
  ruoteServiceDownloadAnexo: string = "radicacion/documentos/download-document";

  /** Variables para carga de anexos */
  // Route Templaste
  ruoteServiceDocumentsTemplate: string = environment.apiUrl + this.versionApi + "radicacion/transacciones/load-format";
  // Upload Documents Anexos
  ruoteServiceDocumentsAne: string = environment.apiUrl + this.versionApi + "radicacion/documentos/upload-document";
  // Download documents
  ruoteServiceDownloadDocuments: string =
    environment.versionApiDefault + "radicacion/documentos/download-doc-principal";
  // Ruta para ejecutar servicio de initial list modal
  routeLoadDataTablesServiceMod = environment.versionApiDefault + "radicacion/radicados/get-document-versing";
  // Ruta para ejecutar servicio de initial list modal
  // Route Documents modal
  ruoteServiceDocumentsModal: any;
  validateFile: any = [{ type: "xls" }, { type: "xlsx" }, { type: "pdf" }, { type: "doc" }, { type: "docx" }];
  validateFileAnexos: any = environment.validateFile.anexosRadicado;
  statusUploadFileAne: boolean = false; // Muestra el modal para adjuntar anexos
  statusUploadFileAneMasive: boolean = false; // Muestra el modal para adjuntar anexos
  statusSendReplyMailModal = false; // Muestra el modal de envio de respuesta por correo
  showTipoDocumental: boolean = true; // Se muestra el campo  tipo documental de anexos
  showObservacion: boolean = true; // Muestra el campo observacion de anexos
  statusNameFile: boolean = false; // Muestra el campo nombre archivo de anexos
  valueNameFile: string; // Valor del nombre archivo
  statusReturnDataClose = false; // Cierra el modal y retorna la información
  dataSend: any; // Data que se le envia al front de los radicados
  statusViewList: boolean = true; // Data que se le envia al front del view
  appViewListStatus: boolean = true;

  // Simple table modal
  statusSimpleTableModal: boolean = false; // Muestra el modal de tabla

  hashLocalStorage: any;

  // Variables para notificacion del componente simple-modal
  modalNotificationStatus: boolean = true;
  modalNotificationClassAlert: string = "alert alert-info alert-with-icon";
  modalNotificationMessage: string = "notificationVersionamientoDocuPrincipales";

  itemCardSelected: boolean = false; // Variable para saber si el item de una tarjeta esta seleccionado

  inFirmaFisica: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private floatingButtonService: FloatingButtonService,
    public lhs: LocalStorageService,
    public sweetAlertService: SweetAlertService,
    public restService: RestService,
    private router: Router,
    public globalAppService: GlobalAppService,
    public transaccionesService: TransaccionesService,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService,
    private changeChildrenService: ChangeChildrenService,
    private dialog: MatDialog
  ) {
    this.paramiD = this.route.snapshot.paramMap.get("id"); // SE recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
    this.routeBotonUpdateView = this.routeBotonUpdateView + this.paramiD;

    /** Idioma inical */
    this.detectLanguageInitial();
  }

  ngOnInit() {
    /** Detectando si se ejecuta cambio de idioma */
    this.detectLanguageChange();

    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      if (this.paramiD) {
        this.operacionesTiposRadicados();
      }
    });

    this.hashLocalStorage = this.authService.decryptAES(localStorage.getItem(environment.hashSkina));
  }

  /**
   * Funcion que retorna la estructura de los botones a mostrar
   */
  operacionesTiposRadicados() {
    let params = {
      event: {
        0: {
          id: this.paramOID,
        },
      },
      module: "view",
    };

    this.restService
      .restPost(this.versionApi + "radicacion/radicados/radi-multi-acciones", params, this.authorization)
      .subscribe(
        (res) => {
          this.resServicesOperaciones = res;
          if (this.resServicesOperaciones.status == 200) {
            // la estructura de los botones llega por backend se asigna a la variable de botones
            this.menuButtonsSelectOne = this.resServicesOperaciones.dataTransacciones;
            if (!this.itemCardSelected) {
              // Asignar la data recibida al boton flotante
              this.menuButtons = this.menuButtonsSelectOne;
            }
            this.inFirmaFisica = this.resServicesOperaciones.firmaFisica;
          }
        },
        (err) => {
          this.resServicesOperacionesErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesOperacionesErr).then((res) => {});
        }
      );
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  public menuReceiveData(event) {
    this.dataIdRadicados = [parseInt(this.paramOID)];

    switch (event.action) {
      case "save":
        let buttonSubmit = <HTMLFormElement>document.getElementById("sendForm");
        buttonSubmit.click();
        break;

      case "add":
        if (this.dataIdRadicados.length > 0) {
          // Cambia el los mensajes de texto del componete para confirmar la eliminacion
          this.globalAppService.text18nGet().then((res) => {
            this.resSerLenguage = res;
            // console.log( this.resSerLenguage );
            this.titleMsg = this.resSerLenguage.titleMsg;
            this.textMsg = this.resSerLenguage["textMsgAsoRadi"];
            this.bntCancelar = this.resSerLenguage["bntCancelarSendMail"];
            this.btnConfirmacion = this.resSerLenguage["btnConfirmar"];

            swal({
              title: this.titleMsg,
              text: this.textMsg,
              type: "warning",
              showCancelButton: true,
              cancelButtonText: this.bntCancelar,
              confirmButtonText: this.btnConfirmacion,
              cancelButtonClass: "btn btn-danger",
              confirmButtonClass: "btn btn-success",
              buttonsStyling: false,
            }).then((result) => {
              if (result.value) {
                // Guarda en localStorage para asociacion de radicados
                localStorage.setItem(
                  environment.hashRadiAsociados,
                  this.authService.encryptAES(this.dataIdRadicados, false)
                );
                this.router.navigate(["/" + "/filing/filing-create"]);
              }
            });
          });
        } else {
          this.router.navigate(["/" + "/filing/filing-create"]);
        }
        break;

      case "edit":
        this.router.navigate(["/" + "/filing/filing-update" + "/" + this.paramiD]);
        break;

      case "view":
        this.router.navigate(["/" + "/filing/filing-view" + "/" + this.paramiD]);
        break;

      case "uploadFile":
        this.statusModalUploadFile = true;
        this.eventClickButtonSelectedData = {
          0: {
            id: this.paramOID,
          },
        };
        break;

      case "printStickers":
        this.transactionPrintStickers();
        break;

      case "sendMail":
        // this.sendEmailClient();
        this.dataSend = {
          0: {
            id: this.paramOID,
          },
        };
        this.statusSendReplyMailModal = true; // Muestra el modal de Envio de respuesta por correo
        break;
      case "schedule":
        this.showAgenda = true; // Transaccion agendar
        // Le asigna la operacion a ejecutar
        this.operationDialogObserva = event.action;
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;
        break;
      case "send":
        this.showReasignacion = true; // Transaccion reasignacion
        // Le asigna la operacion a ejecutar
        this.operationDialogObserva = event.action;
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;
        break;
      case "annulationRequest":
        // Le asigna la operacion a ejecutar
        this.operationDialogObserva = event.action;
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;
        break;
      case "discardConsecutive":
        // Le asigna la operacion a ejecutar
        this.operationDialogObserva = event.action;
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;
        break;
      case "voboRequest":
        this.showVOBO = true; // Transaccion VOBO
        // Le asigna la operacion a ejecutar
        this.operationDialogObserva = event.action;
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;
        break;
      case "vobo":
        this.transactionVobo();
        break;
      case "copyInformaded":
        this.showCopyInformaded = true; // Transaccion de copiar informado
        // Le asigna la operacion a ejecutar
        this.operationDialogObserva = event.action;
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;

        break;
      case "finalizeFiling":
        // Le asigna la operacion a ejecutar
        this.operationDialogObserva = event.action;
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;
        break;

      case "returnFiling":
        this.operationDialogObserva = event.action;
        this.textFormObservaHeader = event.title;
        this.statusModalMain = true;
        break;
      case "includeInFile":
        this.eventClickButtonSelectedData = [{ id: this.paramOID }];
        this.operationDialogObserva = event.action;
        this.statusModalIncludeInFile = true;
        break;
      /** Acciones para los documentos seleccionados ***/

      case "Ver":
        // this.actionReceiveData(event);
        this.statusModalviewPdf = true;
        break;

      case "Descargar":
        this.dowloadDocuments(this.paramsDownload);
        break;

      case "downloadDocumentPackage":
        this.downloadDocumentPackage();
        break;

      case "Comentarios":
        this.sweetAlertService.showNotification("danger", this.messageUnderConstruction);
        break;
      case "loadFormat":
        // this.statusViewList = !this.statusViewList; // Oculta el view List
        this.statusUploadFileAne = true; // Muestra el modal de adjutar documentos
        this.showTipoDocumental = false; // No muestra el tipo documental
        this.showObservacion = false; // No muestra la observación
        this.statusNameFile = true; // Muestra el campo nombre archivo
        this.validateFile = [{ type: "doc" }, { type: "docx" }, { type: "odt" }];
        this.statusReturnDataClose = true; // Cierra el modal y retorna la información
        this.valueNameFile = event.data;
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        this.ruoteServiceDocumentsModal = this.ruoteServiceDocumentsTemplate; // Ruta de la plantilla
        // Le asigna la operacion a ejecutar
        this.operationDialogObserva = event.action;
        this.dataSend = {
          0: {
            id: this.paramOID,
          },
        };
        break;
      case "attachment":
        this.textFormAttachment = event.title;
        this.maxRowsFilesAttachment = 5;
        this.showButtonCleanAttachment = true;
        this.showButtonClearAttachment = true;
        this.showTipoDocumental = false; // Oculta el campo tipo documental
        this.operationDialogObserva = event.action;
        this.dataSend = {
          0: {
            id: this.paramOID,
          },
        };
        this.statusUploadFileAneMasive = true;
        break;
      case "attachmentMain":
        this.textFormAttachment = event.title;
        this.maxRowsFilesAttachment = 1;
        this.showButtonCleanAttachment = false;
        this.showButtonClearAttachment = false;
        this.showTipoDocumental = false; // Oculta el campo tipo documental
        this.operationDialogObserva = event.action;
        this.dataSend = {
          0: {
            id: this.paramOID,
          },
        };
        this.statusUploadFileAneMasive = true;
        break;
      case "versionFormat":
        this.dataSend = {
          id: this.paramOID,
          nameFile: event.data,
        };
        this.statusSimpleTableModal = true;
        this.statusMenuButton = false;
        break;
      case "shippingReady":
        this.transactionShippingReady();
        break;
      case "publishDocument":
        // Continua transacción de publicar documento se le envia la data del documento
        this.continueTransaccionPublicDoc(this.dataDocumentos);
        break;
      case "withdrawal":
        // Le asigna la operacion a ejecutar
        this.operationDialogObserva = event.action;
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;
        break;
      case "excludeTheFile":
        this.transactionExcludeExpedient(this.idExpediente);
        break;
      case "printExternal":
        this.transactionPrintExternalLabel(Number(this.paramOID));
        break;
      case "uploadSignedDocument":
        this.statusUploadFileAne = true; // Muestra el modal de adjutar documentos
        this.showTipoDocumental = false; // No muestra el tipo documental
        this.showObservacion = false; // No muestra la observación
        this.statusNameFile = true; // Muestra el campo nombre archivo
        this.validateFile = [{ type: "pdf" }];
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        this.ruoteServiceDocumentsModal = this.routeServiceUploadSignedDocument; // Ruta de la plantilla
        this.dataSend = this.dataSend = {
          0: {
            id: this.paramOID,
          },
        };
        break;
      // Detalle para las resoluciones
      case "createResolutionDetail":
        if (this.dataIdRadicados.length === 1) {
          const dataResolutionDetail = {
            idRadicado: this.dataIdRadicados[0],
            route: event["route"],
            authorization: this.authorization,
          };
          this.openDialog(FilingCreateDetailResolutionComponent, "75%", dataResolutionDetail);
        }
      break;
      case 'generateNumberFiling':
        this.transactionGenerateNumberFiling(Number(this.paramOID));
      break;
      case 'generateStickerFiling':
        this.transactionGenerateStickerFiling(Number(this.paramOID));
      break;
      case 'loadDocumentRadicado':

      /** Cantidad de registros a mostrar en el listado incial, limitante que se envia al bakend */
      let params = {
        data: ''
      };

      this.restService.restPost(this.versionApi + 'externos/radicados-externos/token-skina-scan', params, this.authorization).subscribe((res) => {
        this.resServicesSkinaScan = res;

        const linkSource = `SkinaScan://aplicacion.documento?toquen=${this.resServicesSkinaScan.message}&idRadicado=${this.dataIdRadicados[0]}&tipoArchivo=1`;
        const downloadLink = document.createElement('a');
    
        downloadLink.href = linkSource;
        downloadLink.click();

      }, (err) => {
        this.resServicesSkinaScanErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resServicesSkinaScanErr).then((res) => { });
      }
      );
    }
  }

  /**
   * Método para descargar la etiqueta luego de asignar número de radicado
   * y támbien si el último estado del documento es firmadoDigitamente(13)
   * @param {object} event
   */
  public transactionGenerateStickerFiling(id: number): void {
    const idRadicado = id;
    const params = {
      ButtonSelectedData: idRadicado
    }
    // Cargando true
    this.sweetAlertService.sweetLoading();
    this.restService.restPost(this.versionApi + 'radicacion/radicados/generate-sticker-filing', params, this.authorization)
      .subscribe((responseService) => {
        const response = responseService;
        this.sweetAlertService.sweetClose();

        this.globalAppService.resolveResponse(response, false).then( async (res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            if (response.hasOwnProperty('dataFile') && response['dataFile'] !== '') {
              await this.downloadFile(response['dataFile'], response['fileName']);
              this.changeChildrenService.changeProcess({ proccess: "reload" });
              this.sweetAlertService.showNotification( 'success', response['message'] );
            }
          }
        });

      }, (err) => {
        this.resErrServices = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
      });
  }

  /**
   * Método para generar número de radicado
   * @param {object} event
   * @returns {void}
   */
   public transactionGenerateNumberFiling(id: number): void {
    const idRadicado = id;
    const params = {
      ButtonSelectedData: idRadicado
    }

    this.sweetAlertService.sweetLoading();
    this.restService.restPost(this.versionApi + 'radicacion/radicados/generate-number-filing', params, this.authorization)
      .subscribe((responseService) => {
        const response = responseService;
        this.sweetAlertService.sweetClose();

        this.globalAppService.resolveResponse(response, false).then( async (res) => {
          const responseResolveResponse = res;

          if (responseResolveResponse == true) {
            await this.operacionesTiposRadicados();
            this.changeChildrenService.changeProcess({ proccess: "reload" });
            this.sweetAlertService.showNotification( 'success', response['message'] );
          }
        });

      }, (err) => {
        this.resErrServices = err;
        console.log(this.resErrServices);
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
      });
  }

  /**
   * Ejecuta dialogs de acuerdo a algún componente
   * @param {string} file
   * @param {string} width
   * @param {object} data
   */
  openDialog(file, width, data) {
    const dialogRef = this.dialog.open(file, {
      disableClose: true,
      width: width,
      data: data,
    });
    dialogRef.afterClosed().subscribe(() => this.changeChildrenService.changeProcess({ proccess: "reload" }));
  }

  /**
   * Método para descarga etiqueta externa
   * @param {number} event
   * @returns {Promise<void>}
   */
  public async transactionPrintExternalLabel(id: number): Promise<void> {
    const idRadicado = id;
    const params = {
      ButtonSelectedData: idRadicado,
    };
    // Cargando true
    //this.sweetAlertService.sweetLoading();
    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/print-external-sticker", params, this.authorization)
      .subscribe((responseService) => {
        const response = responseService;
        this.sweetAlertService.sweetClose();

        this.globalAppService.resolveResponse(response, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            if (response.hasOwnProperty("dataFile") && response["dataFile"] !== "") {
              this.downloadFile(response["dataFile"], response["fileName"]);
              this.changeChildrenService.changeProcess({ proccess: "reload" });
              this.sweetAlertService.showNotification("success", response["message"]);
            }
          }
        });
      });
  }

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {
    // Se reestablecen los valores que se muestran en el componente de observaciones
    this.showAgenda = false; // Transaccion agendar
    this.showReasignacion = false; // Transaccion reasignacion
    this.showVOBO = false; // Transaccion VOBO
    this.showCopyInformaded = false; // Transaccion de copiar informado
    this.statusUploadFileAne = false; // Modal carga de anexos
    this.statusUploadFileAneMasive = false; // Modal carga de anexos Masivo
    this.showTipoDocumental = true; // Muestra el campo tipos documentales en el modal de adjuntar documentos
    this.showObservacion = true; // Muestra el campo observación en el modal de adjuntar documentos
    this.statusNameFile = false; // Oculta el campo nombre archivo
    this.validateFile = [{ type: "xls" }, { type: "xlsx" }, { type: "pdf" }, { type: "doc" }, { type: "docx" }];
    this.statusReturnDataClose = false; // Cierra el modal y retorna la información
    this.valueNameFile = "";
    // Fin reestablecer variables

    // dataObserva es la data que retorna el componente de observaciones
    if (dataObserva.status) {
      switch (this.operationDialogObserva) {
        case "schedule":
          this.transactionSchedule(dataObserva);
          break;
        case "send":
          this.transactionReasing(dataObserva);
          break;
        case "annulationRequest":
          this.transactionCancellationRequest(dataObserva);
          break;
        case "discardConsecutive":
          this.transactionDiscardConsecutive(dataObserva);
          break;
        case "voboRequest":
          this.transactionVoboRequest(dataObserva);
          break;
        case "copyInformaded":
          this.transactionCopyInformaded(dataObserva);
          break;
        case "returnFiling":
          this.transactionReturnFiling(dataObserva);
          break;
        case "finalizeFiling":
          this.transactionFinalizeFiling(dataObserva);
          break;
        case "withdrawal":
          this.transactionWithdrawal(dataObserva);
          break;
        case "includeInFile":
          this.transactionIncludeFiles(dataObserva);
          break;
        case "loadFormat":
          this.statusViewList = !this.statusViewList;
          this.changeChildrenService.changeProcess({ proccess: "reload" });
          this.operacionesTiposRadicados();
          break;
        case "versionFormat":
          this.statusSimpleTableModal = false;
          break;
      }
    } else {
      switch (this.operationDialogObserva) {
        case "send":
          this.changeChildrenService.changeProcess({ proccess: "reload" });
          this.operacionesTiposRadicados();
          break;
        case "returnFiling":
          this.changeChildrenService.changeProcess({ proccess: "reload" });
          this.operacionesTiposRadicados();
          break;
        case "uploadSignedDocument":
          this.changeChildrenService.changeProcess({ proccess: "reload" });
          break;
      }
    }

    // Valida si el estado del view es falso para pasar lo como true
    if (!this.statusViewList) {
      this.statusViewList = !this.statusViewList;
    }

    // Valida si el estado del index Modal es verdadero para pasar lo como false
    if (this.statusSimpleTableModal) {
      this.statusSimpleTableModal = false;
      this.changeChildrenService.changeProcess({ proccess: "reload" });
      this.operacionesTiposRadicados();
    }
    // Se habilita el boton para que se muestre la información
    if (!this.statusMenuButton) {
      this.statusMenuButton = true;
    }

    this.statusModalUploadFile = false;
    this.statusModalMain = false;
    this.statusModalIncludeInFile = false;

    if (this.operationDialogObserva == "attachment" || this.operationDialogObserva == "attachmentMain") {
      this.changeChildrenService.changeProcess({ proccess: "reload" });
      this.operacionesTiposRadicados();
    }
  }

  transactionReturnFiling(dataObserva) {
    let ButtonSelectedData: any = {
      0: {
        id: this.paramOID,
        idInitialList: this.paramOID,
      },
    };

    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // console.log( this.resSerLenguage );
      this.titleMsg = this.resSerLenguage.titleMsg;
      this.textMsg = this.resSerLenguage["textMsgRadiReturnOne"];
      this.bntCancelar = this.resSerLenguage["bntCancelarSendMail"];
      this.btnConfirmacion = this.resSerLenguage["btnConfirmar"];

      swal({
        title: this.titleMsg,
        text: this.textMsg,
        type: "warning",
        showCancelButton: true,
        cancelButtonText: this.bntCancelar,
        confirmButtonText: this.btnConfirmacion,
        cancelButtonClass: "btn btn-danger",
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false,
      }).then((result) => {
        if (String(result.dismiss) === "overlay") {
          this.changeChildrenService.changeProcess({ proccess: "reload" });
          this.operacionesTiposRadicados();
        }

        if (result.value) {
          this.sweetAlertService.sweetLoading();

          let params = {
            observacion: dataObserva.data.observacion,
            ButtonSelectedData: ButtonSelectedData,
          };

          this.restService
            .restPost(this.versionApi + "radicacion/transacciones/return-filing", params, this.authorization)
            .subscribe(
              (res) => {
                this.resServicesReturnFiling = res;

                this.globalAppService.resolveResponse(this.resServicesReturnFiling, false).then((res) => {
                  const responseResolveResponse = res;

                  if (responseResolveResponse == true) {
                    for (let key in this.resServicesReturnFiling.notificacion) {
                      this.sweetAlertService.showNotification(
                        this.resServicesReturnFiling.notificacion[key]["type"],
                        this.resServicesReturnFiling.notificacion[key]["message"]
                      );
                    }
                    this.sweetAlertService.sweetClose();
                    this.router.navigate([this.redirectionPath]);
                  } else {
                    // En caso que se haya dado vovo y la opcion devolver se selecciones pero no se confirme
                    this.changeChildrenService.changeProcess({ proccess: "reload" });
                    this.operacionesTiposRadicados();
                  }
                });
              },
              (err) => {
                this.resServicesReturnFilingErr = err;
                // Evaluar respuesta de error del servicio
                this.globalAppService.resolveResponseError(this.resServicesReturnFilingErr).then((res) => {});
              }
            );
        } else {
          this.changeChildrenService.changeProcess({ proccess: "reload" });
          this.operacionesTiposRadicados();
        }
      });
    });
  }

  transactionSchedule(dataObserva) {
    let params = {
      data: dataObserva.data,
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
        },
      },
    };

    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/schedule", params, this.authorization)
      .subscribe(
        (res) => {
          this.resServicesSchedule = res;
          // console.log(this.resServicesSchedule);

          this.globalAppService.resolveResponse(this.resServicesSchedule, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resServicesSchedule["message"]);
              // this.sweetAlertService.showSwal( 'success-message', 'Datos almacenados', this.resServicesSchedule['']);
              // Cargando false
              this.sweetAlertService.sweetClose();
              this.changeChildrenService.changeProcess({ proccess: "reload" });
              this.operacionesTiposRadicados();
            }
          });
        },
        (err) => {
          this.resServicesScheduleErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesScheduleErr).then((res) => {});
        }
      );
  }

  /**
   * funcion que realiza una asignación a un usuario para que continue con el tramite
   * @param dataObserva data del modal observaciones
   */
  transactionReasing(dataObserva) {
    let params = {
      data: dataObserva.data,
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
          idInitialList: this.paramOID,
        },
      },
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/re-asign", params, this.authorization)
      .subscribe(
        (res) => {
          this.resServicesReasign = res;

          this.globalAppService.resolveResponse(this.resServicesReasign, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resServicesReasign["message"]);
              // Cargando false
              this.sweetAlertService.sweetClose();
              this.router.navigate([this.redirectionPath]);
            } else {
              this.changeChildrenService.changeProcess({ proccess: "reload" });
              this.operacionesTiposRadicados();
            }
          });
        },
        (err) => {
          this.resServicesReasignErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesReasignErr).then((res) => {});
        }
      );
  }

  /**
   * funcion que solicita VOBO o realiza una asignación a un usuario para que de un (visto bueno) VOBO
   * @param dataObserva data del modal observaciones
   */
  transactionVoboRequest(dataObserva) {
    let params = {
      data: dataObserva.data,
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
          idInitialList: this.paramOID,
        },
      },
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/solicita-vobo", params, this.authorization)
      .subscribe(
        (res) => {
          this.resServicesSoliVobo = res;

          this.globalAppService.resolveResponse(this.resServicesSoliVobo, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resServicesSoliVobo["message"]);
              // Cargando false
              this.sweetAlertService.sweetClose();
              this.router.navigate([this.redirectionPath]);
            }
          });
        },
        (err) => {
          this.resServicesSoliVoboErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesSoliVoboErr).then((res) => {});
        }
      );
  }

  /**
   * Transaccion de VOBO (Visto bueno) no recive nada, pero toma los ID's de los radicados
   * seleccionados para el debido consumo de servicio
   */
  transactionVobo() {
    /** Se asigna el valor del id del radicado que se está actualizando */
    let data = {
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
          idInitialList: this.paramOID,
        },
      },
    };
    // Cargando true
    this.sweetAlertService.sweetLoading();

    this.restService.restPut(this.versionApi + "radicacion/transacciones/vobo", data, this.authorization).subscribe(
      (res) => {
        this.resServicesVobo = res;

        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resServicesVobo, false, this.redirectionPath).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification("success", this.resServicesVobo["message"]);
            this.continueTransaccion();
            // Cargando false
            this.sweetAlertService.sweetClose();
          } else {
            this.changeChildrenService.changeProcess({ proccess: "reload" });
            this.operacionesTiposRadicados();
          }
        });
      },
      (err) => {
        this.resServicesVoboErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService
          .resolveResponseError(this.resServicesVoboErr, false, this.redirectionPath)
          .then((res) => {});
      }
    );
  }

  /**
   * Mensaje de confirmación para continuar con la trasacciones
   */
  continueTransaccion() {
    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // console.log( this.resSerLenguage );
      this.titleMsg = "";
      this.textMsg = this.resSerLenguage["textMsContinuarPro"];
      let textReasignar = this.resSerLenguage["Reasignar"];
      let textDevolver = this.resSerLenguage["Devolver"];

      swal({
        title: this.titleMsg,
        text: this.textMsg,
        type: "success",
        showCancelButton: true,
        cancelButtonText: textReasignar,
        confirmButtonText: textDevolver,
        cancelButtonClass: "btn btn-success",
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false,
      }).then((result) => {
        if (String(result.dismiss) === "overlay") {
          this.changeChildrenService.changeProcess({ proccess: "reload" });
          this.operacionesTiposRadicados();
        }

        if (result.value) {
          // Transacion Devolver
          // Le asigna la operacion a ejecutar
          this.operationDialogObserva = "returnFiling";
          this.textFormObservaHeader = "Devolver radicado";
          this.statusModalMain = true;
        }
        // Si el valor es igual a cancelar entonces es reasignar
        if (String(result.dismiss) === "cancel") {
          // Transaccion send - reasignar
          this.showReasignacion = true; // Transaccion reasignacion
          // Le asigna la operacion a ejecutar
          this.operationDialogObserva = "send";
          // Titulo del modal segun el title del boton
          this.textFormObservaHeader = "Reasignar";
          // muestra el componente
          this.statusModalMain = true;
        }
      });
    });
  }

  /**
   * Transaccion de copiar informado
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario
   */
  transactionCopyInformaded(dataObserva) {
    let dataSend = {
      data: dataObserva.data,
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
          idInitialList: this.paramOID,
        },
      },
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.versionApi + "radicacion/informados/copy", dataSend, this.authorization).subscribe(
      (res) => {
        this.resServicesCopyInfo = res;

        this.globalAppService.resolveResponse(this.resServicesCopyInfo, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification("success", this.resServicesCopyInfo["message"]);
            // Cargando false
            this.sweetAlertService.sweetClose();
            this.changeChildrenService.changeProcess({ proccess: "reload" });
            this.operacionesTiposRadicados();
          }
        });
      },
      (err) => {
        this.resServicesCopyInfoErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resServicesCopyInfoErr).then((res) => {});
      }
    );
  }

  /**
   * Transaccion de finalizar radicado
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario
   */
  transactionFinalizeFiling(dataObserva) {
    let dataSend = {
      data: dataObserva.data,
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
          idInitialList: this.paramOID,
        },
      },
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/finalize-filing", dataSend, this.authorization)
      .subscribe(
        (res) => {
          this.resServicesFinalizeFiling = res;

          this.globalAppService.resolveResponse(this.resServicesFinalizeFiling, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resServicesFinalizeFiling["message"]);
              // Cargando false
              this.sweetAlertService.sweetClose();
              this.router.navigate([this.redirectionPath]);
            } else {
              this.changeChildrenService.changeProcess({ proccess: "reload" });
              this.operacionesTiposRadicados();
            }
          });
        },
        (err) => {
          this.resServicesFinalizeFilingErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesFinalizeFilingErr).then((res) => {});
        }
      );
  }

  /**
   * Función para enviar documentos firmados
   * @param dataVal
   */
  transactionShippingReady() {
    let dataSend = {
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
          idInitialList: this.paramOID,
        },
      },
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/shipping-ready", dataSend, this.authorization)
      .subscribe(
        (res) => {
          this.resSerShippingReady = res;

          this.globalAppService.resolveResponse(this.resSerShippingReady, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resSerShippingReady["message"]);
              // Cargando false
              this.sweetAlertService.sweetClose();
              this.router.navigate([this.redirectionPath]);
            } else {
              this.changeChildrenService.changeProcess({ proccess: "reload" });
              this.operacionesTiposRadicados();
            }
          });
        },
        (err) => {
          this.resSerShippingReadyErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerShippingReadyErr).then((res) => {});
        }
      );
  }

  /**
   * Funcion para solicitar la anulacion de un radicado
   * @param dataObserva data del modal observaciones
   */
  transactionCancellationRequest(dataObserva) {
    let params = {
      data: dataObserva.data,
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
        },
      },
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/solicita-anulacion-radicado", params, this.authorization)
      .subscribe(
        (res) => {
          this.resServicesAnnulment = res;

          this.globalAppService.resolveResponse(this.resServicesAnnulment, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resServicesAnnulment["message"]);
              // Cargando false
              this.sweetAlertService.sweetClose();
              this.changeChildrenService.changeProcess({ proccess: "reload" });
              this.operacionesTiposRadicados();
            }
          });
        },
        (err) => {
          this.resServicesAnnulmentErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesAnnulmentErr).then((res) => {});
        }
      );
  }

  /**
   * Funcion para descartar un consecutivo "radicado temporal"
   * @param dataObserva data del modal observaciones
   */
  transactionDiscardConsecutive(dataObserva) {
    let params = {
      data: dataObserva.data,
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
        },
      },
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/descartar-consecutivo", params, this.authorization)
      .subscribe(
        (res) => {
          this.resServicesDiscardConsecutive = res;

          this.globalAppService.resolveResponse(this.resServicesDiscardConsecutive, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resServicesDiscardConsecutive["message"]);
              // Cargando false
              this.sweetAlertService.sweetClose();
              this.changeChildrenService.changeProcess({ proccess: "reload" });
              this.operacionesTiposRadicados();
            }
          });
        },
        (err) => {
          this.resServicesDiscardConsecutiveErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesDiscardConsecutiveErr).then((res) => {});
        }
      );
  }

  /**
   * Funcion que incluye los radicados a expedientes
   * @param dataObserva
   */
  transactionIncludeFiles(dataObserva) {
    this.sweetAlertService.sweetLoading();

    let params = {
      data: dataObserva.data,
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
          idInitialList: this.paramOID,
        },
      },
    };

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/include-expedient", params, this.authorization)
      .subscribe(
        (res) => {
          this.resSerIncludeFiles = res;
          // console.log(this.resSerIncludeFiles);

          this.globalAppService.resolveResponse(this.resSerIncludeFiles, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resSerIncludeFiles["message"]);
              // Cargando false
              this.sweetAlertService.sweetClose();
            }
            this.changeChildrenService.changeProcess({ proccess: "reload" });
            this.operacionesTiposRadicados();
          });
        },
        (err) => {
          this.resSerIncludeFilesErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerIncludeFilesErr).then((res) => {});
        }
      );
  }

  /**
   * Funcion que imprime los radicados seleccionados
   */
  transactionPrintStickers() {
    this.sweetAlertService.sweetLoading();
    let params = {
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
          idInitialList: this.paramOID,
        },
      },
    };

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/print-sticker", params, this.authorization)
      .subscribe(
        (res) => {
          this.resSerPrintStickers = res;
          // console.log(this.resSerPrintStickers);

          this.globalAppService.resolveResponse(this.resSerPrintStickers, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resSerPrintStickers["message"]);
              if (this.resSerPrintStickers.datafile) {
                this.resSerPrintStickers.datafile.forEach((dtFile) => {
                  this.downloadFile(dtFile.dataFile, dtFile.fileName);
                });
              }
            }
            // Cargando false
            this.sweetAlertService.sweetClose();
            this.changeChildrenService.changeProcess({ proccess: "reload" });
          });
        },
        (err) => {
          this.resSerPrintStickersErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerPrintStickersErr).then((res) => {});
        }
      );
  }

  sendEmailClient() {
    if (this.paramOID) {
      /** Mensajes de internacionalización con servicio  translate*/
      const titleMsg = this.translate.instant("titleMsg");
      const textMsg = this.translate.instant("textMsgSendMail") + this.hashLocalStorage.data.radiSendReplyEMail;
      const bntCancelar = this.translate.instant("bntCancelarSendMail");
      const btnConfirmacion = this.translate.instant("btnConfirmacionSendMail");

      swal({
        title: titleMsg,
        text: textMsg,
        type: "warning",
        showCancelButton: true,
        cancelButtonText: bntCancelar,
        confirmButtonText: btnConfirmacion,
        cancelButtonClass: "btn btn-danger",
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          /** Se asigna el valor del id del radicado que se está actualizando */
          let data = {
            id: {
              0: {
                id: this.paramOID,
              },
            },
          };
          // Cargando true
          this.sweetAlertService.sweetLoading();

          this.restService
            .restPut(this.versionApi + "radicacion/transacciones/send-reply-mail", data, this.authorization)
            .subscribe(
              (res) => {
                this.resServicesSendEmailCli = res;

                // Evaluar respuesta del servicio
                this.globalAppService
                  .resolveResponse(this.resServicesSendEmailCli, false, this.redirectionPath)
                  .then((res) => {
                    let responseResolveResponse = res;
                    if (responseResolveResponse == true) {
                      this.sweetAlertService.showNotification("success", this.resServicesSendEmailCli.message);
                      // this.sweetAlertService.showSwal( 'success-message', 'Datos almacenados', this.resServicesSendEmailCli.message);
                      // Redirecciona a la pagina principal
                      // this.router.navigate([ this.redirectionPath ]);
                      this.sweetAlertService.sweetClose();
                      this.changeChildrenService.changeProcess({ proccess: "reload" });
                      this.operacionesTiposRadicados();
                    }
                  });
              },
              (err) => {
                this.resServicesSendEmailCliErr = err;
                // Evaluar respuesta de error del servicio
                this.globalAppService
                  .resolveResponseError(this.resServicesSendEmailCliErr, true, this.redirectionPath)
                  .then((res) => {});
              }
            );
        }
      });
    }
  }

  closeModalSendDocs(data) {
    this.statusModalUploadFile = false;
  }

  /** Toma la información emitida desde el componente de documentos */
  actionsDocsButton(params) {
    if (params.focus) {
      this.itemCardSelected = true;
      if (this.inFirmaFisica && params.card == "cardMainDocs") {
        this.menuButtons = [
          {
            icon: "bookmarks",
            title: "Versionamiento",
            action: "versionFormat",
            data: params.menuButtonsSelect[0]["data"],
          },
        ];
      } else {
        this.menuButtons = params.menuButtonsSelect;
      }
    } else {
      this.itemCardSelected = false;
      this.menuButtons = this.menuButtonsSelectOne;
    }

    this.paramsDownload = params.id;
    this.dataDocumentos = params.dataDoc;
  }

  getDataUserTramitador(data) {
    this.dataUserTramitador = data;
  }

  getDataExpedient(data) {
    this.idExpediente = ConvertParamsBase64Helper(data.idExpediente); // Se pasa al html como componete para que reciba el ID
    this.numeroRadicado = data.numeroRadiRadicado; // Se pasa al html como componete para que reciba el ID
  }

  /** Descarga de paquete de documentos del radicado */
  downloadDocumentPackage() {
    const titleMsg = this.translate.instant("titleMsg");
    const textMsg = this.translate.instant("textMsgDownloadDocumentPackage");
    const bntCancelar = this.translate.instant("bntCancelar");
    const btnConfirmacion = this.translate.instant("btnConfirmacionDownloadDocumentPackage");

    swal({
      title: titleMsg,
      text: textMsg,
      type: "warning",
      showCancelButton: true,
      cancelButtonText: bntCancelar,
      confirmButtonText: btnConfirmacion,
      cancelButtonClass: "btn btn-danger",
      confirmButtonClass: "btn btn-success",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        /** Se asigna el valor del id del radicado seleccionado */
        let data = {
          id: this.paramOID,
        };
        // Cargando true
        this.sweetAlertService.sweetLoading();

        this.restService
          .restPost(this.versionApi + "radicacion/radicados/download-document-package", data, this.authorization)
          .subscribe(
            (res) => {
              this.resServicesDownloadDocumentPackage = res;
              // Evaluar respuesta del servicio
              this.globalAppService.resolveResponse(this.resServicesDownloadDocumentPackage, false).then((res) => {
                let responseResolveResponse = res;
                if (responseResolveResponse == true) {
                  this.downloadFile(
                    this.resServicesDownloadDocumentPackage.datafile,
                    this.resServicesDownloadDocumentPackage.fileName
                  );
                  // Cargando false
                  this.sweetAlertService.sweetClose();
                }
              });
            },
            (err) => {
              this.resServicesDownloadDocumentPackageErr = err;
              // Evaluar respuesta de error del servicio
              this.globalAppService
                .resolveResponseError(this.resServicesDownloadDocumentPackageErr, false)
                .then((res) => {});
            }
          );
      }
    });
  }

  dowloadDocuments(idDocuments) {
    let data = {
      ButtonSelectedData: {
        0: {
          id: idDocuments,
        },
      },
    };

    this.sweetAlertService.sweetLoading();

    this.restService.restPut(this.versionApi + this.ruoteServiceDownloadAnexo, data, this.authorization).subscribe(
      (res) => {
        this.resServicesDownload = res;
        this.globalAppService.resolveResponse(this.resServicesDownload, false).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.downloadFile(this.resServicesDownload.datafile, this.resServicesDownload.fileName);
            this.sweetAlertService.showNotification("success", this.resServicesDownload["message"]);
          }
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

  /**
   * Mensaje de confirmación para continuar con la trasaccion de publicar documento
   */
  continueTransaccionPublicDoc(event) {
    let titleShow: string;
    // Valida si es publico en página PQRSD
    if (!event.statusIdPublic) {
      titleShow = "textMsgPublicDoc";
    } else {
      titleShow = "textMsgPrivateDoc";
    }

    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // console.log( this.resSerLenguage );
      let titleMsg = "";
      let textMsg = this.resSerLenguage[titleShow];
      let textConf = this.resSerLenguage["btnConfirmar"];
      let textCancel = this.resSerLenguage["Cancelar"];

      swal({
        title: titleMsg,
        text: textMsg,
        type: "success",
        showCancelButton: true,
        cancelButtonText: textCancel,
        confirmButtonText: textConf,
        confirmButtonClass: "btn btn-success",
        cancelButtonClass: "btn btn-danger",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          // Transacion Devolver
          this.transactionPublicDoc(event);
        }
      });
    });
  }

  /**
   * Funcion para publicar documentos
   * @param dataVal data seleccionada de los documentos principales
   */
  transactionPublicDoc(dataVal) {
    let data = {
      ButtonSelectedData: [dataVal],
      data: {
        type: "documento",
      },
    };
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/publish-document", data, this.authorization)
      .subscribe(
        (res) => {
          this.resSerPublicDoc = res;

          this.globalAppService.resolveResponse(this.resSerPublicDoc, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resSerPublicDoc["message"]);
              // loading false
              this.sweetAlertService.sweetClose();
              // Regargar la data
              this.changeChildrenService.changeProcess({ proccess: "reload" });
            }
          });
        },
        (err) => {
          this.resSerPublicDocErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerPublicDocErr).then((res) => {});
        }
      );
  }

  /**
   * Transaccion de desiste el ciudadano
   * @param data llegan los ids de radicado
   */
  transactionWithdrawal(dataObserva) {
    /** Se asigna el valor del id del radicado que se está actualizando */
    let params = {
      ButtonSelectedData: {
        0: {
          id: this.paramOID,
          idInitialList: this.paramOID,
        },
      },
      observacion: dataObserva.data.observacion,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/withdrawal", params, this.authorization)
      .subscribe(
        (res) => {
          this.resSerWithdrawal = res;
          // console.log(this.resSerWithdrawal);

          this.globalAppService.resolveResponse(this.resSerWithdrawal, false).then((res) => {
            let responseResolveResponseDown = res;

            if (responseResolveResponseDown == true) {
              this.sweetAlertService.showNotification("success", this.resSerWithdrawal.message);
              // loading false
              this.sweetAlertService.sweetClose();
              // Redirecciona
              this.router.navigate([this.redirectionPath]);
            }
          });
        },
        (err) => {
          this.resSerWithdrawalErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerWithdrawalErr).then((res) => {});
        }
      );
  }

  /**
   * Transacción excluir documentos del expediente
   */
  transactionExcludeExpedient(idExpediente) {
    const titleMsg = this.translate.instant("titleMsg");
    const textMsg = this.translate.instant("textMsgExcluirRad");
    const bntCancelar = this.translate.instant("bntCancelar");
    const btnConfirmacion = this.translate.instant("btnConfirmar");

    swal({
      title: titleMsg,
      text: textMsg,
      type: "warning",
      showCancelButton: true,
      cancelButtonText: bntCancelar,
      confirmButtonText: btnConfirmacion,
      cancelButtonClass: "btn btn-danger",
      confirmButtonClass: "btn btn-success",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        /** Se asigna el valor del id del expediente seleccionado */
        let data = {
          idGdExpediente: idExpediente,
          ButtonSelectedData: {
            0: {
              numeroRadiRadicado: this.numeroRadicado,
              idInitialList: this.paramOID,
            },
          },
        };
        // Cargando true
        this.sweetAlertService.sweetLoading();

        this.restService
          .restPost(this.versionApi + "gestionDocumental/expedientes/exclude-expedient", data, this.authorization)
          .subscribe(
            (res) => {
              this.resSerExcludeExp = res;
              // Evaluar respuesta del servicio
              this.globalAppService.resolveResponse(this.resSerExcludeExp, false).then((res) => {
                let responseResolveResponse = res;
                if (responseResolveResponse == true) {
                  this.operacionesTiposRadicados();
                  this.changeChildrenService.changeProcess({ proccess: "reload" });
                }
                // Cargando false
                this.sweetAlertService.sweetClose();
              });
            },
            (err) => {
              this.resSerExcludeExpErr = err;
              // Evaluar respuesta de error del servicio
              this.globalAppService.resolveResponseError(this.resSerExcludeExpErr, false).then((res) => {});
            }
          );
      }
    });
  }

  closePdfModal(data) {
    this.statusModalviewPdf = false;
  }

  closeSendReplyMailModal(dataModal) {
    this.statusSendReplyMailModal = false;
    if (dataModal.status) {
      this.changeChildrenService.changeProcess({ proccess: "reload" });
      this.operacionesTiposRadicados();
    }
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

  /** Métodos para el uso de la internacionalización */
  detectLanguageInitial() {
    if (localStorage.getItem("language")) {
      this.activeLang = localStorage.getItem("language");
    } else {
      this.activeLang = "es";
    }
    this.translate.setDefaultLang(this.activeLang);
  }

  detectLanguageChange() {
    this.subscriptionTranslateService$ = this.activateTranslateService.activateLanguageChange.subscribe((language) => {
      this.languageReceive = language;
      this.translate.setDefaultLang(this.languageReceive);
    });
  }
  /** Fin Métodos para el uso de la internacionalización */

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }
}
