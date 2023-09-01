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
import { ThemePalette} from '@angular/material/core';

// List
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface DialogData {
  dataDialog: any;
  isNewReportStatusInput: any;
  nombreReportePersonalizado: any;
  observacionValue: any
  showCustomReport: any;
  showAgenda: any;
  showReasignacion: any;
  showVOBO: any;
  showInformar: any;
  showCopyInformaded: any;
  textFormObservaHeader: any;
  dataObserva: any;
  showMotivoDevolucion: any;
}

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-observation',
  template: '',
  styleUrls: ['./observation-dialog.component.css']
})
export class ObservationComponent implements OnInit {

  @Output() public closeObservaEmiter = new EventEmitter<any>(); // Data a retornar al initial list
  @Input() textFormObserva: string = 'Observación'; // i18
  @Input() textFormInputDate: string = 'Fecha de agendación'; // i18
  @Input() titleSubmit: string = 'Guardar';
  @Input() isNewReportStatusInput: boolean = false; // Muestra el campo isNewReport
  @Input() nombreReportePersonalizado: string = ''; // Descripción del repote
  @Input() observacionValue: string = ''; // Observación del repote
  @Input() showCustomReport: boolean = false; // Muestra los campos del reporteador
  @Input() showAgenda: boolean = false; // Muestra el input de fecha
  @Input() showReasignacion: boolean = false; // Muestra los inputs de reasignacion
  @Input() showVOBO: boolean = false; // Muestra los inputs de VOBO (Visto Bueno)
  @Input() showInformar: boolean = false; // Muestra los inputs de Informar a
  @Input() showMotivoDevolucion: boolean = false; // Mostrar los motivos de devolucion
  @Input() showCopyInformaded: boolean = false; // Muestra el input de copiar informado
  @Input() textFormObservaHeader: string = ''; // Titulo del formulario observación
  @Input() dataObserva: any;

  // Variable para dar tamaño al dialog
  widthDialog = '50%';

  public minDate: Date;
  public maxDate: Date;

  constructor( public dialog: MatDialog) {

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear);
    this.maxDate = new Date(currentYear + 1, 11, 31);

  }

  ngOnInit() {
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog( ) {

    if ( this.showReasignacion || this.showCopyInformaded ) {
      this.widthDialog = '75%';
    }

    const dialogRef = this.dialog.open( ObservationDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        dataDialog: this.textFormObserva,
        isNewReportStatusInput: this.isNewReportStatusInput,
        nombreReportePersonalizado: this.nombreReportePersonalizado,
        observacionValue: this.observacionValue,
        showCustomReport: this.showCustomReport,
        showAgenda: this.showAgenda,
        showReasignacion: this.showReasignacion,
        showVOBO: this.showVOBO,
        showInformar: this.showInformar,
        showMotivoDevolucion: this.showMotivoDevolucion,
        showCopyInformaded: this.showCopyInformaded,
        textFormObservaHeader: this.textFormObservaHeader,
        dataObserva: this.dataObserva,
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
  selector: 'app-observation-dialog',
  templateUrl: './observation-dialog.component.html',
  styleUrls: ['./observation-dialog.component.css']
})

export class ObservationDialog implements OnInit, AfterViewChecked {

  /**Variable del formulario */
  moduleForm: UntypedFormGroup;
  validTextType: boolean = false;
  // Version api
  versionApi = environment.versionApiDefault;
  // Autentificacion
  authorization: string;
  // Formulario de fecha
  isNewReportStatusInput: boolean = false // Muestra el campo isNewReport
  nombreReportePersonalizado: string = ''; // Descripción del repote
  observacionValue: string = ''; // Observación del repote
  showCustomReport: boolean = false // Muestra los campos del reporteador
  showAgenda: boolean = false; // Muestra el input de fecha
  showReasignacion: boolean = false; // Muestra los inputs de reasignacion
  showVOBO: boolean = false; // Muestra los inputs de VOBO (VOBO)
  showInformar: boolean = false; // Muestra los inputs de Informar
  showCopyInformaded: boolean = false; // Muestra los inputs de Copiar informado
  showMotivoDevolucion: boolean = false; // Muestra los inputs de Informar a
  showUserOrigen: boolean = false; // Muestra los inputs de Informar
  textFormObservaHeader: string; // texto del header
  dataObserva: any; // Data que se recibe para mostrar tramitadores

  userOrigen: any; // Muestra los usuarios que tramitan los radicados

  textFormInputDate: string = 'Fecha de agendación'; // i18
  textFormObserva: string; // Texto principal del formulario
  botonSubmitIcon: string = 'check_circle_outline'; // Icono del boton
  // Variables se consumos de servicios
  resSerlistDependencias: any; // Lista de pendencias
  resSerlistDependenciasErr: any; // Lista de pendencias
  resSerlistUsuarios: any; // Lista de usuarios
  resSerlistUsuariosErr: any; // Lista de usuarios
  resSerlistUsuariosExt: any; // Lista de usuarios externos
  resSerlistUsuariosExtErr: any; // Lista de usuarios externos

  resSerlistMotivoDevolucion: any; // Lista de motivos devolucion
  resSerlistMotivoDevolucionErr: any; // Lista motivos devolucion


  // Variables para las listas
  listDependenciasInfo: any;
  listUsuariosInfo: any;
  listUsuariosInfoExt: any;
  listDependencias: any;
  listUsuarios: any;
  listMotivoDevolucion: any;

  params: any = {}; // parametros que envia en un servici

  /** lists filtered + namelist by search keyword */
  // Filtros de informacion
  filteredlistDependenciasInfo: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistUsuariosInfo: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistUsuariosInfoExt: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  // Filtros de reaisgnacion
  filteredlistDependencias: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistUsuarios: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  // Filtros Motivo devolucion
  filteredlistMotivoDevolucion: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  public minDate: Date;
  public maxDate: Date;

  /** slide-toggle  */
  color: ThemePalette = 'primary';

  messageRadioInfo = 'No'; // Mensaje de radio button para informar usuarios externos
  showExternalUser:boolean = false; // agrega el mostrar usuarios externos para informar

  constructor( public dialogRef: MatDialogRef<ObservationDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private formBuilder: UntypedFormBuilder, public sweetAlertService: SweetAlertService, public restService: RestService,
      public globalAppService: GlobalAppService, public lhs: LocalStorageService ) {
    /**
    * Configuración del formulario
    */
   // Asignación de valores que llegan por input
   this.textFormObserva = this.data.dataDialog;
   this.isNewReportStatusInput = this.data.isNewReportStatusInput;
   this.nombreReportePersonalizado = this.data.nombreReportePersonalizado;
   this.observacionValue = this.data.observacionValue;
   this.showCustomReport = this.data.showCustomReport;
   this.showAgenda = this.data.showAgenda;
   this.showReasignacion = this.data.showReasignacion;
   this.showVOBO = this.data.showVOBO;
   this.showInformar = this.data.showInformar;
   this.showCopyInformaded = this.data.showCopyInformaded;
   this.showMotivoDevolucion = this.data.showMotivoDevolucion;
   this.textFormObservaHeader = this.data.textFormObservaHeader;
   this.dataObserva = this.data.dataObserva;

   const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, new Date().getMonth(), new Date().getDate());
    this.maxDate = new Date(currentYear + 1, 11, 31);

    this.moduleForm = this.formBuilder.group({
      observacion: new UntypedFormControl(this.observacionValue, Validators.compose([
        Validators.required,
      ])),
      fecha: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      /** 
       * Campos para reporteador
       */
      isNewReport: new UntypedFormControl(false, Validators.compose([
        // Validators.required,
      ])),
      nombreReportePersonalizado: new UntypedFormControl(this.nombreReportePersonalizado, Validators.compose([
        // Validators.required,
      ])),
      /**
       * Campos para informar
       */
      idDependenciasInfo: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      idUsuariosInfo: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      infoUserExt: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      idUsuariosExternos: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      /**
       * Campos para reasignar
       */
      idDependenciaTramitador: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      idUsuarioTramitador: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      idCgMotivoDevolucion: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      /**
       * Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listDependenciasInfoFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listUsuariosInfoFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listUsuariosInfoExtFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listDependenciasFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listUsuariosFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listMotivoDevolucionFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });

    // Validation reporteador
    if ( this.showCustomReport ) {
      this.moduleForm.controls['nombreReportePersonalizado'].setValidators([Validators.required]);
    }

    // Validation Agenda
    if ( this.showAgenda ) {
      this.moduleForm.controls['fecha'].setValidators([Validators.required]);
    }

    // Validation reasignacion
    if ( this.showReasignacion ) {

      if ( this.dataObserva ) {
        if ( this.dataObserva.userOrigen ) {
          // Muestra los usuarios tramitadores
          this.showUserOrigen = true;
          this.userOrigen = this.dataObserva.userOrigen;
        }
      }

      this.moduleForm.controls['idDependenciaTramitador'].setValidators([Validators.required]);
      this.moduleForm.controls['idUsuarioTramitador'].setValidators([Validators.required]);
      this.showInformar = true;
    }

    // Validacion VOBO
    if (this.showVOBO) {
      this.moduleForm.controls['idUsuarioTramitador'].setValidators([Validators.required]);
    }

    // Validacion Copiar informado
    if (this.showCopyInformaded) {
      // this.moduleForm.controls['idDependenciasInfo'].setValidators([Validators.required]);
      // this.moduleForm.controls['idUsuariosInfo'].setValidators([Validators.required]);
    }

    if(this.showMotivoDevolucion){
      this.moduleForm.controls['idCgMotivoDevolucion'].setValidators([Validators.required]);
    }

  }

  ngOnInit() {

    // Hace el llamado del token
    this.getTokenLS();

    // Modulo de reasignacion
    if (this.showReasignacion) {

      // listen for search field value changes
      this.moduleForm.controls['listDependenciasFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listDependencias');
      });
      // listen for search field value changes
      this.moduleForm.controls['listUsuariosFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listUsuarios');
      });
    }

    // listas para informar
    if ( this.showInformar || this.showCopyInformaded ) {
      // listen for search field value changes
      this.moduleForm.controls['listDependenciasInfoFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listDependenciasInfo');
      });
      // listen for search field value changes
      this.moduleForm.controls['listUsuariosInfoFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listUsuariosInfo');
      });
      // listen for search field value changes
      this.moduleForm.controls['listUsuariosInfoExtFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listUsuariosInfoExt');
      });
    }

    // Listas para VOBO
    if (this.showVOBO) {
      // listen for search field value changes
      this.moduleForm.controls['listUsuariosFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listUsuarios');
      });
    }

    if(this.showMotivoDevolucion){
      // listen for search field value changes
      this.moduleForm.controls['listMotivoDevolucionFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listMotivoDevolucion');
      });
    }
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
      // Reasignacion
      if (this.showReasignacion) {
        this.getListDependencia();
      }

      // Listas usuarios VOBO
      if (this.showVOBO) {
        this.getListUserWitOutDepe();
      }

      // Copiar informado
      if (this.showCopyInformaded) {
        this.getListDependencia();
      }

      if(this.showMotivoDevolucion){
        this.getListMotivoDevolucion();
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

  closeDialog() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  // Llama la lista de las dependencias
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

  // Llama la lista de los usuarios
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

  // Llama la lista de motivos de devolcion
  getListMotivoDevolucion(){

    this.restService.restGet(this.versionApi + 'radicacion/distribuciony-envio/motivo-devolucion', this.authorization).subscribe(
      (data) => {
        this.resSerlistMotivoDevolucion = data; 

        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistMotivoDevolucion).then((res) => {
          let responseResolveResponse = res;

          if(this.resSerlistMotivoDevolucion.dataCgMotivosDevolucion){
              this.listMotivoDevolucion = this.resSerlistMotivoDevolucion.dataCgMotivosDevolucion;
              // load the list initial
              this.filteredlistMotivoDevolucion.next(this.listMotivoDevolucion.slice());
            }

        });
      }, (err) => {
        this.resSerlistMotivoDevolucionErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistMotivoDevolucionErr).then((res) => { });
      }
    );
  }

  /**
   * Funcion que llama los usuarios segun la dependencia del usuario logueado
   * y se organiza a partir del perfil Usuario Jefe
   */
  getListUserWitOutDepe() {

    this.restService.restGet(this.versionApi + 'user/index-list-user-by-depend', this.authorization).subscribe(
      (data) => {
        this.resSerlistUsuarios = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistUsuarios).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
              this.listUsuarios = this.resSerlistUsuarios.data;
              // load the list initial
              this.filteredlistUsuarios.next(this.listUsuarios.slice());
          }
        });
      }, (err) => {
        this.resSerlistUsuariosErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistUsuariosErr).then((res) => { });
      }
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

  /**
   * onChange de nuevo reporte
   */
   MatSlideToggleChangeReport(event) {
    if (event.checked) {
      this.messageRadioInfo = 'Si';
    } else {
      this.messageRadioInfo = 'No';
    }
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
