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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject, Subject } from 'rxjs';
import { ListaBusq, DialogData } from './interface/send-reply-mail-dialog.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-send-reply-mail',
  template: '',
  styleUrls: ['./send-reply-mail-dialog.component.css']
})
export class SendReplyMailComponent implements OnInit {

  @Output() public closeModalEmiter = new EventEmitter<any>(); // Data a retornar al initial list
  @Input() dataSend: any;

  // Variable para dar tamaño al dialog
  widthDialog = '95%';

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog( ) {

    const dialogRef = this.dialog.open( SendReplyMailDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        dataSend: this.dataSend,
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
  selector: 'app-send-reply-mail-dialog',
  templateUrl: './send-reply-mail-dialog.component.html',
  styleUrls: ['./send-reply-mail-dialog.component.css']
})

export class SendReplyMailDialog implements OnInit, AfterViewChecked {

  /**Variable del formulario */
  moduleForm: UntypedFormGroup;

  // Version api
  versionApi = environment.versionApiDefault;

  // Autentificacion
  authorization: string;

  userOrigen: any; // Muestra los usuarios que tramitan los radicados

  textFormInputDate: string = 'Fecha de agendación'; // i18
  textFormObserva: string; // Texto principal del formulario
  botonSubmitIcon: string = 'check_circle_outline'; // Icono del boton

  // Variables se consumos de servicios
  resSerlistDocuments: any; // Lista de pendencias
  resSerlistDocumentsErr: any; // Lista de pendencias

  dataSend: any;

  arrayDocuments: any = [];

  params: any = {}; // parametros que envia en un servici
  resSerlistUsuarios: any; // Lista de usuarios
  resSerlistUsuariosErr: any; // Lista de usuarios
  resSerlistUsuariosExt: any; // Lista de usuarios externos
  resSerlistUsuariosExtErr: any; // Lista de usuarios externos
  listUsuariosInfo: any;
  listUsuariosInfoExt: any;
  listUsuarios: any;
  filteredlistUsuarios: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistUsuariosInfo: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  resSerlistDependencias: any; // Lista de pendencias
  resSerlistDependenciasErr: any; // Lista de pendencias
  listDependencias: any;
  listDependenciasInfo: any;
  filteredlistDependenciasInfo: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistDependencias: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  _onDestroy = new Subject<void>();
  messageRadioInfo = 'No'; // Mensaje de radio button para informar usuarios externos
  showExternalUser:boolean = false; // agrega el mostrar usuarios externos para informar
  filteredlistUsuariosInfoExt: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  isSlideChecked = true;
  messageRadioInfoEmail = 'Si';

  constructor( public dialogRef: MatDialogRef<SendReplyMailDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private formBuilder: UntypedFormBuilder, public sweetAlertService: SweetAlertService, public restService: RestService,
      public globalAppService: GlobalAppService, public lhs: LocalStorageService, private translate: TranslateService)
  {

    this.dataSend = this.data.dataSend;
    
    /**
    * Configuración del formulario
    */
    this.moduleForm = this.formBuilder.group({
      observacion: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      idDependenciasInfo: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      idUsuariosInfo: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      infoUserExt: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      userClient: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      idUsuariosExternos: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      listDependenciasInfoFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listUsuariosInfoFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listUsuariosInfoExtFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();

    this.moduleForm.controls['listUsuariosInfoFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listUsuariosInfo');
      });
    
    this.moduleForm.controls['listUsuariosInfoExtFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listUsuariosInfoExt');
      });
  }

  ngAfterViewChecked() {
    $('.cdk-global-overlay-wrapper').css('z-index', '1000');
    $('.cdk-overlay-pane').css('overflow', 'auto');
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      /** Llamado de los servicios para las listas */
      this.getDocumentsSendReplyMail();
      this.getListDependencia();
    });
  }

  resServicesSendEmailCli: any;
  resServicesSendEmailCliErr: any;

  submitForm() {

    /** Mensajes de internacionalización con servicio  translate*/
    const titleMsg = this.translate.instant('titleMsg');
    const textMsg = this.translate.instant('textMsgSendMail') + this.radiSendReplyEMail;
    const bntCancelar = this.translate.instant('bntCancelarSendMail');
    const btnConfirmacion = this.translate.instant('btnConfirmacionSendMail');

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

        // loading true
        this.sweetAlertService.sweetLoading();

        let data = {
          dataSend: this.dataSend,
          selectedRows: this.selectedRows,
          sendMail: this.moduleForm.value
        }

        this.restService.restPut( this.versionApi + 'radicacion/transacciones/send-reply-mail', data, this.authorization)
          .subscribe((res) => {
            this.resServicesSendEmailCli = res;

            // Evaluar respuesta del servicio
            this.globalAppService.resolveResponse(this.resServicesSendEmailCli, false).then((res) => {
              let responseResolveResponse = res;
              if (responseResolveResponse == true) {
                this.sweetAlertService.showNotification( 'success', this.resServicesSendEmailCli.message );
                // loading false
                this.sweetAlertService.sweetClose();
                this.dialogRef.close({event: 'close', status: true , data: [] });
              }
            });
          }, (err) => {
            this.resServicesSendEmailCliErr = err;
            // Evaluar respuesta de error del servicio
            this.globalAppService.resolveResponseError(this.resServicesSendEmailCliErr, false).then((res) => { });
          }
        );
        
      }
    });

  }

  closeDialog() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  // Llama la lista de documentos
  getDocumentsSendReplyMail() {

    // loading true
    this.sweetAlertService.sweetLoading();

    let data = this.dataSend;

    this.restService.restGetParams(this.versionApi + 'radicacion/documentos/get-documents-send-reply-mail', data, this.authorization).subscribe(
      (data) => {
        this.resSerlistDocuments = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistDocuments).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.arrayDocuments = this.resSerlistDocuments.data;
            this.radiSendReplyEMail = this.resSerlistDocuments.radiSendReplyEMail;
            // loading false
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.resSerlistDocumentsErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistDocumentsErr).then((res) => { });
      }
    );
  }

  selectedRows: any = [];
  radiSendReplyEMail: string = '';
  clickRow(data) {
    if (this.arrayDocuments[data.index]['rowSelect'] == true) {
      this.arrayDocuments[data.index]['rowSelect'] = false;

      let indexSearch = this.selectedRows.indexOf(this.arrayDocuments[data.index]);
      this.selectedRows.splice(indexSearch, 1);
    } else {
      this.arrayDocuments[data.index]['rowSelect'] = true;
      this.arrayDocuments[data.index]['idInitialList'] = data.index;

      this.selectedRows.push(this.arrayDocuments[data.index]);
    }
  }

  getListUsuarios( dataDepe, campo, includeUserLogin = false ) {
    // loading true
    this.sweetAlertService.sweetLoading();

    this.params = {
      idDependencia: dataDepe,
      includeUserLogin: includeUserLogin, // true = Indica al servicio que retorne el usuario que se encuentra logueado
    };

    this.restService.restGetParams(this.versionApi + 'user/index-list-by-depe', this.params, this.authorization).subscribe(
      (data) => {
        this.resSerlistUsuarios = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistUsuarios).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {

            switch (campo) {
              case 'destino':
                  this.listUsuarios = this.resSerlistUsuarios.data;
                  // load the list initial
                  this.filteredlistUsuarios.next(this.listUsuarios.slice());
              break;
              case 'informa':
                  this.listUsuariosInfo = this.resSerlistUsuarios.data;
                  // load the list initial
                  this.filteredlistUsuariosInfo.next(this.listUsuariosInfo.slice());
              break;
            }

          }
          // loading false
          this.sweetAlertService.sweetClose();
        });
      }, (err) => {
        this.resSerlistUsuariosErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistUsuariosErr).then((res) => { });
      }
    );
  }

  getListDependencia() {
    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restGet(this.versionApi + 'gestionDocumental/trd-dependencias/index-list', this.authorization).subscribe(
      (data) => {
        this.resSerlistDependencias = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistDependencias).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listDependencias = this.resSerlistDependencias.data;
            this.listDependenciasInfo = this.resSerlistDependencias.data;
            // load the list initial informacition
            this.filteredlistDependenciasInfo.next(this.listDependenciasInfo.slice());
            // load the list initial reasing
            this.filteredlistDependencias.next(this.listDependencias.slice());
          }
          // loading false
          this.sweetAlertService.sweetClose();
        });
      }, (err) => {
        this.resSerlistDependenciasErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistDependenciasErr).then((res) => { });
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

  /**
   * Función que muestra los informados de usuarios externos
   * @param eventr recibe true o falase
   */
   MatSlideToggleChange(event) {
    if (event.checked) {
      this.messageRadioInfo = 'Si';
      this.showExternalUser = true; // Puede seleccionar muchos usuarios externos

      if ( !this.listUsuariosInfoExt ) {
        // consulta los usuarios externos
        this.getListUsuariosExt();
      }

    } else {
      this.messageRadioInfo = 'No';
      this.showExternalUser = false; // No selecciona ninguno y limpia el campo
      this.moduleForm.controls['idUsuariosExternos'].setValue('');
    }
  }

  // Para tomar la opción de enviar notificación solo al funcionario o al cliente tambien
  MatSlideToggleChangeEmail(event) {
    if (event.checked) {
      this.messageRadioInfoEmail = 'Si';
    } else {
      this.messageRadioInfoEmail = 'No';
    }
  }

  // Llama la lista de los usuarios externos
  getListUsuariosExt() {

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restGetParams(this.versionApi + 'configuracionApp/cg-gestion-terceros/index-list-client', this.params, this.authorization).subscribe(
      (data) => {
        this.resSerlistUsuariosExt = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistUsuariosExt).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {

              this.listUsuariosInfoExt = this.resSerlistUsuariosExt.data;
              // load the list initial
              this.filteredlistUsuariosInfoExt.next(this.listUsuariosInfoExt.slice());

          }
          // loading false
          this.sweetAlertService.sweetClose();
        });
      }, (err) => {
        this.resSerlistUsuariosExtErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistUsuariosExtErr).then((res) => { });
      }
    );

  }

}
