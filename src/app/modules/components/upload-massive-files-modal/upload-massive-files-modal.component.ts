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

import { Component, OnInit, Output, EventEmitter, AfterViewChecked, Inject, Input, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { environment } from 'src/environments/environment';
import { EncryptService } from 'src/app/services/encrypt.service';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';
import { ViewChild } from '@angular/core';

// List
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from '../../../services/activate-translate.service';

export interface DialogData {
  dataDialog: any;
  initCardHeaderIcon: any;
  textForm: any;
  textFormLabel: any;
  showButtonDowload: any;
  validateFile: any;
  uploadResponse: any;
  maxSize: any;
  showTipoDocumental: any;
  ruoteServiceDocuments: any;
  redirectionPath: any;
  showFechaDoc: any;
  dataDepen: any;
  maxRowsFiles: number;
  showButtonClean: boolean;
  showButtonClear: boolean;
}

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-upload-massive-files-modal',
  template: '',
  styleUrls: ['./upload-massive-files-modal.component.css']
})
export class UploadMassiveFilesModalComponent implements OnInit {

  @Output() public closeModalEmiter = new EventEmitter<any>(); // Data a retornar al initial list
  // Variable para dar tamaño al dialog
  widthDialog = '50%';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'attachment';
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Cargar anexos';
  @Input() textFormLabel = '';
  // Ruta a ejecutar
  @Input() ruoteServiceDocuments: any = 'radicacion/documentos/upload-document';
   // Objeto que se envia al back como parametro request
  @Input() dataSend: object;
  // Ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  @Input() redirectionPath = '/dashboard';
  // Cargar linea de proceso
  @Input() uploadResponse: any;
  // Muestra el boton para descargar formato
  @Input() showButtonDowload: boolean = false;
  // Validación de formatos de archivos
  @Input() validateFile: any = [{ type: 'xls' }, { type: 'xlsx' }];
  @Input() maxSize:number = 5242880; // Maximo de peso permitido por defecto 5MB
  // Tipo documental
  @Input() showTipoDocumental: any = true;
  // Fecha documento
  @Input() showFechaDoc: boolean = false; // Muestra el campo de fecha documento

  @Input() dataDepen: any; // Id de la dependencia
 
  @Input() maxRowsFiles: number = 5;
  @Input() showButtonClean: boolean = true;
  @Input() showButtonClear: boolean = true;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // hace le llamado del dialogo
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog( ) {

    const dialogRef = this.dialog.open( UploadMassiveFilesDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        dataDialog: this.dataSend,
        initCardHeaderIcon: this.initCardHeaderIcon,
        textForm: this.textForm,
        textFormLabel: this.textFormLabel,
        showButtonDowload: this.showButtonDowload,
        validateFile: this.validateFile,
        uploadResponse: this.uploadResponse,
        showTipoDocumental: this.showTipoDocumental,
        maxSize: this.maxSize,
        ruoteServiceDocuments: this.ruoteServiceDocuments,
        redirectionPath: this.redirectionPath,
        showFechaDoc: this.showFechaDoc,
        dataDepen: this.dataDepen,
        maxRowsFiles: this.maxRowsFiles,
        showButtonClean: this.showButtonClean,
        showButtonClear: this.showButtonClear,
      }
    });
    dialogRef.afterClosed().subscribe( res => {
      let respuesta = res;
      if ( !respuesta ) {
        respuesta = {event: 'close', status: false , data: [] };
      }
      // console.log('Respuesta al cerrar el dialogo');
      // console.log(respuesta);
      this.closeComponent(respuesta);
    });
  }

  /*** Método para cerrar o destruir el componente desde el padre ***/
  closeComponent( respuesta ) {
    this.closeModalEmiter.emit(respuesta);
  }

}


@Component({
  selector: 'app-upload-massive-files-dialog',
  templateUrl: './upload-massive-files-modal.component.html',
  styleUrls: ['./upload-massive-files-modal.component.css']
})

export class UploadMassiveFilesDialog implements OnInit, AfterViewChecked, OnDestroy {

  /**Variable del formulario */
  initCardHeaderIcon: any; // Icono del formulario
  textForm: string; // titulo del formulrio
  textFormLabel: string; // Titulo del anexo
  ruoteServiceDocuments: any; // Ruta a ejecutar
  redirectionPath: any; // Ruta redireccionar
  dataSend: any; // Data a enviar
  showButtonDowload: boolean = false; // Muestra el boton para descargar formato
  uploadResponse: any =  { status: false, message: 'Cargando...', proccess: 50 }; // Carga de proceso de archivo
  validateFile: any; // Validación de los formatos
  maxSize: any; // Tamaño maximo de archivo
  maxSizeText: string = '5MB';
  textFormObserva = 'Descripción';
  notificationErrExt: string = 'Solo es permitido archivos';
  notificationErrExtArray: any = [];
  showTipoDocumental: boolean = true; // Muestra el tipo documental
  showFechaDoc: boolean = false; // Muestra el campo de fecha documento
  dataDepen: any; // Id de la dependencia
  maxRowsFiles: number = 5;
  showButtonClean: boolean = true;
  showButtonClear: boolean = true;

  moduleForm: any; // FormGroup
  filesForm: UntypedFormArray;
  validTextType: boolean = false;
  // Version api
  versionApi = environment.versionApiDefault;
  // Autentificacion
  authorization: string;

  // Variables para la descarga
  uploadValid: boolean = false;
  uploadProcess: boolean = false;

  // Variables para las listas
  listTipoDocumental: any = [];
  listTipoDocumentalStatus: boolean = false;

  /** lists filtered + namelist by search keyword */
  filteredlistTipoDocumental: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  // Variables de consumo de servicios
  resSerLenguage: any;
  responseService: any;
  responseServiceErr: any;
  urlEndSend: any;
  resSerlistTipDoc: any;
  resSerlistTipDocErr: any;

  /** Input de archivos multiples inhabilitado para futuras modificaciones */
  viewInputFileMultiple: boolean = false;
  @ViewChild('inputFileMultiple', {static: false}) inputFileMultiple: ElementRef;

  /** Variables para internacionalizacion */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  translator: any; // Se pasara al componente hijo para reutilizar la instancia del del servicio TranslateService

  constructor(public dialogRef: MatDialogRef<UploadMassiveFilesDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: UntypedFormBuilder,
  public sweetAlertService: SweetAlertService, private encryptService: EncryptService, private http: HttpClient, private globalAppService: GlobalAppService,
  private translate: TranslateService, private activateTranslateService: ActivateTranslateService,
  private router: Router, public lhs: LocalStorageService, public restService: RestService) {

    /** Idioma inical */
    this.detectLanguageInitial();
    this.translator = this.translate;

    /**
    * Configuración del formulario
    */
    this.initCardHeaderIcon = this.data.initCardHeaderIcon;
    this.textForm = this.data.textForm;
    this.textFormLabel = this.data.textFormLabel;
    this.dataSend = this.data.dataDialog;
    this.ruoteServiceDocuments = this.data.ruoteServiceDocuments;
    this.showButtonDowload = this.data.showButtonDowload;
    this.uploadResponse = this.data.uploadResponse;
    this.validateFile = this.data.validateFile;
    this.maxSize = this.data.maxSize;
    this.redirectionPath = this.data.redirectionPath;
    this.showFechaDoc = this.data.showFechaDoc;
    this.showTipoDocumental = this.data.showTipoDocumental;
    this.dataDepen = this.data.dataDepen;
    this.maxRowsFiles = this.data.maxRowsFiles;
    this.showButtonClean = this.data.showButtonClean;
    this.showButtonClear = this.data.showButtonClear;
    this.moduleForm = this.formBuilder.group({
      /** FormArray de archivos */
      filesForm: this.formBuilder.array([]),
      /** Campo para contar las veces que se ha hecho clik en el boton submit */
      countSubmitForm: new UntypedFormControl(0, Validators.compose([
        Validators.required
      ])),
    });
  }

  ngOnInit() {
    /** Detectando si se ejecuta cambio de idioma */
    this.detectLanguageChange();

    this.addRowFileToList(false);
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      if (this.showTipoDocumental) {
        /** Llamado de los servicios para las listas */
        this.getListTipDocu();
      }

    });
  }

  ngAfterViewChecked() {
    $('.cdk-global-overlay-wrapper').css('z-index', '1000');
    $('.cdk-overlay-pane').css('overflow', 'auto');

    $('.mat-dialog-container').css('background', 'transparent');
    $('.mat-dialog-container').css('padding', '0px');

    //not
    //$('.cdk-overlay-pane').css('overflow', 'hidden');
    

  }

  submitForm() {

    this.analyzeSuccessRecords();

    let countSubmitForm = this.moduleForm.controls['countSubmitForm'].value;
    this.moduleForm.controls['countSubmitForm'].setValue(countSubmitForm + 1); 

  }

  closeDialog() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  clearRowFileToListRecibe(event: number) {
    const control = <UntypedFormArray>this.moduleForm.controls['filesForm'];
    control.removeAt(event);
    if(this.moduleForm.controls['filesForm'].value.length == 0) {
      this.addRowFileToList(false);
    }
  }

  /** Función receptora deste el hijo para agregar un nuevo item al formArray de los archivos */
  addRowFileToListRecibe(event) {
    this.addRowFileToList(false);
  }

  /** Función para agregar un nuevo item al formArray de los archivos
   * isParentFile: es una variable para determinar si se pasarán los archivo seleccionados desde el padre al hijo (Funcionalidad en construcción)
   */
  addRowFileToList(isParentFile: boolean = false){

    this.filesForm = this.moduleForm.get('filesForm') as UntypedFormArray;
    this.filesForm.push(this.createItem({
      isParentFile: isParentFile
    }));

  }

  /*** Métodos para configuración de formArray ***/
  createItem(data): UntypedFormGroup {
    return this.formBuilder.group({
      isParentFile: new UntypedFormControl( data.isParentFile, Validators.compose([
        //Validators.required
      ])),
      isSuccessForm: new UntypedFormControl(false, Validators.compose([
        //Validators.required,
      ])),
      observacion: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      idTipoDocumental: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      fechaDocumento: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      fileUpload: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      confidencial: new UntypedFormControl(true, Validators.compose([
        Validators.required
      ])),
      isPublicoRadiDocumento: new UntypedFormControl(false, Validators.compose([
        Validators.required
      ])),
      /**
       * Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listTipoDocumentalFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });
  }

  /** Función que recibe la selección del archivo input multiple (Funcionalidad en construcción) */
  onSelectedFileNew(event) {
    this.addRowFileToList(true);
  }

  /** Función para el llamado de las listas de tipos documentales */
  getListTipDocu() {
    // params que necesita el servicio
    let params = {
      idGdTrdDependencia: this.dataDepen.idGdTrdDependencia,
      idGdTrdSerie: this.dataDepen.idGdTrdSerie,
      idGdTrdSubserie: this.dataDepen.idGdTrdSubserie
    };

    this.restService.restGetParams(this.versionApi + 'radicacion/documentos/index-list', params, this.authorization).subscribe(
      (data) => {
        this.resSerlistTipDoc = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistTipDoc).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listTipoDocumental = this.resSerlistTipDoc.data;
            this.listTipoDocumentalStatus = true;
            // load the list initial reasing
            this.filteredlistTipoDocumental.next(this.listTipoDocumental.slice());
          }
        });
      }, (err) => {
        this.resSerlistTipDocErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistTipDocErr).then((res) => { });
      }
    );
  }

  onDownloadFormat() {
    
  }

  /** Función que analiza si todos los registros de formArray de archivos fueron exitosos */
  analyzeSuccessRecords() {
    const filesForm = this.moduleForm.controls['filesForm'].value;
    const rowsLength = filesForm.length;
    let i = 0;
    filesForm.forEach(element => {
      i++;
      if (element.isSuccessForm === false){
        return false;
      } else {
        if (i == rowsLength) {
          const message = this.translate.instant('No hay archivos nuevos para procesar');
          this.sweetAlertService.sweetInfoText('Información', message, 'info');
          return true;
        }
      }
    });
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
