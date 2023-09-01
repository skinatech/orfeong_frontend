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
import { ConvertParamsBase64Helper } from "src/app/helpers/convert-params-base64.helper";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { RestService } from "src/app/services/rest.service";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { GlobalAppService } from "src/app/services/global-app.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivateTranslateService } from "src/app/services/activate-translate.service";
import swal from "sweetalert2";
import { ChangeChildrenService } from "src/app/services/change-children.service";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-doc-manag-folder-view",
  templateUrl: "./doc-manag-folder-view.component.html",
  styleUrls: ["./doc-manag-folder-view.component.css"],
})
export class DocManagFolderViewComponent implements OnInit, OnDestroy {
  // Autentificacion
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID = 0;
  // Nombre del formulario
  textFormView = "Detalle de expediente"; // i18n
  /** Datos que solicita el ViewList */
  // Ruta a consultar en el ViewList
  reuteLoadView: string = "gestionDocumental/expedientes/view";
  // Ruta a actualizar en el ViewList
  routeBotonUpdateView: string = "/documentManagement/folder-update/";
  // Icono del ViewList
  initCardHeaderIcon = "fact_check";
  // Ruta a redirigir
  redirectionPath = "/documentManagement/folder-index/false";
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { name: "Gestión documental", route: "/documentManagement" },
    { name: "Expedientes", route: this.redirectionPath },
  ];
  breadcrumbRouteActive = "Detalles";
  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderTitle = "Documentos de expediente";
  routeLoadDataTablesService: string =
    environment.versionApiDefault + "gestionDocumental/expedientes/index-exp-documentos";
  routeIndIndex: string = "/documentManagement/folder-ind-index/";
  viewColumStatus: false; // Se olculta el campo status
  classMainConten: string = "";
  classContainerFluid: string = "";
  dtTitles: any = [
    { title: "Número radicado", data: "numeroRadiRadicado" },
    { title: "Tipo documental", data: "nombreGdTrdTipoDocumental" },
    { title: "Documento", data: "nombreRadiDocumento" },
    { title: "Descripción", data: "descripcionRadiDocumentoRadicado" },
    { title: "Fecha documento", data: "creacionRadiDocumento" },
  ];
  /**
   * Configuración para el botón flotante
   */
  iconMenu: string = "edit";
  dataRows: any;
  dataRows1: any;
  dataDividita: any;
  valorDividido: any;
  data1: any = [];
  data2: any = [];
  // Para el proceso del historico del radicado se muestra la data correspondiente
  dataRowsHistorico: any;
  statusSeeMoreHistory: boolean = false; // Muestra div ver mas
  statusSeeHistory: boolean = true; // Muestra div ver mas
  numberLimitHistory: number; // Limite de 3
  minLimit: number = 5; // Limite de 3
  // Version api
  versionApi = environment.versionApiDefault;
  // Variables de servicios
  responseServiceView: any;
  responseServiceViewErr: any;

  initBotonCreateRoute: string = "/documentManagement/folder-create"; // Ruta del botón crear
  initBotonUpdateRoute: string = "/documentManagement/folder-update"; // Ruta editar

  menuButtonsSelectOneClose: any = [
    { icon: "add", title: "Agregar", action: "add", data: "" },
    { icon: "cloud_download", title: "Descarga paquete documentos", action: "downloadExpedientPackage", data: "" },
    { icon: "featured_play_list", title: "Hoja de control", action: "controlSheet", data: "" },
    { icon: "playlist_add_check_circle", title: "Paz y salvo", action: "peaceAndSafe", data: "" },
    { icon: "lock_open", title: "Reabrir expediente", action: "openFolder", data: "" },
  ];

  menuButtonsSelectOneOpen: any = [
    { icon: "add", title: "Agregar", action: "add", data: "" },
    { icon: "edit", title: "Editar", action: "edit", data: "" },
    { icon: "attachment", title: "Carga de documentos", action: "attachment", data: "" },
    { icon: "cloud_download", title: "Descarga paquete documentos", action: "downloadExpedientPackage", data: "" },
    { icon: "featured_play_list", title: "Hoja de control", action: "controlSheet", data: "" },
    { icon: "playlist_add_check_circle", title: "Paz y salvo", action: "peaceAndSafe", data: "" },
    { icon: "lock", title: "Cerrar expediente", action: "closeFolder", data: "" },
  ];

  menuButtonsSelectOne: any = [];

  menuButtonsSelectDocumentMasive: any = [
    { icon: "work_off", title: "Excluir documentos", action: "excludeTheFile", data: "" },
  ];

  menuButtonsSelectDocumentNoPdf: any = [
    { icon: "work_off", title: "Excluir documentos", action: "excludeTheFile", data: "" },
    { icon: "cloud_download", title: "Descargar", action: "Descargar", data: "" },
  ];

  menuButtonsSelectDocumentPdf: any = [
    { icon: "work_off", title: "Excluir documentos", action: "excludeTheFile", data: "" },
    { icon: "remove_red_eye", title: "Ver", action: "Ver", data: "" },
    { icon: "cloud_download", title: "Descargar", action: "Descargar", data: "" },
  ];

  eventSelectData: any;

  // boton paar referencia cruzada // note_alt // folder_special
  buttonCrossReference: any = { icon: "text_snippet", title: "Referencia cruzada", action: "crossReference", data: "" };
  existeFisicamenteGdExpediente: boolean = false; // indica si el expediente existe físicamente (híbrido)
  statusModalCrossReference: boolean = false; // Muestra u oculta el modal de referencia cruzada
  havePermissionCrossReference: boolean = false; // Permiso para referencia cruzada
  havePermissionUpdate: boolean = false; // Permiso para update

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectOne;
  eventClickButtonSelectedData: any;
  operationDialogObserva: string; // Menu seleccionado

  /** Variables para modal de carga de documentos */
  statusUploadFileAneMasive: boolean = false; // muestra o oculta el modal
  // Upload Documents Anexos
  ruoteServiceDocumentsAne: string =
    environment.apiUrl + this.versionApi + "radicacion/transacciones/upload-document-to-expedient";
  validateFileAnexos: any = environment.validateFile.anexosRadicado;
  dataSend: any; // Data que se le envia al front de los radicados
  textForm: string; // Titulo del modal
  textFormLabel: string; // Muestra el nombre del Expediente

  routeServicePeaceAndSafe = "gestionDocumental/expedientes/peace-and-safe";

  /** Descarga paquete de documentos asociados al expediente */
  resServicesDownloadExpedientPackage: any;
  resServicesDownloadExpedientPackageErr: any;
  resServicesDownload: any;
  resServicesDownloadErr: any;
  /** variables para excluir expediente */
  resSerExcludeExp: any;
  resSerExcludeExpErr: any;

  resSerChangeStatus: any;
  resSerChangeStatusErr: any;
  resSerCloseFolder: any;
  resSerCloseFolderErr: any;
  resSerOpenFolder: any;
  resSerOpenFolderErr: any;

  /** Variables para internacionalizacion */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  // Muestra el campo de fecha documento en el formulario de cargar documentos
  showFechaDoc: boolean = true;
  // Estado del expediente
  statusExpedient: any;
  dataDepen: any; // data depenendcia, serie, subserie

  // Variables de modal
  statusModalMain = false; // Muestra o oculta el modal
  showPass = true; // Muestra o oculta el campo password en el modal
  textFormObservaHeader = ""; // Titulo del modal
  initialNotificationMessageArray = []; // Mensaje de notificación
  textPassword = "Digite su contraseña";
  observacionModal: boolean = true; // muestra el campo observacion del modal

  /** Variables para el modal pdf */
  statusModalviewPdf: boolean = false;
  ruoteServiceDownloadFile: string = "";
  paramsDownload: any; // Esta variable toma el valor del id del documento seleccionado y lo pasa opción de descaga
  dataExpediente: any; 

  constructor(
    private route: ActivatedRoute,
    public lhs: LocalStorageService,
    public sweetAlertService: SweetAlertService,
    public restService: RestService,
    private router: Router,
    public globalAppService: GlobalAppService,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService,
    private changeChildrenService: ChangeChildrenService
  ) {
    this.paramiD = this.route.snapshot.paramMap.get("id"); // SE recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
    this.routeBotonUpdateView = this.routeBotonUpdateView + this.paramiD;
    this.routeIndIndex = this.routeIndIndex + this.paramiD;

    /** Idioma inical */
    this.detectLanguageInitial();
  }

  ngOnInit() {
    /** Detectando si se ejecuta cambio de idioma */
    this.detectLanguageChange();

    // Hace el llamado del token
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      if (this.paramOID != 0) {
        this.getCallUrl(this.authorization);
      }
    });
  }

  getCallUrl(authori) {
    let params = {
      id: this.paramOID,
    };

    this.restService.restGetParams(this.versionApi + this.reuteLoadView, params, authori).subscribe(
      (res) => {
        this.responseServiceView = res;
        
        // console.log(this.responseServiceView);
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceView, false, this.redirectionPath).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            if (this.responseServiceView.data) {
              this.dataRows = this.responseServiceView.data;

              this.dataExpediente = {
                id: this.paramOID,
                numeroExpediente: this.dataRows[0].value,
              }; 

              this.statusExpedient = this.responseServiceView.statusExpedient;
              this.existeFisicamenteGdExpediente = this.responseServiceView.existeFisicamenteGdExpediente;
              this.havePermissionCrossReference = this.responseServiceView.havePermissionCrossReference;
              this.havePermissionUpdate = this.responseServiceView.havePermissionUpdate;

              // asigna los botones
              if (
                this.statusExpedient == environment.statusExpedienteText.Abierto ||
                this.statusExpedient == environment.statusExpedienteText.PendienteCerrar
              ) {
                this.menuButtonsSelectOne = JSON.parse(JSON.stringify(this.menuButtonsSelectOneOpen));
                
                if (this.existeFisicamenteGdExpediente == true && this.havePermissionCrossReference == true) {
                  this.menuButtonsSelectOne.push(this.buttonCrossReference);
                }

                if (this.havePermissionUpdate == false) {
                  this.menuButtonsSelectOne.splice(1, 1);
                  this.menuButtonsSelectOne.splice(5, 1);
                }

              } else {
                this.menuButtonsSelectOne = this.menuButtonsSelectOneClose;
              }

              // Valida que tenga mensajes para que los muestre en notificacion
              if (this.responseServiceView.notificacion.length > 0) {
                this.responseServiceView.notificacion.forEach((dataSer) => {
                  this.sweetAlertService.showNotification(dataSer.type, dataSer.message);
                });
              }

              // Asigna los botones
              this.menuButtons = this.menuButtonsSelectOne;

              if (this.responseServiceView.dataHistorico) {
                this.dataRowsHistorico = this.responseServiceView.dataHistorico;
                if (this.dataRowsHistorico.length > this.minLimit) {
                  this.statusSeeMoreHistory = true;
                  this.numberLimitHistory = this.minLimit;
                }
                // Asigna la dataDepen que necesita para mostrar los tipos documentales
                if (this.responseServiceView.dataDepen) {
                  this.dataDepen = this.responseServiceView.dataDepen;
                }
              }
            }
          }
        });
      },
      (err) => {
        this.responseServiceViewErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService
          .resolveResponseError(this.responseServiceViewErr, true, this.redirectionPath)
          .then((res) => {});
      }
    );
  }

  /**
   * Fuincion que cambia el estado de ver mas en Documentos
   * @param status // Estado
   * @param module // Modulo a consultar
   */
  seeMoreAndLess(status, module) {
    if (status) {
      // Valida modulo
      switch (module) {
        case "History":
          this.numberLimitHistory = this.dataRowsHistorico.length;
          break;
      }
    } else {
      // Valida modulo
      switch (module) {
        case "History":
          this.numberLimitHistory = this.minLimit;
          break;
      }
    }
    // Asigna el valor contrario
    switch (module) {
      case "History":
        this.statusSeeHistory = !this.statusSeeHistory;
        break;
    }
  }

  menuPrimaryReceiveData(event) {
    this.router.navigate(["/" + this.routeBotonUpdateView]);
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {
    // Asigna el valor para utilizar lo en otras funciones
    this.operationDialogObserva = event.action;

    switch (event.action) {
      case "add":
        this.router.navigate(["/" + this.initBotonCreateRoute]);
        break;
      case "edit":
        this.router.navigate(["/" + this.initBotonUpdateRoute + "/" + this.paramiD]);
        break;
      case "changeStatus":
        this.changeStatus();
        break;
      case "attachment":
        this.dataSend = [{ id: this.paramOID }];
        this.textForm = event.title;
        // Nombre del expediente y TRD
        this.textFormLabel = "";
        this.statusUploadFileAneMasive = true;
        break;
      case "downloadExpedientPackage":
        this.downloadDocumentPackage(this.paramOID);
        break;
      case "excludeTheFile":
        this.transactionExcludeExpedient(this.paramOID);
        break;
      case "closeFolder":
        // Cerrar expediente
        this.textFormObservaHeader = event.title;
        this.observacionModal = true;
        this.initialNotificationMessageArray = ["textCierreFolder"]; // Mensaje de notificación
        this.confirmaCloseFolder();
        break;
      case "openFolder":
        // Abrir expediente
        this.textFormObservaHeader = event.title;
        this.observacionModal = false;
        this.initialNotificationMessageArray = ["textOpenFolder"]; // Mensaje de notificación
        this.confirmarOpenFolder();
        break;
      case "crossReference":
        this.eventSelectData = {
          0: {
            id: this.paramOID,
            // idInitialList: this.paramOID
          },
        };
        this.statusModalCrossReference = true;
        break;
      case "Ver":
        this.statusModalviewPdf = true;
        break;
      case "Descargar":
        this.dowloadDocuments(this.paramsDownload);
        break;
      case "controlSheet":
        this.ruoteServiceDownloadFile = "gestionDocumental/expedientes/download-control-sheet";
        this.dowloadDocuments(this.paramOID);
        break;
      case "peaceAndSafe":
        this.processPeaceAndSafe();
        break;
    }
  }

  processPeaceAndSafe() {
    const data = {
      data: this.dataExpediente, // Data de los expedientes seleccionados
    };

    this.sweetAlertService.sweetLoading();

    this.restService.restPost(`${this.versionApi}${this.routeServicePeaceAndSafe}`, data, this.authorization).subscribe(
      (responseApi) => {
        this.globalAppService.resolveResponse(responseApi, false).then((responseGlobal) => {
          if (responseGlobal === true) {
            this.downloadFile(responseApi.datafile, responseApi.fileName);
            this.sweetAlertService.showNotification("success", responseApi.message);
          }

          this.sweetAlertService.sweetClose();
        });
      },
      (err) => this.globalAppService.resolveResponseError(err)
    );
  }

  /**
   * Función de descarga del documento seleccionado
   * @param idDocument
   */
  dowloadDocuments(idDocument) {
    let data = {
      ButtonSelectedData: {
        0: {
          id: idDocument,
        },
      },
    };
    this.sweetAlertService.sweetLoading();

    this.restService.restPut(this.versionApi + this.ruoteServiceDownloadFile, data, this.authorization).subscribe(
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

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {
    this.statusUploadFileAneMasive = false;
    this.statusModalMain = false;
    // dataObserva es la data que retorna el componente de observaciones
    if (dataObserva.status) {
      switch (this.operationDialogObserva) {
        case "closeFolder":
          this.tansacctionCloseFolder(dataObserva.data);
          break;
        case "openFolder":
          this.transacctionOpenFolder(dataObserva.data);
          break;
      }
    } else {
      this.getCallUrl(this.authorization);
      this.changeChildrenService.changeProcess({ proccess: "reload" });
    }
  }

  closeCrossReferenceModal(data) {
    this.getCallUrl(this.authorization);
    this.changeChildrenService.changeProcess({ proccess: "reload" });
    this.statusModalCrossReference = false;
  }

  // Función que muestra el mensaje de confirmación antes de mostrar el modal de la transacción Cerrar expediente
  confirmaCloseFolder() {
    const titleMsg = this.translate.instant("titleMsg");
    const textMsg = this.translate.instant("textMsgFolderClose");
    const bntCancelar = this.translate.instant("bntCancelar");
    const btnConfirmacion = this.translate.instant("btnConfirmacion");

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
        this.statusModalMain = true; // Muestra el modal
      }
    });
  }

  confirmarOpenFolder() {
    const titleMsg = this.translate.instant("titleMsg");
    const textMsg = this.translate.instant("textMsgFolderOpen");
    const bntCancelar = this.translate.instant("bntCancelar");
    const btnConfirmacion = this.translate.instant("btnConfirmacion");

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
        this.statusModalMain = true; // Muestra el modal
      }
    });
  }

  /** Cambia el estado del expediente a Cerrado */
  tansacctionCloseFolder(data) {
    let ButtonSelectedData: any = {
      0: {
        id: this.paramOID,
        idInitialList: this.paramOID,
      },
    };

    let params = {
      ButtonSelectedData: ButtonSelectedData, // Data de los expedientes seleccionados
      data: data, // Data de las observaciones
    };
    // Cargando true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "gestionDocumental/expedientes/closed-expedient", params, this.authorization)
      .subscribe(
        (res) => {
          this.resSerCloseFolder = res;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerCloseFolder, false).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resSerCloseFolder.message);
              this.downloadFile(this.resSerCloseFolder.datafile, this.resSerCloseFolder.fileName);
              this.getCallUrl(this.authorization);
            }
            // Cargando false
            this.sweetAlertService.sweetClose();
          });
        },
        (err) => {
          this.resSerCloseFolderErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerCloseFolderErr, false).then((res) => {});
        }
      );
  }

  /** Cambia el estado del expediente a Cerrado */
  transacctionOpenFolder(data) {
    let ButtonSelectedData: any = {
      0: {
        id: this.paramOID,
        idInitialList: this.paramOID,
      },
    };

    let params = {
      ButtonSelectedData: ButtonSelectedData, // Data de los expedientes seleccionados
      data: data, // Data de las observaciones
    };
    // Cargando true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "gestionDocumental/expedientes/open-expedient", params, this.authorization)
      .subscribe(
        (res) => {
          this.resSerOpenFolder = res;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerOpenFolder, false).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resSerOpenFolder.message);
              if (this.resSerOpenFolder.datafile) {
                this.downloadFile(this.resSerOpenFolder.datafile, this.resSerOpenFolder.fileName);
              }
              this.getCallUrl(this.authorization);
            }
            // Cargando false
            this.sweetAlertService.sweetClose();
          });
        },
        (err) => {
          this.resSerOpenFolderErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerOpenFolderErr, false).then((res) => {});
        }
      );
  }

  /** Descarga de paquete de documentos de los radicados asociados al expediente */
  downloadDocumentPackage(idExpediente) {
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
        /** Se asigna el valor del id del expediente seleccionado */
        let data = {
          id: idExpediente,
        };
        // Cargando true
        this.sweetAlertService.sweetLoading();

        this.restService
          .restPost(this.versionApi + "gestionDocumental/expedientes/download-file-documents", data, this.authorization)
          .subscribe(
            (res) => {
              this.resServicesDownloadExpedientPackage = res;
              // Evaluar respuesta del servicio
              this.globalAppService.resolveResponse(this.resServicesDownloadExpedientPackage, false).then((res) => {
                let responseResolveResponse = res;
                if (responseResolveResponse == true) {
                  this.downloadFile(
                    this.resServicesDownloadExpedientPackage.datafile,
                    this.resServicesDownloadExpedientPackage.fileName
                  );
                }
                // Cargando false
                this.sweetAlertService.sweetClose();
              });
            },
            (err) => {
              this.resServicesDownloadExpedientPackageErr = err;
              // Evaluar respuesta de error del servicio
              this.globalAppService
                .resolveResponseError(this.resServicesDownloadExpedientPackageErr, false)
                .then((res) => {});
            }
          );
      }
    });
  }

  /**
   * Transacción excluir documentos del expediente
   */
  transactionExcludeExpedient(idExpediente) {
    const titleMsg = this.translate.instant("titleMsgExcluir");
    const textMsg = this.translate.instant("textMsgExcluir");
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
          ButtonSelectedData: this.eventClickButtonSelectedData,
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
                  this.getCallUrl(this.authorization);
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

  /** Cambiar estado del expediente */
  changeStatus() {
    // loading Active
    this.sweetAlertService.sweetLoading();
    let params = [this.paramOID + "|0"];

    this.restService
      .restPut(this.versionApi + "gestionDocumental/expedientes/change-status", params, this.authorization)
      .subscribe(
        (res) => {
          this.resSerChangeStatus = res;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerChangeStatus, true, this.redirectionPath).then((res) => {
            let resResolveResponse = res;
            if (resResolveResponse == true) {
              this.sweetAlertService.sweetClose();
              this.sweetAlertService.showNotification("success", this.resSerChangeStatus.message);
              this.getCallUrl(this.authorization);
              this.changeChildrenService.changeProcess({ proccess: "reload" });
            }
          });
        },
        (err) => {
          this.resSerChangeStatusErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService
            .resolveResponseError(this.resSerChangeStatusErr, true, this.redirectionPath)
            .then((res) => {});
        }
      );
  }

  /**
   *
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {
    this.eventClickButtonSelectedData = event;
    if (event.length > 0) {
      if (
        this.statusExpedient == environment.statusExpedienteText.Abierto ||
        this.statusExpedient == environment.statusExpedienteText.PendienteCerrar
      ) {
        this.analizeReceiveData(this.eventClickButtonSelectedData);
      } else {
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else {
      // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectOne;
    }
  }

  /** Analiza la data de los documentos seleccionados para definir las rutas de descarga y las acciones a permitir */
  analizeReceiveData(dataSelected) {
    if (dataSelected.length == 1) {
      this.paramsDownload = dataSelected[0].id;

      if (dataSelected[0].extension == "pdf") {
        this.menuButtons = this.menuButtonsSelectDocumentPdf;
      } else {
        this.menuButtons = this.menuButtonsSelectDocumentNoPdf;
      }

      if (dataSelected[0].model == "GdExpedienteDocumentos") {
        this.ruoteServiceDownloadFile = "gestionDocumental/expedientes/download-document";
      } else if (dataSelected[0].model == "RadiDocumentos") {
        this.ruoteServiceDownloadFile = "radicacion/documentos/download-document";
      } else if (dataSelected[0].model == "RadiDocumentosPrincipales") {
        this.ruoteServiceDownloadFile = "radicacion/documentos/download-doc-principal";
      } else if (dataSelected[0].model == "GdReferenciasCruzadas") {
        this.ruoteServiceDownloadFile = "gestionDocumental/expedientes/download-cross-reference";
      } else {
        this.ruoteServiceDownloadFile = "";
      }
    } else {
      this.menuButtons = this.menuButtonsSelectDocumentMasive;
    }
  }

  /**
   * Solo debe llegar el action
   * @param data idInitialList
   */
  eliminarRegistro(data) {
    /** Recorrido de la data de los buttons */
    this.menuButtons.forEach((element, index) => {
      if (element.action == data) {
        this.menuButtons.splice(index, 1);
      }
    });
  }

  closePdfModal(data) {
    this.statusModalviewPdf = false;
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
