import { Component, OnInit, Output, Inject, EventEmitter, Input, AfterViewChecked, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from 'src/app/services/activate-translate.service';
import { ChangeChildrenService } from 'src/app/services/change-children.service';
import { ThemePalette} from '@angular/material/core';
import { EncryptService } from 'src/app/services/encrypt.service';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';

export interface DialogData {
  dataDialog: any;
  initCardHeaderStatus: any;
  initCardHeaderIcon: any;
  initCardHeaderTitle: any;
  dataSend: any;
  redirectionPath: any;
  routeLoadDataTablesService: any;
  ruoteServiceDownloadDocuments: any;
  viewColumStatus: any;
  dtTitles: any;
  dataUserTramitador: any;
  modalNotificationStatus: boolean;
  modalNotificationClassAlert: string;
  modalNotificationMessage: string;
  onlyDownloadStatus: boolean;
}

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-simple-table-modal',
  template: '',
  styleUrls: ['./simple-table-modal.component.css']
})
export class SimpleTableModalComponent implements OnInit {

  @Output() public closeModalEmiter = new EventEmitter<any>(); // Data a retornar al formulario
  /** Initial List */
  @Input() initCardHeaderStatusMod = true;
  @Input() initCardHeaderIconMod = 'build';
  @Input() initCardHeaderTitleMod = 'Listado de documentos principales';
  @Input() showButtonFiltrerMod: boolean = false;
  @Input() viewColumStatus: boolean = true;
  @Input() onlyDownloadStatus: boolean = false; // Mostrar solo botones de descarga
  // Nombre del módulo donde se esta accediendo al initialList
  @Input() dataSend: any = {}; // data
  @Input() dataUserTramitador: any; // data usuario tramitador
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  @Input() redirectionPath: string = 'dashboard';
  // Configuraciones para datatables
  @Input() routeLoadDataTablesServiceMod: string ;
  @Input() ruoteServiceDownloadDocuments: string;

  /** Variables para mostrar la alerta informativa  */
  @Input() modalNotificationStatus: boolean = false;
  @Input() modalNotificationClassAlert: string = 'alert alert-info alert-with-icon';
  @Input() modalNotificationMessage: string;

  @Input() dtTitles: any = [
    { 'title': 'Usuario carga', 'data': 'user' },
    { 'title': 'Nombre documento', 'data': 'nombreRadiDocumentoPrincipal' },
    { 'title': 'Extensión', 'data': 'extensionRadiDocumentoPrincipal' },
    { 'title': 'Fecha carga', 'data': 'creacionRadiDocumentoPrincipal' },
    { 'title': 'Imagen principal', 'data': 'imagenPrincipalRadiDocumento' },
    { 'title': 'Disponibilidad página pública', 'data': 'statusTextPublic' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  // Variable para dar tamaño al dialog
  @Input() widthDialog = '75%';

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog( ) {

    const dialogRef = this.dialog.open( SimpleTableDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        dataDialog: {},
        initCardHeaderStatus: this.initCardHeaderStatusMod,
        initCardHeaderIcon: this.initCardHeaderIconMod,
        initCardHeaderTitle: this.initCardHeaderTitleMod,
        dataSend: this.dataSend,
        redirectionPath: this.redirectionPath,
        routeLoadDataTablesService: this.routeLoadDataTablesServiceMod,
        ruoteServiceDownloadDocuments: this.ruoteServiceDownloadDocuments,
        viewColumStatus: this.viewColumStatus,
        dtTitles: this.dtTitles,
        dataUserTramitador: this.dataUserTramitador,
        modalNotificationStatus: this.modalNotificationStatus,
        modalNotificationClassAlert: this.modalNotificationClassAlert,
        modalNotificationMessage: this.modalNotificationMessage,
        onlyDownloadStatus: this.onlyDownloadStatus,
      }
    });
    dialogRef.afterClosed().subscribe( res => {
      let respuesta = res;
      if ( !respuesta ) {
        respuesta = {event: 'close', status: false , data: [] };
      }
      this.closeComponent(respuesta);
    });
  }

  /*** Método para cerrar o destruir el componente desde el padre ***/
  closeComponent( respuesta ) {
    this.closeModalEmiter.emit(respuesta);
  }

}

@Component({
  selector: 'app-simple-table-dialog',
  templateUrl: './simple-table-modal.component.html',
  styleUrls: ['./simple-table-modal.component.css']
})

export class SimpleTableDialog implements OnInit, AfterViewChecked, OnDestroy {

  /**Variable del formulario */
  validTextType: boolean = false;
  // Version api
  versionApi = environment.versionApiDefault;
  // Autentificacion
  authorization: string;
  dataUserTramitador: any; // data del usuario tramitador
  selectedRows: any = [];
  dtData: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'build';
  initCardHeaderTitle: string;
  dataSend: any; // data que llega por input
  // Nombre del módulo donde se esta accediendo al initialList
  route: string;
  // Ruta a redirigir
  redirectionPath: string;
  // Data del usuario
  hashLocalStorage: any;
  /** Formulario index */
  viewColumStatus: boolean; // Muestra la columna estado
  // Configuraciones para datatables
  routeLoadDataTablesService: string;
  ruoteServiceDownloadDocuments: string;

  dtTitles: any = [];

  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [
    { icon: 'grading', title: 'Combinar correspondencia', action: 'correspondenceTemplate', data: '' },
    { icon: 'get_app', title: 'Descargar plantilla', action: 'download', data: '' },
  ];
  menuButtonsSelectCombi: any = [
    { icon: 'qr_code', title: 'Firmar documento', action: 'signDocument', data: '' },
    { icon: 'get_app', title: 'Descargar plantilla', action: 'download', data: '' },
  ];
  //sguarin FirmaDigital para habilitar las opciones del boton para un documento en estado combinado
  //pero sin firmas
  menuButtonsSelectCombiSinFirmas: any = [
    { icon: 'fact_check', title: 'Firma Certificada', action: 'signDocumentOption', data: '' },
    { icon: 'get_app',    title: 'Descargar plantilla', action: 'download', data: '' },
  ];
  menuButtonsSelectFirmado: any = [
    { icon: 'get_app',         title: 'Descargar plantilla', action: 'download',        data: '' },
    { icon: 'queue_play_next', title: 'Publicar documento',  action: 'publishDocument', data: '' },
    { icon: 'fact_check',      title: 'Firma Certificada', action: 'signDocumentOption', data: '' },
  ];
  menuButtonsSelectFirmadoOne: any = [
    { icon: 'get_app',         title: 'Descargar plantilla', action: 'download',        data: '' },
    { icon: 'queue_play_next', title: 'Publicar documento',  action: 'publishDocument', data: '' },
    { icon: 'visibility',      title: 'Ver',                 action: 'Ver',             data: '' },
    { icon: 'fact_check',      title: 'Firma Certificada', action: 'signDocumentOption', data: '' },
  ];
  //Botones habilitados para en proceso de firma digital
  menuButtonsSelectProsesoFirmaDigitalOne: any = [
    { icon: 'get_app',         title: 'Descargar plantilla', action: 'download',        data: '' },
    { icon: 'visibility',      title: 'Ver',                 action: 'Ver',             data: '' },
    //FirmaDigital boton para que se habilite la firma digital en el boton general para UN documento
    //que este en estado firmado icono, nombre y action 
    { icon: 'fact_check',      title: 'Firma Certificada', action: 'signDocumentOption', data: '' },
  ];
  //Botones habilitados para un documento en estado firmado digitalmente
  menuButtonsSelectFirmadoDigitalmenteOne: any = [
    { icon: 'get_app',         title: 'Descargar plantilla', action: 'download',        data: '' },
    { icon: 'visibility',      title: 'Ver',                 action: 'Ver',             data: '' },
    { icon: 'fact_check',      title: 'Firma Certificada', action: 'signDocumentOption', data: '' },
  ];
  menuButtonsOnlyDownload: any = [
    { icon: 'get_app',         title: 'Descargar plantilla', action: 'download',        data: '' },
  ];
  menuButtonsOnlyDownloadAndPdf: any = [
    { icon: 'get_app',         title: 'Descargar plantilla', action: 'download',        data: '' },
    { icon: 'visibility',      title: 'Ver',                 action: 'Ver',             data: '' },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  // Servicios
  resServicesIni: any;
  resServicesIniErr: any;
  resSerDownload: any;
  resSerDownloadErr: any;
  resSerCorTemplate: any;
  resSerCorTemplateErr: any;
  resSerSignDoc: any;
  resSerSignDocErr: any;
  resSerPublicDoc: any;
  resSerPublicDocErr: any;
  // Variables para notificacion
  modalNotificationStatus: boolean = false;
  modalNotificationClassAlert: string = 'alert alert-info alert-with-icon';
  modalNotificationMessage: string;

  onlyDownloadStatus: boolean = false; // Mostrar solo botones de descarga

  /** Variables para internacionalizacion */
  activeLang: string;
  languageReceive: any;
  resSerLenguage: any;

  // Variables para saber si el usuario logueado es el dueño del radicado o informado
  isUserTramitador: boolean = false;
  isUserInformado: boolean = false;
  isRadiFinalizado: boolean = false; // determina si el radicado se encuentra finalizado (finalizado, solo debe permitir descargar)

  radiHasImgPrincipal: boolean = false; // Variable para validar si el radicado ya tiene una imagen principal

  /** slide-toggle  */
  tittleNewFiling = 'Nuevo número de radicado';
  color: ThemePalette = 'primary';
  messageIsNewFiling:string = 'No';
  /**Variable del formulario */
  moduleForm: UntypedFormGroup;
  // Variable que muestra el botón
  estadoDocuGenerado:boolean = false; // Oculta o muestra el botón de nuevo radicado
  tipoRadicadoId: any; // Es el ID de la tabla de tipos de radicado

  /** Variables del modal pdf */
  statusModalviewPdf: boolean = false;
  statusModalviewSignaturePdf: boolean = false;
  idDocument: any = {};
  ruoteServiceDocumentPdf: string = 'radicacion/documentos/download-doc-principal';

  isRadiSigned: boolean = false; // Indica si el radicado posee algún documento versionado en estado firmado
  isRadiSignedOrInProcess: boolean = false; // Indica si el radicado posee algún documento versionado en estado firmado o en proceso de firma

  subscriptionTranslateService$: Subscription;

  // 
  buttonSigned: any = {};
  buttonSignedOptions: any = {};

  textFormViewPdf = 'Vista del documento';

  constructor(  public matDialog: MatDialog, public dialogRef: MatDialogRef<SimpleTableDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
      public sweetAlertService: SweetAlertService, public restService: RestService, public globalAppService: GlobalAppService,
      private translate: TranslateService, private activateTranslateService: ActivateTranslateService,
      public lhs: LocalStorageService, private authService: AuthService, private changeChildrenService: ChangeChildrenService, private formBuilder: UntypedFormBuilder ) {

        // Asigna los valores que llegan por input
        this.initCardHeaderStatus = this.data.initCardHeaderStatus;
        this.initCardHeaderIcon = this.data.initCardHeaderIcon;
        this.initCardHeaderTitle = this.data.initCardHeaderTitle;
        this.dataSend = this.data.dataSend;
        this.redirectionPath = this.data.redirectionPath;
        this.routeLoadDataTablesService = this.data.routeLoadDataTablesService;
        this.ruoteServiceDownloadDocuments = this.data.ruoteServiceDownloadDocuments;
        this.viewColumStatus = this.data.viewColumStatus;
        this.dtTitles = this.data.dtTitles;
        this.dataUserTramitador = this.data.dataUserTramitador;

        this.modalNotificationStatus = this.data.modalNotificationStatus;
        this.modalNotificationClassAlert = this.data.modalNotificationClassAlert;
        this.modalNotificationMessage = this.data.modalNotificationMessage;
        this.onlyDownloadStatus = this.data.onlyDownloadStatus;

        this.moduleForm = this.formBuilder.group({
          isNewFiling: new UntypedFormControl( false, Validators.compose([
            // Validators.required,
          ]))
        });

        /** Idioma inical */
        this.detectLanguageInitial();
  }

  ngOnInit() {
    /** Detectando si se ejecuta cambio de idioma */
    this.detectLanguageChange();

    // Hace el llamado del token
    this.getTokenLS();
  
  }

  ngAfterViewChecked() {
    $('.cdk-global-overlay-wrapper').css('z-index', '1000');
    $('.cdk-overlay-pane').css('overflow', 'auto');
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.hashLocalStorage = this.authService.decryptAES( localStorage.getItem( environment.hashSkina ) );
      this.authorization = res;
      this.consultarUrl(this.authorization);
    });
  }

  consultarUrl(authe) {

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost( this.routeLoadDataTablesService, this.dataSend, authe).subscribe(
      (res) => {

        this.resServicesIni = res;

        this.globalAppService.resolveResponse(this.resServicesIni, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // this.sweetAlertService.showNotification( 'success', this.resServicesIni['message'] );
            this.dtData = this.resServicesIni.data;
            // Data seleccionada vacia
            this.selectedRows = [];
            this.selectedRowsReceiveData(this.selectedRows);

            // Info del usuario logueado 
            if (typeof this.resServicesIni.isUserTramitador != 'undefined') {
              this.isUserTramitador = this.resServicesIni.isUserTramitador;
            }
            if (typeof this.resServicesIni.isUserInformado != 'undefined') {
              this.isUserInformado = this.resServicesIni.isUserInformado;
            }
            if (typeof this.resServicesIni.isRadiFinalizado != 'undefined') {
              this.isRadiFinalizado = this.resServicesIni.isRadiFinalizado;
            }
            if (typeof this.resServicesIni.radiHasImgPrincipal != 'undefined') {
              this.radiHasImgPrincipal = this.resServicesIni.radiHasImgPrincipal;
            }
            if (typeof this.resServicesIni.estadoDocuGenerado != 'undefined') {
              this.estadoDocuGenerado = this.resServicesIni.estadoDocuGenerado;
              this.tipoRadicadoId = this.resServicesIni.tipoRadicado;
              this.validaNewFiling();
            }
            if (typeof this.resServicesIni.isRadiSigned != 'undefined') {
              this.isRadiSigned = this.resServicesIni.isRadiSigned;
              if (this.isRadiSigned == true) {
                this.moduleForm.controls['isNewFiling'].setValue(false);
              }
            }
            if (typeof this.resServicesIni.isRadiSignedOrInProcess != 'undefined') {
              this.isRadiSignedOrInProcess = this.resServicesIni.isRadiSignedOrInProcess
            }
            if (typeof this.resServicesIni.onlyDownloadStatus != 'undefined') {
              if (this.onlyDownloadStatus == false) {
                // Se asigna el valor solo cuando se cambiará la variable a true, ya que el módulo de correspondencia solo tiene permisos de lectura y no debe volver a false
                this.onlyDownloadStatus = this.resServicesIni.onlyDownloadStatus
              }
            }

            // tipos de firmas 
            if(this.resServicesIni.buttonSigned){
              this.buttonSigned = this.resServicesIni.buttonSigned;
            }

            // Cargando false
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.resServicesIniErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resServicesIniErr).then((res) => { });
      }
    );

  }

  clickRow(data) {
    if (this.dtData[data.index]['rowSelect'] == true) {
      this.dtData[data.index]['rowSelect'] = false;

      let indexSearch = this.selectedRows.indexOf(this.dtData[data.index]);
      this.selectedRows.splice(indexSearch, 1);
    } else {
      this.dtData[data.index]['rowSelect'] = true;
      this.dtData[data.index]['idInitialList'] = data.index;

      this.selectedRows.push(this.dtData[data.index]);
    }
    this.selectedRowsReceiveData(this.selectedRows);
  }

  /**
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {

    let textMsgErrorPermisos = '';
    textMsgErrorPermisos = this.translate.instant('textMsgErrorPermisos');

    switch (event.action) {
      case 'correspondenceTemplate':
        //Validar si el radicado ya posee imagen principal (Primera combinación de correspondencia);
        if (this.radiHasImgPrincipal == true) {
          
          // Internacionalización de mensajes para el modal de confirmación de la acción
          const titleMsg = this.translate.instant('titleMsg');
          let textMsg = '';
          // la variable statusisNewFiling valida si es un nuevo numero de radicado
          let statusisNewFiling = this.moduleForm.controls['isNewFiling'].value;
          if ( statusisNewFiling == false ) {
            textMsg = this.translate.instant('textMsgCorrespondenceTemplateNoNumber');
          } else {
            textMsg = this.translate.instant('textMsgCorrespondenceTemplate');
          }
          const bntCancelar = this.translate.instant('bntCancelar');
          const btnConfirmacion = this.translate.instant('btnConfirmacion');

          /** Modal de confirmación de la acción */
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
              this.correspondenceTemplate(this.eventClickButtonSelectedData);
            }
          });

        } else {
          this.correspondenceTemplate(this.eventClickButtonSelectedData);
        }

      break;
      case 'download':
        this.donwnLoadDocuments(this.eventClickButtonSelectedData);
      break;
      case 'signDocument':

        let qr:boolean = false;
        let mechanical:boolean = false;
        let physical = false;

        //Habilita los botones de firma qr y mecanica
        // console.log(this.buttonSigned);
        this.buttonSigned.forEach(element => {
            if(element == "qr"){
              qr = true;
            }
            if(element == "mechanical"){
              mechanical = true;
            }
            if(element == "physical"){
              physical = true;
            }
        });

        const dialogRef = this.matDialog.open(SimpleDialog, {
          disableClose: false,
          width: '35%',
          data: {
            qr: qr,
            mechanical: mechanical,
            physical: physical,
            document: this.eventClickButtonSelectedData,
            authorization: this.authorization
          }
        });
    
        dialogRef.afterClosed().subscribe( res => {
          // Regargar la data
          this.consultarUrl(this.authorization);
        });
      break;
      //Habre el modal para mostrar las opciones de firma digital que se tengan configuradas
      case 'signDocumentOption':

        this.sweetAlertService.sweetLoading();

        //this.transactionSignDocumentOptions();
        let andes:boolean = false;
        let orfeoNG:boolean = false;
        let mostrarfirma:boolean = false; // Indica si se tiene configurado para mostrar la firma en el documento
        let usuariofirmaprueba:boolean = true; // Permite mostrar o no los datos del usuario que va a firmar (aplica para cuando se vaya a pasar a productivo)

        let data = {
          ButtonSelectedData: this.eventClickButtonSelectedData,
          authorization: this.authorization
        };

        this.restService.restPost( this.versionApi + 'site/sign-document-options', data, this.authorization).subscribe((res) => {
          this.sweetAlertService.sweetClose();
            this.resSerSignDoc = res;
            this.globalAppService.resolveResponse(this.resSerSignDoc, false).then((res) => {
              const responseResolveResponse = res;
              if (responseResolveResponse == true) {
                this.resSerSignDoc['data'].forEach(element => {
                    if(element == "Andes") {
                      andes = true;

                      this.resSerSignDoc['dataAdicional'][element].forEach(elementsItem => {
                          if(elementsItem.mostrar_firma){
                            mostrarfirma = elementsItem.mostrar_firma;
                            usuariofirmaprueba = elementsItem.pruebas;
                          }
                      });
                    }

                    if(element == "OrfeoNG") {
                      orfeoNG = true;
                    }
                });

                const dialogRef1 = this.matDialog.open(SimpleDialogOption, {
                  disableClose: false,
                  width: '35%',
                  data: {
                    andes: andes,
                    orfeoNG: orfeoNG,
                    mostrarfirma: mostrarfirma,
                    usuariofirmaprueba: usuariofirmaprueba,
                    document: this.eventClickButtonSelectedData,
                    authorization: this.authorization,
                    tamanoPaginaWidth: this.resSerSignDoc['tamanoPaginaWidth'],
                    tamanoPaginaHeight: this.resSerSignDoc['tamanoPaginaHeight'],
                    dataFile: this.resSerSignDoc['datafile']
                  }
                });

                dialogRef1.afterClosed().subscribe( res => {
                  // Regargar la data
                  this.consultarUrl(this.authorization);
                });
              }
            });
            }, (err) => {
              this.resSerSignDocErr = err;
              // Evaluar respuesta de error del servicio
              this.globalAppService.resolveResponseError(this.resSerSignDocErr).then((res) => { });
            }
        );
      break;
      //Cuando se oprime click en firma digital para un archivo que esta en estado
      //combinación de correspondencia pero sin firmas.
      case 'signDocument2':
        let digital:boolean = false;

        this.buttonSigned.forEach(element => {
          if(element == "digital"){
            digital = true;
          }
        });

        if(digital){  
          this.transactionSignDocumentCombiSinFirmas(this.eventClickButtonSelectedData);
          //Se abre cuadro de dialogo DigitalSignDialog
          const dialogRef4 = this.matDialog.open(DigitalSignDialog, {
            disableClose: false,
            width: '35%',
            data: {
              //La data va ser la del documento seleccionado
              document: this.eventClickButtonSelectedData,
              authorization: this.authorization
            }
          });
          //Despues de cerrar
          dialogRef4.afterClosed().subscribe( res => {
            // Regargar la data
            this.consultarUrl(this.authorization);
          });
        } else{
          this.sweetAlertService.sweetInfoText('Error', textMsgErrorPermisos);
        } 
        //FirmaDigital Fin
      break;
      //Firma digital para un archivo que se encuentra en estado firmado
      case 'digitalSign':

        let digital1:boolean = false;

        this.buttonSigned.forEach(element => {
          if(element == "digital"){
            digital1 = true;
          }
        });

        if(digital1){
          this.donwnLoadDocumentsFirmaDigital(this.eventClickButtonSelectedData);
  
          //Se abre cuadro de dialogo DigitalSignDialog
          const dialogRef2 = this.matDialog.open(DigitalSignDialog, {
            disableClose: false,
            width: '35%',
            data: {
              document: this.eventClickButtonSelectedData,
              authorization: this.authorization
            }
          });
  
          dialogRef2.afterClosed().subscribe( res => {
            // Regargar la data
            this.consultarUrl(this.authorization);
          });
        } else {
          this.sweetAlertService.sweetInfoText('Error', textMsgErrorPermisos);
        }
      break;
      case 'digitalSign2':

        let digital2:boolean = false;

        this.buttonSigned.forEach(element => {
          if(element == "digital"){
            digital2 = true;
          }
        });

        if(digital2){

          //Descarga de documento para firma digital (simplemente descarga sin extraer hash)
          this.donwnLoadDocuments(this.eventClickButtonSelectedData);
          
          //Se abre cuadro de dialogo DigitalSignDialog
          const dialogRef22 = this.matDialog.open(DigitalSignDialog, {
            disableClose: false,
            width: '35%',
            data: {
              //La data va ser la del documento seleccionado
              document: this.eventClickButtonSelectedData,
              authorization: this.authorization
            }
          });
    
          //Despues de cerrar
          dialogRef22.afterClosed().subscribe( res => {
            // Regargar la data
            this.consultarUrl(this.authorization);
          });
        } else {
          this.sweetAlertService.sweetInfoText('Error', textMsgErrorPermisos);
        }
      break;
      case 'Ver':
        if(this.eventClickButtonSelectedData[0].statusDocsPrincipales==13){

          this.textFormViewPdf = 'Vista del documento - Firmado digitalmente';
          this.statusModalviewPdf = false;
          this.statusModalviewSignaturePdf = true;
        }else {
          this.textFormViewPdf = 'Vista del documento';
          this.statusModalviewPdf = true;
          this.statusModalviewSignaturePdf = false;         
        }
        this.idDocument = this.eventClickButtonSelectedData[0].id;
        
      break;
      case 'publishDocument':
        this.continueTransaccionPublicDoc(this.eventClickButtonSelectedData);
      break;
    }
  }

  closeDialog() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  /**
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {
    if (event.length > 0) {
      if (this.dataUserTramitador.user_idTramitador == this.hashLocalStorage.data.idDataCliente) {
        // Validar si el radicado se encuentra en estado finalizado
        if (this.isRadiFinalizado == true) {
          this.eventClickButtonSelectedData = event;
          this.menuButtons = this.menuButtonsOnlyDownload;
        } else {
          this.validaButtonsPDF(event);
        }
      } else {
        // Si el usuario logueado es diferente al usuario tramitador, pero es informado solo permite descargar
        if(this.isUserInformado == true) {
          this.eventClickButtonSelectedData = event;
          this.menuButtons = this.menuButtonsOnlyDownload;
        } else {
          if (event.length === 1) {
            this.eventClickButtonSelectedData = event;
            if (event[0]['extensionRadiDocumentoPrincipal'] === 'pdf') {
              this.menuButtons = this.menuButtonsOnlyDownloadAndPdf;
            } else {
              this.menuButtons = this.menuButtonsOnlyDownload;
            }
          } else {
            this.eventClickButtonSelectedData = event;
            this.menuButtons = this.menuButtonsOnlyDownload;
          }
        }
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  validaButtonsPDF(event) {

    // Se asigna los valores
    this.eventClickButtonSelectedData = event;

    let unicoStatus = true;
    let uniStatusVal = event[0].statusDocsPrincipales;

      // Un registro seleccionado
    if (event.length == 1) { // Un registro seleccionado

      switch (uniStatusVal) {
        case 6: // Documento Combinado sin firmas
        if (this.onlyDownloadStatus) {
          this.menuButtons = this.menuButtonsOnlyDownload;
        } else {
          if (this.isRadiSigned) {
            this.menuButtons = this.menuButtonsSelectFirmadoDigitalmenteOne;
          } else {
            this.menuButtons = this.menuButtonsSelectCombiSinFirmas;
          }
        }
        break;
        case 12: // Documento en proceso de firma digital
        if (this.onlyDownloadStatus) {
          this.menuButtons = this.menuButtonsOnlyDownload;
        } else {
          if (this.isRadiSigned) {
            this.menuButtons = this.menuButtonsSelectFirmadoDigitalmenteOne;
          } else {
            this.menuButtons = this.menuButtonsSelectProsesoFirmaDigitalOne;
          }
        }
        break;
        case 13: // Documento firmado digitalmente
        if (this.onlyDownloadStatus) {
          this.menuButtons = this.menuButtonsOnlyDownload;
        } else {
          if (this.isRadiSigned) {
            this.menuButtons = this.menuButtonsSelectFirmadoDigitalmenteOne;
          } else {
            this.menuButtons = this.menuButtonsSelectFirmadoDigitalmenteOne;
          }
        }
        break;
        case 7: // Documento en proceso de firma
          if (this.onlyDownloadStatus) {
            this.menuButtons = this.menuButtonsOnlyDownload;
          } else {
            if (this.isRadiSigned) {
              this.menuButtons = this.menuButtonsOnlyDownload;
            } else {
              this.menuButtons = this.menuButtonsSelectCombi;
            }
          }
        break;
        case 8: // Documento Combinado
          if (this.onlyDownloadStatus) {
            this.menuButtons = this.menuButtonsOnlyDownload;
          } else {
            if (this.isRadiSigned) {
              this.menuButtons = this.menuButtonsOnlyDownload;
            } else {
              this.menuButtons = this.menuButtonsSelectCombi;
            }
          }
        break;
        case 9: // Documento Firmado
          if (this.onlyDownloadStatus) {
            this.menuButtons = this.menuButtonsOnlyDownloadAndPdf
          } else {
            this.menuButtons = this.menuButtonsSelectFirmadoOne;
          }
        break;
        case 10: // Documento Cargado
          if (this.onlyDownloadStatus) {
            this.menuButtons = this.menuButtonsOnlyDownload;
          } else {
            if (this.isRadiSignedOrInProcess) {
              this.menuButtons = this.menuButtonsOnlyDownload;
            } else {
              this.menuButtons = this.menuButtonsSelectOne;
            }
          }
        break;
        case 15: // Documento en proceso de firma física
        case 20: // Documento firmado físicamente
          if (this.onlyDownloadStatus) {
            this.menuButtons = this.menuButtonsOnlyDownload;
          } else {
            this.menuButtons = this.menuButtonsOnlyDownloadAndPdf;
          }
        break;
        default: // Documento inactivo
          this.menuButtons = this.menuButtonsSelectNull;
        break;
      }

    } else {
      // Recorre los botones
      event.forEach( element => {
        // Valida si es unico registro
        if ( element.statusDocsPrincipales != uniStatusVal ) {
          unicoStatus = false;
        }
      });
      // Si tiene un mismo estado
      if ( unicoStatus ) {
        switch (uniStatusVal) {
          case 7: // Documento en proceso de firma
            if (this.onlyDownloadStatus) {
              this.menuButtons = this.menuButtonsOnlyDownload;
            } else {
              this.menuButtons = this.menuButtonsOnlyDownload;
            }
          break;
          case 8: // Documento Combinado
            if (this.onlyDownloadStatus) {
              this.menuButtons = this.menuButtonsOnlyDownload;
            } else {
              this.menuButtons = this.menuButtonsOnlyDownload;
            }
          break;
          case 9: // Documento Firmado
            if (this.onlyDownloadStatus) {
              this.menuButtons = this.menuButtonsOnlyDownload;
            } else {
              this.menuButtons = this.menuButtonsSelectFirmado;
            }
          break;
          case 10: // Documento Cargado
            this.menuButtons = this.menuButtonsOnlyDownload;
        break;
          default: // Documento inactivo
            this.menuButtons = this.menuButtonsSelectNull;
          break;
        }

      } else {
        // Solo descarga
        this.menuButtons = this.menuButtonsOnlyDownload;
      }

    }

  }

  /**
   * Funcion que realiza la combinación de correspondencia
   * @param dataVal
   */
  correspondenceTemplate(dataVal) {

    let dataRadi = [];
    dataRadi.push(this.dataSend);

    let data = {
      data: dataVal[0],
      ButtonSelectedData: dataRadi,
      isNewFiling: this.moduleForm.controls['isNewFiling'].value
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost( this.versionApi + 'radicacion/transacciones/correspondence-match' , data, this.authorization).subscribe(
      (res) => {

        this.resSerCorTemplate = res;

        this.globalAppService.resolveResponse(this.resSerCorTemplate, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resSerCorTemplate['message'] );
            if ( this.resSerCorTemplate.datafile) {
              this.downloadFile(this.resSerCorTemplate.datafile, this.resSerCorTemplate.fileName);
            }
            // Regargar la data
            this.consultarUrl(this.authorization);
          }
        });

      }, (err) => {
        this.resSerCorTemplateErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerCorTemplateErr).then((res) => { });
      }
    );
  }

  closePdfModal(data) {
    this.statusModalviewPdf = false;
    this.statusModalviewSignaturePdf = false;
  }

  /**
   * Funcion para descargar documentos
   * @param dataVal
   */
  donwnLoadDocuments(dataVal) {
    // loading true
    let data = {
      data: dataVal
    };

    this.sweetAlertService.showNotificationLoading();

    this.restService.restPost( this.ruoteServiceDownloadDocuments, data, this.authorization).subscribe((res) => {

        this.resSerDownload = res;

        this.globalAppService.resolveResponse(this.resSerDownload, false).then((res) => {
          const responseResolveResponse = res;
          this.sweetAlertService.showNotificationClose();
          if (responseResolveResponse == true) {
            // this.sweetAlertService.showNotification( 'success', this.resSerDownload['message'] );
            let dataFileArray = this.resSerDownload.datafile;
            if ( this.resSerDownload.datafile) {
              // this.downloadFile(this.resSerDownload.datafile, this.resSerDownload.fileName);
              dataFileArray.forEach( dataSer => {
              if ( dataSer.datafile ) {
                  this.downloadFile(dataSer.datafile, dataSer.fileName);
                }
              });
            }
          }
          // Cargando false
          // this.sweetAlertService.sweetClose();
        });
        }, (err) => {
          this.resSerDownloadErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerDownloadErr).then((res) => {
            this.sweetAlertService.showNotificationClose();
          });
        }
    );
  }
  /**
   * sguarin Funcion para descargar documentos que quieran pasar un proceso de firma digital
   * @param dataVal
   */
  donwnLoadDocumentsFirmaDigital(dataVal) {
    // loading true
    let data = {
      data: dataVal
    };

    this.sweetAlertService.showNotificationLoading();

    this.restService.restPost( this.versionApi + 'radicacion/documentos/download-doc-principal-firma-digital', data, this.authorization).subscribe((res) => {

      this.resSerDownload = res;

      this.globalAppService.resolveResponse(this.resSerDownload, false).then((res) => {
        const responseResolveResponse = res;
        this.sweetAlertService.showNotificationClose();
        if (responseResolveResponse == true) {
          // this.sweetAlertService.showNotification( 'success', this.resSerDownload['message'] );
          let dataFileArray = this.resSerDownload.datafile;
          if ( this.resSerDownload.datafile) {
            // this.downloadFile(this.resSerDownload.datafile, this.resSerDownload.fileName);
            dataFileArray.forEach( dataSer => {
            if ( dataSer.datafile ) {
                this.downloadFile(dataSer.datafile, dataSer.fileName);
              }
            });
          }
        }
        // Cargando false
        // this.sweetAlertService.sweetClose();
      });
      }, (err) => {
        this.resSerDownloadErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerDownloadErr).then((res) => {
          this.sweetAlertService.showNotificationClose();
        });
      }
    );
  }

  /**
   * Funcion para colocar campos faltantes a archivos en estado de combinación de correspondencia
   * sin variables de firma, asignar radicado, convertir a formato pdf, firmar digitalmente por Orfeo y descargar 
   * para proceso de firma digital
   * @param dataVal data seleccionada de los documentos principales
   */
  transactionSignDocumentCombiSinFirmas(dataVal) {

    let data = {
      ButtonSelectedData: dataVal,
    };

    this.sweetAlertService.sweetLoading();

    this.restService.restPost( this.versionApi + 'radicacion/transacciones/sign-document-combi-sin-firmas', data, this.authorization).subscribe((res) => {
        this.resSerSignDoc = res;
        this.sweetAlertService.sweetClose();

        this.globalAppService.resolveResponse(this.resSerSignDoc, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resSerSignDoc['message'] );
            // this.dialogRef.close({event: 'close', status: false , data: [] });

            this.donwnLoadDocumentsFirmaDigital(this.eventClickButtonSelectedData);

            this.consultarUrl(this.authorization);
          }
        });
        }, (err) => {
          this.resSerSignDocErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerSignDocErr).then((res) => { });
        }
    );
  }

  /**
  * Mensaje de confirmación para continuar con la trasaccion de publicar documento
  */
  continueTransaccionPublicDoc(event) {

    let titleShow: string;
    if ( !event[0].statusIdPublic ) {
      titleShow = 'textMsgPublicDoc';
    } else {
      titleShow = 'textMsgPrivateDoc';
    }

    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {
      this.resSerLenguage = res;
      let titleMsg = '';
      let textMsg = this.resSerLenguage[titleShow];
      let textConf = this.resSerLenguage['btnConfirmar'];
      let textCancel = this.resSerLenguage['Cancelar'];

      swal({
        title: titleMsg,
        text: textMsg,
        type: 'success',
        showCancelButton: true,
        cancelButtonText: textCancel,
        confirmButtonText: textConf,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).then( (result) => {

        if (result.value) {
          // Transacion Devolver
          this.transactionPublicDoc(this.eventClickButtonSelectedData);
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
      ButtonSelectedData: dataVal,
      data: {
        type: 'principal'
      }
    };
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost( this.versionApi + 'radicacion/transacciones/publish-document', data, this.authorization).subscribe((res) => {

        this.resSerPublicDoc = res;

        this.globalAppService.resolveResponse(this.resSerPublicDoc, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resSerPublicDoc['message'] );
            // Regargar la data
            this.consultarUrl(this.authorization);
          }
        });
        }, (err) => {
          this.resSerPublicDocErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerPublicDocErr).then((res) => { });
        }
    );
  }

  /**
   * Función que asigna el valor al campo si es nuevo número de radicado
   */
  MatSlideToggleChange(event) {
    /** Evaluar si el imput esta checkeado como true o false */
      if (event.checked) {
        this.messageIsNewFiling = 'Si';
        this.moduleForm.controls['isNewFiling'].setValue(true);
      } else {
        this.messageIsNewFiling = 'No';
        this.moduleForm.controls['isNewFiling'].setValue(false);
      }
      /** Fin Evaluar si el imput esta checkeado como true o false */
  }

  /**
   * Función que valida el número de radicado nuevo
   */
  validaNewFiling() {

    if ( this.estadoDocuGenerado ) {
      this.MatSlideToggleChange({ checked: true });
    } else {
      // PQRSD o ENTRADA
      if ( this.tipoRadicadoId == environment.tipoRadicadoId.pqrs || this.tipoRadicadoId == environment.tipoRadicadoId.entrada ) {
        this.MatSlideToggleChange({ checked: true });
      }
      // El resto
      if ( this.tipoRadicadoId != environment.tipoRadicadoId.entrada && this.tipoRadicadoId != environment.tipoRadicadoId.pqrs ) {
        this.MatSlideToggleChange({ checked: false });
      }
    }

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

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }
}

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-table-modal.component.css']
})

export class SimpleDialog implements OnInit {
  
  versionApi = environment.versionApiDefault;
  moduleForm: UntypedFormGroup;
  dataDialog: any;
  selectedoption:string = '';
  statusSelectedoption: boolean = false;

  noneOptionFirma:boolean = false;

  //
  resSerSignDoc: any;
  resSerSignDocErr: any;

  constructor(private formBuilder: UntypedFormBuilder, public sweetAlertService: SweetAlertService, public restService: RestService,  public globalAppService: GlobalAppService, public dialogRef: MatDialogRef<SimpleDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.moduleForm = this.formBuilder.group({
      passUser: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ]))
    });
  }

  ngOnInit() {
    this.dataDialog = this.data;
    
    if(this.dataDialog.qr == false && this.dataDialog.mechanical == false && this.dataDialog.physical == false){
      this.noneOptionFirma = true;
    }
  }

  /**
   * Función que ejecuta el submit
   */
  onSelected(select) {
    this.selectedoption = select;
    // this.dialogRef.close({event: 'close', status: true , data: select});
  }

  /**
   * Cuando se hace clic en el botón se envia el formulario
   * @param event
   */
  sendForm(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById('sendForm');
    buttonSubmit.click();
  }
  
  /**
   * Función que ejecuta el submit
   */
  submit() {

    this.statusSelectedoption = false;

    if (this.moduleForm.valid) {

      if(this.selectedoption == ""){
        this.statusSelectedoption = true;
      }else{
        this.transactionSignDocument();
        // this.dialogRef.close({event: 'close', status: true , data: this.moduleForm.getRawValue()});
      }

    }
  }
    
  
  // Cierra el modal
  cerrar() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  /**
   * Funcion para firmar documentos eso solo permite
   * @param dataVal data seleccionada de los documentos principales
   */
  transactionSignDocument() {

    let data = {
      ButtonSelectedData: this.dataDialog.document,
      moduleForm: this.moduleForm.getRawValue(),
      selectedoption: this.selectedoption,
    };
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost( this.versionApi + 'radicacion/transacciones/sign-document', data, this.dataDialog.authorization).subscribe((res) => {
        this.resSerSignDoc = res;
        this.sweetAlertService.sweetClose();

        this.globalAppService.resolveResponse(this.resSerSignDoc, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            if (data.selectedoption === 'physical' && this.resSerSignDoc['dataFile']) {
              this.downloadFile(this.resSerSignDoc['dataFile'], this.resSerSignDoc['fileName']);
            }
            this.sweetAlertService.showNotification( 'success', this.resSerSignDoc['message'] );
            this.dialogRef.close({event: 'close', status: false , data: [] });
          }
        });
        }, (err) => {
          this.resSerSignDocErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerSignDocErr).then((res) => { });
        }
    );
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
}

@Component({
  selector: 'app-digital-sign-dialog',
  templateUrl: './digital-sign-dialog.component.html',
  styleUrls: ['./simple-table-modal.component.css']
})

//Cuadro de dialogo para cargar un archivo firmado digitalmente
export class DigitalSignDialog implements OnInit {
  
  versionApi = environment.versionApiDefault;
  moduleForm: UntypedFormGroup;
  dataDialog: any;

  noneOptionFirma:boolean = false;

  //
  resSerSignDoc: any;
  resSerSignDocErr: any;

  constructor(
    private formBuilder: UntypedFormBuilder, public sweetAlertService: SweetAlertService, public restService: RestService,  public globalAppService: GlobalAppService, public dialogRef: MatDialogRef<SimpleDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public encryptService: EncryptService,
    private http: HttpClient,
    private translate: TranslateService, private activateTranslateService: ActivateTranslateService
  ) {

    this.moduleForm = this.formBuilder.group({
      passUser: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      fileUpload: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  //Captura de data del documento principal seleccionado
  ngOnInit() {    
    this.dataDialog = this.data;
    
    // console.log(this.dataDialog)
  }

  //carga de archivo
  uploadValid: boolean = false;
  @ViewChild('inputFile', {static: false}) inputFile: ElementRef;

  //Validación cuando se carga un archivo, si lo deja o no deja subir
  onSelectedFile(event) {
    if (event.target.files.length > 0) {
      this.validateFileExtension(event.target.files[0]).then((res) => {
        if (res) {
            this.moduleForm.controls['fileUpload'].setValue(event.target.files[0]);
            this.uploadValid = true;
        } else {
          this.sweetAlertService.sweetInfoText('Archivo no válido', 'Solo se permiten archivos PDF');
          this.uploadValid = false;
          this.inputFile.nativeElement.value = '';
        }
      });
    }else {
      this.uploadValid = false;
      this.inputFile.nativeElement.value = '';
      this.moduleForm.controls['fileUpload'].setValue(event.target.files[0]);
    }
  }

  /**
   * Valida la extensión del archivo que será cargado
   * @param nameFile nombre del archivo a cargar
   // */
   validateFileExtension(nameFile) {
    return new Promise<boolean>((resolve) => {
      const extensionArr = nameFile.name.split('.');
      const extension = extensionArr.pop().toLowerCase();
      if (extension == 'pdf') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Cuando se hace clic en el botón se envia el formulario
   * @param event
   */
  sendForm(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById('sendForm');
    buttonSubmit.click();
  }
  
  /**
   * Función que ejecuta el submit
   */
  submit() {

    if(this.uploadValid){
      if (this.moduleForm.valid) {
        this.transactionDigitalSignDocument();
      }
    } else {
      let txtMsgArchivoNoCargado = '';
      txtMsgArchivoNoCargado = this.translate.instant('txtMsgArchivoNoCargado');
      this.sweetAlertService.sweetInfoText('Error', txtMsgArchivoNoCargado);
    }
  }    
  
  // Cierra el modal
  cerrar() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  responseService: any;
  responseServiceErr: any;
  urlEndSend: any = '';

  transactionDigitalSignDocument() {

    // Loadign true
    this.sweetAlertService.sweetLoading();

    if (!this.moduleForm.valid) {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    } else {
      const formData = new FormData();
      formData.append('fileUpload', this.moduleForm.get('fileUpload').value);

      let data = {
        ButtonSelectedData: this.dataDialog.document,
        dataForm: this.moduleForm.value
      };

      this.encryptService.generateRouteGetParams(environment.apiUrl + this.versionApi + 'radicacion/transacciones/digital-sign-document', data, this.dataDialog.authorization).then((res) => {
        this.urlEndSend = res;

        /** Comsumo de servicio  */
        this.http.post(this.urlEndSend, formData, {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.dataDialog.authorization,
            'language': localStorage.getItem('language') ? localStorage.getItem('language') : 'es'
          }),
          reportProgress: true,
          observe: 'events'

        }).subscribe((event: any) => {
          switch (event.type) {
            case HttpEventType.Response: // Cuando termina la carga
                if (event.body) {
                  this.responseService = event.body;
                  // Desencriptar respuesta del servicio
                  this.encryptService.decryptAES(this.responseService.encrypted, this.dataDialog.authorization).then((res) => {
                    let responseServiceDecrypt: any = res;
                    // console.log(responseServiceDecrypt);
                    // Evaluar respuesta del servicio
                    this.globalAppService.resolveResponse(responseServiceDecrypt, false).then((res) => {
                      let responseResolveResponse = res;
                      if (responseResolveResponse == true) {
                          this.sweetAlertService.showSwal('success-message', 'varTextPerfect', responseServiceDecrypt.message);

                          // Valida si se retorna el valor del formulario y cierra el modal
                          this.dialogRef.close({event: 'close', status: true , data: this.moduleForm.value });
                      }
                    });
                    // Fin Evaluar respuesta del servicio
                  });
                  // Fin Desencriptar respuesta del servicio
                }
            break;
          }

        }, (err) => {
          this.responseServiceErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.responseServiceErr, false).then((res) => { });
          this.sweetAlertService.sweetInfoText('El archivo no pudo ser procesado', '');
        });
        /** Fin Comsumo de servicio  */
      });
    }
  }
}

// Firma digital certificada
@Component({
  selector: 'app-simple-dialog-option',
  templateUrl: './simple-dialog-option.component.html',
  styleUrls: ['./simple-table-modal.component.css']
})

export class SimpleDialogOption implements OnInit {

  versionApi = environment.versionApiDefault;
  moduleForm: UntypedFormGroup;
  dataDialog: any;
  selectedoption:string = '';
  statusSelectedoption: boolean = false;

  noneOptionFirma:boolean = false;
  resSerSignDoc: any;
  resSerSignDocErr: any;
  statusModalviewPdf: boolean = false;

  // Proceso para la firma certificada
  listCordenadasFirma: any;
  responseServiceListModuleFirma: any;
  responseServiceListModuleFirmaErr: any;
  filteredlistCordenadas: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Variables para internacionalizacion */
  activeLang: string;
  languageReceive: any;
  resSerLenguage: any;

  public closeModalEmiter = new EventEmitter<any>(); // Data a retornar al formulario

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();
  subscriptionTranslateService$: Subscription;

  constructor(private formBuilder: UntypedFormBuilder, 
    public sweetAlertService: SweetAlertService, 
    public restService: RestService,  
    public globalAppService: GlobalAppService, 
    private translate: TranslateService, private activateTranslateService: ActivateTranslateService,
    public dialogRef: MatDialogRef<SimpleDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, 
    public dialog: MatDialog) {

    this.moduleForm = this.formBuilder.group({
      passUser: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      user: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      coordenadasFirma: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      numeroPaginaFirma: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ]))
    });

    /** Idioma inical */
    this.detectLanguageInitial();

  }

  ngOnInit() {
    this.dataDialog = this.data;
    //Se valida si existen los tipos de firmas andes u Orfeo para mostrar las opciones de firmado
    if(this.dataDialog.andes == false && this.dataDialog.orfeoNG == false){
      this.noneOptionFirma = true;
    }
  }

  /**
   * Función que ejecuta el submit
   */
  onSelected(select) {
    this.selectedoption = select;
  }

  /**
   * Cuando se hace clic en el botón se envia el formulario
   * @param event
   */
   sendFormOption(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById('sendFormOption');
    buttonSubmit.click();
  }
  
  /**
   * Función que ejecuta el submit
   */
  submit() {

    this.statusSelectedoption = false;

    if (this.moduleForm.valid) {

      if(this.selectedoption == ""){
        this.statusSelectedoption = true;
      }else{
        this.transactionSignDocumentOption();
      }

    }
  }    
  
  // Cierra el modal
  cerrar() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  /**
   * Funcion para firmar documentos eso solo permite
   * @param dataVal data seleccionada de los documentos principales
   */
   transactionSignDocumentOption() {

    let data = {
      ButtonSelectedData: this.dataDialog.document,
      moduleForm: this.moduleForm.getRawValue(),
      selectedoption: this.selectedoption,
      valorAuthorization: this.dataDialog.authorization,
    };
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost( this.versionApi + 'site/process-sign', data, this.dataDialog.authorization).subscribe((res) => {
        this.resSerSignDoc = res;
        this.sweetAlertService.sweetClose();

        this.globalAppService.resolveResponse(this.resSerSignDoc, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resSerSignDoc['message'] );
            this.dialogRef.close({event: 'close', status: false , data: [] });
          }
        });
        }, (err) => {
          this.resSerSignDocErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerSignDocErr).then((res) => { });
        }
    );
  }

  /** Realiza el filtro de busqueda */
  filterBanks(nomList) {
    if (!this[nomList]) {
      return;
    }
    // get the search keyword
    let search = this.moduleForm.controls[nomList + 'Filter'].value;
    if (!search) {
      this['filtered' + nomList].next(this[nomList].slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this['filtered' + nomList].next(
      this[nomList].filter( listOption => listOption.val.toLowerCase().indexOf(search) > -1)
    );
  }

  viewimage(){
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog() {
    const dialogRef = this.dialog.open(ViewImageDialog, {
      disableClose: false,
      width: '95%',
      panelClass: 'app-full-bleed-dialog',
      data: {
        dataFile: this.dataDialog.dataFile
      }
    });
    dialogRef.afterClosed().subscribe( res => {
      let respuesta = res;
      if (!respuesta) {
        respuesta = {event: 'close', status: false , data: [] };
      } else {
        if (respuesta.data[0].process && respuesta.data[0].process === true) {
          const dataLocalStorageSignature = localStorage.getItem('dataFirmaCertificada');
          if (dataLocalStorageSignature) {
            const localStorageSignature = JSON.parse(dataLocalStorageSignature);

            const tamanoXDocReal = Number(this.dataDialog.tamanoPaginaWidth);
            const processX = tamanoXDocReal * localStorageSignature.posx;
            const endprocessX = processX / localStorageSignature.width;
            const endPosX = Math.round(endprocessX);

            const tamanoYDocReal = Number(this.dataDialog.tamanoPaginaHeight);
            const processY = tamanoYDocReal * localStorageSignature.posy;
            const endprocessY = processY / localStorageSignature.height;
            const redondearY = Math.round(endprocessY);
            const endPosY = tamanoYDocReal - redondearY;

            this.moduleForm.controls['coordenadasFirma'].setValue(`${endPosX},${endPosY}`);
            this.moduleForm.controls['numeroPaginaFirma'].setValue(localStorageSignature.page);
          }
        }
      }

      this.closeComponent(respuesta);
    });
  }

  /*** Método para cerrar o destruir el componente desde el padre ***/
  closeComponent( respuesta ) {
    this.closeModalEmiter.emit(respuesta);
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

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }

}

@Component({
  selector: 'app-view-image-modal',
  templateUrl: './view-image-modal.component.html',
  styleUrls: ['./simple-table-modal.component.css']
})

//View de la imagen que contine las cordenadas de la firma
export class ViewImageDialog implements OnInit {
  versionApi = environment.versionApiDefault;
  moduleForm: UntypedFormGroup;
  dataDialog: any;

  noneOptionFirma:boolean = false;
  statusModalviewPdf: boolean = true;
  //
  resSerSignDoc: any;
  resSerSignDocErr: any;

  /** Variables para internacionalizacion */
  activeLang: string;
  languageReceive: any;
  resSerLenguage: any;

  coordenadasx: number;
  coordenadasy: number;
  pageClick: number;

  subscriptionTranslateService$: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ViewImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService) {

    /** Idioma inical */
    this.detectLanguageInitial();
  }

  //Captura de data del documento principal seleccionado
  ngOnInit() {
    this.openPdf(this.data.dataFile);
  }

  // Cierra el modal
  cerrar() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  continue() {
    this.dialogRef.close({event: 'close', status: false , data: [{ process: true }] });
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

  openPdf(fileBase64) {
    const pdfAsArray = this.convertDataURIToBinary(fileBase64);
    const urlTemplate = 'assets/dist/pdfViewJs/viewer2.html?file=';
    let binaryData = [];
    binaryData.push(pdfAsArray);
    const dataPdf = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }));
    document.getElementById('frameViewPdf').setAttribute('src', urlTemplate + encodeURIComponent(dataPdf));
  }

  convertDataURIToBinary(base64) {
    const raw = window.atob(base64);
    const rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }

    return array;
  }

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }

}