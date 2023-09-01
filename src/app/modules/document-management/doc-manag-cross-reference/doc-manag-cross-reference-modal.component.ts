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

import { Component, OnInit, Output, EventEmitter, AfterViewChecked, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { environment } from 'src/environments/environment';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';
import { table } from 'console';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { resolve } from 'dns';

export interface DialogData {
  idDocument: any;
  initCardHeaderIcon: any;
  textForm: any;
  ruoteServiceDocuments: any;
  redirectionPath: any;
  dataDocumentos: any;
  eventSelectData; any
}

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-doc-manag-cross-reference-modal',
  template: '',
  styleUrls: ['./doc-manag-cross-reference-modal.component.css']
})
export class DocManagCrossReferenceModalComponent implements OnInit {

  @Output() public closeModalEmiter = new EventEmitter<any>(); // Data a retornar
  // Variable para dar tamaño al dialog
  widthDialog = '95%';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'text_snippet';
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Referencia cruzada';
  // Ruta a ejecutar
  @Input() ruoteServiceDocuments: any = 'radicacion/documentos/upload-document';
  // Objeto que se envia al back como parametro request
  @Input() idDocument: object;
  // Ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  @Input() redirectionPath = '/dashboard';
  // Data adicionar para enviar al servicio
  @Input () dataDocumentos: any;

  @Input() eventSelectData: any = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // hace le llamado del dialogo
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog() {

    const dialogRef = this.dialog.open(DocManagCrossReferenceModalDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        idDocument: this.idDocument,
        initCardHeaderIcon: this.initCardHeaderIcon,
        textForm: this.textForm,
        ruoteServiceDocuments: this.ruoteServiceDocuments,
        redirectionPath: this.redirectionPath,
        dataDocumentos: this.dataDocumentos,
        eventSelectData: this.eventSelectData
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      let respuesta = res;
      if (!respuesta) {
        respuesta = { event: 'close', status: false, data: [] };
      }
      this.closeComponent(respuesta);
    });
  }

  /*** Método para cerrar o destruir el componente desde el padre ***/
  closeComponent(respuesta) {
    this.closeModalEmiter.emit(respuesta);
  }

}


@Component({
  selector: 'app-doc-manag-cross-reference-modal-dialog',
  templateUrl: './doc-manag-cross-reference-modal.component.html',
  styleUrls: ['./doc-manag-cross-reference-modal.component.css']
})

export class DocManagCrossReferenceModalDialog implements OnInit, AfterViewChecked {

  /**Variable del formulario */
  initCardHeaderIcon: any; // Icono del formulario
  textForm: string; // titulo del formulrio
  ruoteServiceDocuments: any; // Ruta a ejecutar
  redirectionPath: any; // Ruta redireccionar
  idDocument: any; // id Del documento a descargar
  dataDocumentos: any; // Data adicional para enviar al servicio

  eventSelectData: any = [];

  validTextType: boolean = false;
  // Version api
  versionApi = environment.versionApiDefault;

  // Autentificacion
  authorization: string;

  // Variables de consumo de servicios
  responseService: any;
  responseServiceErr: any;
  resSerlistTiposAnexosFisicos: any;
  resSerlistTiposAnexosFisicosErr: any;

  // textAlertViewPdfStatus: boolean = false;
  textAlertViewPdfStatus: boolean = true;
  textAlertViewPdf: string;
  styleIframe: any = {
    'display': 'none'
  };
  styleContent: any = {
    'height': '150px'
  };

  viewPdfStatus: boolean = true;
  colGrip: string = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
  styleContentNew: any = {
    'height': '500px'
  };

  /*** pdfOpen ***/
  pdfAsArray: any;
  urlTemplate: string;
  binaryData: any = [];
  dataPdf: any;
  raw: any;
  rawLength: any;

  typeRenderFile: string = "application/pdf";

  moduleForm: any;

  _onDestroy = new Subject<void>();  
  listGdTiposAnexosFisicos: any; // Tipos CgRegional
  filteredlistGdTiposAnexosFisicos: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  statusTipoAnexoGdReferenciaCruzada: boolean = false;
  classIdGdTipoAnexoFisico = 'col-xs-12 col-sm-12 col-md-12 col-lg-12';

  constructor(
    public dialogRef: MatDialogRef<DocManagCrossReferenceModalDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public sweetAlertService: SweetAlertService, private globalAppService: GlobalAppService,
    public lhs: LocalStorageService, public restService: RestService,
    private formBuilder: UntypedFormBuilder, 
  ) {

    /**
      * Configuración del formulario
      */
    this.moduleForm = this.formBuilder.group({
      nombreGdReferenciaCruzada: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      cantidadGdReferenciaCruzada: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      ubicacionGdReferenciaCruzada: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      tipoAnexoGdReferenciaCruzada: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      
      idGdTipoAnexoFisico: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),

      listGdTiposAnexosFisicosFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });
  }

  ngOnInit() {
    this.eventSelectData = this.data.eventSelectData;
    this.initCardHeaderIcon = this.data.initCardHeaderIcon;
    this.textForm = this.data.textForm;
    
    this.getTokenLS();

    // listen for search field value changes
    this.moduleForm.controls['listGdTiposAnexosFisicosFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listGdTiposAnexosFisicos');
    });
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

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.getListTiposAnexosFisicos();
    });
  }

  ngAfterViewChecked() {
    $('.cdk-global-overlay-wrapper').css('z-index', '1000');
    $('.cdk-overlay-pane').css('overflow', 'auto');
  }

  closeDialog() {
    this.dialogRef.close({ event: 'close', status: false, data: [] });
  }

  onlyNumberKey(e) {
    return (e.charCode === 8 || e.charCode === 0) ? null : e.charCode >= 48 && e.charCode <= 57;
  }

  /** Datos para Listas desplegables */
  getListTiposAnexosFisicos(){  
    this.restService.restGet(this.versionApi + 'gestionDocumental/expedientes/get-gd-tipos-anexos-fisicos', this.authorization).subscribe(
      (data) => {
        this.resSerlistTiposAnexosFisicos = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistTiposAnexosFisicos).then((res) => {
          
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
      
            this.listGdTiposAnexosFisicos = this.resSerlistTiposAnexosFisicos.data;
            this.filteredlistGdTiposAnexosFisicos.next(this.listGdTiposAnexosFisicos.slice());
  
          }
        });
      }, (err) => {
        this.resSerlistTiposAnexosFisicosErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistTiposAnexosFisicosErr).then((res) => { });
      }
    );
  }

  onChangeGdTipoAnexoFisico() {
    
    this.classIdGdTipoAnexoFisico = 'col-xs-12 col-sm-12 col-md-12 col-lg-12';

    this.statusTipoAnexoGdReferenciaCruzada = false;
    this.moduleForm.controls['tipoAnexoGdReferenciaCruzada'].disable();

    this.moduleForm.controls['idGdTipoAnexoFisico'].value.forEach(element => {
      if (element  == 6) {
        this.classIdGdTipoAnexoFisico = 'col-xs-12 col-sm-12 col-md-6 col-lg-6';
        this.statusTipoAnexoGdReferenciaCruzada = true;
        this.moduleForm.controls['tipoAnexoGdReferenciaCruzada'].enable();
      }
    });

  }

  submitForm() {
    if (this.moduleForm.valid) {

      this.sweetAlertService.sweetLoading();
      let data = {
        data: this.moduleForm.value,
        eventSelectData: this.eventSelectData,
      }

      this.restService.restPost(this.versionApi + 'gestionDocumental/expedientes/cross-reference', data, this.authorization).subscribe(
        (data) => {
          this.responseService = data;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.responseService).then((res) => {
            
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {

              for ( let key in this.responseService.notificacion) {
                this.sweetAlertService.showNotification(this.responseService.notificacion[key]['type'], this.responseService.notificacion[key]['message'] );
              }
              this.sweetAlertService.sweetClose();
              this.dialogRef.close({ event: 'close', status: true, data: this.responseService });

            }
          });
        }, (err) => {
          this.responseServiceErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.responseServiceErr).then((res) => { });
        }
      );

    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

}