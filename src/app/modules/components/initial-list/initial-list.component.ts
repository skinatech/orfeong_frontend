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

import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  AfterViewChecked,
} from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "src/app/services/rest.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { Subject, Subscription } from "rxjs";

import { FloatingButtonService } from "src/app/services/floating-button.service";
import { environment } from "src/environments/environment";
import { promise } from "protractor";

import { DataTableDirective } from "angular-datatables";
import { GlobalAppService } from "src/app/services/global-app.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivateTranslateService } from "src/app/services/activate-translate.service";
import { EncryptService } from "src/app/services/encrypt.service";
import { HttpClient, HttpHeaders, HttpEventType } from "@angular/common/http";

import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { AuthService } from "src/app/services/auth.service";
/**
 * Importación del servidor sockect
 */
import { SocketioService } from "src/app/services/socketio.service";
import { ChangeChildrenService } from "../../../services/change-children.service";

import swal from "sweetalert2";
import { takeUntil } from "rxjs/operators";

/** Interface del tatatable */
declare interface DataTable {
  headerRow: string[];
  // footerRow: string[];
  dataRows: string[][];
}

declare const $: any;
/** Interface del tatatable */

@Component({
  selector: "app-initial-list",
  templateUrl: "./initial-list.component.html",
  styleUrls: ["./initial-list.component.css"],
})
export class InitialListComponent implements AfterViewInit, OnInit, AfterViewChecked, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  /**
   * Valida si los filtros deben abrir automaticamente
   */
  @Input() filterActive: any = false; //recibe open o false

  /** Propiedades del Initial List */
  // Propiedades agregadas
  @Input() initCardHeaderStatus: boolean = true; // Controla el header del panel/card
  @Input() initCardHeaderIcon: string; // Icono del header del panel/card
  @Input() initCardHeaderTitle: string; // Título del header del panel/card
  @Input() routeLoadDataTablesService: string; // servicio utilizado para el retorno de los datos del dt
  @Input() medodDataTablesService: string = "GET"; // Médodo utilizado para el consumo del api principal del dt ['GET, 'POST']
  @Input() initBotonCreateText: string; // Texto del botón crear
  @Input() initBotonCreateRoute: string; // Ruta del botón crear
  @Input() isredirectionPath: boolean = true; // Define si se utiliza la redireccion en caso de no tener permisos de acceso
  @Input() redirectionPath: string = "/dashboard"; // ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  @Input() routeData: string; // nombre del módulo de la data a la que se esta accediendo
  @Input() statusParamsAdd: boolean = false; // Status params adicionales en consumo de api "routeLoadDataTablesService"
  @Input() dataParamsAdd: any = {}; // Parámetros adicionales en consumo de api "routeLoadDataTablesService"

  // Propiedades estandar del dataTable
  @Input() dtlengthMenu: any = [10, 25, 50, 100]; // Controla la cantidad de registros a mostrar
  @Input() dtOrderingActive: boolean = true; // Controla la activación de la opción de ordenación de la columnas del datatable
  @Input() dtSearchingActive: boolean = false; // Controla la activación de la opción de busqueda de datos en las filas del datatable
  @Input() orderStatus: string = "desc"; // Orden para el campo estado, false = asc, true = desc
  @Input() orderByColumnStatus: number = 0; // posición de la columna estado
  @Input() showButtonFiltrer: boolean = true; // Muestra el boton de initial List
  @Input() viewColumStatus: boolean = true; // Mostrar la columna de status

  statusFilter: boolean = false; // Muestra el componente de filterInitialList
  @Input() dataFilterSchema: any; // Muestra la información del esquema completo
  // Parametro de id
  @Input() paramOID = 0;
  @Input() dataFilter: any; // Data del filtro
  /** Propiedades del Initial List */

  /*** Configuraciones para datatables ***/
  dtData: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @Input() dtTitles: any; // Titulos de los datatables
  @Input() dtActionsStatus: boolean = true; // Controla la columna Acciones // Ya no se utiliza 2019-11-13
  @Input() actions: any = []; // Acciones que contiene los datatables // Ya no se utiliza 2019-11-13
  @Input() menssageStatus: string;
  /*** Fin Configuraciones para datatables ***/

  /** Clases de los contenedores iniciales */
  @Input() classMainConten: string = "main-content";
  @Input() classContainerFluid: string = "container-fluid";

  @Input() classDataTableResponsive = "table-responsive";
  @Input() sweetLoadingInitStatus: boolean = true; // Mostrar el logo cargando en el llamado del servicio principal

  /** Las variables para mostrar la alerta informativa  */
  @Input() initialNotificationStatus: boolean = false;
  @Input() initialNotificationClassAlert: string = "alert alert-info alert-with-icon";
  @Input() initialNotificationMessage: string;
  @Input() initialNotificationMessageArray: any = [];

  subscriptionChangeDetectedService: any;
  subscriptionChangeDetectedServiceOpenFilter: any;

  /** Variables para consultas de servicios */
  @Input() authorization: string = "";
  responseServiceInit: any;
  responseServiceInitErr: any;
  resServicesAnnulment: any;
  resServicesAnnulmentErr: any;
  resServicesReasign: any;
  resServicesReasignErr: any;
  resServicesVobo: any;
  resServicesVoboErr: any;
  resServicesFinalizeFiling: any;
  resServicesFinalizeFilingErr: any;
  resServiceReturnFil: any;
  resServiceReturnFilErr: any;
  resServiceDelivered: any;
  resServiceDeliveredErr: any;
  resServiceReturnDelivered: any;
  resServiceReturnDeliveredErr: any;
  resServiceShipping: any;
  resServiceShippingErr: any;
  resServicesCopyInfo: any;
  resServicesCopyInfoErr: any;
  resSerShippingReady: any;
  resSerShippingReadyErr: any;
  resSerArchiveFiling: any;
  resSerArchiveFilingErr: any;
  resSerApplyForLoan: any;
  resSerApplyForLoanErr: any;
  resSerApproveLoan: any;
  resSerApproveLoanErr: any;
  resSerCancelLoan: any;
  resSerCancelLoanErr: any;
  resSerReturnLoan: any;
  resSerReturnLoanErr: any;
  resSerDownloadRotulos: any;
  resSerDownloadRotulosErr: any;
  resSerManualTransfer: any;
  resSerManualTransferErr: any;
  resSerDownloadFuit: any;
  resSerDownloadFuitErr: any;
  resSerAcceptTransfer: any;
  resSerAcceptTransferErr: any;
  resSerRejectTransfer: any;
  resSerRejectTransferErr: any;
  resSerArchiveFolder: any;
  resSerArchiveFolderErr: any;
  resSerReturnPqrToCitizen: any;
  resSerReturnPqrToCitizenErr: any;
  resSerWithdrawal: any;
  resSerWithdrawalErr: any;
  /** Variables para consultas de servicios */

  /** Variables para sockets */
  resSocketOnLanguage: any;
  servicePrueba: any;

  /**
   * Configuración para la data seleccionada
   */
  selectedRows: any = [];
  @Output() public selectedRowsEmiter = new EventEmitter<any>();
  @Output() public dataFilterEmiter = new EventEmitter<any>(); // Filtros seleccionados
  @Input() dataInitialListReturn = [Object];
  @Output() public dataIndexReturn = new EventEmitter<Array<string>>();

  /**
   * Configuración para el proceso de change status
   */
  idsChangeStatus: any = [];
  @Input() routeChangeStatus: string;
  responseServiceChangeStatus: any;
  responseServiceChangeStatusErr: any;
  subscriptionChangeStatus: any;
  subscriptionChangeStatusAnulation: any;
  subscriptionTransactionReasign: any;
  subscriptionTransactionReturnFiling: any;
  subscriptionTransactionVobo: any;
  subscriptionDataChangeDelivered: any;
  subscriptionDataChangeReturnDelivery: any;
  subscriptionDataChangeShipping: any;
  subscriptionTransactionCopyInfo: any;
  subscriptionTransactionFinalizeFiling: any;
  subscriptionTransactionShippingReady: any;
  subscriptionTransactionArchiveFiling: any;
  subscriptionApplyForLoan: any;
  subscriptionApproveLoan: any;
  subscriptionCancelLoan: any;
  subscriptionReturnLoan: any;
  subscriptionDownloadRotulos: any;
  subscriptionManualTransfer: any;
  subscriptionDownloadFuit: any;
  subscriptionAcceptTransfer: any;
  subscriptionRejectTransfer: any;
  subscriptionArchiveFolder: any;
  subscriptionReturnPqrToCitizen: any;
  subscriptionWithdrawal: any;

  receivedDataChangeStatus: any = [];
  receivedDataChangeReasign: any = [];
  receivedDataChangeAnnulment: any = [];
  receivedDataChangeDelivered: any = [];
  receivedDataChangeReturnDelivery: any = [];
  receivedDataChangeShipping: any = [];
  receivedDataShippingReady: any = [];
  receivedDataArchiveFiling: any = [];
  receivedDataApplyForLoan: any = [];
  receivedDataApproveLoan: any = [];
  receivedDataCancelLoan: any = [];
  receivedDataReturnLoan: any = [];
  receivedDataDownloadRotulos: any = [];
  receivedDataManualTransfer: any = [];
  receivedDataDownloadFuit: any = [];
  receivedDataAcceptTransfer: any = [];
  receivedDataRejectTransfer: any = [];
  receivedDataArchiveFolder: any = [];
  receivedDataReturnPqrToCitizen: any = [];
  receivedDataWithdrawal: any = [];
  receivedDataReasign: any = [];
  receivedDataReturnFiling: any = [];
  receivedDataAnnulment: any = [];
  receivedDataVobo: any = [];
  receivedDataCopyInformaded: any = [];
  receivedDataFinalizeFiling: any = [];
  dataListLocalStorage: any;
  moduloLocalStorage: string;

  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  /** Lenguaje de campos del datatable */
  dtLanguage: object = {
    es: {
      sProcessing: "Procesando...",
      sLengthMenu: "Mostrar _MENU_ registros",
      sZeroRecords: "No se encontraron resultados",
      sEmptyTable: "No se encontraron documentos",
      sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
      sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
      sInfoPostFix: "",
      sSearch: "Búsqueda Avanzada:",
      sUrl: "",
      sInfoThousands: ",",
      sLoadingRecords: "Cargando...",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      oAria: {
        sSortAscending: ": Activar para ordenar la columna de manera ascendente",
        sSortDescending: ": Activar para ordenar la columna de manera descendente",
      },
      buttons: {
        csv: "CSV",
        excel: "EXCEL",
        pdf: "PDF",
        print: "IMPRIMIR",
      },
    },
    en: {
      sProcessing: "Processing...",
      sLengthMenu: "Show _MENU_ entries",
      sZeroRecords: "No results found",
      sEmptyTable: "No documents found",
      sInfo: "Showing _START_ to _END_ of _TOTAL_ entries",
      sInfoEmpty: "Showing 0 to 0 of 0 entries",
      sInfoFiltered: "(filtered from _MAX_ total entries)",
      sInfoPostFix: "",
      sSearch: "Search:",
      sUrl: "",
      sInfoThousands: ",",
      sLoadingRecords: "Loading...",
      oPaginate: {
        sFirst: "First",
        sLast: "Last",
        sNext: "Next",
        sPrevious: "Previous",
      },
      oAria: {
        sSortAscending: ": Activate to sort the column in ascending order",
        sSortDescending: ": Activate to sort the column in descending order",
      },
      buttons: {
        csv: "CSV",
        excel: "EXCEL",
        pdf: "PDF",
        print: "PRINT",
      },
    },
    br: {
      sProcessing: "Processamento...",
      sLengthMenu: "Mostrar _MENU_ registros",
      sZeroRecords: "Nenhum resultado encontrado",
      sEmptyTable: "Nenhum documento encontrado",
      sInfo: "Mostrando registros del _START_ a _END_ de um total de _TOTAL_ registros",
      sInfoEmpty: "Mostrando registros del 0 a 0 de um total de 0 registros",
      sInfoFiltered: "(filtrando um total de _MAX_ registros)",
      sInfoPostFix: "",
      sSearch: "Busca avançada:",
      sUrl: "",
      sInfoThousands: ",",
      sLoadingRecords: "Cargando...",
      oPaginate: {
        sFirst: "Primeiro",
        sLast: "Último",
        sNext: "Próximo",
        sPrevious: "Anterior",
      },
      oAria: {
        sSortAscending: ": Ative para classificar a coluna em ordem crescente",
        sSortDescending: ": Ative para classificar a coluna em ordem decrescente",
      },
      buttons: {
        csv: "CSV",
        excel: "EXCEL",
        pdf: "PDF",
        print: "IMPRIMIR",
      },
    },
  };

  /** Variables para traer el texto de confirmacion */
  titleMsg: string;
  textMsg: string;
  bntCancelar: string;
  btnConfirmacion: string;
  resSerLenguage: any;

  /** Variable que indica si se debe realizar la recarga del datatable cuando hay un cambio de lenguage */
  reloadLangDatatable = false; // Por defecto debe ser false

  /** versionApi  */
  versionApi = environment.versionApiDefault;

  // files
  uploadResponse: any = { status: false, message: "Cargando...", proccess: 50 };
  ruoteServiceDocuments: string = environment.apiUrl + this.versionApi + "radicacion/transacciones/upload-file";
  urlEndSend: any;
  uploadProcess: any;

  /** Para Modulo de Radicacion Email */
  @Input() moduleEmail: boolean = false;
  @Input() mailBox: string = "";
  @Output() public changeDataMailEmiter = new EventEmitter<any>(); // Data a retornar
  infoMailCount: any;

  infoLimitRecords: any = false;

  countCallsDatatablesInit: number = 0; // Numero de veces que se ha hecho llamado a dataTablesInit()
  fechaActual: string = ""; // Fecha actual de la consulta (utilizada solamente para fines informativos)
  @Input() moduleFormInitial: any; // Variable de formulario recibida desde el componente padre
  _onDestroy = new Subject<void>(); // Subject that emits when the component has been destroyed.

  constructor(
    private router: Router,
    private http: HttpClient,
    public restService: RestService,
    private authService: AuthService,
    private lhs: LocalStorageService,
    private floatingButtonService: FloatingButtonService,
    public globalAppService: GlobalAppService,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService,
    private encryptService: EncryptService,
    public sweetAlertService: SweetAlertService,
    private socketioService: SocketioService,
    private changeChildrenService: ChangeChildrenService
  ) {
    /**
     * Idioma inical
     */
    this.detectLanguageInitial();
  }

  ngOnInit() {
    this.getTokenLS();
    this.getUserLS();
    /**
     * Detectando si se ejecuta cambio de idioma
     */
    this.detectLanguageChange();
    this.configDtOptions();

    this.valueChangesVarInput();
  }

  ngAfterViewInit() {
    if (this.viewColumStatus == true) {
      this.changeStatusDetected();
    }

    this.changeDetectedService();
  }

  ngAfterViewChecked() {
    /**
     * Cuando toda la vista está cargada por completo se agregan las clases para dar estilo a los botones de descarga
     */
    $(".buttons-csv").addClass("btn btn-primary btn-round mat-raised-button");
    $(".buttons-excel").addClass("btn btn-primary btn-round mat-raised-button");
    $(".buttons-pdf").addClass("btn btn-primary btn-round mat-raised-button");
    $(".buttons-print").addClass("btn btn-primary btn-round mat-raised-button");
  }

  /**
   * Métodos agregados
   */

  /** Metodo para evaluar cambios en variables recibidas como Input() que pertenecen a un Formulario del componente padre */
  valueChangesVarInput() {
    if (this.moduleEmail) {
      this.moduleFormInitial.controls["countCallsDatatablesInit"].valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.reloadInitialList();
        });
    }
  }

  /**
   * Método que reconstruye el datatable si la configuración de lenguaje cambia
   * Analiza la variable "reloadLangDatatable" y si está en true, aplica la función rerender() del datatable
   * @return [boolean]
   * En el front existe un botón que solo se muestra si el datatable se debe reconstruir porque el lenguaje activo cambió
   * por esto se retorna la variable "reloadLangDatatable"
   */
  reloadDatatableByLang() {
    if (this.reloadLangDatatable == true && environment.supportedLanguages[this.languageReceive] == true) {
      this.reloadLangDatatable = false;
      this.rerender();
    }
    return this.reloadLangDatatable;
  }

  /** función para recargar el initial list */
  reloadInitialList() {
    /** Recargar el initial list cuando detecte un cambio en la variable recibida como Input() */
    this.dataFilter = { status: false, data: [] };
    this.statusFilter = false;

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.dataTablesInit();

    /** Retornar data seleccionada vacia ya que se esta reinicializando el dataTable */
    this.selectedRows = [];
    this.selectedRowsEmiter.emit(this.selectedRows);
  }

  /** Método para configurar las propiedades estandar del datatable */
  configDtOptions() {
    return new Promise((resolve) => {
      let textList = this.translate.instant(this.initCardHeaderTitle);

      this.dtOptions = {
        dom: "lfrtBip",
        buttons: [
          {
            extend: "csvHtml5",
            title: textList,
          },
          {
            extend: "excelHtml5",
            title: textList,
          },
          {
            extend: "pdfHtml5",
            title: textList,
            orientation: "landscape",
            pageSize: "LEGAL",
          },
          {
            extend: "print",
            title: textList,
          },
        ],
        lengthChange: false,
        lengthMenu: this.dtlengthMenu,
        ordering: this.dtOrderingActive,
        searching: this.dtSearchingActive,
        order: [this.orderByColumnStatus, this.orderStatus],
        language: this.dtLanguage[this.activeLang], // Seleccionando lenguaje activo
        fnDrawCallback: function (oSettings) {
          window.scroll(0, 0); // Posicionando scroll al inicio
        },
      };

      if (this.orderByColumnStatus != 0) {
        this.orderByColumnStatus;
      } else {
        if (this.viewColumStatus) {
          this.orderByColumnStatus = this.dtTitles.length + 1;
        } else {
          this.orderByColumnStatus = this.dtTitles.length;
        }
      }

      resolve(true);
    });
  }

  getUserLS() {
    this.lhs.getUser().then((res: any) => {
      // Llamado de sockets
      this.socketOnRoom(res.idDataCliente);
    });
  }

  /** Método para obtener el token que se encuentra encriptado en el local storage */
  getTokenLS() {
    /** Se consulta solo si el token no se recibió como Input() */
    if (this.authorization == "" || this.authorization == null) {
      this.lhs.getToken().then((res: string) => {
        this.authorization = res;
        this.dataListLocalStorage = localStorage.getItem(environment.hashDataList);
        this.moduloLocalStorage = localStorage.getItem(environment.hashDataListModule);
        this.moduloLocalStorage = this.restService.decryptAES(this.moduloLocalStorage, this.authorization);

        /*if (this.moduloLocalStorage == this.routeData) {
          this.dataTablesInitLocalStorage();
        } else {*/
        this.dataTablesInit();
        //}
      });
    } else {
      this.dataTablesInit();
    }
  }

  /** Método para analizar la data correos almacenada en el localstorage */
  analizeDataMailLocalStorage() {
    return new Promise<any>((resolve) => {
      /** Validar si existia data guardada del initial list de la radicacion mail */
      let pruebaCorreoInitial = localStorage.getItem(environment.hashMailInitialListSkina);
      let pruebaCorreoInitialDecipted = this.authService.decryptAES(pruebaCorreoInitial);
      if (pruebaCorreoInitialDecipted != null) {
        this.responseServiceInit = pruebaCorreoInitialDecipted;
        if (this.responseServiceInit.fechaActual) {
          this.fechaActual = this.responseServiceInit.fechaActual;
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        localStorage.removeItem(environment.hashMailInitialListSkina);
        resolve(false);
      }
      /** Fin Validar si existia data guardada del initial list de la radicacion mail */
    });
  }

  /** Método para consultar el servicio que retorna la data para el dataTable */
  dataTablesInit() {
    if (this.sweetLoadingInitStatus) {
      this.sweetAlertService.sweetLoading();
    }

    if (this.moduleEmail && this.countCallsDatatablesInit == 0) {
      this.analizeDataMailLocalStorage().then((res: any) => {
        if (res == true) {
          this.sweetAlertService.showNotification(
            "success",
            this.translate.instant("Está visualizando la última consulta realizada el ") + this.fechaActual
          );
          /** Se llama directamente al metodo que procesa la respuesta correcta del servicio del datatable ya que se utiliza la data del local storage */
          this.dataTablesInitProcessService(true);
        } else {
          /** Llamado al metodo que posee el servicio que obtiene la data del datatable */
          this.dataTablesInitService();
        }
      });
    } else {
      /** Llamado al metodo que posee el servicio que obtiene la data del datatable */
      this.dataTablesInitService();
    }

    /** Suma un numero al contador de veces que se ha llamado a la funcion principal del datatable "dataTablesInit()" */
    this.countCallsDatatablesInit++;
  }

  /** Método utilizado para el llamado del servicio del datatable */
  dataTablesInitService() {
    // Variable para construir los parametros
    let params: any = {};
    // Valida si hay informacion de los filtros
    if (this.dataFilter) {
      if (this.dataFilter.status) {
        params = this.dataFilter.data;
        // Valida Si llega un id
        if (this.paramOID != 0) {
          params["id"] = this.paramOID;
        }
      } else {
        // Valida Si llega un id
        if (this.paramOID != 0) {
          params = {
            id: this.paramOID,
          };
        }
      }
    } else {
      // Valida Si llega un id
      if (this.paramOID != 0) {
        params = {
          id: this.paramOID,
        };
      }
    }

    if (this.moduleEmail) {
      let dataUser = this.authService.decryptAES(localStorage.getItem(environment.hashMailSkina));
      params["dataEmail"] = dataUser;
    } else if (this.statusParamsAdd) {
      params["dataParamsAdd"] = this.dataParamsAdd;
    }

    if (this.medodDataTablesService == "GET") {
      this.restService.restGetParams(this.routeLoadDataTablesService, params, this.authorization).subscribe(
        (res) => {
          this.responseServiceInit = res;
          // console.log( this.responseServiceInit );
          // Evaluar respuesta del servicio
          this.globalAppService
            .resolveResponse(this.responseServiceInit, this.isredirectionPath, this.redirectionPath)
            .then((res) => {
              let responseResolveResponse = res;
              if (responseResolveResponse == true) {
                /** Llamado al metodo que procesa la respuesta correcta del servicio del datatable */
                this.dataTablesInitProcessService(responseResolveResponse);
                // Retornar data al componente padre
                if (this.dataInitialListReturn.length > 0) {
                  const dataReturn = [];
                  this.dataInitialListReturn.forEach((element) => {
                    dataReturn.push({ name: element["name"], value: this.responseServiceInit[element["name"]] });
                  });
                  this.dataIndexReturn.emit(dataReturn);
                }
              }
            });
        },
        (err) => {
          this.responseServiceInitErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService
            .resolveResponseError(this.responseServiceInitErr, this.isredirectionPath, this.redirectionPath)
            .then((res) => {});
        }
      );
    } else {
      this.restService.restPost(this.routeLoadDataTablesService, params, this.authorization).subscribe(
        (res) => {
          this.responseServiceInit = res;
          // console.log( this.responseServiceInit );
          // Evaluar respuesta del servicio
          this.globalAppService
            .resolveResponse(this.responseServiceInit, this.isredirectionPath, this.redirectionPath)
            .then((res) => {
              let responseResolveResponse = res;
              if (responseResolveResponse == true) {
                /** Llamado al metodo que procesa la respuesta correcta del servicio del datatable */
                this.dataTablesInitProcessService(responseResolveResponse);
                // Retornar data al componente padre
                if (this.dataInitialListReturn.length > 0) {
                  const dataReturn = [];
                  this.dataInitialListReturn.forEach((element) => {
                    dataReturn.push({ name: element["name"], value: this.responseServiceInit[element["name"]] });
                  });
                  this.dataIndexReturn.emit(dataReturn);
                }
              }
            });
        },
        (err) => {
          this.responseServiceInitErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService
            .resolveResponseError(this.responseServiceInitErr, this.isredirectionPath, this.redirectionPath)
            .then((res) => {});
        }
      );
    }
  }

  /** Método utilizado para procesar la respuesta correcta del del servicio del datatable */
  dataTablesInitProcessService(responseResolveResponse) {
    if (responseResolveResponse == true) {
      // Información del Filter initial list asignada en el local storage
      localStorage.setItem(
        environment.hashDataFilter,
        this.restService.encryptAES(this.responseServiceInit.filtersData, this.authorization, false)
      );

      // Utilizo el esquema creado del api
      if (this.responseServiceInit.filtersData) {
        this.dataFilterSchema = this.responseServiceInit.filtersData;
        // Muestra el boton de filtros
        // this.showButtonFiltrer = true;

        /**
         * Validando el estado inicial de los filtros
         */
        if (this.filterActive === "open") {
          this.openFilter();
        }
      }

      if (this.moduleEmail) {
        // Guardar consulta del correo en el local storage
        localStorage.setItem(
          environment.hashMailInitialListSkina,
          this.authService.encryptAES(this.responseServiceInit, false)
        );
        this.fechaActual = this.responseServiceInit.fechaActual;
        this.mailBox = this.responseServiceInit.mailBox;
        this.infoMailCount = this.responseServiceInit.infoMailCount;
        if (this.responseServiceInit.initCardHeaderTitle) {
          this.initCardHeaderTitle = this.responseServiceInit.initCardHeaderTitle;
        }
        this.changeDataMail();
      }

      this.dtData = this.responseServiceInit.data;
      // Guarda en el localStorage la data devuelta del servicio, esta la guarda encriptada
      localStorage.removeItem(environment.hashDataListModule);
      localStorage.removeItem(environment.hashDataList);

      if (typeof this.responseServiceInit.infoLimitRecords != "undefined") {
        this.infoLimitRecords = this.responseServiceInit.infoLimitRecords;
      } else {
        this.infoLimitRecords = false;
      }

      // console.log(this.routeData);

      // Información del modulo
      localStorage.setItem(
        environment.hashDataListModule,
        this.restService.encryptAES(this.routeData, this.authorization, false)
      );
      // Información del data
      localStorage.setItem(
        environment.hashDataList,
        this.restService.encryptAES(this.responseServiceInit.data, this.authorization, false)
      );
      this.dtTrigger.next(0);

      if (this.sweetLoadingInitStatus) {
        this.sweetAlertService.sweetClose();
      }
    }
  }

  changeDataMail() {
    let response = {
      mailBox: this.mailBox,
      infoMailCount: this.infoMailCount,
    };
    this.changeDataMailEmiter.emit(response);
  }

  /** Método para consultar el localStorage que retorna la data para el dataTable */
  dataTablesInitLocalStorage() {
    // console.log('localStorage '+this.routeData);
    // Evaluar respuesta del servicio
    this.globalAppService
      .resolveResponse(this.dataListLocalStorage, this.isredirectionPath, this.redirectionPath)
      .then((res) => {
        let responseResolveResponse = res;
        if (responseResolveResponse == true) {
          this.dtData = this.restService.decryptAES(this.dataListLocalStorage, this.authorization);
          this.dtTrigger.next(0);
        }
      });
  }

  /*** Clic en los enlaces de las aciones, en esta será direccionado */
  actionsNavigate(event) {
    this.router.navigate(["/" + event.route + "/" + event.data]);
  }

  clickRow(data) {
    if (this.dtData[data.index]["rowSelect"] == true) {
      this.dtData[data.index]["rowSelect"] = false;

      let indexSearch = this.selectedRows.indexOf(this.dtData[data.index]);
      this.selectedRows.splice(indexSearch, 1);
    } else {
      this.dtData[data.index]["rowSelect"] = true;
      this.dtData[data.index]["idInitialList"] = data.index;

      this.selectedRows.push(this.dtData[data.index]);
    }

    this.selectedRowsEmiter.emit(this.selectedRows);
  }

  changeStatusDetected() {
    this.subscriptionChangeStatus = this.floatingButtonService.clickChangeStatus.subscribe((emit) => {
      this.receivedDataChangeStatus = emit;
      this.loadIdsChangeStatus().then((res) => {
        this.serviceChangeStatus(res);
      });
    });

    this.subscriptionChangeStatusAnulation = this.floatingButtonService.clickChangeStatusAnulation.subscribe((emit) => {
      this.receivedDataAnnulment = emit;
      this.loadChangeStatusAnnulment().then((res) => {
        this.transactionAnnulment(this.receivedDataAnnulment);
      });
    });

    this.subscriptionTransactionReasign = this.floatingButtonService.clickTransactionReasign.subscribe((emit) => {
      this.receivedDataReasign = emit;
      this.transactionReasing(this.receivedDataReasign);
    });

    this.subscriptionTransactionReturnFiling = this.floatingButtonService.clickTransactionReturnFiling.subscribe(
      (emit) => {
        this.receivedDataReturnFiling = emit;
        this.transactionReturnFiling(this.receivedDataReturnFiling);
      }
    );

    this.subscriptionTransactionVobo = this.floatingButtonService.clickTransactionVobo.subscribe((emit) => {
      this.receivedDataVobo = emit;
      this.transactionVobo(this.receivedDataVobo);
    });

    this.subscriptionTransactionCopyInfo = this.floatingButtonService.clickTransactionCopyInformaded.subscribe(
      (emit) => {
        this.receivedDataCopyInformaded = emit;
        this.transactionCopyInformaded(this.receivedDataCopyInformaded);
      }
    );

    this.subscriptionTransactionFinalizeFiling = this.floatingButtonService.clickTransactionFinalizeFiling.subscribe(
      (emit) => {
        this.receivedDataFinalizeFiling = emit;
        this.loadChangeStatusFinalizeFiling().then((res) => {
          this.transactionFinalizeFiling(this.receivedDataFinalizeFiling);
        });
      }
    );

    this.subscriptionTransactionShippingReady = this.floatingButtonService.clickTransactionShippingReady.subscribe(
      (emit) => {
        this.receivedDataShippingReady = emit;
        this.transactionShippingReady(this.receivedDataShippingReady);
      }
    );

    this.subscriptionTransactionArchiveFiling = this.floatingButtonService.clickTransactionArchiveFiling.subscribe(
      (emit) => {
        this.receivedDataArchiveFiling = emit;
        this.transactionArchiveFiling(this.receivedDataArchiveFiling);
      }
    );

    this.subscriptionApplyForLoan = this.floatingButtonService.clickApplyForLoan.subscribe((emit) => {
      this.receivedDataApplyForLoan = emit;
      this.transactionApplyForLoan(this.receivedDataApplyForLoan);
    });

    this.subscriptionApproveLoan = this.floatingButtonService.clickApproveLoan.subscribe((emit) => {
      this.receivedDataApproveLoan = emit;
      this.transactionApproveLoan(this.receivedDataApproveLoan);
    });

    this.subscriptionCancelLoan = this.floatingButtonService.clickCancelLoan.subscribe((emit) => {
      this.receivedDataCancelLoan = emit;
      this.transactionCancelLoan(this.receivedDataCancelLoan);
    });

    this.subscriptionReturnLoan = this.floatingButtonService.clickReturnLoan.subscribe((emit) => {
      this.receivedDataReturnLoan = emit;
      this.transactionReturnLoan(this.receivedDataReturnLoan);
    });

    this.subscriptionDownloadRotulos = this.floatingButtonService.clickDownloadRotulos.subscribe((emit) => {
      this.receivedDataDownloadRotulos = emit;
      this.getDownloadRotulos(this.receivedDataDownloadRotulos);
    });

    this.subscriptionManualTransfer = this.floatingButtonService.clickManualTransfer.subscribe((emit) => {
      this.receivedDataManualTransfer = emit;
      this.transactionManualTransfer(this.receivedDataManualTransfer);
    });

    this.subscriptionDownloadFuit = this.floatingButtonService.clickDownloadFuit.subscribe((emit) => {
      this.receivedDataDownloadFuit = emit;
      this.getDownloadFuit(this.receivedDataDownloadFuit);
    });

    this.subscriptionAcceptTransfer = this.floatingButtonService.clickAcceptTransfer.subscribe((emit) => {
      this.receivedDataAcceptTransfer = emit;
      this.transactionAcceptTransfer(this.receivedDataAcceptTransfer);
    });

    this.subscriptionRejectTransfer = this.floatingButtonService.clickRejectTransfer.subscribe((emit) => {
      this.receivedDataRejectTransfer = emit;
      this.loadIdsChangeStatus().then((res) => {
        this.transactionRejectTransfer(this.receivedDataRejectTransfer);
      });
    });

    this.subscriptionArchiveFolder = this.floatingButtonService.clickArchiveFolder.subscribe((emit) => {
      this.receivedDataArchiveFolder = emit;
      this.transactionArchiveFolder(this.receivedDataArchiveFolder);
    });

    this.subscriptionReturnPqrToCitizen = this.floatingButtonService.clickReturnPqrToCitizen.subscribe((emit) => {
      this.receivedDataReturnPqrToCitizen = emit;
      this.transactionReturnPqrToCitizen(this.receivedDataReturnPqrToCitizen);
    });

    this.subscriptionWithdrawal = this.floatingButtonService.clickWithdrawal.subscribe((emit) => {
      this.receivedDataWithdrawal = emit;
      this.transactionWithdrawal(this.receivedDataWithdrawal);
    });

    this.subscriptionDataChangeDelivered = this.floatingButtonService.clickChangeTransactionDelivered.subscribe(
      (emit) => {
        this.receivedDataChangeDelivered = emit;
        this.receivedDataChangeStatus = emit.ButtonSelectedData;
        this.loadIdsChangeStatus();
        this.transactionDelivered(this.receivedDataChangeDelivered);
      }
    );

    this.subscriptionDataChangeReturnDelivery =
      this.floatingButtonService.clickChangeTransactionReturnDelivered.subscribe((emit) => {
        this.receivedDataChangeReturnDelivery = emit;
        this.receivedDataChangeStatus = emit.ButtonSelectedData;
        this.loadIdsChangeStatus();
        this.transactionReturnDelivery(this.receivedDataChangeReturnDelivery);
      });

    this.subscriptionDataChangeShipping = this.floatingButtonService.clickChangeTransactionShipping.subscribe(
      (emit) => {
        this.receivedDataChangeShipping = emit;
        this.receivedDataChangeStatus = emit.ButtonSelectedData;
        this.loadIdsChangeStatus();
        this.transactionShipping(this.receivedDataChangeShipping);
      }
    );
  }

  loadIdsChangeStatus() {
    return new Promise<any>((resolve) => {
      this.idsChangeStatus = [];
      this.receivedDataChangeStatus.forEach((data) => {
        this.dtData[data.idInitialList]["status"] = 999;
        this.idsChangeStatus.push(data.id + "|" + data.idInitialList);
      });
      resolve(this.idsChangeStatus);
    });
  }

  loadChangeStatusAnnulment() {
    return new Promise<any>((resolve) => {
      this.idsChangeStatus = [];
      this.receivedDataAnnulment.ButtonSelectedData.forEach((data) => {
        this.dtData[data.idInitialList]["status"] = 999;
        this.idsChangeStatus.push(data.id + "|" + data.idInitialList);
      });

      resolve(this.idsChangeStatus);
    });
  }

  /**
   * Funcion que cambia los estados de los registros en el initial list y muestra el spiner o cargando en el status
   * @param dataRows llega el buttonSelecData donde tiene la información del initial list
   */
  loadChageStatusTransaction(dataRows) {
    return new Promise<any>((resolve) => {
      this.idsChangeStatus = [];
      dataRows.ButtonSelectedData.forEach((data) => {
        this.dtData[data.idInitialList]["status"] = 999;
        this.idsChangeStatus.push(data.id + "|" + data.idInitialList);
      });
      resolve(this.idsChangeStatus);
    });
  }

  loadChangeStatusFinalizeFiling() {
    return new Promise<any>((resolve) => {
      this.idsChangeStatus = [];
      this.receivedDataFinalizeFiling.ButtonSelectedData.forEach((data) => {
        this.dtData[data.idInitialList]["status"] = 999;
        this.idsChangeStatus.push(data.id + "|" + data.idInitialList);
      });

      resolve(this.idsChangeStatus);
    });
  }

  serviceChangeStatus(data) {
    this.restService.restPut(this.routeChangeStatus, data, this.authorization).subscribe(
      (res) => {
        this.responseServiceChangeStatus = res;
        // console.log(this.responseServiceChangeStatus);
        if (this.responseServiceChangeStatus.status == environment.statusErrorValidacion) {
          /** Mensaje de error */
          this.sweetAlertService.sweetInfo("Algo está mal", this.responseServiceChangeStatus.data);
          // Object.keys(this.responseServiceChangeStatus.data).forEach(keyname => {
          //   this.sweetAlertService.showNotification('danger', this.responseServiceChangeStatus.data[keyname] );
          // });
          /** Retorno de data original de los status */
          if (this.responseServiceChangeStatus.dataStatus) {
            this.responseServiceChangeStatus.dataStatus.forEach((data) => {
              this.dtData[data.idInitialList]["status"] = data.status;
              this.dtData[data.idInitialList]["statusText"] = data.statusText;
            });
          }
          /** Retorno de data original de los status */
          if (this.responseServiceChangeStatus.dataResponse) {
            this.responseServiceChangeStatus.dataResponse.forEach((data) => {
              this.dtData[data.idInitialList]["status"] = data.status;
              this.dtData[data.idInitialList]["statusText"] = data.statusText;
            });
          }

          this.rerenderChangeStatus(); // Recargar el dataTable para actualizar los datos
        } else if (this.responseServiceChangeStatus.status == environment.statusErrorAccessDenied) {
          /** Mensaje de error */
          this.sweetAlertService.sweetInfo("Algo está mal", { error: this.responseServiceChangeStatus.message });
          // this.sweetAlertService.showNotification('danger', this.responseServiceChangeStatus.message );
          /** Retorno de data original de los status */
          if (this.responseServiceChangeStatus.dataStatus) {
            this.responseServiceChangeStatus.dataStatus.forEach((data) => {
              this.dtData[data.idInitialList]["status"] = data.status;
              this.dtData[data.idInitialList]["statusText"] = data.statusText;
            });
          }
          /** Retorno de data original de los status */
          if (this.responseServiceChangeStatus.dataResponse) {
            this.responseServiceChangeStatus.dataResponse.forEach((data) => {
              this.dtData[data.idInitialList]["status"] = data.status;
              this.dtData[data.idInitialList]["statusText"] = data.statusText;
            });
          }
          this.rerenderChangeStatus(); // Recargar el dataTable para actualizar los datos
        } else {
          /** Mensaje de exito */
          this.sweetAlertService.showNotification("success", this.responseServiceChangeStatus.message);

          /** Valida si llega dataNotification para mostrar notificaciones */
          if (this.responseServiceChangeStatus.dataNotification) {
            let dataNotifi = this.responseServiceChangeStatus.dataNotification;
            dataNotifi.forEach((element) => {
              this.sweetAlertService.showNotification(element.type, element.message);
            });
          }

          if (this.responseServiceChangeStatus.reloadInitialList) {
            /** Recargar initial list */
            this.reloadInitialList();
          } else {
            /** Retorno de data de los estatus modificados */
            this.responseServiceChangeStatus.data.forEach((data) => {
              this.dtData[data.idInitialList]["status"] = data.status;
              this.dtData[data.idInitialList]["statusText"] = data.statusText;
            });
            this.rerenderChangeStatus(); // Recargar el dataTable para actualizar los datos
          }
        }
      },
      (err) => {
        // Evaluar respuesta de error del servicio
        this.responseServiceChangeStatusErr = err;
        this.globalAppService.resolveResponseError(this.responseServiceChangeStatusErr, false).then((res) => {});
      }
    );
  }

  rerender(): void {
    this.configDtOptions().then(() => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(0);
      });
    });
  }

  rerenderChangeStatus(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // this.configDtOptions();
      dtInstance.destroy();
      this.dtTrigger.next(0);
    });
  }

  /** Abre el componente de filter initial list */
  openFilter() {
    this.statusFilter = true;
  }

  /** Cerrar o desdruir componente de filtros */
  closeFilter(respuesta) {
    // console.log(respuesta);
    this.dataFilter = respuesta;
    this.statusFilter = false;
    this.filterActive = false;
    // Destruye el initial list
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.dataTablesInit();
    // this.statusAnexosMain = false;
    /** Retornar data seleccionada vacia ya que se esta reinicializando el dataTable */
    this.selectedRows = [];
    this.selectedRowsEmiter.emit(this.selectedRows);
    /** Fin Retornar data seleccionada vacia ya que se esta reinicializando el dataTable */
    this.dataFilterEmiter.emit(this.dataFilter);
  }

  /** Métodos para el uso de la internacionalización */

  socketOnRoom(userId) {
    /**
     * Activando la escucha del socket para actualizar el lenguaje del usuario
     */
    // this.servicePrueba =  this.socketioService.socketOn(environment.roomLanguageUser + userId ).subscribe((res) => {
    //     this.resSocketOnLanguage = res;
    //     this.activeLang = this.resSocketOnLanguage.data;
    //     this.rerender();
    // });
    // console.log( this.servicePrueba );
    /**
     * Fin Activando la escucha del socket para actualizar el lenguaje del usuario
     */
  }

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
      /** Configurando variables de internacionalización */
      this.activeLang = this.languageReceive;
      localStorage.setItem("language", this.languageReceive);
      this.configDtOptions();
      this.reloadLangDatatable = true; // Se indica que se debe recargar el datatable
    });
  }

  /**
   * Transaccion de Anulacion de radicados
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario
   */
  transactionAnnulment(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPut(this.routeChangeStatus, dataSend, this.authorization).subscribe(
      (res) => {
        this.resServicesAnnulment = res;
        // console.log(this.resServicesAnnulment);

        this.globalAppService.resolveResponse(this.resServicesAnnulment, false).then((res) => {
          let responseResolveResponseDown = res;

          if (responseResolveResponseDown == true) {
            if (data.action == "checkRequest") {
              this.downloadFile(this.resServicesAnnulment.datafile, this.resServicesAnnulment.fileName);
            }
            this.sweetAlertService.showNotification("success", this.resServicesAnnulment["message"]);

            // Recarga el Initial List
            this.reloadInitialList();
          }

          // Cargando false
          this.sweetAlertService.sweetClose();
          // this.rerenderChangeStatus();
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
   * Descargar rotulos de radicado
   * @param data recibe que contiene los id de los radicados y la tipo de rotulo
   */
  getDownloadRotulos(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.showNotificationLoading();

    this.restService
      .restPut(this.versionApi + "gestionArchivo/gestion-archivo/download-rotulos", dataSend, this.authorization)
      .subscribe(
        (res) => {
          this.resSerDownloadRotulos = res;
          // console.log(this.resSerDownloadRotulos);

          this.globalAppService.resolveResponse(this.resSerDownloadRotulos, false).then((res) => {
            let responseResolveResponseDown = res;
            // Cargando false
            this.sweetAlertService.showNotificationClose();
            if (responseResolveResponseDown) {
              if (this.resSerDownloadRotulos.datafile) {
                this.downloadFile(this.resSerDownloadRotulos.datafile, this.resSerDownloadRotulos.fileName);
              }
              this.sweetAlertService.showNotification("success", this.resSerDownloadRotulos["message"]);
            }
          });
        },
        (err) => {
          this.resSerDownloadRotulosErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerDownloadRotulosErr).then((res) => {
            // Cargando false
            this.sweetAlertService.showNotificationClose();
          });
        }
      );
  }

  /**
   * Transferencia manual de expedientes
   * @param data llegan los ids y la observacion
   */
  transactionManualTransfer(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(
        this.versionApi + "gestionDocumental/trd-transferencia/transferencia-manual",
        dataSend,
        this.authorization
      )
      .subscribe(
        (res) => {
          this.resSerManualTransfer = res;
          // console.log(this.resSerManualTransfer);

          this.globalAppService.resolveResponse(this.resSerManualTransfer, false).then((res) => {
            let responseResolveResponseDown = res;

            if (responseResolveResponseDown == true) {
              if (this.resSerManualTransfer.notificacion) {
                this.resSerManualTransfer.notificacion.forEach((dataSer) => {
                  this.sweetAlertService.showNotification(dataSer.type, dataSer.message);
                });
              }

              // Recarga el Initial List
              this.reloadInitialList();
            }

            // Cargando false
            this.sweetAlertService.sweetClose();
            // this.rerenderChangeStatus();
          });
        },
        (err) => {
          this.resSerManualTransferErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerManualTransferErr).then((res) => {});
        }
      );
  }

  /**
   * Funcion que descarga los fuit de los expedientes
   * @param data llegan los ids
   */
  getDownloadFuit(data) {
    let dataSend = {
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.showNotificationLoading();

    this.restService
      .restPut(this.versionApi + "gestionDocumental/trd-transferencia/download-fuit", dataSend, this.authorization)
      .subscribe(
        (res) => {
          this.resSerDownloadFuit = res;
          // console.log(this.resSerDownloadFuit);

          this.globalAppService.resolveResponse(this.resSerDownloadFuit, false).then((res) => {
            let responseResolveResponseDown = res;
            // Cargando false
            this.sweetAlertService.showNotificationClose();
            if (responseResolveResponseDown) {
              if (this.resSerDownloadFuit.datafile) {
                this.resSerDownloadFuit.datafile.forEach((dataFiles) => {
                  this.downloadFile(dataFiles.datafile, dataFiles.fileName);
                });
              }
              this.sweetAlertService.showNotification("success", this.resSerDownloadFuit["message"]);
            }
          });
        },
        (err) => {
          this.resSerDownloadFuitErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerDownloadFuitErr).then((res) => {
            // Cargando false
            this.sweetAlertService.showNotificationClose();
          });
        }
      );
  }

  /**
   * Funcion de aceptar transferencia
   * @param data llegan los ids
   */
  transactionAcceptTransfer(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(
        this.versionApi + "gestionDocumental/trd-transferencia/transferencia-aceptada",
        dataSend,
        this.authorization
      )
      .subscribe(
        (res) => {
          this.resSerAcceptTransfer = res;
          // console.log(this.resSerAcceptTransfer);

          this.globalAppService.resolveResponse(this.resSerAcceptTransfer, false).then((res) => {
            let responseResolveResponseDown = res;

            if (responseResolveResponseDown == true) {
              if (this.resSerAcceptTransfer.notificacion) {
                this.resSerAcceptTransfer.notificacion.forEach((dataSer) => {
                  this.sweetAlertService.showNotification(dataSer.type, dataSer.message);
                });
              }

              // Recarga el Initial List
              this.reloadInitialList();
            }
          });
        },
        (err) => {
          this.resSerAcceptTransferErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerAcceptTransferErr).then((res) => {});
        }
      );
  }

  /**
   * Funcion que rechaza la transaccion
   * @param data llegan los ids y la observacion
   */
  transactionRejectTransfer(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(
        this.versionApi + "gestionDocumental/trd-transferencia/transferencia-rechazada",
        dataSend,
        this.authorization
      )
      .subscribe(
        (res) => {
          this.resSerRejectTransfer = res;
          // console.log(this.resSerRejectTransfer);

          this.globalAppService.resolveResponse(this.resSerRejectTransfer, false).then((res) => {
            let responseResolveResponseDown = res;

            if (responseResolveResponseDown == true) {
              if (this.resSerRejectTransfer.notificacion) {
                this.resSerRejectTransfer.notificacion.forEach((dataSer) => {
                  this.sweetAlertService.showNotification(dataSer.type, dataSer.message);
                });
              }

              // Recarga el Initial List
              this.reloadInitialList();
            }
          });
        },
        (err) => {
          this.resSerRejectTransferErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerRejectTransferErr).then((res) => {});
        }
      );
  }

  /**
   * Transaccion de archivar expediente
   * @param data llegan los ids y la observacion
   */
  transactionArchiveFolder(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/archive-expedient", dataSend, this.authorization)
      .subscribe(
        (res) => {
          this.resSerArchiveFolder = res;
          // console.log(this.resSerArchiveFolder);

          this.globalAppService.resolveResponse(this.resSerArchiveFolder, false).then((res) => {
            let responseResolveResponseDown = res;

            if (responseResolveResponseDown == true) {
              if (this.resSerArchiveFolder.notificacion) {
                this.resSerArchiveFolder.notificacion.forEach((dataSer) => {
                  this.sweetAlertService.showNotification(dataSer.type, dataSer.message);
                });
              }
              // Recarga el Initial List
              this.reloadInitialList();
            }
          });
        },
        (err) => {
          this.resSerArchiveFolderErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerArchiveFolderErr).then((res) => {});
        }
      );
  }

  /**
   * Transaccion de devolver radicado PQRSD al ciudadano
   * @param data llegan los ids y la observacion
   */
  transactionReturnPqrToCitizen(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/return-pqr-to-citizen", dataSend, this.authorization)
      .subscribe(
        (res) => {
          this.resSerReturnPqrToCitizen = res;
          // console.log(this.resSerReturnPqrToCitizen);

          this.globalAppService.resolveResponse(this.resSerReturnPqrToCitizen, false).then((res) => {
            let responseResolveResponseDown = res;

            if (responseResolveResponseDown == true) {
              this.sweetAlertService.showNotification("success", this.resSerReturnPqrToCitizen.message);
              // Recarga el Initial List
              this.reloadInitialList();
            }
          });
        },
        (err) => {
          this.resSerReturnPqrToCitizenErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerReturnPqrToCitizenErr).then((res) => {});
        }
      );
  }

  /**
   * Transaccion de Reasignar
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario y el usuario destino
   */
  transactionReasing(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.routeChangeStatus, dataSend, this.authorization).subscribe(
      (res) => {
        this.resServicesReasign = res;

        this.globalAppService.resolveResponse(this.resServicesReasign, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification("success", this.resServicesReasign["message"]);

            if (
              typeof this.resServicesReasign["messageRadicadosNoProcesados"] !== "undefined" &&
              this.resServicesReasign.messageRadicadosNoProcesados != ""
            ) {
              this.sweetAlertService.showNotification(
                "danger",
                this.resServicesReasign["messageRadicadosNoProcesados"]
              );
            }

            this.reloadInitialList();
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
   * Transaccion de solicitar VOBO o visto bueno
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario
   */
  transactionVobo(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.routeChangeStatus, dataSend, this.authorization).subscribe(
      (res) => {
        this.resServicesVobo = res;

        this.globalAppService.resolveResponse(this.resServicesVobo, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification("success", this.resServicesVobo["message"]);

            this.reloadInitialList();
          }
        });
      },
      (err) => {
        this.resServicesVoboErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resServicesVoboErr).then((res) => {});
      }
    );
  }

  /**
   * Transaccion de finalizar radicado
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario
   */
  transactionFinalizeFiling(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.routeChangeStatus, dataSend, this.authorization).subscribe(
      (res) => {
        this.resServicesFinalizeFiling = res;

        this.globalAppService.resolveResponse(this.resServicesFinalizeFiling, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification("success", this.resServicesFinalizeFiling["message"]);

            this.reloadInitialList();
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
  transactionShippingReady(dataVal) {
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/shipping-ready", dataVal, this.authorization)
      .subscribe(
        (res) => {
          this.resSerShippingReady = res;

          this.globalAppService.resolveResponse(this.resSerShippingReady, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.sweetAlertService.showNotification("success", this.resSerShippingReady["message"]);

              this.reloadInitialList();
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
   * Transacción de archivar radicado
   * @param dataVal
   */
  transactionArchiveFiling(dataVal) {
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/archive-filing", dataVal, this.authorization)
      .subscribe(
        (res) => {
          this.resSerArchiveFiling = res;
          // console.log(this.resSerArchiveFiling);

          this.globalAppService.resolveResponse(this.resSerArchiveFiling, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              // Muestra las notificaciones
              if (this.resSerArchiveFiling.notificacion) {
                this.resSerArchiveFiling.notificacion.forEach((dataSer) => {
                  this.sweetAlertService.showNotification(dataSer.type, dataSer.message);
                });
              }

              // Recarga el Initial List
              this.reloadInitialList();
            }
            // Cargando false
            // this.sweetAlertService.sweetClose();
          });
        },
        (err) => {
          this.resSerArchiveFilingErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerArchiveFilingErr).then((res) => {});
        }
      );
  }

  /**
   * Transacción de Solicitar préstamo de documentos
   * @param dataVal
   */
  transactionApplyForLoan(dataVal) {
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(dataVal.route, dataVal, this.authorization).subscribe(
      (res) => {
        this.resSerApplyForLoan = res;

        this.globalAppService.resolveResponse(this.resSerApplyForLoan, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Muestra las notificaciones
            this.sweetAlertService.showNotification("success", this.resSerApplyForLoan.message);

            // Recarga el Initial List
            this.reloadInitialList();
          }
          // Cargando false
          this.sweetAlertService.sweetClose();
        });
      },
      (err) => {
        this.resSerApplyForLoanErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerApplyForLoanErr).then((res) => {});
      }
    );
  }

  /**
   * Transacción de Aceptar préstamo de documentos
   * @param dataVal
   */
  transactionApproveLoan(dataVal) {
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(dataVal.route, dataVal, this.authorization).subscribe(
      (res) => {
        this.resSerApproveLoan = res;

        this.globalAppService.resolveResponse(this.resSerApproveLoan, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Muestra las notificaciones
            this.sweetAlertService.showNotification("success", this.resSerApproveLoan.message);
          }
          // Cargando false
          this.sweetAlertService.sweetClose();
          // Recarga el Initial List
          this.reloadInitialList();
        });
      },
      (err) => {
        this.resSerApproveLoanErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerApproveLoanErr).then((res) => {});
      }
    );
  }

  /**
   * Transacción de Cancelar préstamo de documentos
   * @param dataVal
   */
  transactionCancelLoan(dataVal) {
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(dataVal.route, dataVal, this.authorization).subscribe(
      (res) => {
        this.resSerCancelLoan = res;
        // console.log(this.resSerCancelLoan);

        this.globalAppService.resolveResponse(this.resSerCancelLoan, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Muestra las notificaciones
            this.sweetAlertService.showNotification("success", this.resSerCancelLoan.message);

            // Recarga el Initial List
            this.reloadInitialList();
          }
          // Cargando false
          this.sweetAlertService.sweetClose();
        });
      },
      (err) => {
        this.resSerCancelLoanErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerCancelLoanErr).then((res) => {});
      }
    );
  }

  /**
   * Transacción de Devolver préstamo de documentos
   * @param dataVal
   */
  transactionReturnLoan(dataVal) {
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(dataVal.route, dataVal, this.authorization).subscribe(
      (res) => {
        this.resSerReturnLoan = res;
        // console.log(this.resSerReturnLoan);

        this.globalAppService.resolveResponse(this.resSerReturnLoan, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Muestra las notificaciones
            this.sweetAlertService.showNotification("success", this.resSerReturnLoan.message);

            // Recarga el Initial List
            this.reloadInitialList();
          }
          // Cargando false
          this.sweetAlertService.sweetClose();
        });
      },
      (err) => {
        this.resSerReturnLoanErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerReturnLoanErr).then((res) => {});
      }
    );
  }

  /**
   * Transaccion de enviar correspondencia
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario
   */
  transactionShipping(data) {
    this.uploadProcess = true;
    // loading true
    this.sweetAlertService.sweetLoading();
    // Se asignan los  valores al json
    let dataSend = {
      formValue: data.dataObserva,
      eventSelectData: data.ButtonSelectedData,
    };

    const formData = new FormData();
    formData.append("fileUpload", data.dataObserva.fileUpload);

    this.uploadResponse = { status: true, message: "Cargando...", proccess: 0 };

    this.encryptService.generateRouteGetParams(this.ruoteServiceDocuments, dataSend, this.authorization).then((res) => {
      this.urlEndSend = res;

      /** Comsumo de servicio  */
      this.http
        .post(this.urlEndSend, formData, {
          headers: new HttpHeaders({
            Authorization: "Bearer " + this.authorization,
            language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
          }),
          reportProgress: true,
          observe: "events",
        })
        .subscribe(
          (event: any) => {
            switch (event.type) {
              case HttpEventType.UploadProgress: // Cuando el archivo está siendo cargado
                const progress = Math.round((100 * event.loaded) / event.total);
                this.uploadResponse = { status: true, message: "Cargando...", proccess: progress };
                break;
              case HttpEventType.Response: // Cuando termina la carga
                if (event.body) {
                  this.resServiceShipping = event.body;
                  // Desencriptar respuesta del servicio
                  this.encryptService.decryptAES(this.resServiceShipping.encrypted, this.authorization).then((res) => {
                    let resUploadFileDecrypt: any = res;
                    // console.log(resUploadFileDecrypt);
                    // Evaluar respuesta del servicio
                    this.globalAppService
                      .resolveResponse(resUploadFileDecrypt, true, this.redirectionPath)
                      .then((res) => {
                        let responseResolveResponse = res;
                        // Cargando false
                        this.sweetAlertService.sweetClose();
                        if (responseResolveResponse == true) {
                          this.uploadResponse = { status: true, message: "Completado", proccess: 100 };
                          this.sweetAlertService.showNotification("success", resUploadFileDecrypt.message);

                          if (resUploadFileDecrypt.data) {
                            resUploadFileDecrypt.data.forEach((data) => {
                              this.dtData[data.idInitialList]["status"] = data.status;
                              this.dtData[data.idInitialList]["statusText"] = data.statusText;
                            });
                          }

                          this.selectedRowsEmiter.emit(data.ButtonSelectedData);
                        } else {
                          this.uploadProcess = false;
                        }
                      });
                    // Fin Evaluar respuesta del servicio
                  });
                  // Fin Desencriptar respuesta del servicio
                }
                break;
            }
          },
          (err) => {
            this.resServiceShippingErr = err;
            // Evaluar respuesta de error del servicio
            this.globalAppService
              .resolveResponseError(this.resServiceShippingErr, true, this.redirectionPath)
              .then((res) => {});
            this.uploadResponse = { status: true, message: "Cargando...", proccess: 0 };
            this.sweetAlertService.sweetInfoText("El archivo no pudo ser procesado", "");
            this.uploadProcess = false;
          }
        );
      /** Fin Comsumo de servicio  */
    });

    return false;
  }

  /**
   * Transaccion Entrega de correspondencia
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario
   */
  transactionDelivered(data) {
    // loading true
    this.sweetAlertService.sweetLoading();

    let params = {
      ButtonSelectedData: data.ButtonSelectedData,
    };

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/delivered", params, this.authorization)
      .subscribe(
        (res) => {
          this.resServiceDelivered = res;

          this.globalAppService.resolveResponse(this.resServiceDelivered, false).then((res) => {
            const responseResolveResponse = res;

            if (responseResolveResponse == true) {
              for (let key in this.resServiceDelivered.notificacion) {
                this.sweetAlertService.showNotification(
                  this.resServiceDelivered.notificacion[key]["type"],
                  this.resServiceDelivered.notificacion[key]["message"]
                );
              }

              if (this.resServiceDelivered.data) {
                this.resServiceDelivered.data.forEach((data) => {
                  this.dtData[data.idInitialList]["status"] = data.status;
                  this.dtData[data.idInitialList]["statusText"] = data.statusText;
                });
              }

              this.selectedRowsEmiter.emit(data.ButtonSelectedData);
            }

            // Cargando false
            this.sweetAlertService.sweetClose();
          });
        },
        (err) => {
          this.resServiceDeliveredErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServiceDeliveredErr).then((res) => {});
        }
      );
  }

  /**
   * Metodo Devolver radicado
   * @param data Parametros de la peticion
   * @param dataIdRadicados array id radicados
   */
  transactionReturnDelivery(data) {
    let params = {
      data: data.dataObserva,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/return-delivery", params, this.authorization)
      .subscribe(
        (res) => {
          this.resServiceReturnDelivered = res;

          this.globalAppService.resolveResponse(this.resServiceReturnDelivered, false).then((res) => {
            const responseResolveResponse = res;

            this.sweetAlertService.showNotificationClose();

            if (responseResolveResponse == true) {
              for (let key in this.resServiceReturnDelivered.notificacion) {
                this.sweetAlertService.showNotification(
                  this.resServiceReturnDelivered.notificacion[key]["type"],
                  this.resServiceReturnDelivered.notificacion[key]["message"]
                );
              }

              if (this.resServiceReturnDelivered.data) {
                this.resServiceReturnDelivered.data.forEach((data) => {
                  this.dtData[data.idInitialList]["status"] = data.status;
                  this.dtData[data.idInitialList]["statusText"] = data.statusText;
                });
              }

              this.selectedRowsEmiter.emit(data.ButtonSelectedData);
            }

            // Cargando false
            this.sweetAlertService.sweetClose();
          });
        },
        (err) => {
          this.resServiceReturnDeliveredErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServiceReturnDeliveredErr).then((res) => {});
        }
      );
  }

  /** resServicesCopyInfo
   * Transaccion de copiar informado
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario
   */
  transactionCopyInformaded(data) {
    let dataSend = {
      data: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.routeChangeStatus, dataSend, this.authorization).subscribe(
      (res) => {
        this.resServicesCopyInfo = res;

        this.globalAppService.resolveResponse(this.resServicesCopyInfo, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Cargando false
            this.sweetAlertService.showNotificationClose();
            this.sweetAlertService.showNotification("success", this.resServicesCopyInfo["message"]);
            this.reloadInitialList();
          }
          // this.rerenderChangeStatus();
          // // Cargando false
          // this.sweetAlertService.sweetClose();
        });
      },
      (err) => {
        this.resServicesCopyInfoErr = err;
        // Evaluar respuesta de error del servicio
        // Cargando false
        this.sweetAlertService.showNotificationClose();
        this.globalAppService.resolveResponseError(this.resServicesCopyInfoErr).then((res) => {});
      }
    );
  }

  /**
   * Transaccion de devolucion de radicado
   * @param data recibe que contiene los id de los radicados y la observacion que digita el usuario
   */
  transactionReturnFiling(data) {
    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // console.log( this.resSerLenguage );
      this.titleMsg = this.resSerLenguage.titleMsg;
      this.textMsg = this.resSerLenguage["textMsgRadiReturn"];
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
          let params = {
            observacion: data.data,
            ButtonSelectedData: data.ButtonSelectedData,
          };

          this.sweetAlertService.sweetLoading();

          this.restService
            .restPost(this.versionApi + "radicacion/transacciones/return-filing", params, this.authorization)
            .subscribe(
              (res) => {
                this.resServiceReturnFil = res;

                this.globalAppService.resolveResponse(this.resServiceReturnFil, false).then((res) => {
                  const responseResolveResponse = res;

                  if (responseResolveResponse == true) {
                    for (let key in this.resServiceReturnFil.notificacion) {
                      this.sweetAlertService.showNotification(
                        this.resServiceReturnFil.notificacion[key]["type"],
                        this.resServiceReturnFil.notificacion[key]["message"]
                      );
                    }
                    // if (data.action) {
                    //   if (this.resServiceReturnFil.data) {
                    //     this.resServiceReturnFil.data.forEach( (dataSer, index) => {
                    //       this.eliminarRegistro(dataSer.idInitialList);
                    //       /** Emitir data seleccionada al componente padre, luego de finalizar la eliminación de registros */
                    //       if(this.resServiceReturnFil.data.length == index + 1) {
                    //         this.selectedRowsEmiter.emit(this.selectedRows);
                    //       }
                    //       /** Emitir data seleccionada al componente padre, luego de finalizar la eliminación de registros */
                    //     });
                    //   }
                    // }
                    // this.sweetAlertService.sweetClose();

                    this.reloadInitialList();
                  }
                });
              },
              (err) => {
                this.resServiceReturnFilErr = err;
                // Evaluar respuesta de error del servicio
                this.globalAppService.resolveResponseError(this.resServiceReturnFilErr).then((res) => {});
              }
            );
        }
      });
    });
  }

  /**
   * Transaccion de desiste el ciudadano
   * @param data llegan los ids de radicado
   */
  transactionWithdrawal(data) {
    let dataSend = {
      observacion: data.data,
      ButtonSelectedData: data.ButtonSelectedData,
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(this.versionApi + "radicacion/transacciones/withdrawal", dataSend, this.authorization)
      .subscribe(
        (res) => {
          this.resSerWithdrawal = res;
          // console.log(this.resSerWithdrawal);

          this.globalAppService.resolveResponse(this.resSerWithdrawal, false).then((res) => {
            let responseResolveResponseDown = res;

            if (responseResolveResponseDown == true) {
              this.sweetAlertService.showNotification("success", this.resSerWithdrawal.message);
              // Recarga el Initial List
              this.reloadInitialList();
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
   * Descarga el archivo que llega en base64
   * @param file el  en base 64
   * @param nameDownload nombre del archivo
   */
  downloadFile(file, nameDownload) {
    // console.log(file);
    const linkSource = `data:application/pdf;base64,${file}`;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = nameDownload;
    downloadLink.click();
  }

  /**
   * Solo debe llegar el Id del initial list idInitialList
   * @param data idInitialList
   */
  eliminarRegistro(data) {
    /** Recorrido de la data del initial list */
    this.dtData.forEach((infoIni, index) => {
      if (infoIni.idInitialList == data) {
        this.dtData.splice(index, 1);
      }
    });
    /** Recorrido de la variable que contiene la data seleccionada y que es utilizada por el componente padre */
    this.selectedRows.forEach((infoSelected, index) => {
      if (infoSelected.idInitialList == data) {
        this.selectedRows.splice(index, 1);
      }
    });
  }

  changeDetectedService() {
    this.subscriptionChangeDetectedService = this.changeChildrenService.reloadComponent.subscribe((emit) => {
      this.reloadInitialList();
    });
    this.subscriptionChangeDetectedServiceOpenFilter = this.changeChildrenService.openFilter.subscribe((emit) => {
      this.openFilter();
    });
  }

  copyToClipboard(item) {
    this.sweetAlertService.showNotification("success", this.translate.instant("Copiado"));

    document.addEventListener("copy", (e: ClipboardEvent) => {
      e.clipboardData.setData("text/plain", item);
      e.preventDefault();
      document.removeEventListener("copy", null);
    });
    document.execCommand("copy");
  }

  /** Fin Métodos para el uso de la internacionalización */
  ngOnDestroy() {
    if (!!this.subscriptionChangeStatus) this.subscriptionChangeStatus.unsubscribe();
    if (!!this.subscriptionChangeStatusAnulation) this.subscriptionChangeStatusAnulation.unsubscribe();
    if (!!this.subscriptionTransactionReasign) this.subscriptionTransactionReasign.unsubscribe();
    if (!!this.subscriptionTransactionVobo) this.subscriptionTransactionVobo.unsubscribe();
    if (!!this.subscriptionTransactionReturnFiling) this.subscriptionTransactionReturnFiling.unsubscribe(); // Devolucion de Radicado
    if (!!this.subscriptionTransactionCopyInfo) this.subscriptionTransactionCopyInfo.unsubscribe();
    if (!!this.subscriptionTransactionFinalizeFiling) this.subscriptionTransactionFinalizeFiling.unsubscribe();
    if (!!this.subscriptionDataChangeShipping) this.subscriptionDataChangeShipping.unsubscribe(); // Envio Correspondencia
    if (!!this.subscriptionDataChangeReturnDelivery) this.subscriptionDataChangeReturnDelivery.unsubscribe(); // Devolver Correspondencia
    if (!!this.subscriptionDataChangeDelivered) this.subscriptionDataChangeDelivered.unsubscribe(); // Entregar Correspondencia
    if (!!this.subscriptionTransactionShippingReady) this.subscriptionTransactionShippingReady.unsubscribe(); // Envio de documentos
    if (!!this.subscriptionTransactionArchiveFiling) this.subscriptionTransactionArchiveFiling.unsubscribe(); // Archivar radicado
    if (!!this.subscriptionApplyForLoan) this.subscriptionApplyForLoan.unsubscribe(); // Solicitar préstamo
    if (!!this.subscriptionApproveLoan) this.subscriptionApproveLoan.unsubscribe(); // Aceptar préstamo
    if (!!this.subscriptionCancelLoan) this.subscriptionCancelLoan.unsubscribe(); // Cancelar préstamo
    if (!!this.subscriptionReturnLoan) this.subscriptionReturnLoan.unsubscribe(); // Devolver préstamo
    if (!!this.subscriptionDownloadRotulos) this.subscriptionDownloadRotulos.unsubscribe(); // Descargar rotulos
    if (!!this.subscriptionManualTransfer) this.subscriptionManualTransfer.unsubscribe(); // Transferencia manual
    if (!!this.subscriptionDownloadFuit) this.subscriptionDownloadFuit.unsubscribe(); // Descargar Fuit expedientes
    if (!!this.subscriptionAcceptTransfer) this.subscriptionAcceptTransfer.unsubscribe(); // Acepta transferencia de expedientes
    if (!!this.subscriptionRejectTransfer) this.subscriptionRejectTransfer.unsubscribe(); // Rechaza transferencia de expedientes
    if (!!this.subscriptionArchiveFolder) this.subscriptionArchiveFolder.unsubscribe(); // Archiva expedientes
    if (!!this.subscriptionReturnPqrToCitizen) this.subscriptionReturnPqrToCitizen.unsubscribe(); // Devuelve radicado PQRSD al ciudadano
    if (!!this.subscriptionWithdrawal) this.subscriptionWithdrawal.unsubscribe(); // Desiste el ciudadano

    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe(); // Subscripción de cambio de lenguaje

    if (!!this.subscriptionChangeDetectedService) this.subscriptionChangeDetectedService.unsubscribe();
    if (!!this.subscriptionChangeDetectedServiceOpenFilter)
      this.subscriptionChangeDetectedServiceOpenFilter.unsubscribe();

    this.socketioService.socketDisconnect();
    this.dtTrigger.unsubscribe();
  }
}
