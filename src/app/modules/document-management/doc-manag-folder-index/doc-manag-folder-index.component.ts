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
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
import { FloatingButtonService } from "src/app/services/floating-button.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivateTranslateService } from "../../../services/activate-translate.service";
import { LocalStorageService } from "../../../services/local-storage.service";
import swal from "sweetalert2";
import { SweetAlertService } from "../../../services/sweet-alert.service";
import { RestService } from "../../../services/rest.service";
import { GlobalAppService } from "../../../services/global-app.service";
import { ChangeChildrenService } from "src/app/services/change-children.service";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-doc-manag-folder-index",
  templateUrl: "./doc-manag-folder-index.component.html",
  styleUrls: ["./doc-manag-folder-index.component.css"],
})
export class DocManagFolderIndexComponent implements OnInit, OnDestroy {
  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = "fact_check";
  initCardHeaderTitle = "Listado de expedientes";
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = "Folder";
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = "/documentManagement/folder-index";
  /** Formulario index */
  initBotonCreateRoute: string = "/documentManagement/folder-create"; // Ruta del botón crear
  initBotonUpdateRoute: string = "/documentManagement/folder-update"; // Ruta editar
  initBotonViewRoute: string = "/documentManagement/folder-view"; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [{ name: "Gestión documental", route: "/documentManagement" }];
  breadcrumbRouteActive = "Expedientes";
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + "gestionDocumental/expedientes/index";
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + "gestionDocumental/expedientes/change-status";

  dtTitles: any = [
    { title: "Nº Expediente", data: "numeroExpediente" },
    { title: "Nombre", data: "nombreExpediente" },
    { title: "Serie", data: "serie" },
    { title: "Subserie", data: "subserie" },
    { title: "Fecha inicio del expediente", data: "fechaProceso" },
    { title: "Dependencia", data: "dependenciaCreador" },
    { title: "Usuario creador", data: "userCreador" },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  buttonPeaceAndSafe = { icon: "playlist_add_check_circle", title: "Paz y salvo", action: "peaceAndSafe", data: "" };
  menuButtonsSelectNull: any = [{ icon: "add", title: "Agregar", action: "add", data: "" }];
  menuButtonsSelectOne: any = [
    { icon: "add", title: "Agregar", action: "add", data: "" },
    //{ icon: 'edit', title: 'Editar', action: 'edit', data: '' },
    { icon: "remove_red_eye", title: "Ver", action: "view", data: "" },
    // { icon: 'attachment', title: 'Carga de documentos', action: 'attachment', data: '' },
    { icon: "cloud_download", title: "Descargar paquete de documentos", action: "downloadExpedientPackage", data: "" },
    // { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
    { icon: "featured_play_list", title: "Hoja de control", action: "controlSheet", data: "" },
    { icon: "playlist_add_check_circle", title: "Paz y salvo", action: "peaceAndSafe", data: "" },
  ];
  menuButtonsSelectOneOwner: any = [
    { icon: "add", title: "Agregar", action: "add", data: "" },
    { icon: "edit", title: "Editar", action: "edit", data: "" },
    { icon: "remove_red_eye", title: "Ver", action: "view", data: "" },
    { icon: "cloud_download", title: "Descargar paquete de documentos", action: "downloadExpedientPackage", data: "" },
    { icon: "featured_play_list", title: "Hoja de control", action: "controlSheet", data: "" },
    { icon: "playlist_add_check_circle", title: "Paz y salvo", action: "peaceAndSafe", data: "" },
  ];
  menuButtonsSelectMasive: any = [
    { icon: "add", title: "Agregar", action: "add", data: "" },
    // { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];
  menuButtonsClose: any = { icon: "lock", title: "Cerrar expediente", action: "closeFolder", data: "" };
  menuButtonsOpen: any = { icon: "lock_open", title: "Reabrir expediente", action: "openFolder", data: "" };
  menuButtonsDoc: any = { icon: "attachment", title: "Carga de documentos", action: "attachment", data: "" };
  menuButtonsEdit: any = { icon: "edit", title: "Editar", action: "edit", data: "" };
  menuButtonsCrossReference: any = {
    icon: "text_snippet",
    title: "Referencia cruzada",
    action: "crossReference",
    data: "",
  };

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
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
  textFormLabel: string; // Muestra el nombre del anexo

  /** Descarga paquete de documentos asociados al expediente */
  resServicesDownloadExpedientPackage: any;
  resServicesDownloadExpedientPackageErr: any;
  resSerCloseFolder: any;
  resSerCloseFolderErr: any;

  /** Variables para internacionalizacion */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;
  // Muestra el campo de fecha documento en el formulario de cargar documentos
  showFechaDoc: boolean = true;
  dataDepen: any; // data depenendcia, serie, subserie

  // Variables de modal
  statusModalMain = false; // Muestra o oculta el modal
  showPass = true; // Muestra o oculta el campo password en el modal
  observacionModal: boolean = true; // muestra el campo observacion del modal
  textFormObservaHeader = ""; // Titulo del modal
  initialNotificationMessageArray: any;
  textPassword = "Digite su contraseña";
  userCreadorId = 0; // Id usuario logueado

  statusModalCrossReference: boolean = false; // Muestra u oculta el modal de referencia cruzada

  ruoteServiceDownloadFile: string = "gestionDocumental/expedientes/download-control-sheet";
  resServicesDownload: any;
  resServicesDownloadErr: any;

  routeServicePeaceAndSafe = "gestionDocumental/expedientes/peace-and-safe";

  /**
   * Valida si el filtro debe mostrarse automaticamente
   */
  paramFilterActive: any;

  constructor(
    private router: Router,
    private floatingButtonService: FloatingButtonService,
    public restService: RestService,
    public lhs: LocalStorageService,
    public sweetAlertService: SweetAlertService,
    public globalAppService: GlobalAppService,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService,
    private changeChildrenService: ChangeChildrenService,
    private routeActi: ActivatedRoute
  ) {
    /** Idioma inical */
    this.detectLanguageInitial();
    this.paramFilterActive = this.routeActi.snapshot.paramMap.get("params");
  }

  ngOnInit() {
    /** Detectando si se ejecuta cambio de idioma */
    this.detectLanguageChange();

    // Hace el llamado del token
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
    this.lhs.getUser().then((res: any) => {
      this.userCreadorId = res.idDataCliente;
    });
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
        this.router.navigate(["/" + this.initBotonUpdateRoute + "/" + this.eventClickButtonSelectedData[0]["data"][0]]);
        break;
      case "view":
        this.router.navigate(["/" + this.initBotonViewRoute + "/" + this.eventClickButtonSelectedData[0]["data"][0]]);
        break;
      case "changeStatus":
        this.floatingButtonService.changeStatus(this.eventClickButtonSelectedData);
        break;
      case "attachment":
        this.statusUploadFileAneMasive = true;
        this.dataSend = this.eventClickButtonSelectedData;
        // Data que se necesita para que se muestren la lista de los tipos documentales
        this.dataDepen = {
          idGdTrdDependencia: this.eventClickButtonSelectedData[0].idGdTrdDependencia,
          idGdTrdSerie: this.eventClickButtonSelectedData[0].idGdTrdSerie,
          idGdTrdSubserie: this.eventClickButtonSelectedData[0].idGdTrdSubserie,
        };
        this.textForm = event.title;
        // Nombre del expediente y TRD
        this.textFormLabel =
          this.eventClickButtonSelectedData[0].nombreExpediente +
          " - " +
          this.eventClickButtonSelectedData[0].serie +
          " - " +
          this.eventClickButtonSelectedData[0].subserie;
        break;
      case "downloadExpedientPackage":
        this.downloadDocumentPackage(this.eventClickButtonSelectedData[0].id);
        break;
      case "closeFolder":
        // Cerrar expediente
        this.textFormObservaHeader = event.title;
        this.observacionModal = true;
        this.initialNotificationMessageArray = ["textCierreFolder"]; // Mensaje de notificación
        this.confirmaCloseFolder();
        break;
      case "openFolder":
        // Cerrar expediente
        this.textFormObservaHeader = event.title;
        this.observacionModal = false;
        this.initialNotificationMessageArray = ["textOpenFolder"]; // Mensaje de notificación
        this.confirmarOpenFolder();

        break;
      case "crossReference":
        this.statusModalCrossReference = true;
        break;
      case "controlSheet":
        this.dowloadDocuments();
        break;
      case "peaceAndSafe":
        this.processPeaceAndSafe();
        break;
    }
  }

  processPeaceAndSafe() {
    const data = {
      data: this.eventClickButtonSelectedData[0], // Data de los expedientes seleccionados
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

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {
    // Convierte los valores originales
    this.statusUploadFileAneMasive = false;
    this.statusModalMain = false;
    // dataObserva es la data que retorna el componente de observaciones
    if (dataObserva.status) {
      switch (this.operationDialogObserva) {
        case "closeFolder":
          this.transacctionCloseFolder(dataObserva.data);
          break;
        case "openFolder":
          this.transacctionOpenFolder(dataObserva.data);
          break;
      }
    }
  }

  closeCrossReferenceModal(data) {
    this.statusModalCrossReference = false;
    this.changeChildrenService.changeProcess({ proccess: "reload" });
  }

  /**
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {
    // Limpia los botones
    this.menuButtons = [];
    // Recorre el contenido de los registros seleccionados
    if (event.length > 0) {
      let statusInicial = event[0].status;
      this.eventClickButtonSelectedData = event;

      if (event.length == 1) {
        // Un registro seleccionado
        // Para el dueño del expediente puede editar lo
        if (event[0].userCreadorId == this.userCreadorId) {
          this.menuButtons = this.menuButtonsSelectOneOwner;
        } else {
          this.menuButtons = this.menuButtonsSelectOneOwner;
        }

        if (event[0].activarPazYsalvo) {
          const findPeaceAndSafe = this.menuButtons.find((element) => element.action === "peaceAndSafe");
          if (!findPeaceAndSafe) {
            this.menuButtons.push(this.buttonPeaceAndSafe);
          }
        } else {
          const findPeaceAndSafe = this.menuButtons.find((element) => element.action === "peaceAndSafe");
          if (findPeaceAndSafe) {
            this.eliminarRegistro("peaceAndSafe");
          }
        }
      } else {
        // Varios registros seleccionados
        // Asigna los botones basicos
        this.menuButtons = this.menuButtonsSelectMasive;
      }

      this.validateFileWtatus();

      this.validaButtons(event).then((res) => {
        // Valida si todos los seleccionados tienen el mismo estado
        if (res) {
          // Valida que el estado este en Abierto o pendiente por cerrar
          if (
            statusInicial == environment.statusExpedienteText.Abierto ||
            statusInicial == environment.statusExpedienteText.PendienteCerrar
          ) {
            this.validaButtons(event, "closeFolder").then((resTipo) => {
              if (!resTipo) {
                // Elimina el registro de la otra transacción
                this.eliminarRegistro("openFolder");
                // Agrega la transacción
                this.menuButtons.push(this.menuButtonsDoc, this.menuButtonsClose);
              }
            });
            // Validar la referencia cruzada
            this.validaButtons(event, "crossReference").then((resTipo) => {
              if (!resTipo) {
                // Validar permiso de referencia cruzada
                this.havePermissionCrossReference(event).then((resPermission) => {
                  if (resPermission) {
                    // Agrega la transacción
                    this.menuButtons.push(this.menuButtonsCrossReference);
                  }
                });
              }
            });
          }
          // Valida que el estado este en Cerrado
          if (statusInicial == environment.statusExpedienteText.Cerrado) {
            this.validaButtons(event, "openFolder").then((resTipo) => {
              if (!resTipo) {
                // Elimina el registro de la otra transacción
                this.eliminarRegistro("closeFolder");
                this.eliminarRegistro("attachment");
                this.eliminarRegistro("edit");
                this.eliminarRegistro("crossReference");
                // Agrega la transacción
                this.menuButtons.push(this.menuButtonsOpen);
              }
            });
          }
        } else {
          this.menuButtons = this.menuButtonsSelectMasive;
          // Elimina el registro de la otra transacción
          this.eliminarRegistro("closeFolder");
          this.eliminarRegistro("openFolder");
          this.eliminarRegistro("attachment");
          this.eliminarRegistro("crossReference");
        }
      });
    } else {
      // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  validaButtons(event, tipo = "normal") {
    let statusInicial = event[0].status;
    return new Promise((resolve) => {
      switch (tipo) {
        case "normal":
          event.forEach((element) => {
            // Valida si todos los expedientes seleccionados tienen el mismo estado
            if (statusInicial != element.status) {
              resolve(false);
            }
          });
          resolve(true);
          break;
        case "crossReference":
        case "closeFolder":
        case "openFolder":
          // Recorre los botones validando si tiene el mismo tipo
          this.menuButtons.forEach((element) => {
            // Valida si todos los botones que no este el mismo tipo
            if (element.action == tipo) {
              resolve(true);
            }
          });
          resolve(false);
          break;
      }
    });
  }

  // Valida si algun expedientes seleccionado no tiene permiso de referencia cruzada
  havePermissionCrossReference(event) {
    return new Promise((resolve) => {
      event.forEach((element) => {
        if (element.havePermissionCrossReference == false) {
          resolve(false);
        }
      });
      resolve(true);
    });
  }

  /**
   * Función de descarga del documento
   */
  dowloadDocuments() {
    let data = {
      ButtonSelectedData: this.eventClickButtonSelectedData, // Data de los expedientes seleccionados
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

  /** Cambia el estado del expediente a Cerrado */
  transacctionCloseFolder(data) {
    let params = {
      ButtonSelectedData: this.eventClickButtonSelectedData, // Data de los expedientes seleccionados
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
              if (this.resSerCloseFolder.datafile) {
                this.downloadFile(this.resSerCloseFolder.datafile, this.resSerCloseFolder.fileName);
              }
              this.changeChildrenService.changeProcess({ proccess: "reload" });
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
    let params = {
      ButtonSelectedData: this.eventClickButtonSelectedData, // Data de los expedientes seleccionados
      data: data, // Data de las observaciones
    };

    // Cargando true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "gestionDocumental/expedientes/open-expedient", params, this.authorization)
      .subscribe(
        (res) => {
          this.resSerCloseFolder = res;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerCloseFolder, false).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resSerCloseFolder.message);
              if (this.resSerCloseFolder.datafile) {
                this.downloadFile(this.resSerCloseFolder.datafile, this.resSerCloseFolder.fileName);
              }
              this.changeChildrenService.changeProcess({ proccess: "reload" });
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

  /**
   * Valida el estado expediente en "pendiente por cerrar"
   */
  validateFileWtatus() {
    let params = {
      ButtonSelectedData: this.eventClickButtonSelectedData, // Data de los expedientes seleccionados
    };

    // Cargando true
    // this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "gestionDocumental/expedientes/notification-status", params, this.authorization)
      .subscribe(
        (res) => {
          this.resSerCloseFolder = res;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerCloseFolder, false).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              // Valida que tenga mensajes para que los muestre en notificacion
              if (this.resSerCloseFolder.notificacion.length > 0) {
                this.resSerCloseFolder.notificacion.forEach((dataSer) => {
                  this.sweetAlertService.showNotification(dataSer.type, dataSer.message);
                });
              }
            }
            // Cargando false
            // this.sweetAlertService.sweetClose();
          });
        },
        (err) => {
          this.resSerCloseFolderErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerCloseFolderErr, false).then((res) => {});
        }
      );
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

  ngOnDestroy(): void {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }
}
