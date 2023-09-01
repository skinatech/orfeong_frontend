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

import { Component, OnInit, Input, Output, Inject, EventEmitter, AfterViewChecked } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { UntypedFormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

export interface DialogData {
  dataDialog: any;
}

@Component({
  selector: 'app-filter-initial-list',
  template: '',
  styleUrls: ['./filter-initial-list.component.css']
})

export class FilterInitialListComponent implements OnInit, AfterViewChecked {

  @Input() dataFilterSchema: any; // Data del filtro
  @Output() public closeFilterEmiter = new EventEmitter<any>(); // Data a retornar al initial list
  dataFilterOK: any;  // Data para enviar al dialogo que trae la informacion del schena

  constructor( public dialog: MatDialog, private authService: AuthService ) { }

  ngOnInit() {
    this.openDialog();
  }

  ngAfterViewChecked() {
    $('.cdk-global-overlay-wrapper').css('z-index', '1000');
    $('.cdk-overlay-pane').css('overflow', 'auto');
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog( ) {

    if ( this.dataFilterSchema ) {
      this.dataFilterOK = this.dataFilterSchema;
    } else {
      this.dataFilterOK = this.authService.decryptAES( localStorage.getItem(environment.hashDataFilter) );
    }

    // console.log( this.dataFilterOK );

    const dialogRef = this.dialog.open(FilterInitialListDialog, {
      disableClose: false,
      width: '95%',
      data: {
        dataConfig: this.dataFilterOK.configGlobal,
        dataFilter: this.dataFilterOK.schema
      }
    });
    dialogRef.afterClosed().subscribe( res => {
      let respuesta = res
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
    this.closeFilterEmiter.emit(respuesta);
  }

}


@Component({
  selector: 'app-filter-initial-list-dialog',
  templateUrl: './filter-initial-list.component.html',
  styleUrls: ['./filter-initial-list.component.css']
})

export class FilterInitialListDialog implements OnInit {

  /** Propiedades del Filter List */
  // Propiedades agregadas

  @Input() initCardHeaderStatus: boolean = true; // Controla el header del panel/card
  initCardHeaderIcon: string = 'pageview'; // Icono del header del panel/card
  initCardHeaderTitle: string = 'Filtros de búsqueda'; // Título del header del panel/card
  botonSubmitIcon: string = 'search'; // icono del botón
  
  routeSubmit: string; // Ruta del submit

  form = new UntypedFormGroup({});
  model = {
    filterOperation: [{}],
  };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  // Version api
  versionApi = environment.versionApiDefault;
  // Autentificacion
  authorization: string;
  // variables para servicios
  routeServiceChange: any; // Ruta a ejecutar en el OnChange
  params: any;
  resSerChange: any;
  resSerChangeErr: any;


  constructor( public dialogRef: MatDialogRef<FilterInitialListDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
  public restService: RestService, public globalAppService: GlobalAppService, public lhs: LocalStorageService ) { }

  ngOnInit() {
    this.fields = this.data['dataFilter']; // schema

    if (this.fields ) {
      const valFiels = this.fields[0]['fieldArray']['fieldGroup'].map(f => {
        if (f.templateOptions && f.templateOptions.changeExpr) {
          f.templateOptions.change = Function( f.templateOptions.changeExpr).bind(this);
        }
        return f;
      });
    }

    // Configuracion del diseño del filtro
    this.routeServiceChange = this.data['dataConfig']['routeChange'];
    this.initCardHeaderTitle = this.data['dataConfig']['titleCard'];
    this.initCardHeaderIcon = this.data['dataConfig']['icon'];
    this.routeSubmit = this.data['dataConfig']['routeSubmit'];
    this.botonSubmitIcon = this.data['dataConfig']['botonSubmitIcon'];

    // Hace el llamado del token
    this.getTokenLS();

  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  submit() {
    if (this.form.valid) {
      // console.log(this.form.value);
      this.dialogRef.close({event: 'close', status: true , data: this.form.value });
    } else {
      this.dialogRef.close({event: 'close', status: false , data: [] });
    }
  }

  /**
   * Consulta para los usuarios dependiendo las dependencias
   * @param camOrig Campo Origen donde se tomara el valor para consultar la información
   * @param camDes Campo Destino donde quedara lo que retorne el backend
   * @param option Campo option como opcional
   */
  consultaListChange( camOrig, camDes, option: any = '' ) {

    let valOrigen = this.form.controls['filterOperation']['value'][0][camOrig];

    this.params = {
      id: valOrigen,
      option: option
    };

    this.restService.restGetParams(this.versionApi + this.routeServiceChange, this.params, this.authorization).subscribe(
      (data) => {
        this.resSerChange = data;
        // console.log(this.resSerChange);

        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerChange).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {

            // this.form.controls['filterOperation']['value'][0][camDes] = this.resSerChange.data;

            const valFielsg = this.fields[0]['fieldGroup'][0]['fieldGroup'].map( g => {
              if ( g.key == camDes ) {
                g.templateOptions.options = this.resSerChange.data;
              }
              return g;
            });
          }
        });
      }, (err) => {
        this.resSerChangeErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerChangeErr).then((res) => { });
      }
    );

  }

}
