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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { ChangeChildrenService } from 'src/app/services/change-children.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ListaBusq {
  ruta: string;
  label: string;
  data: [];
}

@Component({
  selector: 'app-report-index',
  templateUrl: './report-index.component.html',
  styleUrls: ['./report-index.component.css']
})
export class ReportIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'api';
  initCardHeaderTitle = 'Reportes';
  initCardHeaderTitle2 = this.initCardHeaderTitle; // Titulo de la card con el inicial-list que contiene el resultado del reporte
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'Reports';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/reports/reports-index';
  /** Formulario index */
  initBotonViewRoute: string = '/reports/reports-view'; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Reportes', 'route': '/reports' },
  ];
  breadcrumbRouteActive = 'Reportes';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = '';
  dtTitles: any = [];
  viewColumStatus = false; // Oculta la columna de status del initial list

  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  eventClickButtonSelectedData: any;
  classMainConten: string = '';
  classContainerFluid: string = '';
  // Valida typo
  validTextType: boolean = false;
  // Variable del formulario
  moduleForm: UntypedFormGroup;
  statusInitiaList: boolean = false; // muestra y oculta el initial list
  // Variables de servicio
  resSerlistReports: any;
  resSerlistReportsErr: any;

  listReports: any;

  /** lists filtered + namelist by search keyword */
  filteredlistReports: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  initialNotificationStatus: boolean = false;
  initialNotificationMessage: string = '';

  constructor(private router: Router, private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public restService: RestService, public globalAppService: GlobalAppService,
    private changeChildrenService: ChangeChildrenService, public sweetAlertService: SweetAlertService) {
    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      reportes: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      /** Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listReportsFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
    // listen for search field value changes
    this.moduleForm.controls['listReportsFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listReports');
    });
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      /** Llamado de los servicios para las listas */
      this.getListReports();
    });
  }

  // Llama la lista de las regionales
  getListReports() {

    this.restService.restGet(this.versionApi + 'reportes/index-list', this.authorization).subscribe(
      (data) => {
        this.resSerlistReports = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistReports).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listReports = this.resSerlistReports.data;
            // load the list initial
            this.filteredlistReports.next(this.listReports.slice());
          }
        });
      }, (err) => {
        this.resSerlistReportsErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistReportsErr).then((res) => { });
      }
    );
  }

  /**
   * Función que cambia la ruta del index a mostrar
   * @params ruta ruta que se le asigna al initial List
   */
  changeReport(ruta) {
    this.statusInitiaList = false;
    this.listReports.forEach( element => {
      if ( element.ruta == ruta) {

        if (typeof element.description != 'undefined' && element.description != '' && element.description != null) {
          this.initialNotificationStatus = true;
          this.initialNotificationMessage = element.description;
        } else {
          this.initialNotificationStatus = false;
        }
        
        this.dtTitles = element.dtTitles;
        this.routeLoadDataTablesService = environment.versionApiDefault + ruta;
      }
    });
  }

  /**
   * Función que recarga el componente initial list
   */
  recargarInitial() {
    //Cambiar el título del reporte
    this.listReports.forEach( element => {
      if (element.ruta == this.moduleForm.controls['reportes'].value) {
        this.initCardHeaderTitle2 = element.label;
      }
    });

    //Recargar initial list
    if (this.routeLoadDataTablesService != '' ) {
      this.statusInitiaList = true;
      this.changeChildrenService.changeProcess({ proccess: 'reload' });
    } else {
      this.statusInitiaList = false;
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  /**
   *
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
      }
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
      this[nomList].filter( listOption => listOption.label.toLowerCase().indexOf(search) > -1)
    );
  }s

}
