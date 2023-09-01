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

import { Component, AfterViewInit, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { ConvertParamsBase64Helper } from '../../../helpers/convert-params-base64.helper';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { environment } from 'src/environments/environment';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { ChangeChildrenService } from '../../../services/change-children.service';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.css']
})
export class ViewListComponent implements AfterViewInit, OnInit, OnDestroy {

  @Output() public actionsDocsButtonEmiter = new EventEmitter<any>(); // Data a retornar al initial list
  @Output() public dataUserTramitadorEmiter = new EventEmitter<any>(); // Data a retornar al formulario del usuario tramitador
  @Output() public dataExpedientEmiter = new EventEmitter<any>(); // Data a retornar al formulario de expediente
  
  @Input() reuteLoadView: string;
  @Input() reuteLoadViewHistorico: string;
  @Input() panelHeadingStatus: boolean = true;
  @Input() routeBotonUpdateView: string;
  subscriptionChangeDetectedService: any;
  /** Las variables para mostrar la alerta informativa  */
  @Input() initialNotificationClassAlert: string = 'alert alert-info alert-with-icon';
  @Input() initialNotificationMessageArray: any = [];

  // Autentificacion
  authorization: string;
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre del boton
  @Input() textButtonView = 'Enviar';
  // Nombre del formulario
  @Input() textFormView = 'Formulario principal de operaciones';
  // Boton para update
  @Input() initBotonUpdateRoute = '';
  // Icono que se muestra
  @Input() initCardHeaderIcon = 'person';
  @Input() initCardHeaderCollapsIcon = 'featured_play_list';
  // Variable que indica si se desesa mostrar o no el colaps
  @Input() dtCollapStatus: boolean = false;
  // Evaluar respuesta del servicio
  @Input() isredirectionPath: boolean = true; // Define si se utiliza la redireccion en caso de no tener permisos de acceso
  @Input() redirectionPath: string = '/dashboard'; // ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  @Input() showFuntionButtonRadi: boolean = true; // habilita la función de mostrar los botones de los documentos del radicado

  versionApi = environment.versionApiDefault;

  responseServiceView: any;
  responseServiceViewHistorico: any;
  responseServiceViewErr: any;
  responseServiceViewErrHistorico: any;
  paramId: any;
  dataRows: any;
  dataRows1: any;
  dataDividita: any;
  valorDividido: any;
  data1: any = [];
  data2: any = [];
  style:string = "style";
  styleCor:string = "style";
  stylePri = 'style';

  nombreExpediente: string = '';
  routeBaseExpediente: string = '/documentManagement/folder-view';
  routeExpediente: string = '';
  statusRouteExpediente: boolean = false;

  // Para el proceso del historico del radicado se muestra la data correspondiente
  dataRowsHistorico: any;
  data2Historico: any = [];
  // Variable para ver mas en historico
  statusSeeMoreHistory: boolean = false; // Muestra div ver mas
  statusSeeHistory: boolean = true;
  numberLimitHistory: number; // Limite de 5
  minLimit: number = 5; // Limite de 5

  // Variable para ver mas en historico
  statusSeeMoreDoc: boolean = false; // Muestra div ver mas en documentos
  statusSeeMoreDocPri: boolean = false; // Muestra div ver mas en documentos principales
  statusSeeDoc: boolean = true;
  statusSeeDocPri: boolean = true;
  numberLimitDoc: number;
  numberLimitDocPrincipal: number;
  minLimitDoc: number = 4; // Limite de 4
  valselect: number;
  valselectCor: number;
  valselectPri: number;

  // Variable recibe los documetos del Radicado
  dataRowDocumentos: any = [];
  dataDocumentos: any = [];
  dataRowDocuPrincipal: any = []; // Registros de documentos princial
  dataDocuPrincipal: any = []; // Documentos principales
  dataRowCorrespondencia: any = [];
  statusDocuPrincipal: boolean = false; // muestra o no los documentos principales del radicado

  // Variables para activacion y uso de la la vista del acordeon como checklist
  @Input() checkListAcordeon: boolean = false; // Activa la vista del card para el acordion
  @Input() checkListAcordeonCardHeaderIcon: string = '';
  @Input() checkListAcordeonTexForm: string = '';
  conjuntos: any;
  elementos: any;

  onlyDownloadStatus: boolean = false;

  // Variables para saber si el usuario logueado es el dueño del radicado o informado
  isUserTramitador: boolean = false;
  isUserInformado: boolean = false;
  isRadiFinalizado: boolean = false; // determina si el radicado se encuentra finalizado (finalizado, solo debe permitir descargar)

  //Ver Correspondencia
  @Input() showCorrespondencia: boolean = false; // Mostrar card correspondencia

  /** Botones */
  menuButtons: any = [
    { icon: 'get_app',        title: 'Descargar',      action: 'Descargar',     data: '' },
    { icon: 'queue_play_next', title: 'Publicar documento', action: 'publishDocument', data: '' },
  ];
  menuButtonsOnlyDownload: any = [
    { icon: 'get_app',        title: 'Descargar',      action: 'Descargar',     data: '' },
  ];
  menuButtonsWithPdf: any = [
    { icon: 'visibility',     title: 'Ver',            action: 'Ver',           data: '' },
    { icon: 'get_app',        title: 'Descargar',      action: 'Descargar',     data: '' },
    { icon: 'queue_play_next', title: 'Publicar documento', action: 'publishDocument', data: '' },
  ];
  menuButtonsWithPdfOnlyDownload: any = [
    { icon: 'visibility',     title: 'Ver',            action: 'Ver',           data: '' },
    { icon: 'get_app',        title: 'Descargar',      action: 'Descargar',     data: '' },
  ];
  menuButtonsCor: any = [
    { icon: 'get_app',        title: 'Descargar',      action: 'DescargarCor',     data: '' },
    { icon: 'visibility',     title: 'Ver',            action: 'Ver',           data: '' },
    // { icon: 'delete_outline', title: 'Eliminar',       action: 'Eliminar',      data: '' },
  ];
  menuButtonsPri: any = [
    { icon: 'publish', title: 'Asociar plantilla', action: 'loadFormat', data: '' },
    { icon: 'bookmarks', title: 'Versionamiento', action: 'versionFormat', data: '' },
  ];
  menuButtonsPriInformadoOFinalizadoODescartado: any = [
    { icon: 'bookmarks', title: 'Versionamiento', action: 'versionFormat', data: '' },
  ];
  menuButtonsPriNoTramitador: any = [
    { icon: 'bookmarks', title: 'Versionamiento', action: 'versionFormat', data: '' },
  ];

  menuButtonsSelect = [];

  loading = false; // Mostrar logo o spiner cargando

  gifOrfeoNg: string = environment.frontUrl + 'assets/img/logos/orfeo_ng_gif.gif';

  constructor(public restService: RestService, private route: ActivatedRoute, private router: Router, public sweetAlertService: SweetAlertService, public lhs: LocalStorageService, public globalAppService: GlobalAppService, private changeChildrenService: ChangeChildrenService) {
    this.paramId = this.route.snapshot.paramMap.get('id');
    this.paramOID = ConvertParamsBase64Helper(this.paramId); // Se pasa al html como componete para que reciba el ID
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();

    // Subscripción que permite detectar que el parametro es diferente para que este se recargue el componente
    this.route.params.subscribe(params => {
      if ( this.paramId != params.id ) {
        // Asigna los valores de params
        this.paramId = params.id;
        this.paramOID = ConvertParamsBase64Helper(this.paramId); // Se pasa al html como componete para que reciba el ID
        // Recarga el componente
        this.changeChildrenService.changeProcess({ proccess: 'reload' });
      }
    });
  }

  ngAfterViewInit() {
    this.changeDetectedService();
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

    this.data1 = [];
    this.data2 = [];

    let data1 = [];
    let data2 = [];

    let params = {
      id: this.paramOID
    };

    this.loading = true;

    this.restService.restGetParams( this.versionApi + this.reuteLoadView, params, authori).subscribe(
      (res) => {
        this.responseServiceView = res;
        this.loading = false;
        // console.log(this.responseServiceView);
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceView, this.isredirectionPath, this.redirectionPath).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            if (this.responseServiceView.data) {
              this.dataRows = this.responseServiceView.data;
              this.dataDividita = this.dataRows.length;
              this.valorDividido = this.dataDividita / 2;
              for (let i = 0; i <= this.dataRows.length; i++) {
                if (i < this.valorDividido) {
                  data1.push(this.dataRows[i]);
                } else {
                  if (this.dataRows[i]) {
                    data2.push(this.dataRows[i]);
                  } else {
                    data2.push({ 'alias': '', 'value': '', 'color': '' });
                  }
                }
              }
            }

            if (typeof this.responseServiceView.textFormView != 'undefined' && this.responseServiceView.textFormView != '') {
              this.textFormView = this.responseServiceView.textFormView;
            }

            this.data1 = data1;
            this.data2 = data2;

            if ( this.responseServiceView.messageNotification ) {
              this.initialNotificationMessageArray = this.responseServiceView.messageNotification;
            }

            if (this.dtCollapStatus == true) {
              if (this.responseServiceView.dataHistorico) {

                this.dataRowsHistorico = this.responseServiceView.dataHistorico;
                if ( this.dataRowsHistorico.length > this.minLimit ) {
                  this.statusSeeMoreHistory = true;
                  this.numberLimitHistory = this.minLimit;
                }

              }
              // Asigna el nombre del expediente
              if (typeof this.responseServiceView.nombreExpediente != 'undefined' && this.responseServiceView.nombreExpediente != '') {
                  this.nombreExpediente = this.responseServiceView.nombreExpediente;
                  this.routeExpediente = this.routeBaseExpediente + '/' + this.responseServiceView.idExpediente;
                  this.statusRouteExpediente = true;
                  // envia data del expediente para el view  de radicado
                  this.dataExpedientEmiter.emit({ idExpediente: this.responseServiceView.idExpediente[0], numeroRadiRadicado: this.responseServiceView.numeroRadiRadicado });
              } else {
                this.statusRouteExpediente = false;
              }
              // Verifica si hay información de documentos
              if (this.responseServiceView.dataDocumentos) {
                this.dataRowDocumentos = this.responseServiceView.dataDocumentos;
                for (let i = 0; i <= this.dataRowDocumentos.length; i++) {
                    if (this.dataRowDocumentos[i]) {
                      this.dataDocumentos.push(this.dataRowDocumentos[i]);
                    }
                }
                if ( this.dataRowDocumentos.length > this.minLimitDoc ) {
                  this.statusSeeMoreDoc = true;
                  this.numberLimitDoc = this.minLimitDoc;
                }
              }
              // Verifica si hay información de imagen principal
              if (this.responseServiceView.dataDocPrincipal) {
                this.statusDocuPrincipal = true; // muestra los documentos principales
                this.dataRowDocuPrincipal = this.responseServiceView.dataDocPrincipal;
                for (let i = 0; i <= this.dataRowDocuPrincipal.length; i++) {
                    if (this.dataRowDocuPrincipal[i]) {
                      this.dataDocuPrincipal.push(this.dataRowDocuPrincipal[i]);
                    }
                }
                if ( this.dataRowDocuPrincipal.length > this.minLimitDoc ) {
                  this.statusSeeMoreDocPri = true;
                  this.numberLimitDocPrincipal = this.minLimitDoc;
                }
              }
              // Verifica data del usuario tramitador para radicados
              if (this.responseServiceView.dataUserTramitador) {
                this.dataUserTramitadorEmiter.emit(this.responseServiceView.dataUserTramitador);
              }

              if(this.showCorrespondencia == true){
                if (this.responseServiceView.dataCorrespondencia) {
                  this.dataRowCorrespondencia = this.responseServiceView.dataCorrespondencia;
                }
              }

              if (typeof this.responseServiceView.onlyDownloadStatus != 'undefined') {
                this.onlyDownloadStatus = this.responseServiceView.onlyDownloadStatus;
              }              
              if (typeof this.responseServiceView.isUserTramitador != 'undefined') {
                this.isUserTramitador = this.responseServiceView.isUserTramitador;
              }
              if (typeof this.responseServiceView.isUserInformado != 'undefined') {
                this.isUserInformado = this.responseServiceView.isUserInformado;
              }
              if (typeof this.responseServiceView.isRadiFinalizado != 'undefined') {
                this.isRadiFinalizado = this.responseServiceView.isRadiFinalizado;
              }
            }

            if (this.checkListAcordeon == true) {
              this.conjuntos = this.responseServiceView.conjuntos;
              this.elementos = this.responseServiceView.elementos;
            }
          }
        });
      }, (err) => {
        this.responseServiceViewErr = err;
        this.loading = false;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceViewErr, this.isredirectionPath, this.redirectionPath).then((res) => { });
      }
    );


  }

  redirect() {
    this.router.navigate(['filing/filing-index/false']);
  }

  /**
   * Fuincion que cambia el estado de ver mas en hotorico
   * @param status
   */
  seeMoreHistory(status) {
    if (status) {
      this.numberLimitHistory = this.dataRowsHistorico.length;
    } else {
      this.numberLimitHistory = this.minLimit;
    }
    this.statusSeeHistory = !this.statusSeeHistory;
  }

  /**
   * Fuincion que cambia el estado de ver mas en Documentos
   * @param status
   */
  seeMoreDocuments(status) {
    if (status) {
      this.numberLimitDoc = this.dataRowDocumentos.length;
    } else {
      this.numberLimitDoc = this.minLimitDoc;
    }
    this.statusSeeDoc = !this.statusSeeDoc;
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
        case 'Documents':
          this.numberLimitDoc = this.dataRowDocumentos.length;
          break;
        case 'DocumentsMain':
          this.numberLimitDocPrincipal = this.dataRowDocuPrincipal.length;
          break;
        case 'History':
          this.numberLimitHistory = this.dataRowsHistorico.length;
          break;
      }
    } else {
      // Valida modulo
      switch (module) {
        case 'Documents':
          this.numberLimitDoc = this.minLimitDoc;
          break;
        case 'DocumentsMain':
          this.numberLimitDocPrincipal = this.minLimitDoc;
          break;
        case 'History':
          this.numberLimitHistory = this.minLimit;
          break;
      }
    }
    // Asigna el valor contrario
    switch (module) {
      case 'Documents':
        this.statusSeeDoc = !this.statusSeeDoc;
        break;
      case 'DocumentsMain':
        this.statusSeeDocPri = !this.statusSeeDocPri;
        break;
      case 'History':
        this.statusSeeHistory = !this.statusSeeHistory;
        break;
    }

  }

  docFocus(data, id, isPdf, dataDoc) {

    // Valida si la función esta activa para que este se muestre los botones de funciones para los documentos de los radicados
    if (this.showFuntionButtonRadi) {
      this.valselectPri = null;
      this.valselectCor = null;

      if (isPdf === true) {
        if (this.onlyDownloadStatus) {
          this.menuButtonsSelect = this.menuButtonsWithPdfOnlyDownload;
        } else {
          this.menuButtonsSelect = this.menuButtonsWithPdf;
        }
      } else {
        if (this.onlyDownloadStatus) {
          this.menuButtonsSelect = this.menuButtonsOnlyDownload;
        } else {
          this.menuButtonsSelect = this.menuButtons;
        }
      }

      if (this.valselect == data) {
          if ( this.style == '') {
            this.style = '#007fff42';
            this.styleCor = '';
            this.selectedDocument('cardAnex', id, true, dataDoc);
          } else {
            this.style = '';
            this.selectedDocument('cardAnex', id, false, dataDoc);
          }
      } else {
        this.valselect = data;
        this.style = '#007fff42';
        this.styleCor = '';
        this.selectedDocument('cardAnex', id, true, dataDoc);
      }
    }
  }

  docFocusCor(data, id, dataDoc ) {

    this.valselectPri = null;
    this.valselect = null;

    this.menuButtonsSelect = this.menuButtonsCor;

    if (this.valselectCor == data) {
        if( this.styleCor == ''){
          
          this.styleCor = '#007fff42';
          this.selectedDocument('cardCorrespondence', id,true);
          this.style = '';


        }else{
          this.styleCor = '';
          this.selectedDocument('cardCorrespondence', id,false);
        }
    } else {
      this.valselectCor = data;
      this.styleCor = '#007fff42';
      this.selectedDocument('cardCorrespondence', id,true);
      this.style = '';
    }
  }

  /**
   * Funcion que cambia el estilo del documento seleccionado y asigna las funciones a ejecutar en los botones
   * @param data
   * @param id
   * @param name
   */
  docPriFocus(data, id, name) {

    this.valselectCor = null;
    this.valselect = null;

    /** Validar botones si el usuario no es dueño del radicado */
    if (this.isRadiFinalizado == true) {
      this.menuButtonsPri = this.menuButtonsPriInformadoOFinalizadoODescartado;
    } else {
      if(this.isUserTramitador == false) {
        if(this.isUserInformado == true) {
          this.menuButtonsPri = this.menuButtonsPriInformadoOFinalizadoODescartado;
        } else {
          this.menuButtonsPri = this.menuButtonsPriNoTramitador;
        }
      }
    }

    if (this.onlyDownloadStatus) {
      this.menuButtonsPri = this.menuButtonsPriInformadoOFinalizadoODescartado;
    }

    this.asignaValorBoton(name).then((res) => {

      this.menuButtonsSelect = this.menuButtonsPri;
      if (this.valselectPri == data) {
        if ( this.stylePri == '') {
          this.stylePri = '#007fff42';
          this.selectedDocument('cardMainDocs', id, true);
        } else {
          this.stylePri = '';
          this.selectedDocument('cardMainDocs', id, false);
        }
      } else {
        this.valselectPri = data;
        this.stylePri = '#007fff42';
        this.selectedDocument('cardMainDocs', id, true);
      }

    });

  }

  /**
   * función que signa el valor name al data de los botones
   * @param name
   */
  asignaValorBoton(name) {

    return new Promise(resolve => {
      // Asigna el nombre del arcivo para que lo reciba en otro formulario
      this.menuButtonsPri.forEach(element => {
        element.data = name;
      });
      resolve(true);
    });
  }

  selectedDocument(card, id, focus, dataDoc: any = {}) {
    let params = {
      'card': card,
      'id': id,
      'menuButtonsSelect': this.menuButtonsSelect,
      'focus': focus,
      'dataDoc': dataDoc
    };

    this.actionsDocsButtonEmiter.emit(params);
  
  }

  changeDetectedService() {
    this.subscriptionChangeDetectedService = this.changeChildrenService.reloadComponent.subscribe(emit => {
      this.getTokenLS();
      this.clearSelectionAndButon();
    });
  }

  /** Funcion que limpia la seleccion de items de las tarjetas y lo emite al padre */
  clearSelectionAndButon() {
    this.valselectPri = null;
    this.valselectCor = null;
    this.valselect = null;

    let params = {
      'id': null,
      'menuButtonsSelect': [],
      'focus': false
    };

    this.actionsDocsButtonEmiter.emit(params);
  }

  ngOnDestroy() {
    if (!!this.subscriptionChangeDetectedService) this.subscriptionChangeDetectedService.unsubscribe();
  }
}
