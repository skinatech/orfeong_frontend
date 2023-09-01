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

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { EncryptService } from 'src/app/services/encrypt.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import swal from 'sweetalert2';
import { RestService } from '../../../services/rest.service';

@Component({
  selector: 'app-upload-files-question',
  templateUrl: './upload-files-question.component.html',
  styleUrls: ['./upload-files-question.component.css']
})
export class UploadFilesQuestionComponent implements OnInit {

  moduleForm: UntypedFormGroup;

  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;


  @Output() public submitFormEmit = new EventEmitter<any>();

  // Nombre de tarjetas del formulario
  @Input() textForm = 'Carga de archivos';
  // Valida tipo texto
  validTextType: boolean = false;
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'attachment';
  /** Extensiones validas */
  @Input() validateFile: any = [{ type: 'xls' }, { type: 'xlsx' }];
  @Input() validateFileRequired: boolean = true; // Valida si el campo es obligatorio
  // Si el servicio debe filtrar algo por ID este será el input para enviar ese dato (En este caso el idRenta)
  @Input() ruoteServiceDocuments: string; // Ruta para ejecutar la carga del archivo
  
  urlEndSend: any;
  /** Response upload service */
  @Input() uploadResponse: any = { status: false, message: 'Cargando...', proccess: 50 };
  @Input() maxSize: number = 2097152; // Maximo de peso permitido por defecto 2MB
  @Input() maxSizeText: string = '2MB';
  @Input() dataSend: object; // Objeto que se envia al back como parametro request
  @Input() showInputFile: boolean = false; // Recibe el estado del input
  @Input() idSend: string; // Id de la renta
  @Input() idPregunta: any; // Id de la Pregunta
  @Input() dataAttachment: any; // Array para almacenar los documentos
  validaShowAttachment: boolean = false; // Muestra los icosnos de los archivos cargados 

  authorization: any;
  notificationErrExtArray: any = [];
  notificationErrExt: string = 'Solo es permitido archivos';

  alertStatusForm: boolean = false;
  alertMaxSizeFile: boolean = false;
  alertStatusFormText: string;
  versionApi: string = environment.versionApiDefault;

  uploadValid: boolean = false;
  uploadProcess: boolean = false;
  /** variables del componente para el boton  */
  iconMenu = 'attachment';
  styleButtonFloat = { 'display': 'inline-block'};
  styleButtonIcon = { 'width': '50px', 'height': '50px' };
  styleIcon = { 'margin-top': '-08px' };

  initBotonDeleteRoute: string = '/setting/fee-create'; // Ruta del botón Borrar
  initBotonDownloadRoute: string = '/setting/fee-create'; // Ruta del botón Descargar
  menuButtons: any = [
    { icon: 'cloud_download', title: 'Descargar', action: 'download', data: '' },
    { icon: 'delete_forever', title: 'Borrar', action: 'delete', data: '' },
  ];

  /** Variables de consumo de servicios */
  responseService: any;
  responseServiceErr: any;
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;

  statusInitialScroll: boolean = false; // Posicionar automaticamente el scroll al inicio del componente

  @Input() redirectionPath = '/dashboard'; // Ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion

  @Output() public uploadSuccessFileEmiter = new EventEmitter<any>();

  constructor(private formBuilder: UntypedFormBuilder, private http: HttpClient, public lhs: LocalStorageService, private sweetAlertService: SweetAlertService, private encryptService: EncryptService, private globalAppService: GlobalAppService, public restService: RestService ) {
    /**
     * Configuración del formulario para el login
     */
    this.moduleForm = this.formBuilder.group({
      fileUpload: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.getTokenLS();
    this.onAttchment();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
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
          this.notificationErrExtArray.push("." + element.type);
          if (extension == element.type) {
            extensionAcepted = true;
          }
        });
      resolve(extensionAcepted);
    });
  }

  onSelectedFile(event) {

    if (event.target.files.length > 0) {

      this.validateFileExtension(event.target.files[0]).then((res) => {
        if (res) {
          // if (event.target.files[0].size > this.maxSize) {
            /*this.sweetAlertService.sweetInfoText('El archivo es muy pesado', 'Solo es permitido cargar ' + this.maxSizeText);
            this.uploadValid = false;
            this.moduleForm.controls['fileUpload'].setValue('');*/
          // } else {
            this.moduleForm.controls['fileUpload'].setValue(event.target.files[0]);
            this.uploadValid = true;
          // }
        } else {
          this.sweetAlertService.sweetInfoText('Archivo no válido', this.notificationErrExt + ' ' + this.notificationErrExtArray.join());
          this.uploadValid = false;
          this.moduleForm.controls['fileUpload'].setValue('');

        }
      });
    } else {
      this.moduleForm.controls['fileUpload'].setValue('');
    }

  }

  submitForm() {

    this.dataSend['idPregunta'] = this.idPregunta;

    this.uploadValid = false;

    if ( this.validateFileRequired && this.moduleForm.get('fileUpload').value == '' ) {

      this.uploadValid = true;
      this.sweetAlertService.sweetInfoText('Seleccione un archivo valido', '');

    } else {
      this.uploadProcess = true;

      const formData = new FormData();
      formData.append('fileUpload', this.moduleForm.get('fileUpload').value);

      this.uploadResponse = { status: true, message: 'Cargando...', proccess: 0 };

      this.encryptService.generateRouteGetParams( environment.apiUrl + this.ruoteServiceDocuments, this.dataSend, this.authorization).then((res) => {
        this.urlEndSend = res;

        /** Comsumo de servicio  */
        this.http.post(this.urlEndSend, formData, {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.authorization,
            'language': 'es'
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
                    const responseServiceDecrypt: any = res;
                    // console.log(responseServiceDecrypt);
                    // Evaluar respuesta del servicio
                    this.globalAppService.resolveResponse(responseServiceDecrypt, true, this.redirectionPath).then((res) => {
                      const responseResolveResponse = res;
                      if (responseResolveResponse == true) {
                        // Muestra la barra de proceso en 0 y la oculta
                        this.uploadResponse = { status: false, message: 'Completado', proccess: 0 };
                        // Muestra el input para cargar otro archivo
                        this.uploadProcess = false;
                        // Muestra el mensaje de archivo cargado
                        this.sweetAlertService.showSwal('success-message', 'Perfecto!', responseServiceDecrypt.message);
                        // Agergar datos del nuevo documento cargado al array de documentos
                        this.addDataAttachment(responseServiceDecrypt.data.idRentaDocumento, responseServiceDecrypt.data.nomRentaDocumentos);
                          /** Se envia el indice del componente para redireccionar a listado de documentos
                           * cuando no se tenga nada más por cargar
                           */
                      } else {
                        this.uploadProcess = false;
                        this.uploadValid = false;
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
          this.globalAppService.resolveResponseError(this.responseServiceErr, true, this.redirectionPath).then((res) => { });
          this.uploadResponse = { status: true, message: 'Cargando...', proccess: 0 };
          this.sweetAlertService.sweetInfoText('El archivo no pudo ser procesado', '');
        });
        /** Fin Comsumo de servicio  */

      });
    }
  }

  /** Método para agregar un registro al array de documentos */
  addDataAttachment(id, name) {
    if (id != null) {
      this.dataAttachment.push({ idRentaDocumento: id, nombre: name });
      this.validaShowAttachment = true;
    }
  }

  onChangeShowFile(event) {
    // console.log( event );
    this.showInputFile = !this.showInputFile;
    /** Si ya no aplica a la pregunta se eliminan los documentos */
    if (this.showInputFile === false  ) {
      this.onRemoveQuestion();
    }

    this.onApplyQuestion();
  }

  /** Funcion que habilita el boton para guardar la  */
  onApplyQuestion() {
    if (!this.validateFileRequired) {
      /** Habilita el boton para realizar consumo de servicio sin enviar archivo */
      this.uploadValid = true;
    }
  }

  /** Recorre los documentos */
  onAttchment() {
    if ( this.dataAttachment.length > 0 ) {
      this.showInputFile = true;
      this.dataAttachment.forEach( element => {
        if ( element.idRentaDocumento != null ) {
          this.validaShowAttachment = true;
        }
      });
    }
  }

  /** Elimina la pregunta que ya se aplico */
  onRemoveQuestion() {

    const data = { idRenta: this.idSend, idPregunta: this.idPregunta };

    /** Valida si tiene documentos o respuestas */
    if ( this.dataAttachment.length > 0 ) {
      /** Muestra mensaje solo cuando tiene una respuesta */
      swal({
        title: '¿No aplica a la pregunta?',
        text: 'Si el cliente no aplica a la pregunta se eliminarán los documentos adjuntos.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Si, No aplica!',
        cancelButtonText: 'Cancelar',
         buttonsStyling: false
      }).then((result) => {
        // console.log(result);
        if (result.value) {

          this.restService.restPost(environment.versionApiDefault + 'rentas/renta-cuestionario-respuestas/delete-respuesta', data, this.authorization)
            .subscribe((res) => {
              this.responseServiceFormSubmit = res;
              // Evaluar respuesta del servicio
              this.globalAppService.resolveResponse(this.responseServiceFormSubmit, false ).then((res) => {
                const responseResolveResponse = res;

                if (responseResolveResponse == true) {

                  // Quita el valor del archivo 
                  this.dataAttachment.forEach(function(currentValue, index, arr) {
                      arr.splice( index, 1 );
                  });

                  this.sweetAlertService.showSwal('success-message', 'Perfecto!', this.responseServiceFormSubmit.message);
                }
              });
            }, (err) => {
              this.responseServiceFormSubmitErr = err;
              // Evaluar respuesta de error del servicio
              this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, false ).then((res) => { });
            }
          );

        } else {
          this.showInputFile = true;
        }
      });

    }

  }

  onDownloadPDF( idRentaDocumento, nombreDoc ) {

    const data = { idRentaDocumento: idRentaDocumento };

    this.restService.restPost(environment.versionApiDefault + 'rentas/renta-documentos/download-base64', data, this.authorization)
      .subscribe((res) => {
        this.responseServiceFormSubmit = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceFormSubmit, false ).then((res) => {
          const responseResolveResponse = res;

          if (responseResolveResponse == true) {
            this.downloadFile( this.responseServiceFormSubmit.datafile, nombreDoc );
          }
        });
      }, (err) => {
        this.responseServiceFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, false ).then((res) => { });
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
		const downloadLink = document.createElement("a");

		downloadLink.href = linkSource;
		downloadLink.download = nameDownload;
		downloadLink.click();
  }
  

  /**
   *
   * @param event
   * @param id IdRentaDocumento
   * @param nombreDoc nombre del documento
   * Procesando las opciones del menu flotante
   *
   */
  menuReceiveData(event, id, nombreDoc ) {

    /**
     * id Es el idRentaDocumento Numero del documento
     * idSend Es el idRenta Numero de la renta
     * nombreDoc nombre del documento para la funcion de descarga
     */
    switch (event.action) {
      case 'delete':
        this.onDeleteAttachment( id );
      break;
      case 'download':
        this.onDownloadPDF( id, nombreDoc );
      break;
    }
  }

  onDeleteAttachment( idRentaDocumento ) {

    const data = { idRentaDocumento: idRentaDocumento, idRenta: this.idSend };
    
    swal({
      title: '¿Está seguro?',
      text: '¿Desea eliminar el documento adjunto?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Si, Borrar!',
      cancelButtonText: 'Cancelar',
       buttonsStyling: false
    }).then((result) => {
      if (result.value) {

        this.restService.restPost(environment.versionApiDefault + 'rentas/renta-cuestionario-respuestas/delete-document', data, this.authorization)
          .subscribe((res) => {
            this.responseServiceFormSubmit = res;
            // Evaluar respuesta del servicio
            this.globalAppService.resolveResponse(this.responseServiceFormSubmit, false ).then((res) => {
              const responseResolveResponse = res;

              if (responseResolveResponse == true) {

                // Quita el valor del archivo 
                this.dataAttachment.forEach(function(currentValue, index, arr) {
                  if ( arr[index].idRentaDocumento == idRentaDocumento) {
                    arr.splice( index, 1 );
                  }
                });

                this.sweetAlertService.showSwal('success-message', 'Perfecto!', this.responseServiceFormSubmit.message);

              }
            });
          }, (err) => {
            this.responseServiceFormSubmitErr = err;
            // Evaluar respuesta de error del servicio
            this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, false ).then((res) => { });
          }
        );

      }
    });

  }

}
