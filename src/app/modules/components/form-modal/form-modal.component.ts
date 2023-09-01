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

import { Component, OnInit, Output, Inject, EventEmitter, Input, AfterViewChecked } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GlobalAppService } from 'src/app/services/global-app.service';
import { RestService } from 'src/app/services/rest.service';
import { environment } from 'src/environments/environment';
import { EncryptService } from 'src/app/services/encrypt.service';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from 'src/app/services/activate-translate.service';

import swal from 'sweetalert2';

export interface DialogData {
  url: any;
  eventSelectData:any;
  fileLabel: string;
}

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-form-modal',
  template: '',
  styleUrls: ['./form-modal.component.css']
})

export class FormModalComponent implements OnInit {

  @Output() public closeModalSendDocsEmiter = new EventEmitter<any>(); // Data a retornar al initial list

  @Input() ruoteServiceDocuments: string; // Ruta para ejecutar la carga del archivo
  @Input() eventClickButtonSelectedData: any; // Ruta para ejecutar la carga del archivo
  @Input() fileLabel: string = 'Seleccione el archivo'; // Label para la seleccion del archivo

  activeLang: string;
  languageReceive: any;
  
  subscriptionTranslateService$: Subscription;

  constructor(
    public sweetAlertService: SweetAlertService, 
    public dialog: MatDialog,
    private translate: TranslateService, 
    private activateTranslateService: ActivateTranslateService,) { 

      this.detectLanguageInitial();
  
  }

  ngOnInit() {
    this.openDialog();
    this.detectLanguageChange();
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


  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog( ) {

    const dialogRef = this.dialog.open(modalDialog, {
      disableClose: false,
      width: '95%',
      data: {
        url:this.ruoteServiceDocuments,
        eventSelectData: this.eventClickButtonSelectedData,
        fileLabel: this.fileLabel
      }
    });
    dialogRef.afterClosed().subscribe( res => {
      let respuesta = res
      if ( !respuesta ) {
        respuesta = {event: 'close', status: false , data: [] };
      }
      this.closeComponent(respuesta);
    });
  }

  /*** Método para cerrar o destruir el componente desde el padre ***/
  closeComponent( respuesta ) {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
    this.closeModalSendDocsEmiter.emit(respuesta);
  }

}

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})

export class modalDialog implements OnInit, AfterViewChecked {

  /**Variable del formulario */
  moduleForm: UntypedFormGroup;
    
  
  @Input() redirectionPath = '/filing/filing-index/false';  // Ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion

  /** Variables File Input */
  uploadProcess: boolean = false;
  uploadValid: boolean = false;
  
  ruoteServiceDocuments: any;
  eventSelectData: any;

  dataSend: object; // Objeto que se envia al back como parametro request
  urlEndSend: any;
  uploadResponse: any = { status: false, message: 'Cargando...', proccess: 50 };
  
  resUploadFile: any;
  resUploadFileErr: any;

  _onDestroy = new Subject<void>();  

  authorization: string;
  versionApi = environment.versionApiDefault;

  resSerlistGeneral: any;
  resSerlistGeneralErr: any;

  listCgRegional: any;       // Tipos CgRegional 
  listCgProveedores: any;    // Tipos CgProveedores 
  listCgEnvioServicio: any;    // Tipos CgEnvioServicio
 
  filteredlistidCgRegional: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistidCgProveedores: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistidCgEnvioServicio: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  
  multiple: boolean = false;
  accept: string = ".png, .jpg, .jpeg";
  color:string = "GREY";

  notificationErrExtArray: any = [];
  notificationErrExt: string = 'Solo es permitido archivos';

  validateFile: any = [{ type: 'pdf' }, { type: 'png' }, { type: 'jpg' }];
  maxSize:number = 5242880; // Maximo de peso permitido por defecto 5MB
  maxSizeText: string = '5MB';

  validatecliente: boolean = false; // Variable para mostrar alerta a usuario

  /** Variables para traer el texto de confirmacion */
  titleMsg: string;
  textMsg: string;
  bntCancelar: string;
  btnConfirmacion: string;
  resSerLenguage: any;

  fileLabel: string;

  constructor( 

    @Inject(MAT_DIALOG_DATA) public data: DialogData, 
    
    private formBuilder: UntypedFormBuilder, 
    private encryptService: EncryptService,
    private http: HttpClient,
    private router:Router,

    public dialogRef: MatDialogRef<modalDialog>, 
    public sweetAlertService: SweetAlertService,  
    public lhs: LocalStorageService, 
    public restService: RestService,
    public globalAppService: GlobalAppService

  ) {
      
    this.fileLabel = this.data.fileLabel;
    
    /**
      * Configuración del formulario
    */
    this.moduleForm = this.formBuilder.group({
  
      numeroGuiaRadiEnvio: new UntypedFormControl('', Validators.compose([
        // Validators.required,
        //Validators.pattern('[a-zA-Z]'),
      ])),
      fileUpload: new UntypedFormControl('', Validators.compose([
        //Validators.required
      ])),
      idCgRegional: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      listCgRegionalFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      idCgProveedores: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      listCgProveedoresFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      idCgEnvioServicio: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      listCgEnvioServicioFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      observacion: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),

    });

  }

  ngOnInit() {

    this.getTokenLS();

    this.moduleForm.controls['listCgRegionalFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listCgRegional');
    });

    this.moduleForm.controls['listCgProveedoresFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listCgProveedores');
    });

    this.moduleForm.controls['listCgEnvioServicioFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listCgEnvioServicio');
    });

    this.ruoteServiceDocuments = this.data.url;
    this.eventSelectData = this.data.eventSelectData;

  }

  ngAfterViewChecked() {
    $('.cdk-global-overlay-wrapper').css('z-index', '1000');
    $('.cdk-overlay-pane').css('overflow', 'auto');
  }


  submitForm() {
    if (this.moduleForm.valid) {
      this.confirm();
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  confirm(){

    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {

      this.resSerLenguage = res;
      // console.log( this.resSerLenguage );
      this.titleMsg = this.resSerLenguage.titleMsg;
      this.textMsg = this.resSerLenguage['textMsgRadiReturn'];
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

        if(result.value){
          this.dialogRef.close({event: 'close', status: true , data: this.moduleForm.value });
        }

      });
    });
  }

  closeDialog() {
    this.validatecliente = false;
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  getTokenLS(){
  
      this.lhs.getToken().then((res: string) => {
      
        this.authorization = res;   
        this.validarCliente();

      }); 
  }

  validarCliente(){

    let params = { 
      eventSelectData: this.eventSelectData
    };
  
    this.restService.restPost(this.versionApi + 'radicacion/transacciones/validar-cliente', params, this.authorization).subscribe((res) => {

      this.resSerlistGeneral = res;
      this.validatecliente = this.resSerlistGeneral['validatecliente'];

        if(!this.validatecliente){
          this.getListGeneral();
        }

      }, (err) => {
        this.resSerlistGeneralErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistGeneralErr).then((res) => { });
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

  /** Datos para Listas desplegables */
  getListGeneral(){
    this.restService.restGet(this.versionApi + 'radicacion/transacciones/index-general-filing-lists', this.authorization).subscribe(
      (data) => {
  
        this.resSerlistGeneral = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistGeneral).then((res) => {
          
          let responseResolveResponse = res;
  
          if (responseResolveResponse == true) {
      
            // Tipo Regionales
            if (this.resSerlistGeneral.dataCgRegionales){
              // load the list initial
              this.listCgRegional = this.resSerlistGeneral.dataCgRegionales;
              this.filteredlistidCgRegional.next(this.listCgRegional.slice());
            }
  
          }
        });
      }, (err) => {
        this.resSerlistGeneralErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistGeneralErr).then((res) => { });
      }
    );
  }

  getSelectsType(){
    
    let params = { 
      idCgRegional:this.moduleForm.controls['idCgRegional'].value,
      idCgProveedores:  this.moduleForm.controls['idCgProveedores'].value,
    };
  
    this.restService.restPost(this.versionApi + 'radicacion/transacciones/list-envio-docs', params, this.authorization).subscribe((res) => {

      this.resSerlistGeneral = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistGeneral).then((res) => {
          
          let responseResolveResponse = res;

            if (responseResolveResponse == true) {
            
                // Tipo Regionales
                if (this.resSerlistGeneral.dataCgProveedor){
                  // load the list initial
                  this.listCgProveedores = this.resSerlistGeneral.dataCgProveedor;
                  this.filteredlistidCgProveedores.next(this.listCgProveedores.slice());
                }

                // Tipo Servicios
                if (this.resSerlistGeneral.dataCgEnvioServicio){
                  // load the list initial
                  this.listCgEnvioServicio = this.resSerlistGeneral.dataCgEnvioServicio;
                  this.filteredlistidCgEnvioServicio.next(this.listCgEnvioServicio.slice());
                }
    
            }

        });

      }, (err) => {
        this.resSerlistGeneralErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistGeneralErr).then((res) => { });
      }
    );
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

      // console.log(event.target.files[0]);

      this.validateFileExtension(event.target.files[0]).then((res) => {
        if (res) {
          if (event.target.files[0].size > this.maxSize) {
            this.sweetAlertService.sweetInfoText('El archivo es muy pesado', 'Solo es permitdo cargar ' + this.maxSizeText);
            this.uploadValid = false;
            // this.inputFile.nativeElement.value = '';
          } else {
            this.moduleForm.controls['fileUpload'].setValue(event.target.files[0]);
            this.uploadValid = true;
          }
        } else {
          this.sweetAlertService.sweetInfoText('Archivo no válido', this.notificationErrExt + ' ' + this.notificationErrExtArray.join());
          this.uploadValid = false;
          // this.inputFile.nativeElement.value = '';
        }
      });
    }
  }

}
