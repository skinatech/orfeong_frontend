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

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AuthService } from '../../../services/auth.service';
import { RestService } from '../../../services/rest.service';
import { GlobalAppService } from '../../../services/global-app.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from '../../../services/activate-translate.service';
import { EncryptService } from 'src/app/services/encrypt.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css']
})
export class DashboardMainComponent implements OnInit, OnDestroy {

  /** Variables para el componente top-nav-bar */
  topNavBarTitle: string = 'Tablero de inicio';
  topNavBarRouteActive: string = '';
  topNavBarOn: string = '';
  /** Fin Variables para el componente top-nav-bar */

  lastPoppedUrl: string;
  location: Location;

  //Data del usuario
  hashLocalStorage: any;

  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'dashboard';
  // Autorizacion de localstorage
  authorization: string = '';
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/dashboard';
  /** Clases de los contenedores iniciales */
  classMainConten: string = '';
  classContainerFluid: string = '';
  classDataTableResponsive = 'table-responsive maxHeightDataTable'; // Preguntar a Jenny si se utiliza el max-height
  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [
    { icon: 'remove_red_eye', title: 'Ver', action: 'view', data: '' },
  ];
  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  initBotonViewRoute: string = '/users/users-view'; // Ruta ver usuario


  /** Initial List Préstamos abiertos */
  dtOpenLoansStatus: boolean = false;
  initCardHeaderStatusOpenLoans: boolean = true;
  initCardHeaderIconOpenLoans = 'folder_open';
  initCardHeaderTitleOpenLoans = 'Préstamos abiertos por documento';
  viewColumStatusOpenLoans: boolean = false;
  routeLoadDataTablesServiceOpenLoans: string = environment.versionApiDefault + 'dashboard/index-approval-loan';
  dtTitlesOpenLoans: any = [
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Fecha vencimiento', 'data': 'dateExpired' },
    { 'title': 'Expediente', 'data': 'expedient' },
    { 'title': 'Responsable', 'data': 'responsable' },
  ];
  /** Fin Initial List Préstamos abiertos */

  /** Initial List Transferencias realizadas */
  dtTransfersAcceptedStatus: boolean = false;
  initCardHeaderStatusTransfersAccepted: boolean = true;
  initCardHeaderIconTransfersAccepted = 'done';
  initCardHeaderTitleTransfersAccepted = 'Transferencias realizadas';
  viewColumStatusTransfersAccepted: boolean = false;
  routeLoadDataTablesServiceTransfersAccepted: string = environment.versionApiDefault + 'dashboard/index-transfers-accepted';
  dtTitlesTransfersAccepted: any = [
    { 'title': 'Número expediente', 'data': 'expedientNumber' },
    { 'title': 'Expediente', 'data': 'expedientName' },
    { 'title': 'Archivo', 'data': 'fileType' },
    { 'title': 'Dependencia', 'data': 'dependency' },
  ];
  /** Fin Initial List Transferencias realizadas */

    /** Initial List Transferencias realizadas */
    dtTransfersGesDocStatus: boolean = false;
    initCardHeaderStatusTransfersGesDoc: boolean = true;
    initCardHeaderIconTransfersGesDoc = 'done';
    initCardHeaderTitleTransfersGesDoc = 'Transferencias de gestión documental';
    viewColumStatusTransfersGesDoc: boolean = false;
    routeLoadDataTablesServiceTransfersGesDoc: string = environment.versionApiDefault + 'dashboard/index-transfers-ges-doc';
    dtTitlesTransfersGesDoc: any = [
      { 'title': 'Número expediente',   'data': 'expedientNumber'   },
      { 'title': 'Nombre expediente',   'data': 'expedientName'     },
      { 'title': 'Serie',               'data': 'serie'             },
      { 'title': 'Subserie',            'data': 'subserie'          },
      { 'title': 'Fecha de creación',   'data': 'creacionGdExpediente'       },
      { 'title': 'Fecha años gestión',  'data': 'tiempoGestionGdExpedientes' },
      { 'title': 'Fecha años central',  'data': 'tiempoCentralGdExpedientes' },
      { 'title': 'Tipo de archivo',     'data': 'tipoArchivo'       },
      { 'title': 'Estado',              'data': 'statusText'        },
    ];
    /** Fin Initial List Transferencias realizadas */

  /** Initial List Radicados creados en ventanilla por día actual */
  dtCreateWindowTodayAdmStatus: boolean = false;
  initCardHeaderStatusCreateWindowTodayAdm: boolean = true;
  initCardHeaderIconCreateWindowTodayAdm = 'description';
  initCardHeaderTitleCreateWindowTodayAdm = 'Radicados de entrada y salida creados hoy';
  viewColumStatusCreateWindowTodayAdm: boolean = false;
  routeLoadDataTablesServiceCreateWindowTodayAdm: string = environment.versionApiDefault + 'dashboard/index-files-created-window';
  dtTitlesCreateWindowTodayAdm: any = [
    { 'title': 'Tipo radicado', 'data': 'filingType' },
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Asunto', 'data': 'subject' },
    { 'title': 'Remitente', 'data': 'sender' },
    { 'title': 'Fecha vencimiento', 'data': 'dateExpired' },
    { 'title': 'Dependencia creadora', 'data': 'depeCreadora' },
    { 'title': 'Usuario creador', 'data': 'userCreador' },
    { 'title': 'Dependencia tramitadora', 'data': 'depeTramitadora' },
    { 'title': 'Usuario tramitador', 'data': 'userTramitador' },
  ];
  dtCreateWindowTodayAdmClass = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';
  /** Fin Initial List Radicados creados en ventanilla por día actual */

  /** Initial List Préstamos cerrados (No se usara por ahora) */
  dtClosedLoansStatus: boolean = false;
  initCardHeaderStatusClosedLoans: boolean = true;
  initCardHeaderIconClosedLoans = 'folder';
  initCardHeaderTitleClosedLoans = 'Préstamos cerrados';
  viewColumStatusClosedLoans: boolean = false;
  routeLoadDataTablesServiceClosedLoans: string = environment.versionApiDefault + 'dashboard/index-return-loan';
  dtTitlesClosedLoans: any = [
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Fecha de entrega', 'data': 'date' },
    { 'title': 'Expediente', 'data': 'expedient' },
    { 'title': 'Responsable', 'data': 'responsable' },
  ];
  /**Fin Initial List Préstamos abiertos por expedientes*/

  //
  /** Initial List Radicados Vencidos (No se usara por ahora) jobando */
  dtFileExpiredOfficialStatus: boolean = false;
  initCardHeaderStatusFileExpiredOfficial: boolean = true;
  initCardHeaderIconFileExpiredOfficial = 'query_builder';
  initCardHeaderTitleFileExpiredOfficial = 'Radicados vencidos';
  viewColumStatusFileExpiredOfficial: boolean = false;
  routeLoadDataTablesServiceFileExpiredOfficial: string = environment.versionApiDefault + 'dashboard/index-file-expired-official';
  dtTitlesFileExpiredOfficial: any = [
    { 'title': 'Tipo radicado', 'data': 'filingType' },
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Días de vencimiento', 'data': 'expiredDays' },
    { 'title': 'Asunto', 'data': 'subject' },
  ];
  /** Fin Initial List Radicados Vencidos */

  /** Initial List Radicados devueltos (No se usara por ahora) jobando */
  dtReturnFileOfficialStatus: boolean = false;
  initCardHeaderStatusReturnFileOfficial: boolean = true;
  initCardHeaderIconReturnFileOfficial = 'reply';
  initCardHeaderTitleReturnFileOfficial = 'Radicados devueltos';
  viewColumStatusReturnFileOfficial: boolean = false;
  routeLoadDataTablesServiceReturnFileOfficial: string = environment.versionApiDefault + 'dashboard/index-return-file-official';
  dtTitlesReturnFileOfficial: any = [
    { 'title': 'Tipo radicado', 'data': 'filingType' },
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Motivo de devolución', 'data': 'observation' },
  ];
  /** Fin Initial List Radicados devueltos */

  /**Initial Radicados asignados jobando*/
  dtFuncionalRadiAsignados: boolean = false;
  initCardHeaderStatusFuncionalRadiAsignados: boolean = true;
  initCardHeaderIconFuncionalRadiAsignados = 'reply';
  initCardHeaderTitleFuncionalRadiAsignados = 'Radicados Asignados';
  viewColumStatusFuncionalRadiAsignados: boolean = false;
  routeLoadDataTablesServiceFuncionalRadiAsignados: string = environment.versionApiDefault + 'dashboard/index-assigned-filings';
  dtTitlesFuncionalRadiAsignados: any = [
    { 'title': 'Tipo radicado', 'data': 'filingType' },
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Fecha de Creación', 'data': 'creationDate' },
    { 'title': 'Fecha de Vencimiento', 'data': 'expiredDate' },
    { 'title': 'Asunto', 'data': 'filingType' },
    { 'title': 'Estado', 'data': 'statusText' },
  ];
  /** Fin Initial Radicados asignados */

  /** Initial List Radicados informados */
  dtFileInformedStatus: boolean = false;
  initCardHeaderStatusFileInformed: boolean = true;
  initCardHeaderIconFileInformed = 'info';
  initCardHeaderTitleFileInformed = 'Radicados informados';
  viewColumStatusFileInformed: boolean = false;
  routeLoadDataTablesServiceFileInformed: string = environment.versionApiDefault + 'dashboard/index-file-informed';
  dtTitlesFileInformed: any = [
    { 'title': 'Tipo radicado', 'data': 'filingType' },
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Fecha vencimiento', 'data': 'dateExpired' },
    { 'title': 'Asunto', 'data': 'subject' },
  ];
  /** Fin Initial List Radicados informados */

  /** sguarin Initial List Documentos Pendiente firma, como se ve en el dashboard*/
  //El que me habilita la visualización de mi tablero
  dtUnsignedDocumentsStatus: boolean = false;
  //Para ver titulo de la tabla
  initCardHeaderStatusUnsignedDocuments: boolean = true;
  initCardHeaderIconUnsignedDocuments = 'info';
  initCardHeaderTitleUnsignedDocuments = 'Documentos pendientes firma';
  //El que me permite ver el estado
  viewColumStatusUnsignedDocuments: boolean = false;
  routeLoadDataTablesServiceUnsignedDocuments: string = environment.versionApiDefault + 'dashboard/index-unsigned-documents';
  dtTitlesUnsignedDocuments: any = [
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Asunto', 'data': 'subject' },
    //{ 'title': 'Estado', 'data': 'statusText' },
  ];
  /** Fin Initial List Documentos pendiente firma */

    /** sguarin radicados asignados a la dependencia*/
  //El que me habilita la visualización de mi tablero
  dtRadiAsigDepStatus: boolean = false;
  //Para ver titulo de la tabla
  initCardHeaderStatusRadiAsigDep: boolean = true;
  initCardHeaderIconRadiAsigDep = 'info';
  initCardHeaderTitleRadiAsigDep = 'Radicados asignados a la dependencia';
  //El que me permite ver el estado
  viewColumStatusRadiAsigDep: boolean = false;
  routeLoadDataTablesServiceRadiAsigDep: string = environment.versionApiDefault + 'dashboard/index-assigned-filings';
  dtTitlesRadiAsigDep: any = [
    { 'title': 'Tipo radicado', 'data': 'filingType' },                         
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Fecha de creación', 'data': 'creationDate' },
    { 'title': 'Fecha de vencimiento', 'data': 'expiredDate' },
    { 'title': 'Asunto', 'data': 'subject' },
    { 'title': 'Estado', 'data': 'statusText' },
    { 'title': 'Usuario responsable', 'data': 'userTramitador' },
    //{ 'title': 'Estado', 'data': 'statusText' },
  ];
  /** Fin Initial List Documentos pendiente firma */

  //
  /** Initial List Solicitudes de visto bueno */
  dtVoboRequestBossStatus: boolean = false;
  initCardHeaderStatusVoboRequestBoss: boolean = true;
  initCardHeaderIconVoboRequestBoss = 'spellcheck';
  initCardHeaderTitleVoboRequestBoss = 'Solicitudes de visto bueno';
  viewColumStatusVoboRequestBoss: boolean = false;
  routeLoadDataTablesServiceVoboRequestBoss: string = environment.versionApiDefault + 'dashboard/index-vobo-request-boss';
  dtTitlesVoboRequestBoss: any = [
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Responsable', 'data': 'responsable' },
  ];
  /** Fin Initial List Solicitudes de visto bueno */
  

  /** Initial List Radicados Vencidos Jefe (No se usara por ahora) */
  dtFileExpiredBossStatus: boolean = false;
  initCardHeaderStatusFileExpiredBoss: boolean = true;
  initCardHeaderIconFileExpiredBoss = 'query_builder';
  initCardHeaderTitleFileExpiredBoss = 'Radicados vencidos';
  viewColumStatusFileExpiredBoss: boolean = false;
  routeLoadDataTablesServiceFileExpiredBoss: string = environment.versionApiDefault + 'dashboard/index-file-expired-boss';
  dtTitlesFileExpiredBoss: any = [
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Días de vencimiento', 'data': 'expiredDays' },
    { 'title': 'Asunto', 'data': 'subject' },
    { 'title': 'Remitente', 'data': 'sender' },
    { 'title': 'Responsable', 'data': 'responsable' },
  ];
  /** Fin Initial List Radicados Vencidos Jefe */

  /** Usuarios activos vs Usuarios inactivos */
  cardUserCounterStatus: boolean = false; //actionUserCounter
  resServicesUserCounter: any;
  resServicesUserCounterErr: any;
  countActiveUsers = 0;
  countInactiveUsers = 0;

  /** Initial List Últimas entradas del log */
  dtLastLogEntriesStatus: boolean = false;
  initCardHeaderStatusLastLogEntries: boolean = true;
  initCardHeaderIconLastLogEntries = 'timer';
  initCardHeaderTitleLastLogEntries = 'Últimas entradas del log';
  viewColumStatusLastLogEntries: boolean = false;
  routeLoadDataTablesServiceLastLogEntries: string = environment.versionApiDefault + 'dashboard/index-last-log-entries';
  dtTitlesLastLogEntries: any = [
    { 'title': 'Usuario', 'data': 'userName' },
    { 'title': 'Fecha', 'data': 'dateLog' },
    { 'title': 'Evento', 'data': 'event' },
    { 'title': 'Módulo', 'data': 'module' },
  ];
  /** Fin Initial List Últimas entradas del log */

  /** Initial List Usuarios por dependencia */
  dtUserByDependencyStatus: boolean = false;
  initCardHeaderStatusUserByDependency: boolean = true;
  initCardHeaderIconUserByDependency = 'done';
  initCardHeaderTitleUserByDependency = 'Usuarios por dependencia';
  viewColumStatusUserByDependency: boolean = false;
  routeLoadDataTablesServiceUserByDependency: string = environment.versionApiDefault + 'dashboard/index-user-by-dependency';
  dtTitlesUserByDependency: any = [
    { 'title': 'Dependencia', 'data': 'dependency' },
    { 'title': 'Cantidad usuarios', 'data': 'countUser' },
  ];
  /** Fin Initial List Usuarios por dependencia */

  /** Initial List Usuarios por perfil */
  dtUserByProfileStatus: boolean = false;
  initCardHeaderStatusUserByProfile: boolean = true;
  initCardHeaderIconUserByProfile = 'done';
  initCardHeaderTitleUserByProfile = 'Usuarios por perfil';
  viewColumStatusUserByProfile: boolean = false;
  routeLoadDataTablesServiceUserByProfile: string = environment.versionApiDefault + 'dashboard/index-user-by-profile';
  dtTitlesUserByProfile: any = [
    { 'title': 'Perfil', 'data': 'profile' },
    { 'title': 'Cantidad usuarios', 'data': 'countUser' },
  ];
  /** Fin Initial List Usuarios por perfil */

  /** Initial List Radicados creados en ventanilla por día actual */
  dtCreateWindowTodayStatus: boolean = false;
  initCardHeaderStatusCreateWindowToday: boolean = true;
  initCardHeaderIconCreateWindowToday = 'description';
  initCardHeaderTitleCreateWindowToday = 'Radicados creados hoy';
  viewColumStatusCreateWindowToday: boolean = false;
  routeLoadDataTablesServiceCreateWindowToday: string = environment.versionApiDefault + 'dashboard/index-files-created-window';
  dtTitlesCreateWindowToday: any = [
    { 'title': 'Tipo radicado', 'data': 'filingType' },
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Asunto', 'data': 'subject' },
    { 'title': 'Remitente', 'data': 'sender' },
    { 'title': 'Fecha vencimiento', 'data': 'dateExpired' },
    { 'title': 'Dependencia creadora', 'data': 'depeCreadora' },
    { 'title': 'Usuario creador', 'data': 'userCreador' },
    { 'title': 'Dependencia tramitadora', 'data': 'depeTramitadora' },
    { 'title': 'Usuario tramitador', 'data': 'userTramitador' },
    { 'title': 'Estado', 'data': 'statusText' },
  ];
  dtCreateWindowTodayClass = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';
  /** Fin Initial List Radicados creados en ventanilla por día actual */

  /** Variables para internacionalizacion */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  /** Variables para control de inactividad */
  userTimeOutSessionMin: any;
  subscriptionBnIdle$: Subscription;

  /** Definición de clases para los datatables */
  dtFileInformedClass = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';
  dataUrlActivo = ''; // Ruta para usuarios activos
  dataUrlInactivo = ''; // Ruta para usuarios inactivos

  constructor(private router: Router, location: Location, private lhs: LocalStorageService, private authService: AuthService, public restService: RestService, public globalAppService: GlobalAppService,
    private translate: TranslateService, private activateTranslateService: ActivateTranslateService, private encryptService: EncryptService, 
    private bnIdle: BnNgIdleService
  ) {
    this.location = location;
    /** Idioma inical */
    this.detectLanguageInitial();
  }

  ngOnInit() {
    /** Detectando si se ejecuta cambio de idioma */
    this.detectLanguageChange();

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
      // console.log('this.lastPoppedUrl');
      // console.log(this.lastPoppedUrl);
    });

    this.getTokenLS();
    this.calculateSessionInactivity('');
  }

  /** Método para obtener el token que se encuentra encriptado en el local storage */
  getTokenLS() {
    /** Se consulta solo si el token no se recibió como Input() */
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.hashLocalStorage = this.authService.decryptAES( localStorage.getItem( environment.hashSkina ) );
      this.validateUserType(this.hashLocalStorage.data.idUserTipo);
      // Crea la estructura para filtros de usuarios
      let paramsActivo = {
        status: 10
      };
      let paramsInactivo = {
        status: 0
      };
      // Encrypta la información para enviar la por GET
      this.dataUrlActivo = this.encryptService.encryptAES(paramsActivo, this.authorization, true );
      this.dataUrlInactivo = this.encryptService.encryptAES(paramsInactivo, this.authorization, true );
    });
  }

  validateUserType(idUserTipo: any) {
    // Administrador de gestión documental
    if (idUserTipo == environment.tipoUsuario.AdministradorGestionDoc) {
      this.dtOpenLoansStatus = true;
      this.dtTransfersAcceptedStatus = true;
      this.dtTransfersGesDocStatus = true;
      //this.dtClosedLoansStatus = true;
      this.dtCreateWindowTodayStatus = true;
    }
    // Funcional
    if (idUserTipo == environment.tipoUsuario.Funcional) {
      // this.dtFileExpiredOfficialStatus = true;
      // this.dtReturnFileOfficialStatus = true;
      this.dtFuncionalRadiAsignados = true;
      
      this.dtFileInformedStatus = true;
      this.dtFileInformedClass = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';
    }
    // Jefe
    if (idUserTipo == environment.tipoUsuario.Jefe) {
      this.dtFileInformedStatus = true;
      this.dtFileInformedClass = 'col-lg-7 col-md-7 col-sm-12 col-xs-12';
      this.dtVoboRequestBossStatus = true;
      this.dtUnsignedDocumentsStatus = true;
      this.dtRadiAsigDepStatus = true;
      // this.dtFileExpiredBossStatus = true;
    }
    // Ventanilla de radicación
    if (idUserTipo == environment.tipoUsuario.VentanillaRadicacion) {
      this.dtFileInformedStatus = true;
      this.dtFileInformedClass = 'col-lg-6 col-md-6 col-sm-12 col-xs-12';
      this.dtReturnFileOfficialStatus = true;
      this.dtCreateWindowTodayStatus = true;
    }
    // Administrador del sistema
    if (idUserTipo == environment.tipoUsuario.AdministradorSistema) {
      this.userCounterService();
      this.cardUserCounterStatus = true;
      this.dtLastLogEntriesStatus = true;
      this.dtUserByDependencyStatus = true;
      this.dtUserByProfileStatus = true;
    }
  }

  /** Servicio para consultar usuarios activos e inactivos */
  userCounterService() {
    this.restService.restGet(environment.versionApiDefault + 'dashboard/user-counter', this.authorization).subscribe(
      (res) => {
        this.resServicesUserCounter = res;

        this.globalAppService.resolveResponse(this.resServicesUserCounter, false).then((res) => {
          let responseResolveResponseDown = res;
          if (responseResolveResponseDown == true) {
            this.countActiveUsers = this.resServicesUserCounter.data.active;
            this.countInactiveUsers = this.resServicesUserCounter.data.inactive;
          }
        });
      }, (err) => {
        this.resServicesUserCounterErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resServicesUserCounterErr).then((res) => { });
      }
    );
  }

  /** Es requerido por la plantilla pero no se conoce su función */
  public isMap() {
    if (this.location.prepareExternalUrl(this.location.path()) === '/maps/fullscreen') {
      return true;
    } else {
      return false;
    }
  }

  /** Seleccion de registros del Initial List Préstamos abiertos y cerrados */
  selectedRowsReceiveDataOpenLoans(event) {

    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'documentaryLoans/history-loan/' + this.eventClickButtonSelectedData[0]['data'][0];// Ruta del histórico
        this.menuButtons = this.menuButtonsSelectOne;
      } else {
        this.menuButtons = this.menuButtonsSelectOne;
        this.initBotonViewRoute = 'documentaryLoans/manage-loan-index';
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }

  }

  /** Seleccion de registros del Initial List Préstamos cerrados */
  selectedRowsReceiveDataClosedLoans(event) {

    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'documentaryLoans/history-loan/' + this.eventClickButtonSelectedData[0]['data'][0];// Ruta del histórico
        this.menuButtons = this.menuButtonsSelectOne;
      } else {
        this.menuButtons = this.menuButtonsSelectOne;
        this.initBotonViewRoute = 'documentaryLoans/manage-loan-index';
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }

  }

  /** Seleccion de registros del Initial List Transferencias realizadas */
  selectedRowsReceiveDataTransfersAccepted(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'archiveManagement/documentary-transfer-index'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      } else {
        this.initBotonViewRoute = 'archiveManagement/documentary-transfer-index'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }

  }
  
  /** Seleccion de registros del Initial List Transferencias de gestión documental */
  selectedRowsReceiveDataTransfersGesDoc(event) {
    let dataUrl = '';

    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;

        // Crea la estructura para filtros
        let params = {
          idGdExpediente: event[0].id
        };
        // Encrypta la información para enviar la por GET
        dataUrl = this.encryptService.encryptAES(params, this.authorization, true );
        this.initBotonViewRoute = 'archiveManagement/documentary-transfer-index/' + dataUrl; // Ruta ver detalle

        this.menuButtons = this.menuButtonsSelectOne;
      } else {
        this.initBotonViewRoute = 'archiveManagement/documentary-transfer-index'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Seleccion de registros del Initial List Radicados Vencidos */
  selectedRowsReceiveDataFileExpiredOfficial(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'filing/filing-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.initBotonViewRoute = 'filing/filing-index/open'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Seleccion de registros del Initial List Radicados devueltos */
  selectedRowsReceiveDataReturnFileOfficial(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'filing/filing-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.initBotonViewRoute = 'filing/filing-index/open'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Seleccion de registros del Initial List Radicados informados */
  selectedRowsReceiveDataFuncionalRadiAsignados(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'filing/filing-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.initBotonViewRoute = 'filing/filing-index/open'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Seleccion de registros del Initial List Radicados informados */
  selectedRowsReceiveDataFileInformed(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'filing/filing-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.initBotonViewRoute = 'filing/filing-index/open'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

    /** sguarin Seleccion de registros del Initial List Documentación pendiente firma 
     * cuando selecciono los documentos en el dashboard
    */
    selectedRowsReceiveDataUnsignedDocuments(event) {
      if (event.length > 0) {
        if (event.length == 1) { // Un registro seleccionado
          this.eventClickButtonSelectedData = event;
          this.initBotonViewRoute = 'filing/filing-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
          this.menuButtons = this.menuButtonsSelectOne;
        } else { // Varios registros seleccionados
          this.initBotonViewRoute = 'filing/filing-index/open'; // Ruta ver index
          this.menuButtons = this.menuButtonsSelectOne;
        }
      } else { // Ningun registro seleccionado
        this.menuButtons = this.menuButtonsSelectNull;
      }
    }

    /** sguarin Seleccion de registros del Initial List Documentación pendiente firma 
     * cuando selecciono los documentos en el dashboard
    */
         selectedRowsReceiveDataRadiAsigDep(event) {
          if (event.length > 0) {
            if (event.length == 1) { // Un registro seleccionado
              this.eventClickButtonSelectedData = event;
              this.initBotonViewRoute = 'filing/filing-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
              this.menuButtons = this.menuButtonsSelectOne;
            } else { // Varios registros seleccionados
              this.initBotonViewRoute = 'filing/filing-index/open'; // Ruta ver index
              this.menuButtons = this.menuButtonsSelectOne;
            }
          } else { // Ningun registro seleccionado
            this.menuButtons = this.menuButtonsSelectNull;
          }
        }

  /** Seleccion de registros del Initial List Radicados creados en ventanilla hoy */
  selectedRowsReceiveDataCreateWindowToday(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'filing/filing-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.initBotonViewRoute = 'filing/filing-index/open'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Seleccion de registros del Initial List Radicados Vencidos Jefe */
  selectedRowsReceiveDataFileExpiredBoss(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'filing/filing-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.initBotonViewRoute = 'filing/filing-index/open'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Seleccion de registros del Initial List Solicitudes de visto bueno */
  selectedRowsReceiveDataVoboRequestBoss(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'filing/filing-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.initBotonViewRoute = 'filing/filing-index/open'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Seleccion de registros del Initial List Últimas entradas del log */
  selectedRowsReceiveDataLastLogEntries(event) {

    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.initBotonViewRoute = 'audit/log-audit-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.initBotonViewRoute = 'audit/log-audit-index'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }

  }

  /** Seleccion de registros del Initial List Usuarios por dependencia */
  selectedRowsReceiveDataUserByDependency(event) {
    let dataUrl = '';

    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        // Crea la estructura para filtros
        let params = {
          idGdTrdDependencia: event[0].id
        };
        // Encrypta la información para enviar la por GET
        dataUrl = this.encryptService.encryptAES(params, this.authorization, true );
        this.initBotonViewRoute = 'users/users-index/' + dataUrl; // Ruta ver detalle
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectOne;
        this.initBotonViewRoute = 'users/users-index/open'; // Ruta ver index
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }

  }

  /** Seleccion de registros del Initial List Usuarios por perfil */
  selectedRowsReceiveDataUserByProfile(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        // this.initBotonViewRoute = 'users/roles-view' + '/' + this.eventClickButtonSelectedData[0]['data'][0]; // Ruta ver detalle
        let dataUrl = '';
        // Crea la estructura para filtros
        let params = {
          idRol: event[0].id
        };
        // Encrypta la información para enviar la por GET
        dataUrl = this.encryptService.encryptAES(params, this.authorization, true );
        this.initBotonViewRoute = 'users/users-index/' + dataUrl; // Ruta ver detalle
        this.menuButtons = this.menuButtonsSelectOne;

      } else { // Varios registros seleccionados
        this.initBotonViewRoute = 'users/users-index/open'; // Ruta ver index
        this.menuButtons = this.menuButtonsSelectOne;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {

    switch (event.action) {
      case 'view':
        this.router.navigate(['/' + this.initBotonViewRoute]);
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
        this.eventClickButtonSelectedData = event;
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectNull;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Métodos para el uso de la internacionalización */
  detectLanguageInitial() {
    if (localStorage.getItem('language')) {
      this.activeLang = localStorage.getItem('language');
    } else {
      this.activeLang = 'es';
    }
    this.translate.setDefaultLang(this.activeLang);
  }

  detectLanguageChange() {
    this.subscriptionTranslateService$ = this.activateTranslateService.activateLanguageChange.subscribe(language => {
      this.languageReceive = language;
      this.translate.setDefaultLang(this.languageReceive);
    });
  }
  /** Fin Métodos para el uso de la internacionalización */

  /**
   * Metodo para inicializar la funcionalidad de inactividad
   * @params autho authorization
   */
  calculateSessionInactivity(autho: string) {
    let minutes = environment.timeOutSessionMin;

    this.callLocalStorageHashTimeOut().then( (res) => {
      this.userTimeOutSessionMin = res;
      if ( this.userTimeOutSessionMin) {
        minutes = this.userTimeOutSessionMin;
      }
      let seconds = minutes * 60;

      this.subscriptionBnIdle$ = this.bnIdle.startWatching(seconds).subscribe((res) => {
        if(res) {
          // Busca si hay un modal en el cuerpo
          const body = document.getElementsByTagName('body')[0];
          const modalBackdrop = document.getElementsByClassName('mat-dialog-container')[0];
          // Valida ai hay un modal 
          if( modalBackdrop) {
            // Elimina el modal
            body.classList.remove('mat-dialog-container');
            modalBackdrop.remove();
          }
          this.restService.logout(autho, 'inactividad');
        }
      });
    });

  }

  /**
   * Inicio Decoradores utilizados para conocer si se utiliza el mouse o el teclado
   * Se debe cambiar la metodología en caso de que el sistema se ponga lento o aparezcan muchos logs de advertencias como el siguiente:
   * [Violation] 'requestIdleCallback' handler took 62ms
   */
  @HostListener('click', ['$event.target'])onClick(btn) {
    if (!!this.subscriptionBnIdle$) {
      this.bnIdle.resetTimer();
    }
    
  }

  @HostListener('window:keydown', ['$event']) handleKeyDown(event: KeyboardEvent) {
    if (!!this.subscriptionBnIdle$) {
      this.bnIdle.resetTimer();
    }
  }
  
  /** Fin Decoradores utilizados para conocer si se utiliza el mouse o el teclado */

  /** Función que obtiene el tiempo de sessión para inactividad en el local storage */
  callLocalStorageHashTimeOut() {
    return new Promise(resolve => {
      let timeOutLS = localStorage.getItem( environment.hashTimeOut );
      resolve(timeOutLS);
    });
  }

  ngOnDestroy() {
    if (!!this.subscriptionBnIdle$) this.subscriptionBnIdle$.unsubscribe();
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }

}
