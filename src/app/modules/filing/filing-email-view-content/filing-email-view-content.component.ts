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

import { Component, OnInit, Input, Output, Inject, EventEmitter, AfterViewChecked, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { UntypedFormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { RestService } from '../../../services/rest.service';
import { GlobalAppService } from '../../../services/global-app.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ChangeChildrenService } from '../../../services/change-children.service';

export interface DialogData {
  dataDialog: any;
}

@Component({
  selector: 'app-filing-email-view-content',
  template: '',
  styleUrls: ['./filing-email-view-content.component.css']
})
export class FilingEmailViewContentComponent implements OnInit, AfterViewChecked {

  @Input() dataViewContent: any; // Data recibida (Informacion del correo seleccionado)
  @Input() mailBox: string; // Bandeja de correo
  @Input() authorization: string; // Data recibida (Informacion del correo seleccionado)
  @Output() public closeViewContentEmiter = new EventEmitter<any>(); // Data a retornar al initial list

  constructor(public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
    this.openDialog();
  }

  ngAfterViewChecked() {
    $('.cdk-global-overlay-wrapper').css('z-index', '1000');
    $('.cdk-overlay-pane').css('overflow', 'auto');
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog() {

    const dialogRef = this.dialog.open(FilingEmailViewContentDialog, {
      disableClose: false,
      width: '95%',
      data: {
        dataViewContent: this.dataViewContent,
        authorization: this.authorization,
        mailBox: this.mailBox
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      let respuesta = res
      if (!respuesta) {
        respuesta = { event: 'close', status: false, data: [] };
      }
      // console.log('Respuesta al cerrar el dialogo');
      // console.log(respuesta);
      this.closeComponent(respuesta);
    });
  }

  /*** Método para cerrar o destruir el componente desde el padre ***/
  closeComponent(respuesta) {
    this.closeViewContentEmiter.emit(respuesta);
  }

}


@Component({
  selector: 'app-filing-email-view-content-dialog',
  templateUrl: './filing-email-view-content.component.html',
  styleUrls: ['./filing-email-view-content.component.css']
})

export class FilingEmailViewContentDialog implements OnInit, OnDestroy {

  /** Propiedades del Filter List */
  // Propiedades agregadas
  @Input() initCardHeaderStatus: boolean = true; // Controla el header del panel/card
  @Input() initCardHeaderIcon: string = 'contact_mail'; // Icono del header del panel/card
  @Input() initCardHeaderTitle: string = 'Asunto'; // Título del header del panel/card
  @Input() routeLoadDataTablesService: string; // servicio utilizado para el retorno de los datos del dt
  @Input() botonSubmitIcon: string = 'search'; // icono del botón
  @Input() isredirectionPath: boolean = true; // Define si se utiliza la redireccion en caso de no tener permisos de acceso
  @Input() redirectionPath: string = '/dashboard'; // ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  @Input() routeData: string; // nombre del módulo de la data a la que se esta accediendo
  routeSubmit: string; // Ruta del submit

  /** Informacion y detalles del correo */
  mailBox: string;
  dataViewContent: any = {};

  authorization: string;
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  
  isBodyHtml: boolean = true;
  mailBody: any = "";
  vistaDisponible: string = "";

  nombreCliente: string = "";
  correoElectronicoCliente: string = "";
  asuntoRadiRadicado: string = "";
  date: string = "";
  
  attachment: any[] = [];
  attachmentString: string = "";
  /** Informacion y detalles del correo */

  form = new UntypedFormGroup({});
  model = {
    filterOperation: [{}],
  };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  subscriptionCloseComponentService: any;

  constructor(
    public dialogRef: MatDialogRef<FilingEmailViewContentDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public sweetAlertService: SweetAlertService, public restService: RestService, public globalAppService: GlobalAppService,
    private lhs: LocalStorageService, private authService: AuthService,
    private changeChildrenService: ChangeChildrenService
  ) { }

  ngOnInit() {
    this.dataViewContent = this.data['dataViewContent'];
    this.authorization = this.data['authorization'];
    this.mailBox = this.data['mailBox'];

    this.nombreCliente = this.dataViewContent['fromName'];
    this.correoElectronicoCliente = this.dataViewContent['fromAddress'];
    this.asuntoRadiRadicado = this.dataViewContent['subject'];
    this.date = this.dataViewContent['date'];

    this.getTokenLS();
    this.requestToModalService();
  }

  /** Método para obtener el token que se encuentra encriptado en el local storage */
  getTokenLS() {
    /** Se consulta solo si el token no se recibió como Input() */
    if (this.authorization == '' || this.authorization == null) {
      this.lhs.getToken().then((res: string) => {
        this.authorization = res;
        this.onSearchMail(this.dataViewContent.id, this.authorization);
      });
    } else {
      this.onSearchMail(this.dataViewContent.id, this.authorization);
    }
  }

  /** Caonsulta de correo seleccionado */
  onSearchMail(id, authorization) {
    this.sweetAlertService.sweetLoading();

    let dataUser =  this.authService.decryptAES(localStorage.getItem(environment.hashMailSkina));

    let params = {
      id: id,
      dataEmail: dataUser,
      mailBox: this.mailBox
    };

    this.restService.restGetParams(environment.versionApiDefault + 'radicacion/radicacion-email/read-email-content', params, authorization).subscribe(
      (res) => {
        this.responseServiceFormSubmit = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceFormSubmit, false).then((res) => {
          let responseResolveResponse = res;
          
          if (responseResolveResponse == true) {
            if (this.responseServiceFormSubmit.data) {
              this.mailBody = this.responseServiceFormSubmit.data.mailBody;
              this.isBodyHtml = this.responseServiceFormSubmit.data.isBodyHtml;
              this.vistaDisponible = this.responseServiceFormSubmit.data.vistaDisponible;
              this.nombreCliente = this.responseServiceFormSubmit.data.nombreCliente;
              this.correoElectronicoCliente = this.responseServiceFormSubmit.data.correoElectronicoCliente;
              this.asuntoRadiRadicado = this.responseServiceFormSubmit.data.asuntoRadiRadicado;
              this.date = this.responseServiceFormSubmit.data.date;
              this.attachment = this.responseServiceFormSubmit.data.attachment;
              this.attachmentString = this.responseServiceFormSubmit.data.attachmentString;
            }
          } else {
            this.dialogRef.close({ event: 'close', status: false, data: [] });
          }
          this.sweetAlertService.sweetClose();
          
        });
      }, (err) => {
        this.responseServiceFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, false).then((res) => { });
        this.sweetAlertService.sweetClose();
        this.dialogRef.close({ event: 'close', status: false, data: [] });
      }
    );
  }

  requestToModalService() {
    this.subscriptionCloseComponentService = this.changeChildrenService.closeComponent.subscribe(emit => {
      this.dialogRef.close({ event: 'close', status: false, data: [] });
    });
  }

  ngOnDestroy() {
    if (!!this.subscriptionCloseComponentService) this.subscriptionCloseComponentService.unsubscribe();
  }

}
