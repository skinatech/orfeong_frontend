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

import { Component, OnInit, Output, EventEmitter, AfterViewChecked, Inject, Input, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
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
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface DialogData {
  dataDialog: any;
  initCardHeaderIcon: any;
  textForm: any;
  showButtonDowload: any;
  validateFile: any;
  uploadResponse: any;
  maxSize: any;
  showTipoDocumental: any;
  showObservacion: any;
  statusNameFile: any;
  valueNameFile: any;
  statusReturnDataClose: any;
  ruoteServiceDocuments: any;
  redirectionPath: any;
}

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-upload-files-modal',
  template: '',
  styleUrls: ['./upload-files-modal.component.css']
})
export class UploadFilesModalComponent implements OnInit {

  @Output() public closeModalEmiter = new EventEmitter<any>(); // Data a retornar al initial list
  // Variable para dar tamaño al dialog
  widthDialog = '50%';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'attachment';
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Cargar anexos';
  // Ruta a ejecutar
  @Input() ruoteServiceDocuments = 'radicacion/documentos/upload-document';
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
  @Input() showTipoDocumental: boolean = true; // Muestra el campo tipo documental
  @Input() showObservacion: boolean = true; // Muestra el campo observación
  @Input() statusNameFile: boolean = false; // Muestra el campo observación
  @Input() valueNameFile: string; // Muestra el valor de nombre file
  @Input() statusReturnDataClose: boolean = false; // Retorna información y cierra el modelo

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // hace le llamado del dialogo
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog( ) {

    const dialogRef = this.dialog.open( UploadFilesDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        dataDialog: this.dataSend,
        initCardHeaderIcon: this.initCardHeaderIcon,
        textForm: this.textForm,
        showButtonDowload: this.showButtonDowload,
        validateFile: this.validateFile,
        uploadResponse: this.uploadResponse,
        showTipoDocumental: this.showTipoDocumental,
        showObservacion: this.showObservacion,
        statusNameFile: this.statusNameFile,
        valueNameFile: this.valueNameFile,
        maxSize: this.maxSize,
        ruoteServiceDocuments: this.ruoteServiceDocuments,
        statusReturnDataClose: this.statusReturnDataClose,
        redirectionPath: this.redirectionPath,
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
  selector: 'app-upload-files-dialog',
  templateUrl: './upload-files-modal.component.html',
  styleUrls: ['./upload-files-modal.component.css']
})

export class UploadFilesDialog implements OnInit, AfterViewChecked {

  /**Variable del formulario */
  initCardHeaderIcon: any; // Icono del formulario
  textForm: string; // titulo del formulrio
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
  showObservacion: boolean = true; // Muestra la observación
  statusNameFile: boolean = false; // muestra el campo nombre archivo
  valueNameFile: string; // Muestra el valor del campo file name
  labelNameFile = 'Nombre archivo'; // label del archivo
  placeHolderNameFile = 'ingreseNameFile'; // label del archivo
  statusReturnDataClose = false; // Retorna data y el cierra el formulario

  moduleForm: UntypedFormGroup;
  validTextType: boolean = false;
  // Version api
  versionApi = environment.versionApiDefault;
  // Autentificacion
  authorization: string;

  // Variables para la descarga
  uploadValid: boolean = false;
  uploadProcess: boolean = false;

  // Variables para las listas
  listTipoDocumental: any;

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

  @ViewChild('inputFile', {static: false}) inputFile: ElementRef;

  constructor(public dialogRef: MatDialogRef<UploadFilesDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: UntypedFormBuilder,
  public sweetAlertService: SweetAlertService, private encryptService: EncryptService, private http: HttpClient, private globalAppService: GlobalAppService,
  private router: Router, public lhs: LocalStorageService, public restService: RestService) {

    /**
    * Configuración del formulario
    */
    this.initCardHeaderIcon = this.data.initCardHeaderIcon;
    this.textForm = this.data.textForm;
    this.dataSend = this.data.dataDialog;
    this.ruoteServiceDocuments = this.data.ruoteServiceDocuments;
    this.showButtonDowload = this.data.showButtonDowload;
    this.uploadResponse = this.data.uploadResponse;
    this.validateFile = this.data.validateFile;
    this.maxSize = this.data.maxSize;
    this.redirectionPath = this.data.redirectionPath;
    this.showTipoDocumental = this.data.showTipoDocumental;
    this.showObservacion = this.data.showObservacion;
    this.statusNameFile = this.data.statusNameFile;
    this.valueNameFile = this.data.valueNameFile;
    this.statusReturnDataClose = this.data.statusReturnDataClose;

    this.moduleForm = this.formBuilder.group({
      observacion: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      idTipoDocumental: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      nameFile: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      fileUpload: new UntypedFormControl('', Validators.compose([
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

  ngOnInit() {

    if (this.showTipoDocumental) {
      this.moduleForm.controls['idTipoDocumental'].setValidators([Validators.required]);

      // listen for search field value changes
      this.moduleForm.controls['listTipoDocumentalFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listTipoDocumental');
      });
    }
    // Deja el campo observación como obligatorio
    if (this.showObservacion) {
      this.moduleForm.controls['observacion'].setValidators([Validators.required]);
    }
    if (this.statusNameFile ) {
      this.moduleForm.controls['nameFile'].setValidators([Validators.required]);
    }
    if (this.valueNameFile) {
      this.moduleForm.controls['nameFile'].setValue(this.valueNameFile);
    }

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
  }

  submitForm() {

    this.uploadValid = false;
    // Loadign true
    this.sweetAlertService.sweetLoading();

    if (!this.moduleForm.valid) {
      this.uploadValid = true;
      this.sweetAlertService.sweetInfo('Algo está mal', '');
      // this.dialogRef.close({event: 'close', status: true , data: this.moduleForm.value });
    } else {
      const formData = new FormData();
      formData.append('fileUpload', this.moduleForm.get('fileUpload').value);

      this.uploadResponse = { status: true, message: 'Cargando...', proccess: 0 };

      let data = {
        ButtonSelectedData: this.dataSend,
        dataForm: this.moduleForm.value
      };

      this.encryptService.generateRouteGetParams( this.ruoteServiceDocuments, data, this.authorization).then((res) => {
        this.urlEndSend = res;

        /** Comsumo de servicio  */
        this.http.post(this.urlEndSend, formData, {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.authorization,
            'language': localStorage.getItem('language') ? localStorage.getItem('language') : 'es'
          }),
          reportProgress: true,
          observe: 'events'

        }).subscribe((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress: // Cuando el archivo está siendo cargado
                const progress = Math.round(100 * event.loaded / event.total);
                this.uploadResponse = { status: true, message: 'Cargando...', proccess: progress };
            break;
            case HttpEventType.Response: // Cuando termina la carga
                if (event.body) {
                  this.responseService = event.body;
                  // Desencriptar respuesta del servicio
                  this.encryptService.decryptAES(this.responseService.encrypted, this.authorization).then((res) => {
                    let responseServiceDecrypt: any = res;
                    // console.log(responseServiceDecrypt);
                    // Evaluar respuesta del servicio
                    this.globalAppService.resolveResponse(responseServiceDecrypt, false, this.redirectionPath).then((res) => {
                      let responseResolveResponse = res;
                      if (responseResolveResponse == true) {
                          this.uploadResponse = { status: true, message: 'Completado', proccess: 100 };
                          this.sweetAlertService.showSwal('success-message', 'varTextPerfect', responseServiceDecrypt.message);

                          // Valida si se retorna el valor del formulario y cierra el modelo
                          if (this.statusReturnDataClose) {
                            this.dialogRef.close({event: 'close', status: true , data: this.moduleForm.value });
                          }

                          /** Se limpia el formulario */
                          this.moduleForm.controls['idTipoDocumental'].setValue('');
                          this.moduleForm.controls['observacion'].setValue('');
                          this.moduleForm.controls['fileUpload'].setValue('');
                          this.inputFile.nativeElement.value = '';
                          // this.inputFile.nativeElement.reset();

                      } else {
                        this.uploadProcess = false;
                        this.uploadValid = true;
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
          this.globalAppService.resolveResponseError(this.responseServiceErr, false, this.redirectionPath).then((res) => { });
          this.uploadResponse = { status: true, message: 'Cargando...', proccess: 0 };
          this.sweetAlertService.sweetInfoText('El archivo no pudo ser procesado', '');
          this.uploadProcess = false;
          this.uploadValid = true;
        });
        /** Fin Comsumo de servicio  */

      });
    }
  }

  closeDialog() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  onSelectedFile(event) {
    if (event.target.files.length > 0) {

      // console.log(event.target.files[0]);

      this.validateFileExtension(event.target.files[0]).then((res) => {
        if (res) {
          // if (event.target.files[0].size > this.maxSize) {
            /* let msjmaxTamanyo: any;
            this.sweetAlertService.text18nGet().then((res) => {
              this.resSerLenguage = res;
              msjmaxTamanyo = this.resSerLenguage['Solo es permitido cargar'];
              msjmaxTamanyo = msjmaxTamanyo + ' ' + this.maxSizeText;
              this.sweetAlertService.sweetInfoText('El archivo es muy pesado', msjmaxTamanyo );
            });*/

            // this.uploadValid = false;
            // this.inputFile.nativeElement.value = '';
          // } else {
            this.moduleForm.controls['fileUpload'].setValue(event.target.files[0]);
            this.uploadValid = true;
          // }
        } else {
          this.sweetAlertService.sweetInfoText('Archivo no válido', this.notificationErrExt + ' ' + this.notificationErrExtArray.join());
          this.uploadValid = false;
          this.inputFile.nativeElement.value = '';
        }
      });
    }
  }

  /**
   * Valida la extensión del archivo que será cargado
   * @param nameFile nombre del archivo a cargar
   // */
  validateFileExtension(nameFile) {
    return new Promise<boolean>((resolve) => {
      let extensionAcepted = false;
      this.notificationErrExtArray = [];
      // const extension = nameFile.name.split('.')[1].toLowerCase();
      const extensionArr = nameFile.name.split('.');
      const extension = extensionArr.pop().toLowerCase();
      this.validateFile.forEach(element => {
        this.notificationErrExtArray.push('.' + element.type);
        if (extension == element.type) {
          extensionAcepted = true;
        }
      });

      resolve(extensionAcepted);
    });
  }

  // Llama la listas
  getListTipDocu() {

    this.restService.restGet(this.versionApi + 'radicacion/documentos/index-list', this.authorization).subscribe(
      (data) => {
        this.resSerlistTipDoc = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistTipDoc).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listTipoDocumental = this.resSerlistTipDoc.data;
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

  /**
   * Recibe el nombre de la lista para realizar la busqueda segun el filtro
   * @param nomList nombre lista
   */
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

}
