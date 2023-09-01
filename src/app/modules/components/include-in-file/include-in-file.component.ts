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
import { Router, Routes, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import { EncryptService } from 'src/app/services/encrypt.service';
import swal from 'sweetalert2';

// List
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';

export interface DialogData {
  eventClickButtonSelectedData: any;
}

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-include-in-file',
  template: '',
  styleUrls: ['./include-in-file.component.css']
})
export class IncludeInFileComponent implements OnInit {

  @Output() public closeIncludeInFileEmiter = new EventEmitter<any>(); // Data a retornar al initial list

  @Input() eventClickButtonSelectedData: any = [];

  widthDialog = '95%'; // Variable para dar tamaño al dialog

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog() {

    const dialogRef = this.dialog.open(IncludeInFileDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        eventClickButtonSelectedData: this.eventClickButtonSelectedData,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      let respuesta = res;
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
    this.closeIncludeInFileEmiter.emit(respuesta);
  }
}

@Component({
  selector: 'app-include-in-file-dialog',
  templateUrl: './include-in-file.component.html',
  styleUrls: ['./include-in-file.component.css']

})

export class IncludeInFileDialog implements OnInit, AfterViewChecked {

  /**Variable del formulario */
  moduleForm: UntypedFormGroup;
  // Version api
  versionApi = environment.versionApiDefault;
  // Autentificacion
  authorization: string;

  // Variables se consumos de servicios
  resSerlistExpedientes: any; // Lista de expedientes
  resSerlistExpedientesErr: any; // Error en lista de expedientes

  // Variables para las listas
  listExpedientesInfo: any;
  listExpedientes: any;

  params: any = {}; // parametros que envia en un servici

  eventClickButtonSelectedData: any = []; // Data seleccionada
  textFormHeader: string = 'Incluir en expediente';
  initCardHeaderIcon = 'assignment_turned_in';
  botonSubmitIcon: string = 'check_circle_outline'; // Icono del boton

  /** slide-toggle  */
  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  disabledSelect:boolean = true;
  statusCreateFolder: boolean = false; // Muestra el dialogo de crear expediente

  isNuevoExpediente: boolean = false;
  tittleSelectTipoExpeidiente = 'Nuevo expediente';
  messageSelectTipoExpeidiente = 'No';
  routeCreateFolder: string = '/documentManagement/folder-create';
  informacionNew = 'informacionNew';
  informacionUpdate = 'informacionUpdate';
  informacionMsg = this.informacionUpdate;

  /** lists filtered + namelist by search keyword */
  // Filtros de informacion
  filteredlistExpedientesInfo: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistExpedientes: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

    /** Variables para traer el texto de confirmacion */
    titleMsg: string;
    textMsg: string;
    bntCancelar: string;
    btnConfirmacion: string;
    resSerLenguage: any;
    validateDuplicate = true; // Valida si el radicado se puede duplicar

  constructor(public dialogRef: MatDialogRef<IncludeInFileDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: UntypedFormBuilder, public sweetAlertService: SweetAlertService, public restService: RestService,
    public globalAppService: GlobalAppService, public lhs: LocalStorageService, private encryptService: EncryptService) {
    /**
    * Configuración del formulario
    */
    this.eventClickButtonSelectedData = this.data.eventClickButtonSelectedData;


    this.moduleForm = this.formBuilder.group({
      nombreExpediente: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      numeroExpediente: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      archivado: new UntypedFormControl(null, Validators.compose([
        // Validators.required,
      ])),
      newFile: new UntypedFormControl(false, Validators.compose([
        // Validators.required,
      ])),
      idExpediente: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      listExpedientesFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
    });

  }

  ngOnInit() {

    // Hace el llamado del token
    this.getTokenLS();

    this.moduleForm.controls['listExpedientesFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listExpedientes');
      });
  }

  /** Función que procesa solo los parámetros que se van a enviar por GET */
  proccessData(data) {
    //sguarin
    //return data;
    return new Promise((resolve) => {
      let dataList = [];
      data.forEach(element => {
        dataList.push({
          id: element.id,
          archivado: element.archivado
        });
      });
      resolve(dataList);
    });
  }

  /** 
   * Función que genera la URL para la creación de un expediente
   * Se encriptan los radicados seleccionados para pasarlos por el método GET
   */
  generateUrl() {
    this.proccessData(this.eventClickButtonSelectedData).then((res) => {
      let params = res;
      let paramsEncrypt = this.encryptService.encryptAES(params, this.authorization, true);
      this.routeCreateFolder = this.routeCreateFolder + '/' + paramsEncrypt;
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

      /** Llamado de los servicios que necesitan el token */
      this.generateUrl();

    });
  }

  submitForm() {
    if (this.moduleForm.valid) {
      if(this.moduleForm.controls['archivado'].value == null){
        
        this.dialogRef.close({ event: 'close', status: true, data: this.moduleForm.value });
      } else {

          this.globalAppService.text18nGet().then((res) => {
          this.resSerLenguage = res;
          // console.log( this.resSerLenguage );
          this.titleMsg = this.resSerLenguage['validarExpedienteArchivado'];
          this.textMsg = this.resSerLenguage['msgexpedienteArchivado'];
          let textAceptar = this.resSerLenguage['btnConfirmar'];
          let textCancelar = this.resSerLenguage['Cancelar'];
    
          swal({
            title: this.titleMsg,
            text: this.textMsg,
            type: 'success',
            showCancelButton: true,
            cancelButtonText: textCancelar,
            confirmButtonText: textAceptar,
            cancelButtonClass: 'btn btn-danger',
            confirmButtonClass: 'btn btn-success',
            buttonsStyling: false
          }).then( (result) => {
    
            // // Entra a dupliar el radicado por confirmación del usuario
            if (result.value) {

                 this.dialogRef.close({ event: 'close', status: true, data: this.moduleForm.value });
            }
    
          });
    
        });

      }
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  closeDialog() {
    this.statusCreateFolder = false; // Dejar modal como oculto
    this.dialogRef.close({ event: 'close', status: false, data: [] });
  }

  openDialogFolder() {
    this.statusCreateFolder = true; // Abre el dialogo de crear expediente
  }

  MatSlideToggleChange(event) {

    if (event.checked) {
      this.moduleForm.controls['idExpediente'].setValue(null);

      this.moduleForm.controls['numeroExpediente'].setValidators([Validators.required]);
      this.moduleForm.controls['archivado'].setValidators([Validators.required]);
      this.moduleForm.controls['nombreExpediente'].setValidators([Validators.required]);
      this.moduleForm.controls['idExpediente'].clearValidators();

      this.moduleForm.controls['numeroExpediente'].updateValueAndValidity();
      this.moduleForm.controls['archivado'].updateValueAndValidity();
      this.moduleForm.controls['nombreExpediente'].updateValueAndValidity();
      this.moduleForm.controls['idExpediente'].updateValueAndValidity();

      this.isNuevoExpediente = true;
      this.messageSelectTipoExpeidiente = 'Si';
      this.informacionMsg = this.informacionNew;

    } else {

      this.moduleForm.controls['numeroExpediente'].clearValidators();
      this.moduleForm.controls['archivado'].clearValidators();
      this.moduleForm.controls['nombreExpediente'].clearValidators();
      this.moduleForm.controls['idExpediente'].setValidators([Validators.required]);

      this.moduleForm.controls['numeroExpediente'].updateValueAndValidity();
      this.moduleForm.controls['archivado'].updateValueAndValidity();
      this.moduleForm.controls['nombreExpediente'].updateValueAndValidity();
      this.moduleForm.controls['idExpediente'].updateValueAndValidity();

      this.isNuevoExpediente = false;
      this.messageSelectTipoExpeidiente = 'No';
      this.informacionMsg = this.informacionUpdate;

    }
  }

  // Consultar Expedientes cuando se da click en la lupa
  searchExpedientes() {

    this.sweetAlertService.sweetLoading();

    let params = {
      numeroExpediente: this.moduleForm.controls['numeroExpediente'].value,
      archivado: this.moduleForm.controls['archivado'].value,
      nombreExpediente: this.moduleForm.controls['nombreExpediente'].value,
    };

    this.restService.restGetParams(this.versionApi + 'gestionDocumental/expedientes/index-list', params, this.authorization).subscribe(
      (data) => {
        this.resSerlistExpedientes = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistExpedientes).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {

            let listExpetientesRes = this.resSerlistExpedientes.data;

            this.listExpedientes = [];
            listExpetientesRes.forEach(element => {
            this.listExpedientes.push({
                id: element.idGdExpediente,
                val: element.numeroGdExpediente + ' - ' + element.nombreGdExpediente,
                archivado: element.archivado
              });
            });
            this.filteredlistExpedientes.next(this.listExpedientes.slice());
            this.moduleForm.controls['idExpediente'].enable();

            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.resSerlistExpedientesErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistExpedientesErr).then((res) => { });
      }
    );
  }

  //Ejecutor cuando se presiona el boton de submit que lo llamo en mi html y lo que hace
  //es asignar mi consulta de archivado que viene en mi back y lo asigna a mi variable archivado
  //de mi front 
  onChangeExp() {

    this.listExpedientes.forEach(element => {
      if (element.id == this.moduleForm.controls['idExpediente'].value) {

        this.moduleForm.controls['archivado'].setValue(element.archivado);

      }
    });
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
      this[nomList].filter(listOption => listOption.val.toLowerCase().indexOf(search) > -1)
    );
  }

}
