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

import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators, FormControl } from '@angular/forms';
import { EncryptService } from '../../../services/encrypt.service';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { GlobalAppService } from '../../../services/global-app.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RestService } from '../../../services/rest.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { environment } from 'src/environments/environment';
import { ThemePalette } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from '../../../services/activate-translate.service';

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-upload-massive-files-detail-modal',
  templateUrl: './upload-massive-files-detail-modal.component.html',
  styleUrls: ['./upload-massive-files-detail-modal.component.css']
})
export class UploadMassiveFilesDetailModalComponent implements OnInit, AfterViewInit {

  @Input() fileSelected: any;

  // Ruta a ejecutar
  @Input() ruoteServiceDocuments: any = 'radicacion/documentos/upload-document';
  // Ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  @Input() redirectionPath = '/dashboard';
  // Cargar linea de proceso
  @Input() uploadResponse: any; //no c
  // Validación de formatos de archivos
  @Input() validateFile: any = [{ type: 'xls' }, { type: 'xlsx' }];
  @Input() maxSize: number = 5242880; // Maximo de peso permitido por defecto 5MB
  
  @Input() maxSizeText: string = '5MB';
  
  // Tipo documental
  @Input() showTipoDocumental: any;

  @Input() textFormObserva: string = 'Descripción';

  @Input() dataSend: any; //no
  @Input() filesFormLength: number = 1;
  @Input() indexComponent: number = 0;
  @Input() showFechaDoc: boolean = false; // Muestra el campo de fecha documento
  @Input() dataDepen: any; // Data de la dependencia

  notificationErrExt: string = 'Solo es permitido archivos';
  notificationErrExtArray: any = [];

  //moduleForm: FormGroup;
  @Input() moduleForm: any; // Formulario padre
  @Input() fileForm: any; // FormGroup
  validTextType: boolean = false;

  @Input() maxRowsFiles: number = 5;
  @Input() showButtonClean: boolean = true;
  @Input() showButtonClear: boolean = true;

  // Variables de consumo de servicios
  resSerLenguage: any;
  responseService: any;
  responseServiceErr: any;
  urlEndSend: any;
  resSerlistTipDoc: any;
  resSerlistTipDocErr: any;

  // Version api
  versionApi = environment.versionApiDefault;
  // Autentificacion
  authorization: string;

  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  @Output() public addRowFileToListEmiter = new EventEmitter<any>(); // Data a retornar para gregar in item a la lista
  @Output() public clearRowFileToListEmiter = new EventEmitter<any>(); // Data a retornar para eliminar un item de la lista

  // Variables para la descarga
  uploadValid: boolean = false;
  uploadProcess: boolean = false;
  uploadProcessStatus: boolean = true;

  nombreArchivoSeleccionado: string = '';

  // Variables para las listas
  @Input() listTipoDocumental: any = [];
  @Input() listTipoDocumentalStatus: boolean = false;

  @Input() translate: any; // instancia del del servicio TranslateService recibida desde el componente padre

  /** lists filtered + namelist by search keyword */
  filteredlistTipoDocumental: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  /** slide-toggle  */
  color: ThemePalette = 'primary';
  messageInputPublico: string = 'No';

  accept: string = '';

  subscriptionCountSubmitForm: any;

  // se utiliza para la fecha del documento
  public minDate: Date;
  public maxDate: Date;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public sweetAlertService: SweetAlertService, private encryptService: EncryptService, private http: HttpClient, private globalAppService: GlobalAppService,
    public lhs: LocalStorageService, public restService: RestService,
  ) {
  }

  ngOnInit() {
    // console.log('ngOnInit');/////
    // console.log(this.filesFormLength);/////
    // console.log(this.indexComponent);/////


    // this.uploadValid = true;/////

    this.validateInputFile();

    if (this.showTipoDocumental) {
      this.fileForm.controls['idTipoDocumental'].setValidators([Validators.required]);

      // listen for search field value changes
      this.fileForm.controls['listTipoDocumentalFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listTipoDocumental');
      });
    }

    this.subscriptionCountSubmitForm = this.moduleForm.controls['countSubmitForm'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.submitForm();
    });

    this.getTokenLS();

    // Vuelve el campo obligatorio
    if (this.showFechaDoc) {
      this.fileForm.controls['fechaDocumento'].setValidators([Validators.required]);
    }
  }

  /** Método para validar la busqueda personalizada de archivos en el navegador */
  validateInputFile() {
    this.accept = '';
    this.validateFile.forEach(element => {
      this.accept = this.accept + '.' + element.type + ',';
    });
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      if (this.showTipoDocumental) {
        /** Llamado de los servicios para las listas */
        if(this.listTipoDocumentalStatus == false) {
          this.getListTipDocu();
        }
        // load the list initial reasing
        // console.log('this.listTipoDocumental');
        this.filteredlistTipoDocumental.next(this.listTipoDocumental.slice());
      }

    });
  }

  ngAfterViewInit(): void {
    this.asignValues();
  }

  asignValues() {
    
    
    if (this.fileForm.controls['isParentFile'].value == true) {
      //console.log('aqui se daña');
      this.inputFile.nativeElement.files = this.fileSelected;
      this.fileForm.controls['fileUpload'].setValue(this.inputFile.nativeElement.files[0]);  
    } else {
      
    }

    //console.log(this.fileForm.controls['fileUpload'].value);
  }

  submitForm() {
    setTimeout(() => {
      this.submitForm2();
    }, this.indexComponent * 2000);
  }

  submitForm2() {
    if (this.fileForm.controls['isSuccessForm'].value == true || this.uploadProcess == true) {
      return;
    } else {
      this.uploadProcess = true;
    }
    
    
    this.uploadValid = false;
    // Loadign true
    //this.sweetAlertService.sweetLoading();///

    let message = '';

    if (!this.fileForm.valid) {
      this.uploadValid = true;
      this.sweetAlertService.sweetInfo('Algo está mal', '');
      // this.dialogRef.close({event: 'close', status: true , data: this.fileForm.value });
    } else {
      const formData = new FormData();
      formData.append('fileUpload', this.fileForm.get('fileUpload').value);
      message = this.translate.instant('Cargando') + '...';
      this.uploadResponse = { status: true, message: message, proccess: 0 };

      let data = {
        ButtonSelectedData: this.dataSend,
        dataForm: this.fileForm.value
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
                message = this.translate.instant('Cargando') + '...';
                this.uploadResponse = { status: true, message: message, proccess: progress - 1 };
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
                          message = this.translate.instant('Completado') + '...';
                          this.uploadResponse = { status: true, message: message, proccess: 100 };
                          //this.sweetAlertService.showSwal('success-message', 'varTextPerfect', responseServiceDecrypt.message);///
                          /** Se envia el indice del componente para redireccionar a listado de documentos cuando
                           * no se tenga nada más por cargar  */
                          // this.router.navigate([ this.redirectionPath ]);
                          this.sweetAlertService.showNotification('success', responseServiceDecrypt.message );
                          
                          this.fileForm.controls['isSuccessForm'].setValue(true);
                          if (this.uploadProcessStatus) {
                          } else {
                            /** Se limpia el formulario */
                            this.limpiarFormulario();
                          }

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
          message = this.translate.instant('Cargando') + '...';
          this.uploadResponse = { status: true, message: message, proccess: 0 };
          this.sweetAlertService.sweetInfoText('El archivo no pudo ser procesado', '');
          this.uploadProcess = false;
          this.uploadValid = true;
        });
        /** Fin Comsumo de servicio  */

      });
    }
  }

  limpiarFormulario(){
    this.fileForm.controls['isSuccessForm'].setValue(false);
    this.uploadProcess = false;
    this.fileForm.controls['idTipoDocumental'].setValue('');
    this.fileForm.controls['fechaDocumento'].setValue('');
    this.fileForm.controls['observacion'].setValue('');
    this.fileForm.controls['fileUpload'].setValue('');
    this.nombreArchivoSeleccionado = "";
    //this.inputFile.nativeElement.value = "";
    //this.inputFile.nativeElement.reset();
  }

  onSelectedFile(event) {

    if (event.target.files.length > 0) {
      this.nombreArchivoSeleccionado = event.target.files[0].name;

      // console.log(event.target.files[0]);

      this.validateFileExtension(event.target.files[0]).then((res) => {
        if (res) {
          // if (event.target.files[0].size > this.maxSize) {
            /*let msjmaxTamanyo: any;
              msjmaxTamanyo = this.translate.instant('Solo es permitido cargar');
              msjmaxTamanyo = msjmaxTamanyo + ' ' + this.maxSizeText;
              this.sweetAlertService.sweetInfoText('El archivo es muy pesado', msjmaxTamanyo );

            this.uploadValid = false;
            this.inputFile.nativeElement.value = '';
            this.nombreArchivoSeleccionado = "";*/
          // } else {
            this.fileForm.controls['fileUpload'].setValue(event.target.files[0]);
            this.uploadValid = true;
          // }
        } else {
          const notificationErrExt = this.translate.instant(this.notificationErrExt);
          this.sweetAlertService.sweetInfoText('Archivo no válido', notificationErrExt + ' ' + this.notificationErrExtArray.join());
          this.uploadValid = false;
          this.inputFile.nativeElement.value = '';
          this.nombreArchivoSeleccionado = "";
        }
      });
    } else {
      this.fileForm.controls['fileUpload'].setValue('');
      this.nombreArchivoSeleccionado = "";
    }
  }

  /**
   * Valida la extensión del archivo que será cargado
   * @param nameFile nombre del archivo a cargar
   */
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

  addRowFileToList(isParentFile: boolean = false) {
    this.addRowFileToListEmiter.emit(isParentFile);
  }

  clearRowFileToList() {
    this.clearRowFileToListEmiter.emit(this.indexComponent);
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
    let search = this.fileForm.controls[nomList + 'Filter'].value;
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

  MatSlideToggleChange(event, tipo) {
    if (event.checked) {

      if (tipo == 'confidencial') {
        this.fileForm.controls['isPublicoRadiDocumento'].setValue(false);
        this.messageInputPublico = 'No';
      } else { // publico
        this.fileForm.controls['confidencial'].setValue(false);
        this.messageInputPublico = 'Si';
      }

    } else {

      if (tipo == 'confidencial') {
        this.fileForm.controls['isPublicoRadiDocumento'].setValue(true);
        this.messageInputPublico = 'Si';
      } else { // publico
        this.fileForm.controls['confidencial'].setValue(true);
        this.messageInputPublico = 'No';
      }

    }
  }

  ngOnDestroy() {
    if (!!this.subscriptionCountSubmitForm) this.subscriptionCountSubmitForm.unsubscribe();
  }

}
