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
  dataDialog: any;
  textFormHeader: any;
  initialNotificationStatus: any;
  initialNotificationMessage: any;
  idExpediente: any;
}

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-arc-manag-modal-archive',
  template: '',
  styleUrls: ['./arc-manag-modal-archive.component.css']
})
export class ArcManagModalArchiveComponent implements OnInit {

  @Output() public closeModalEmiter = new EventEmitter<any>(); // Data a retornar al initial list
  @Input() textFormHeader: string; // Titulo del modal
  @Input() dataDialog: any; // data
  @Input() initialNotificationStatus = false; // muestra la notificacion
  @Input() initialNotificationMessage = 'textFormArchiveFiling';
  @Input() idExpediente = 0; // Id del expediente

  // Variable para dar tamaño al dialog
  widthDialog = '75%';

  constructor( public dialog: MatDialog) {}

  ngOnInit() {
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog( ) {

    const dialogRef = this.dialog.open( ArchiveDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        dataDialog: this.dataDialog,
        textFormHeader: this.textFormHeader,
        initialNotificationStatus: this.initialNotificationStatus,
        initialNotificationMessage: this.initialNotificationMessage,
        idExpediente: this.idExpediente
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
  selector: 'app-archive-dialog',
  templateUrl: './arc-manag-modal-archive.component.html',
  styleUrls: ['./arc-manag-modal-archive.component.css']
})

export class ArchiveDialog implements OnInit, AfterViewChecked {

  /**Variable del formulario */
  moduleForm: UntypedFormGroup;
  validTextType: boolean = false;
  iconMenu = 'save';
  // Version api
  versionApi = environment.versionApiDefault;
  // Autentificacion
  authorization: string;
  userOrigen: any; // Muestra los usuarios que tramitan los radicados
  initCardHeaderIcon = 'batch_prediction';
  textForm = 'Archivar radicado';
  botonSubmitIcon: string = 'check_circle_outline'; // Icono del boton
  // Variables se consumos de servicios
  resSerlistDepart: any;
  resSerlistDepartErr: any;
  resSerlistMunicipios: any;
  resSerlistMunicipiosErr: any;
  resSerListGeneral: any;
  resSerListGeneralErr: any;

  params: any = {}; // parametros que envia en un servicio
  // Variables para las listas
  listDepart: any;
  listMunicipios: any;
  listEdificio: any;
  listPiso: any;
  listBodega: any;
  listEstante: any;
  listRack: any;
  listEntrepano: any;
  listCaja: any;
  dataUConserva: any;
  viewDataForm = Object.keys;
/** Las variables para mostrar la alerta informativa  */
  initialNotificationClassAlert: string = 'alert alert-info alert-with-icon';
  initialNotificationStatus = false; // muestra la notificacion
  initialNotificationMessage: string;
  idExpediente = 0; // Id del expediente

  /** lists filtered + namelist by search keyword */
  filteredlistDepart: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistMunicipios: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistEdificio: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistPiso: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistBodega: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistEstante: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistRack: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistEntrepano: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistCaja: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  valueConservacion = 0; // Id del value de conservación

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  constructor( public dialogRef: MatDialogRef<ArchiveDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private formBuilder: UntypedFormBuilder, public sweetAlertService: SweetAlertService, public restService: RestService,
      public globalAppService: GlobalAppService, public lhs: LocalStorageService ) {
    /**
    * Configuración del formulario
    */
    if (this.data.textFormHeader) {
      this.textForm = this.data.textFormHeader; // Titulo del modal
    }

    this.initialNotificationStatus = this.data.initialNotificationStatus;
    this.initialNotificationMessage = this.data.initialNotificationMessage;
    this.idExpediente = this.data.idExpediente; // id del expediente

    this.moduleForm = this.formBuilder.group({
      idExpediente: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      idDepartamentoGaEdificio: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idMunicipioGaEdificio: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idGaEdificio: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idGaPiso: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idGaBodega: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      unidadConservacionGaArchivo: new UntypedFormControl(1, Validators.compose([
        Validators.required
      ])),
      estanteGaArchivo: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      rackGaArchivo: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      entrepanoGaArchivo: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      cajaGaArchivo: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      unidadCampoGaArchivo: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      cuerpoGaArchivo: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      /** Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listDepartFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listMunicipiosFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listEdificioFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listPisoFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listBodegaFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listEstanteFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listRackFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listEntrepanoFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listCajaFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });

  }

  ngOnInit() {

    // Hace el llamado del token
    this.getTokenLS();

    // listen for search field value changes
    this.moduleForm.controls['listDepartFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listDepart');
    });
    // listen for search field value changes
    this.moduleForm.controls['listMunicipiosFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listMunicipios');
    });
    // listen for search field value changes
    this.moduleForm.controls['listEdificioFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listEdificio');
    });
    // listen for search field value changes
    this.moduleForm.controls['listPisoFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listPiso');
    });
    // listen for search field value changes
    this.moduleForm.controls['listBodegaFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listBodega');
    });
    // listen for search field value changes
    this.moduleForm.controls['listEstanteFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listEstante');
    });
    // listen for search field value changes
    this.moduleForm.controls['listRackFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listRack');
    });
    // listen for search field value changes
    this.moduleForm.controls['listEntrepanoFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listEntrepano');
    });
    // listen for search field value changes
    this.moduleForm.controls['listCajaFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listCaja');
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
      this.getListDepart();
      // envia data del idexpediente inicialmente
      this.getListGeneral(0);

    });
  }

  submitForm() {
    if (this.moduleForm.valid) {
      // console.log( this.moduleForm.getRawValue() );
      // this.moduleForm.getRawValue() envia todos los valores del formulario aunque esten en disable
      this.dialogRef.close({event: 'close', status: true , data: this.moduleForm.getRawValue() });
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  closeDialog() {
    this.dialogRef.close({event: 'close', status: false , data: [] });
  }

  // Llama la lista de los departamentos
  getListDepart() {

    let dataCountry = {
      idNivelGeografico1: environment.defaultCountry,
    };

    this.restService.restPost(this.versionApi + 'radicacion/radicados/nivel-geografico2', dataCountry, this.authorization).subscribe(
      (data) => {
        this.resSerlistDepart = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistDepart).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listDepart = this.resSerlistDepart.dataNivelGeografico2;
            // load the list initial
            this.filteredlistDepart.next(this.listDepart.slice());
          }
        });
      }, (err) => {
        this.resSerlistDepartErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistDepartErr).then((res) => { });
      }
    );
  }

  // Llama la lista de los Municipios
  getListMunicipio(val) {

    let dataMuni = {
      idNivelGeografico2: val,
    };

    this.restService.restPost(this.versionApi + 'radicacion/radicados/nivel-geografico3', dataMuni, this.authorization).subscribe(
      (data) => {
        this.resSerlistMunicipios = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistMunicipios).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listMunicipios = this.resSerlistMunicipios.dataNivelGeografico3;
            // load the list initial
            this.filteredlistMunicipios.next(this.listMunicipios.slice());
          }
        });
      }, (err) => {
        this.resSerlistMunicipiosErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistMunicipiosErr).then((res) => { });
      }
    );
  }

  // Llama la lista de los edificios
  getListGeneral(val) {

    if (this.idExpediente != 0 ) {
      this.moduleForm.controls['idExpediente'].setValue(this.idExpediente);
    }
    // Data formulario
    // console.log(this.moduleForm.value);

    this.restService.restGetParams(this.versionApi + 'gestionArchivo/gestion-archivo/get-general-list', this.moduleForm.value, this.authorization).subscribe(
      (data) => {
        this.resSerListGeneral = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerListGeneral).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Lista edificios
            if (this.resSerListGeneral.dataGaEdificio) {
              this.listEdificio = this.resSerListGeneral.dataGaEdificio;
              // load the list initial
              this.filteredlistEdificio.next(this.listEdificio.slice());
            }
            // Lista piso
            if (this.resSerListGeneral.dataGaPiso) {
              this.listPiso = this.resSerListGeneral.dataGaPiso;
              // load the list initial
              this.filteredlistPiso.next(this.listPiso.slice());
            }
            // Lista del área de archivo (anteriromente bodega)
            if (this.resSerListGeneral.dataGaBodega) {
              this.listBodega = this.resSerListGeneral.dataGaBodega;
              // load the list initial
              this.filteredlistBodega.next(this.listBodega.slice());
            }
            // Lista u conservacion archivo
            if (this.resSerListGeneral.dataUConservacionGaArchivo) {
              this.dataUConserva = this.resSerListGeneral.dataUConservacionGaArchivo;
            }
            // Lista Estantes
            if (this.resSerListGeneral.dataEstanteGaBodega) {
              this.listEstante = this.resSerListGeneral.dataEstanteGaBodega;
              // load the list initial
              this.filteredlistEstante.next(this.listEstante.slice());
            }
            // Lista Rack
            if (this.resSerListGeneral.dataRackGaBodega) {
              this.listRack = this.resSerListGeneral.dataRackGaBodega;
              // load the list initial
              this.filteredlistRack.next(this.listRack.slice());
            }
            // Lista entrepaño
            if (this.resSerListGeneral.dataEntrepanoGaBodega) {
              this.listEntrepano = this.resSerListGeneral.dataEntrepanoGaBodega;
              // load the list initial
              this.filteredlistEntrepano.next(this.listEntrepano.slice());
            }
            // Lista caja
            if (this.resSerListGeneral.dataCajaGaBodega) {
              this.listCaja = this.resSerListGeneral.dataCajaGaBodega;
              // load the list initial
              this.filteredlistCaja.next(this.listCaja.slice());
            }

            if ( this.resSerListGeneral.dataArchivo) {
              for (let name in this.resSerListGeneral.dataArchivo) {
                if (this.moduleForm.controls[name] && this.resSerListGeneral.dataArchivo[name] != '' && this.resSerListGeneral.dataArchivo[name] != 0) {
                  // Asigna el valor
                  this.moduleForm.controls[name].setValue(this.resSerListGeneral.dataArchivo[name]);
                  // Bloquea el campo para que no sea editable
                  this.moduleForm.controls[name].disable();
                  // Consulta la lista de Municipio con el departamento
                  if ( name == 'idMunicipioGaEdificio'){
                    this.getListMunicipio(this.resSerListGeneral.dataArchivo[name]);
                  }
                  // ASigna el valor para el radio button 
                  if ( name == 'unidadConservacionGaArchivo'){
                    this.valueConservacion = this.resSerListGeneral.dataArchivo[name];
                  }
                }
              }
            }

            // asigna el valor del cuerpo
            this.moduleForm.controls['cuerpoGaArchivo'].setValue(this.resSerListGeneral.dataCuerpoGaBodega);

          }
        });
      }, (err) => {
        this.resSerListGeneralErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerListGeneralErr).then((res) => { });
      }
    );
  }

  /**
   * Cuando se hace clic en el botón se envia el formulario
   * @param event
   */
  menuPrimaryReceiveData(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById('sendForm');
    buttonSubmit.click();
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
