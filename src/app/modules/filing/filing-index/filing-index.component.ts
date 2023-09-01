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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FloatingButtonService } from 'src/app/services/floating-button.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from '../../../services/activate-translate.service';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FilingCreateDetailResolutionComponent } from '../filing-create-detail-resolution/filing-create-detail-resolution.component';

import { ChangeChildrenService } from '../../../services/change-children.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-filing-index',
  templateUrl: './filing-index.component.html',
  styleUrls: ['./filing-index.component.css']
})
export class FilingIndexComponent implements OnInit, OnDestroy {

  public titleSubmit: string = 'GUARDAR';

  statusModalUploadFile: boolean = false // Muestra el componente de Envio de Documentos
  statusModalMain: boolean = false;  // Muestra el componente de anexos main
  showAgenda: boolean = false;  // Muestra el input de fecha
  showReasignacion: boolean = false;  // Muestra los inputs de reasignacion
  showVOBO: boolean = false;  // Muestra los inputs de VOBO (Visto bueno)
  showCopyInformaded: boolean = false;  // Muestra los inputs de copiar informado
  textFormObservaHeader: string = ''; // Titulo del botón inteligente tambien titulo del dialog observacion
  operationDialogObserva: string; // operacion que se utiliza para las trasferencias
  // showSendMail: boolean = false; // muestra el modal
  dataSendObserva: any; // Data para enviar al formulario

  statusModalIncludeInFile: boolean = false; // Status del modal incluir en expediente

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'description';
  initCardHeaderTitle = 'Listado de radicados';
  // Nombre del módulo donde se esta accediendo al initialList
  redirectionPath: string = '/filing/filing-index/false';
  route: string = '/filing/filing-index/false';

  /** Formulario index */
  initBotonCreateRoute: string = '/filing/filing-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/filing/filing-update'; // Ruta editar usuario
  initBotonViewRoute: string   = '/filing/filing-view'; // Ruta ver usuario
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Radicación', 'route': '/filing' },
  ];
  breadcrumbRouteActive = 'Radicación estándar';
  // Version api
  versionApi = environment.versionApiDefault;

  textFormAttachment = 'Cargar anexos';
  maxRowsFilesAttachment: number = 5;
  showButtonCleanAttachment: boolean = true;
  showButtonClearAttachment: boolean = true;

  // Autentificacion
  authorization: string;
  /** Variables respuesta Servicios */
  resServices: any;
  resErrServices: any;
  resServicesVobo: any;
  resServicesVoboErr: any;
  resServicesAnnulment: any;
  resServicesAnnulmentErr: any;
  resServicesDiscardConsecutive: any;
  resServicesDiscardConsecutiveErr: any;
  resServicesSendEmailCli: any;
  resServicesSendEmailCliErr: any;
  resServicesDownloadDocumentPackage: any;
  resServicesDownloadDocumentPackageErr: any;
  resSerIncludeFiles: any;
  resSerIncludeFilesErr: any;
  resSerPrintStickers: any;
  resSerPrintStickersErr: any;
  resServicesSkinaScan: any;
  resServicesSkinaScanErr: any;

  validateFile: any = [{ type: 'xls' }, { type: 'xlsx' }, { type: 'pdf' }, { type: 'doc' }, { type: 'docx' }, { type: 'odt' }, { type: 'ods' } ];
  validateFileAnexos: any = environment.validateFile.anexosRadicado;
  statusUploadFileAne: boolean = false; // Muestra el modal para adjuntar anexos
  statusUploadFileAneMasive: boolean = false; // Muestra el modal para adjuntar anexos masivos
  statusSendReplyMailModal: boolean = false; // Muestra el modal de envio de respuesta por correo
  showTipoDocumental: boolean = true; // Se muestra el campo  tipo documental de anexos
  showObservacion: boolean = true ; // Muestra el campo observacion de anexos
  statusNameFile: boolean = false ; // Muestra el campo nombre archivo de anexos
  dataSend: any; // Data que se le envia al front de los radicados
  // Documents
  ruoteServiceDocuments: string = environment.apiUrl + this.versionApi + 'radicacion/transacciones/upload-file';
  // Route Templaste
  ruoteServiceDocumentsTemplate: string = environment.apiUrl + this.versionApi + 'radicacion/transacciones/load-format';
  // Upload Documents Anexos
  ruoteServiceDocumentsAne: string = environment.apiUrl + this.versionApi + 'radicacion/documentos/upload-document';
  // Route Documents modal
  ruoteServiceDocumentsModal: any;
  // Ruta para la carga del documento firmado físicamente
  routeServiceUploadSignedDocument = `${environment.apiUrl + this.versionApi}radicacion/documentos/upload-signed-document`;

  // Configuraciones para datatables
  routeLoadDataTablesService: string = this.versionApi + 'radicacion/radicados/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = this.versionApi + 'radicacion/radicados/change-status';
  routeReasing = this.versionApi + 'radicacion/transacciones/re-asign';
  routeVobo = this.versionApi + 'radicacion/transacciones/solicita-vobo';
  routeCopyInformaded = this.versionApi + 'radicacion/informados/copy';
  routeFinalizeFiling = this.versionApi + 'radicacion/transacciones/finalize-filing';
  routeShippingReady  = this.versionApi + 'radicacion/transacciones/shipping-ready';

  dtTitles: any = [
    { 'title': 'Tipo radicado', 'data': 'TipoRadicado' },
    { 'title': 'Número radicado', 'data': 'numeroRadiRadicado' },
    { 'title': 'Fecha creación', 'data': 'creacionRadiRadicado' },
    { 'title': 'Cliente', 'data': 'nombreCliente' },
    { 'title': 'Asunto', 'data': 'asuntoRadiRadicado' },
    { 'title': 'Tipo documental', 'data': 'nombreTipoDocumental' },
    { 'title': 'Fecha vencimiento', 'data': 'fechaVencimientoRadiRadicados' },
    { 'title': 'Prioridad',         'data': 'prioridadRadicados' },
    { 'title': 'Documento',         'data': 'validDocument' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  messageUnderConstruction: string = 'funcionalidad en construcción';

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
  ];
  menuButtonsSelectOne: any = [];

  menuButtonsSelectMasive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;

  // Data a enviar de los radicados
  dataIdRadicados: any = [];

  /** Variables para internacionalizacion */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  /** Variables para traer el texto de confirmacion */
  titleMsg: string;
  textMsg: string;
  bntCancelar: string;
  btnConfirmacion: string;
  resSerLenguage: any;

  hashLocalStorage: any;

  /**
   * Valida si el filtro debe mostrarse automaticamente
   */
  paramFilterActive: any;

  constructor( private router: Router, public lhs: LocalStorageService, private authService: AuthService, private floatingButtonService: FloatingButtonService, public restService: RestService,
    private translate: TranslateService, private activateTranslateService: ActivateTranslateService,
    public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService, public transaccionesService: TransaccionesService, private routeActi: ActivatedRoute, private changeChildrenService: ChangeChildrenService, private dialog: MatDialog) {
      /** Idioma inical */
      this.detectLanguageInitial();

      this.paramFilterActive = this.routeActi.snapshot.paramMap.get('params');
    }

  ngOnInit() {
    /** Detectando si se ejecuta cambio de idioma */
    this.detectLanguageChange();

    // Hace el llamado del token
    this.getTokenLS();
    /**
     *  remover vista anterior al select multiple RadiRadicadoHijos
     */
     localStorage.removeItem(environment.hashRadiAsociados);
     this.eventClickButtonSelectedData = [];

    this.hashLocalStorage = this.authService.decryptAES( localStorage.getItem( environment.hashSkina ) );
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
  public menuReceiveData(event) {

    this.dataIdRadicados = [];
    // Agrega los id's de los radicados para tratarlos
    let selecRadi = this.eventClickButtonSelectedData;
    if ( selecRadi ) {
      selecRadi.forEach(element => {
        if ( this.dataIdRadicados.indexOf(element.id) < 0 ) {
          this.dataIdRadicados.push(element.id);
        }
      });
    }
    // Le asigna la operacion a ejecutar
    this.operationDialogObserva = event.action;

    switch (event.action) {
      case 'add':

          if (this.dataIdRadicados.length > 0) {
              // Cambia el los mensajes de texto del componete para confirmar la eliminacion
              this.globalAppService.text18nGet().then((res) => {
                this.resSerLenguage = res;
                // console.log( this.resSerLenguage );
                this.titleMsg = this.resSerLenguage.titleMsg;
                this.textMsg = this.resSerLenguage['textMsgRadiMulti'];
                this.bntCancelar = this.resSerLenguage['bntCancelarSendMail'];
                this.btnConfirmacion = this.resSerLenguage['btnConfirmar'];

                swal({
                  title: this.titleMsg,
                  text: this.textMsg,
                  type: 'warning',
                  showCancelButton: true,
                  cancelButtonText: this.bntCancelar,
                  confirmButtonText: this.btnConfirmacion,
                  cancelButtonClass: 'btn btn-danger',
                  confirmButtonClass: 'btn btn-success',
                  buttonsStyling: false
                }).then((result) => {
                  if (result.value) {
                    // Guarda en localStorage para asociacion de radicados
                    localStorage.setItem( environment.hashRadiAsociados, this.authService.encryptAES(this.dataIdRadicados, false));
                    this.router.navigate(['/' + this.initBotonCreateRoute]);
                  }
                });
              });
          } else {
            this.router.navigate(['/' + this.initBotonCreateRoute]);
          }

      break;
      case 'edit':
        this.router.navigate(['/' + this.initBotonUpdateRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'view':
        this.router.navigate(['/' + this.initBotonViewRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'downloadDocumentPackage':
        this.downloadDocumentPackage();
      break;
      case 'uploadFile':
          this.statusModalUploadFile = true;
      break;
      case 'printStickers':
          this.transactionPrintStickers();
      break;
      case 'sendMail':
        // this.sendEmailClient();
        this.dataSend = this.eventClickButtonSelectedData;
        this.statusSendReplyMailModal = true; // Muestra el modal de Envio de respuesta por correo
      break;
      case 'schedule':

        this.showAgenda = true; // Transaccion agendar
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = 'add new Event';
        // muestra el componente
        this.statusModalMain = true;
      break;
      case 'send':

        this.showReasignacion = true; // Transaccion reasignacion
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        this.routeChangeStatus = this.routeReasing;
        // muestra el componente
        this.statusModalMain = true;
      break;
      case 'annulationRequest':
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;
      break;
      case 'discardConsecutive':
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;
      break;
      case 'voboRequest':

        this.showVOBO = true; // Transaccion VOBO
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        this.routeChangeStatus = this.routeVobo;
        // muestra el componente
        this.statusModalMain = true;

      break;
      case 'vobo':
        this.transactionVobo();
      break;
      case 'copyInformaded':

        this.showCopyInformaded = true; // Transaccion de copiar informado
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        this.routeChangeStatus = this.routeCopyInformaded;
        // muestra el componente
        this.statusModalMain = true;

      break;
      case 'loadFormat':
        // valida si hay mas de un radicado
        if ( this.dataIdRadicados.length > 1 ) {
          this.continueUploadTemplate(event);
        } else {
          this.statusUploadFileAne = true; // Muestra el modal de adjutar documentos
          this.showTipoDocumental = false; // No muestra el tipo documental
          this.showObservacion = false; // No muestra la observación
          this.statusNameFile = true; // Muestra el campo nombre archivo
          this.validateFile = [{ type: 'doc' }, { type: 'docx' }, { type: 'odt' } ];
          // Titulo del modal segun el title del boton
          this.textFormObservaHeader = event.title;
          this.ruoteServiceDocumentsModal = this.ruoteServiceDocumentsTemplate; // Ruta de la plantilla
          this.dataSend = this.eventClickButtonSelectedData;
        }
      break;
      case 'attachment':
        this.textFormAttachment = event.title;
        this.maxRowsFilesAttachment = 5;
        this.showButtonCleanAttachment = true;
        this.showButtonClearAttachment = true;

        this.showTipoDocumental = false; // Oculta el campo tipo documental
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        this.ruoteServiceDocumentsModal = this.ruoteServiceDocumentsAne; // Ruta de anexos
        this.dataSend = this.eventClickButtonSelectedData;
        this.statusUploadFileAneMasive = true;
      break;
      case 'attachmentMain':
        this.textFormAttachment = event.title;
        this.maxRowsFilesAttachment = 1;
        this.showButtonCleanAttachment = false;
        this.showButtonClearAttachment = false;

        this.showTipoDocumental = false; // Oculta el campo tipo documental
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        this.ruoteServiceDocumentsModal = this.ruoteServiceDocumentsAne; // Ruta de anexos
        this.dataSend = this.eventClickButtonSelectedData;
        this.statusUploadFileAneMasive = true;
      break;
      case 'finalizeFiling':
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        this.routeChangeStatus = this.routeFinalizeFiling;
        // muestra el componente
        this.statusModalMain = true;
      break;
      case 'returnFiling':
        this.textFormObservaHeader = event.title;
        this.statusModalMain = true;
      break;
      case 'includeInFile':
        this.statusModalIncludeInFile = true;
      break;
      case 'shippingReady':
        this.floatingButtonService.changeTransactionShippingReady(this.eventClickButtonSelectedData);
      break;
      case 'returnPqrToCitizen':
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        // muestra el componente
        this.statusModalMain = true;
      break;
      case 'withdrawal':
        this.textFormObservaHeader = event.title;
        this.statusModalMain = true;
      break;
      case 'printExternal':
        this.transactionPrintExternalLabel(this.eventClickButtonSelectedData);
      break;
      case 'uploadSignedDocument':
        this.statusUploadFileAne = true; // Muestra el modal de adjutar documentos
        this.showTipoDocumental = false; // No muestra el tipo documental
        this.showObservacion = false; // No muestra la observación
        this.statusNameFile = true; // Muestra el campo nombre archivo
        this.validateFile = [{ type: 'pdf' } ];
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        this.ruoteServiceDocumentsModal = this.routeServiceUploadSignedDocument; // Ruta de la plantilla
        this.dataSend = this.eventClickButtonSelectedData;
      break;
      case 'generateNumberFiling':
        this.transactionGenerateNumberFiling(this.eventClickButtonSelectedData);
      break;
      case 'generateStickerFiling':
        this.transactionGenerateStickerFiling(this.eventClickButtonSelectedData);
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
      break;
    }
  }

  /**
   * Método para descargar la etiqueta luego de asignar número de radicado
   * y támbien si el último estado del documento es firmadoDigitamente(13)
   * @param {object} event
   */
  public transactionGenerateStickerFiling(event): void {
    if (event.length > 0) {
      const idRadicado = event[0]['id'];
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
                this.sweetAlertService.showNotification( 'success', response['message'] );
                this.changeChildrenService.changeProcess({ proccess: "reload" });
              }
            }
          });

        }, (err) => {
          this.resErrServices = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
        });
    }
  }

  /**
   * Método para generar número de radicado
   * @param {object} event
   * @returns {void}
   */
  public transactionGenerateNumberFiling(event): void {
    if (event.length > 0) {
      const idRadicado = event[0]['id'];
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
              this.sweetAlertService.showNotification( 'success', response['message'] );
              this.changeChildrenService.changeProcess({ proccess: "reload" });
            }
          });

        }, (err) => {
          this.resErrServices = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
        });
    }
  }

  openDialog(file, width, data) {
    const dialogRef = this.dialog.open(file, {
      disableClose: true,
      width: width,
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

  /**
   * Método para descarga etiqueta externa
   * @param {object} event
   * @returns {void}
   */
  public transactionPrintExternalLabel(event): void {
    if (event.length > 0) {
      const idRadicado = event[0]['id'];
      const params = {
        ButtonSelectedData: idRadicado
      }
      // Cargando true
      this.sweetAlertService.sweetLoading();
      this.restService.restPost(this.versionApi + 'radicacion/transacciones/print-external-sticker', params, this.authorization)
        .subscribe((responseService) => {
          const response = responseService;
          this.sweetAlertService.sweetClose();

          this.globalAppService.resolveResponse(response, false).then( async (res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              if (response.hasOwnProperty('dataFile') && response['dataFile'] !== '') {
                await this.downloadFile(response['dataFile'], response['fileName']);
                this.sweetAlertService.showNotification( 'success', response['message'] );
                this.changeChildrenService.changeProcess({ proccess: "reload" });
              }
            }
          });

        }, (err) => {
          this.resErrServices = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
        });
    }
  }

  /**
   * Funcion que recibe el parametro event y retorna la estructura de los botones a mostrar
   * @param event
   */
  operacionesTiposRadicados(event) {

    if (event.length > 0) {

      // Un registro seleccionado -    // Varios registros seleccionados
      let params = {
        event: event
      };

      this.restService.restPost(this.versionApi + 'radicacion/radicados/radi-multi-acciones', params, this.authorization).subscribe((res) => {

          this.resServices = res;
          this.globalAppService.resolveResponse(this.resServices, false).then((res) => {

            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              // la estructura de los botones llega por backend se asigna a la variable de botones
              this.menuButtonsSelectOne = this.resServices.dataTransacciones;
              this.eventClickButtonSelectedData = event;
              this.menuButtons = this.menuButtonsSelectOne;
              // Guarda en localStorage
              localStorage.setItem( environment.hashMenuButtonRadi, this.authService.encryptAES(this.menuButtons, false));
              // Valida que tenga mensajes para que los muestre en messageButton
              if ( this.resServices.messageButton.length > 0 ) {
                this.resServices.messageButton.forEach( dataSer => {
                  this.sweetAlertService.showNotification( dataSer.type, dataSer.message );
                });
              }
            }

          });

          }, (err) => {
            this.resErrServices = err;
            // Evaluar respuesta de error del servicio
            this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
          }
      );

    // Ningun registro seleccionado
    } else {
      this.menuButtons = this.menuButtonsSelectNull;
    }

  }

  /**
   *
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {
    this.eventClickButtonSelectedData = event;
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectMasive;
      }
    } else { // Ningun registro seleccionado
      localStorage.removeItem(environment.hashRadiAsociados);
      this.menuButtons = this.menuButtonsSelectNull;
    }
    this.operacionesTiposRadicados(event);
  }

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {

    // Inicio - Se reestablecen los valores que se muestran en el componente de observaciones
    this.showAgenda = false; // Transaccion agendar
    this.showReasignacion = false; // Transaccion reasignacion
    this.showVOBO = false; // Transaccion VOBO
    this.showCopyInformaded = false; // Transaccion de copiar informado
    this.routeChangeStatus = ''; // Ruta que ejecuta la transaccion
    this.showTipoDocumental = true; // Muestra el campo tipos documentales en el modal de adjuntar documentos
    this.showObservacion = true; // Muestra el campo observación en el modal de adjuntar documentos
    this.statusNameFile = false; // Oculta el campo nombre archivo
    this.statusModalIncludeInFile = false; // Oculta el modal incluir en expediente
    this.validateFile = [{ type: 'xls' }, { type: 'xlsx' }, { type: 'pdf' }, { type: 'doc' }, { type: 'docx' } ];
    // Fin reestablecer variables

    // dataObserva es la data que retorna el componente de observaciones
    if ( dataObserva.status ) {
      let deleteFilingButton = this.eventClickButtonSelectedData;
      switch ( this.operationDialogObserva ) {
        case 'schedule':
          this.transactionSchedule(dataObserva);
        break;
        case 'send':
          this.floatingButtonService.changeTransactionReasign(this.eventClickButtonSelectedData, dataObserva.data, this.operationDialogObserva );
        break;
        case 'annulationRequest':
            this.transactionCancellationRequest(dataObserva);
        break;
        case 'discardConsecutive':
          this.transactionDiscardConsecutive(dataObserva);
        break;
        case 'attachment':
          this.statusUploadFileAneMasive = false;
        break;
        case 'returnFiling':
          this.floatingButtonService.changeReturnFiling(this.eventClickButtonSelectedData, dataObserva.data.observacion, true);
          this.statusModalMain = true;
        break;
        case 'withdrawal':
          this.floatingButtonService.changeTransactionWithdrawal(this.eventClickButtonSelectedData, dataObserva.data.observacion);
        break;
        case 'voboRequest':
          this.floatingButtonService.changeTransactionVobo(this.eventClickButtonSelectedData, dataObserva.data, this.operationDialogObserva );
        break;
        case 'copyInformaded':
            this.floatingButtonService.changeTransactionCopyInfo(this.eventClickButtonSelectedData, dataObserva.data, this.operationDialogObserva );
        break;
        case 'finalizeFiling':
            this.floatingButtonService.changeTransactionFinalizeFiling(this.eventClickButtonSelectedData, dataObserva.data, this.operationDialogObserva );
        break;
        case 'includeInFile':
            this.transactionIncludeFiles(dataObserva);
        break;
        case 'returnPqrToCitizen':
          this.floatingButtonService.changeReturnPqrToCitizen(this.eventClickButtonSelectedData, dataObserva.data );
        break;
      }

    }
    this.statusUploadFileAne = false;
    this.statusUploadFileAneMasive = false;
    this.statusModalUploadFile = false;
    this.statusModalIncludeInFile = false;
    this.statusModalMain = false;

    if (this.operationDialogObserva == 'uploadFile' || this.operationDialogObserva == 'loadFormat' || this.operationDialogObserva == 'attachment' || this.operationDialogObserva == 'attachmentMain' || this.operationDialogObserva == 'uploadSignedDocument') {
      this.changeChildrenService.changeProcess({ proccess: "reload" });
    }

  }

  transactionSchedule(dataObserva) {

    let params = {
      data: dataObserva.data,
      ButtonSelectedData: this.eventClickButtonSelectedData //
    };

    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.versionApi + 'radicacion/transacciones/schedule', params, this.authorization).subscribe((res) => {

        this.resServices = res;
        // console.log(this.resServices);

        this.globalAppService.resolveResponse(this.resServices, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {

            this.sweetAlertService.showNotification( 'success', this.resServices['message'] );
            // Cargando false
            this.sweetAlertService.sweetClose();
            this.changeChildrenService.changeProcess({ proccess: "reload" });
          }
        });

        }, (err) => {
          this.resErrServices = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
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
      ButtonSelectedData: this.eventClickButtonSelectedData
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.versionApi + 'radicacion/transacciones/solicita-anulacion-radicado', params, this.authorization).subscribe((res) => {

        this.resServicesAnnulment = res;

        this.globalAppService.resolveResponse(this.resServicesAnnulment, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resServicesAnnulment['message'] );
            // Cargando false
            this.sweetAlertService.sweetClose();
            this.changeChildrenService.changeProcess({ proccess: "reload" });
          }
        });

        }, (err) => {
          this.resServicesAnnulmentErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesAnnulmentErr).then((res) => { });
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
      ButtonSelectedData: this.eventClickButtonSelectedData
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.versionApi + 'radicacion/transacciones/descartar-consecutivo', params, this.authorization).subscribe((res) => {

        this.resServicesDiscardConsecutive = res;

        this.globalAppService.resolveResponse(this.resServicesDiscardConsecutive, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resServicesDiscardConsecutive['message'] );
            // Cargando false
            this.sweetAlertService.sweetClose();
            this.changeChildrenService.changeProcess({ proccess: "reload" });
          }
        });

        }, (err) => {
          this.resServicesDiscardConsecutiveErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesDiscardConsecutiveErr).then((res) => { });
        }
    );

  }

  /**
   * Transaccion de VOBO (Visto bueno) no recibe nada, pero toma los ID's de los radicados
   * seleccionados para el debido consumo de servicio
   */
  transactionVobo() {

    /** Se asigna el valor del id del radicado que se está actualizando */
    let data = {
      ButtonSelectedData: this.eventClickButtonSelectedData
    };
    // Cargando true
    this.sweetAlertService.sweetLoading();

    this.restService.restPut( this.versionApi + 'radicacion/transacciones/vobo', data, this.authorization)
      .subscribe((res) => {
        this.resServicesVobo = res;

        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resServicesVobo, true, this.redirectionPath ).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resServicesVobo['message'] );
            this.continueTransaccion();
          }
          // Cargando false
          this.sweetAlertService.sweetClose();
        });
      }, (err) => {
        this.resSerFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, true, this.redirectionPath ).then((res) => { });
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
      ButtonSelectedData: this.eventClickButtonSelectedData //
    };

    this.restService.restPost(this.versionApi + 'radicacion/transacciones/include-expedient', params, this.authorization).subscribe((res) => {

      this.resSerIncludeFiles = res;
      // console.log(this.resSerIncludeFiles);

      this.globalAppService.resolveResponse(this.resSerIncludeFiles, false).then((res) => {
        const responseResolveResponse = res;
        if (responseResolveResponse == true) {
          this.sweetAlertService.showNotification( 'success', this.resSerIncludeFiles['message'] );
        }
        // Cargando false
        this.sweetAlertService.sweetClose();
        this.changeChildrenService.changeProcess({ proccess: 'reload' });
      });

      }, (err) => {
        this.resSerIncludeFilesErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerIncludeFilesErr).then((res) => { });
      }
    );
  }

  /**
   * Funcion que imprime los radicados seleccionados
   */
  transactionPrintStickers() {

    this.sweetAlertService.sweetLoading();
    let params = {
      ButtonSelectedData: this.eventClickButtonSelectedData //
    };

    this.restService.restPost(this.versionApi + 'radicacion/transacciones/print-sticker', params, this.authorization).subscribe((res) => {

      this.resSerPrintStickers = res;
      // console.log(this.resSerPrintStickers);

      this.globalAppService.resolveResponse(this.resSerPrintStickers, false).then((res) => {
        const responseResolveResponse = res;
        if (responseResolveResponse == true) {
          this.sweetAlertService.showNotification( 'success', this.resSerPrintStickers['message'] );
          if (this.resSerPrintStickers.datafile) {
            this.resSerPrintStickers.datafile.forEach( dtFile => {
              this.downloadFile(dtFile.dataFile, dtFile.fileName );
            });
          }
        }
        // Cargando false
        this.sweetAlertService.sweetClose();
        // this.changeChildrenService.changeProcess({ proccess: 'reload' });
      });

      }, (err) => {
        this.resSerPrintStickersErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerPrintStickersErr).then((res) => { });
      }
    );
  }

  /** Descarga de paquete de documentos del radicado */
  downloadDocumentPackage() {

    const titleMsg = this.translate.instant('titleMsg');
    const textMsg = this.translate.instant('textMsgDownloadDocumentPackage');
    const bntCancelar = this.translate.instant('bntCancelar');
    const btnConfirmacion = this.translate.instant('btnConfirmacionDownloadDocumentPackage');

    swal({
      title: titleMsg,
      text: textMsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: bntCancelar,
      confirmButtonText: btnConfirmacion,
      cancelButtonClass: 'btn btn-danger',
      confirmButtonClass: 'btn btn-success',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {

        /** Se asigna el valor del id del radicado seleccionado */
        // let data = {
        //   id: this.paramOID
        // };
        let data = {
          id: this.dataIdRadicados[0]
        };
        // Cargando true
        this.sweetAlertService.sweetLoading();

        this.restService.restPost( this.versionApi + 'radicacion/radicados/download-document-package', data, this.authorization)
          .subscribe((res) => {
            this.resServicesDownloadDocumentPackage = res;            
            // Evaluar respuesta del servicio
            this.globalAppService.resolveResponse(this.resServicesDownloadDocumentPackage, false ).then((res) => {
              let responseResolveResponse = res;
              if (responseResolveResponse == true) {
                this.downloadFile(this.resServicesDownloadDocumentPackage.datafile, this.resServicesDownloadDocumentPackage.fileName);
              }
              // Cargando false
              this.sweetAlertService.sweetClose();
              
            });
          }, (err) => {
            this.resServicesDownloadDocumentPackageErr = err;
            // Evaluar respuesta de error del servicio
            this.globalAppService.resolveResponseError(this.resServicesDownloadDocumentPackageErr, false ).then((res) => { });
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
    const downloadLink = document.createElement('a');

    downloadLink.href = linkSource;
    downloadLink.download = nameDownload;
    downloadLink.click();
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

  sendEmailClient() {

    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // console.log( this.resSerLenguage );
      this.titleMsg = this.resSerLenguage.titleMsg;
      this.textMsg = this.resSerLenguage['textMsgSendMail'] + this.hashLocalStorage.data.radiSendReplyEMail;
      this.bntCancelar = this.resSerLenguage['bntCancelarSendMail'];
      this.btnConfirmacion = this.resSerLenguage['btnConfirmacionSendMail'];

      swal({
        title: this.titleMsg,
        text: this.textMsg,
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: this.bntCancelar,
        confirmButtonText: this.btnConfirmacion,
        cancelButtonClass: 'btn btn-danger',
        confirmButtonClass: 'btn btn-success',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {

          /** Se asigna el valor del id del radicado que se está actualizando */
          let data = {
            id: this.dataIdRadicados
          };
          // Cargando true
          this.sweetAlertService.sweetLoading();

          this.restService.restPut( this.versionApi + 'radicacion/transacciones/send-reply-mail', data, this.authorization)
            .subscribe((res) => {
              this.resServicesSendEmailCli = res;

              // Evaluar respuesta del servicio
              this.globalAppService.resolveResponse(this.resServicesSendEmailCli, true, this.redirectionPath ).then((res) => {
                let responseResolveResponse = res;
                if (responseResolveResponse == true) {
                  this.sweetAlertService.showNotification( 'success', this.resServicesSendEmailCli.message );
                  // this.sweetAlertService.showSwal( 'success-message', 'Respuesta enviada', this.resServicesSendEmailCli.message);
                  // Cargando false
                  this.sweetAlertService.sweetClose();
                  this.changeChildrenService.changeProcess({ proccess: "reload" });
                }
              });
            }, (err) => {
              this.resServicesSendEmailCliErr = err;
              // Evaluar respuesta de error del servicio
              this.globalAppService.resolveResponseError(this.resServicesSendEmailCliErr, true, this.redirectionPath ).then((res) => { });
            }
          );
        }
      });
    });

  }

 closeModalSendDocs(data) {
     this.statusModalUploadFile = false;
 }

  closeSendReplyMailModal(dataModal) {
    this.statusSendReplyMailModal = false;
    if ( dataModal.status ) {
      this.changeChildrenService.changeProcess({ proccess: "reload" });
    }
  }

 /**
  * Mensaje de confirmación para continuar con la trasacciones
  */
  continueTransaccion() {

    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // console.log( this.resSerLenguage );
      this.titleMsg = '';
      this.textMsg = this.resSerLenguage['textMsContinuarPro'];
      let textReasignar = this.resSerLenguage['Reasignar'];
      let textDevolver = this.resSerLenguage['Devolver'];

      swal({
        title: this.titleMsg,
        text: this.textMsg,
        type: 'success',
        showCancelButton: true,
        cancelButtonText: textReasignar,
        confirmButtonText: textDevolver,
        cancelButtonClass: 'btn btn-success',
        confirmButtonClass: 'btn btn-success',
        buttonsStyling: false
      }).then( (result) => {

        if (String(result.dismiss) === 'overlay') {
          this.changeChildrenService.changeProcess({ proccess: "reload" });
        }

        if (result.value) {
          // Transacion Devolver
          // Le asigna la operacion a ejecutar
          this.operationDialogObserva = 'returnFiling';
          this.textFormObservaHeader = 'Devolver radicado';
          this.statusModalMain = true;

        }
        // Si el valor es igual a cancelar entonces es reasignar
        if (String(result.dismiss) === 'cancel') {

          // Transaccion send - reasignar
          this.showReasignacion = true; // Transaccion reasignacion
          // Le asigna la operacion a ejecutar
          this.operationDialogObserva = 'send';
          // Titulo del modal segun el title del boton
          this.textFormObservaHeader = 'Reasignar';
          this.routeChangeStatus = this.routeReasing;
          // muestra el componente
          this.statusModalMain = true;

        }
      });

    });

  }

  /**
  * Mensaje de confirmación para cargar plantillas
  */
 continueUploadTemplate(event) {

  // Cambia el los mensajes de texto del componete para confirmar la eliminacion
  this.globalAppService.text18nGet().then((res) => {
    this.resSerLenguage = res;
    // console.log( this.resSerLenguage );
    this.titleMsg = '';
    this.textMsg = this.resSerLenguage['textMsContinuarCarcarTemplate'];
    let textAceptar = this.resSerLenguage['btnConfirmar'];
    let textCancelar = this.resSerLenguage['Cancelar'];

    swal({
      title: this.titleMsg,
      text: this.textMsg,
      type: 'success',
      showCancelButton: true,
      cancelButtonText: textCancelar,
      confirmButtonText: textAceptar,
      cancelButtonClass: 'btn btn-danger',
      confirmButtonClass: 'btn btn-success',
      buttonsStyling: false
    }).then( (result) => {

      if (result.value) {
        this.statusUploadFileAne = true; // Muestra el modal de adjutar documentos
        this.showTipoDocumental = false; // No muestra el tipo documental
        this.showObservacion = false; // No muestra la observación
        this.statusNameFile = true; // Muestra el campo nombre archivo
        this.validateFile = [{ type: 'doc' }, { type: 'docx' }, { type: 'odt' } ];
        // Titulo del modal segun el title del boton
        this.textFormObservaHeader = event.title;
        this.ruoteServiceDocumentsModal = this.ruoteServiceDocumentsTemplate; // Ruta de la plantilla
        // Le asigna la operacion a ejecutar
        this.operationDialogObserva = event.action;
        this.dataSend = this.eventClickButtonSelectedData;

      }
    });

  });

}

  /**
   * Solo debe llegar el Id del initial list idInitialList
   * @param data idInitialList
   */
  deleteIdsEventButton(data) {
    this.eventClickButtonSelectedData.forEach( (infoIni, index)  => {
      if ( infoIni.idInitialList == data ) {
        this.eventClickButtonSelectedData.splice(index, 1);
      }
    });
  }

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }

}
