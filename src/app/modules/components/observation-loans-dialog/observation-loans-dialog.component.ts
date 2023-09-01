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

// List
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface DialogData {
  textFormObservaHeader: any;
  titleFecha: any;
  dataDialog: any;
  showSoliPrestamo: any;
  showPass: any;
  prestamoFisico: any;
  observacionModal: any;
  initialNotificationClassAlert: any;
  initialNotificationMessageArray: any;
  textPassword: any;
}

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-observation-loans',
  template: '',
  styleUrls: ['./observation-loans-dialog.component.css']
})
export class ObservationLoansComponent implements OnInit {

  @Output() public closeObservaEmiter = new EventEmitter<any>(); // Data a retornar al initial list
  @Input() textFormObservaHeader: string = ''; // Titulo del formulario observación
  @Input() titleFecha: string = 'fecha'; // Titulo para el campo fecha
  @Input() dataSend: any;
  @Input() showSoliPrestamo: boolean = false; // Muestra campos de solicitud de prestamo
  @Input() showPass: boolean = false; // Muestra campos de acepta prestamo
  @Input() prestamoFisico: boolean = false; // Muestra campos de prestamo fisico
  @Input() observacionModal: boolean = true; // Muestra campo de observacion
  /** Las variables para mostrar la alerta informativa  */
  @Input() initialNotificationClassAlert: string = 'col-lg-12 col-md-12 col-sm-12 col-xs-12 mt-2 alert alert-info alert-with-icon';
  @Input() initialNotificationMessageArray: any = [];
  @Input() textPassword = 'Contraseña del solicitante'; // label de contrasena

  // Variable para dar tamaño al dialog
  widthDialog = '50%';

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog( ) {

    const dialogRef = this.dialog.open( ObservationLoansDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        textFormObservaHeader: this.textFormObservaHeader,
        titleFecha: this.titleFecha,
        dataDialog: this.dataSend,
        showSoliPrestamo: this.showSoliPrestamo,
        showPass: this.showPass,
        prestamoFisico: this.prestamoFisico,
        observacionModal: this.observacionModal,
        initialNotificationClassAlert: this.initialNotificationClassAlert,
        initialNotificationMessageArray: this.initialNotificationMessageArray,
        textPassword: this.textPassword
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
    this.closeObservaEmiter.emit(respuesta);
  }

}

@Component({
  selector: 'app-observation-loans-dialog',
  templateUrl: './observation-loans-dialog.component.html',
  styleUrls: ['./observation-loans-dialog.component.css']
})

export class ObservationLoansDialog implements OnInit, AfterViewChecked {

  /**Variable del formulario */
  moduleForm: UntypedFormGroup;
  validTextType: boolean = false;
  textFormObservaHeader: string; // texto del header
  titleFecha: string;
  botonSubmitIcon: string = 'check_circle_outline'; // Icono del boton
  textPassword: string; // Label de la contrasena
  // Version api
  versionApi = environment.versionApiDefault;
  // Autentificacion
  authorization: string;
  // Variables input
  showSoliPrestamo: boolean; // Muestra los campos de solicitar prestamo
  showPass: boolean; // Muestra los campos de acepta prestamo
  prestamoFisico: boolean; // Muestra el campos fecha
  observacionModal: boolean;

  // Variables para las listas
  listTipoPrestamo: any;
  listRequerimiento: any;
  /** lists filtered + namelist by search keyword */
  filteredlistTipoPrestamo: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistRequerimiento: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  /**Servicios */
  resSerTipPrestamo: any;
  resSerTipPrestamoErr: any;
  resSerRequerimiento: any;
  resSerRequerimientoErr: any;
  /** Las variables para mostrar la alerta informativa  */
  initialNotificationClassAlert: string;
  initialNotificationMessageArray = []; // Mensaje de notificación

  public minDate: Date;
  public maxDate: Date;

  constructor( public dialogRef: MatDialogRef<ObservationLoansDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private formBuilder: UntypedFormBuilder, public sweetAlertService: SweetAlertService, public restService: RestService,
      public globalAppService: GlobalAppService, public lhs: LocalStorageService ) {

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, new Date().getMonth(), new Date().getDate());
    this.maxDate = new Date(currentYear + 1, 11, 31);

    // Asignación de valores que llegan por input
    this.textFormObservaHeader = this.data.textFormObservaHeader;
    this.titleFecha = this.data.titleFecha;
    this.showSoliPrestamo = this.data.showSoliPrestamo;
    this.showPass = this.data.showPass;
    this.prestamoFisico = this.data.prestamoFisico;
    this.observacionModal = this.data.observacionModal;
    this.initialNotificationClassAlert = this.data.initialNotificationClassAlert;
    this.initialNotificationMessageArray = this.data.initialNotificationMessageArray;
    this.textPassword = this.data.textPassword;

    this.moduleForm = this.formBuilder.group({
      observacion: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      /**
       * Campos para Solisitar préstamo
       */
      tipoPrestamo: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      requerimiento: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      /**
       * Campos para Aceptar préstamo
       */
      passUser: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      fecha: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      /**
       * Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listTipoPrestamoFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listRequerimientoFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });

    // Solicita prestamo
    if (this.showSoliPrestamo) {
      this.moduleForm.controls['tipoPrestamo'].setValidators([Validators.required]);
      this.moduleForm.controls['requerimiento'].setValidators([Validators.required]);
    }
    // Acepta prestamo
    if ( this.showPass ) {
      this.moduleForm.controls['passUser'].setValidators([Validators.required]);
    }
    // Préstamo físico
    if ( this.prestamoFisico ) {
      this.moduleForm.controls['fecha'].setValidators([Validators.required]);
    }
    // 
    if(this.observacionModal){ 
      this.moduleForm.controls['observacion'].setValidators([Validators.required]);
    }
  


  }

  ngOnInit() {

    // Hace el llamado del token
    this.getTokenLS();
    // Solicitan prestamo
    if ( this.showSoliPrestamo ) {
      // listen for search field value changes
      this.moduleForm.controls['listTipoPrestamoFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listTipoPrestamo');
      });
      // listen for search field value changes
      this.moduleForm.controls['listRequerimientoFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listRequerimiento');
      });
    }

  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      /** Llamado de los servicios para las listas */
      // Solicitan prestamo
      if ( this.showSoliPrestamo ) {
        this.getTipoPrestamo();
        this.getRequerimiento();
      }

    });
  }

  submitForm() {
    if (this.moduleForm.valid) {
      // console.log( this.moduleForm.value );
      this.dialogRef.close({event: 'close', status: true , data: this.moduleForm.value });
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  ngAfterViewChecked() {
    $('.cdk-global-overlay-wrapper').css('z-index', '1000');
    $('.cdk-overlay-pane').css('overflow', 'auto');
  }

  closeDialog() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  // Llama la lista de tipo prestamo
  getTipoPrestamo() {

    this.restService.restGet(this.versionApi + 'gestionArchivo/prestamo-documental/index-list-type', this.authorization).subscribe(
      (data) => {
        this.resSerTipPrestamo = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerTipPrestamo).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listTipoPrestamo = this.resSerTipPrestamo.data;
            // load the list initial reasing
            this.filteredlistTipoPrestamo.next(this.listTipoPrestamo.slice());
          }
        });
      }, (err) => {
        this.resSerTipPrestamoErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerTipPrestamoErr).then((res) => { });
      }
    );
  }

  // Llama la lista de tipo prestamo
  getRequerimiento() {

    this.restService.restGet(this.versionApi + 'gestionArchivo/prestamo-documental/index-list-request', this.authorization).subscribe(
      (data) => {
        this.resSerRequerimiento = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerRequerimiento).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listRequerimiento = this.resSerRequerimiento.data;
            // load the list initial reasing
            this.filteredlistRequerimiento.next(this.listRequerimiento.slice());
          }
        });
      }, (err) => {
        this.resSerRequerimientoErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerRequerimientoErr).then((res) => { });
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