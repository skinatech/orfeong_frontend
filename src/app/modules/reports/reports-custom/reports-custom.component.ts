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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from 'src/app/services/activate-translate.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { environment } from 'src/environments/environment';

// Lista de busqueda
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-reports-custom',
  templateUrl: './reports-custom.component.html',
  styleUrls: ['./reports-custom.component.css']
})
export class ReportsCustomComponent implements OnInit, OnDestroy {

  versionApi = environment.versionApiDefault;

  // Autentificacion
  authorization: string;
  // Nombre del boton
  textButtonForm = 'Enviar';
  textFormRol = 'Reportes personalizados';
  // Icono del formulario
  initCardHeaderIcon = 'api';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Reportes', 'route': '/reports' }
  ];
  breadcrumbRouteActive = 'Reportes personalizados';

  /** Boton flotante */
  iconMenu: string = 'menu';
  menuButtons1: any = [
    { icon: 'view_headline', title: 'Generar reporte', action: 'generateReport', data: '' },
  ];
  menuButtons2: any = [
    { icon: 'view_headline', title: 'Generar reporte', action: 'generateReport', data: '' },
    { icon: 'save', title: 'Guardar reporte', action: 'save', data: '' },
  ];
  menuButtons: any = this.menuButtons1;

  moduleForm: UntypedFormGroup;

  /** Variables de internacionalización */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  responseService: any;
  responseServiceErr: any;
  responseServiceSaveReport: any
  responseServiceSaveReportErr: any

  arrayModels: any;
  listCustomReports: any = [];

  /** lists filtered + namelist by search keyword */
  filteredlistCustomReports: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  step = null; // Paso en el que va el poceso para el acordeon de material

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderTitle = 'Reportes';
  initCardHeaderTitle2 = this.initCardHeaderTitle; // Titulo de la card con el inicial-list que contiene el resultado del reporte
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'Reports';
  // Ruta a redirigir
  redirectionPath = '/reports';
  /** Formulario index */
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  // Configuraciones para datatables
  routeLoadDataTablesService: string = '';
  dtTitles: any = [];
  viewColumStatus = false; // Oculta la columna de status del initial list

  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  eventClickButtonSelectedData: any;
  classMainConten: string = '';
  classContainerFluid: string = '';
  statusInitiaList: boolean = false; // muestra y oculta el initial list
  initialNotificationStatus: boolean = false;
  initialNotificationMessage: string = '';
  statusParamsAdd = true;
  dataParamsAdd = {};

  filterOperation: any = [];

  /** Variables del modal de observacion utilizado para guardar el reporte */
  statusModalMain: boolean = false;
  textFormObservaHeader: string = 'Guardar reporte actual';
  textFormObserva: string = 'Descripción del reporte';
  isNewReportStatusInput: boolean = true;
  nombreReportePersonalizado: string = '';
  observacionValue: string = '';

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public sweetAlertService: SweetAlertService, public restService: RestService, public globalAppService: GlobalAppService, private translate: TranslateService, private activateTranslateService: ActivateTranslateService) {
    this.detectLanguageInitial();
  }

  ngOnInit() {
    this.getTokenLS();
    /**
     * Configuración del formulario para el login
     */
    this.moduleForm = this.formBuilder.group({

      idReportePersonalizado: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      /** Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listCustomReportsFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });
    this.detectLanguageChange();

    // listen for search field value changes
    this.moduleForm.controls['listCustomReportsFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listCustomReports');
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
      this[nomList].filter( listOption => listOption.val.toLowerCase().indexOf(search) > -1)
    );
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.getDataReports();
    });
  }

  /** Data principal de reportes */
  getDataReports() {
    // Cargando true
    this.sweetAlertService.sweetLoading();

    let data = {
      id: this.moduleForm.controls['idReportePersonalizado'].value,
    }

    this.restService.restGetParams(this.versionApi + 'reportes/reportes-personalizados/index', data, this.authorization)
      .subscribe((res) => {
        this.responseService = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseService, true, '/reports').then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            
            this.arrayModels = this.responseService.data.arrayModels;
            this.listCustomReports = this.responseService.data.listCustomReports;
            this.filterOperation = this.responseService.data.filterOperation;
            // load the list initial
            this.filteredlistCustomReports.next(this.listCustomReports.slice());

            // Cargando false
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.responseServiceErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceErr, true, '/reports').then((res) => { });
      }
    );
  }

  onChangeCustomReport() {
    this.statusInitiaList = false;
    this.menuButtons = this.menuButtons1;
    this.getDataReports();
  }

  validateInputParent(e, modelName) {

    this.arrayModels.forEach(model => {
      if (model.model == modelName) {

        model.value = e.target.checked;

        model.schema.forEach(row => {
          row.value = e.target.checked;
        });
      }
    });

  }

  validateInputChildren(e, modelName) {

    /** Validar elemento seleccionado */
    this.arrayModels.forEach(model => {
      if (model.model == modelName) {
        
        let countModuleSchema = model.schema.length;
        let valueModel = true;
        
        model.schema.forEach(row => {
          
          /** asignar valor a elemento seleccionado */
          if (row.column == e.target.name) {
            row.value = e.target.checked;
          }
          /** Fin asignar valor a elemento seleccionado */
          
          if (row.value == false) {
            valueModel = false;
          }

          countModuleSchema = countModuleSchema - 1;

          if (countModuleSchema == 0) {
            model.value = valueModel;
          }
        });
      }
    });

  }

  /**
   * @param event
   * Procesando las opciones del menu flotante
   */
   public menuReceiveData(event) {

    switch (event.action) {

      case 'generateReport':
        this.generateDataReport();
      break;
      case 'save':
        this.confirmSaveReport();
      break;

    }
  }

  generateDataReport() {
    this.dataParamsAdd = {
      idReportePersonalizado: this.moduleForm.controls['idReportePersonalizado'].value,
      arrayModels: this.arrayModels,
      filterOperation: this.filterOperation,
    };
    
    this.dtTitles = [];
    this.arrayModels.forEach(model => {
      model.schema.forEach(element => {
        if (element.value == true) {
          this.dtTitles.push({'title': element.label, 'data': element.column})
        }
      });
    });

    this.routeLoadDataTablesService = this.versionApi + 'reportes/reportes-personalizados/generate-report';

    this.step = null
    this.statusInitiaList = false;
    if (this.dtTitles.length > 0) {
      this.menuButtons = this.menuButtons2;
      setTimeout(() => {
        this.statusInitiaList = true;
      }, 0);
    } else {
      this.menuButtons = this.menuButtons1;
      this.sweetAlertService.sweetInfo('Algo está mal', ['Debe seleccionar al menos un campo para procesar el reporte']);
    }
  }

  /**
  * Mensaje de confirmación para continuar con el proceso de guardado
  */
  confirmSaveReport() {
    if (this.moduleForm.controls['idReportePersonalizado'].value != '') {
      this.isNewReportStatusInput = true;
      this.listCustomReports.forEach(element => {
        if (element.id == this.moduleForm.controls['idReportePersonalizado'].value) {
          this.nombreReportePersonalizado = element.val;
          this.observacionValue = element.description;
        }
      });
    } else {
      this.isNewReportStatusInput = false;
      this.nombreReportePersonalizado = '';
      this.observacionValue = '';
    }
    this.statusModalMain = true;
  }

  closeObserva(dataObserva) {

    this.statusModalMain = false;

    if ( dataObserva.status ) {
      this.saveReport(dataObserva.data);
    }
  }

  /** Consultar reporte guardato */
  saveReport(dataReportModal) {
    // Cargando true
    this.sweetAlertService.sweetLoading();

    let data = {
      id: this.moduleForm.controls['idReportePersonalizado'].value,
      dataReportModal: dataReportModal,
      arrayModels: this.arrayModels,
      filterOperation: this.filterOperation,
    }

    this.restService.restPost(this.versionApi + 'reportes/reportes-personalizados/save-report', data, this.authorization)
      .subscribe((res) => {
        this.responseServiceSaveReport = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceSaveReport, false, '/reports').then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {

            // Muestra el mensaje
            this.sweetAlertService.showNotification('success', this.responseServiceSaveReport.message);
            this.listCustomReports = this.responseServiceSaveReport.data.listCustomReports;
            // load the list initial
            this.filteredlistCustomReports.next(this.listCustomReports.slice());
            this.moduleForm.controls['idReportePersonalizado'].setValue(this.responseServiceSaveReport.data.idReportePersonalizado);

            // Cargando false
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.responseServiceSaveReportErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceSaveReportErr, false, '/reports').then((res) => { });
      }
    );
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
   *
   * @param event
   * Recibe la data de los filtros seleccionados en el inicial list
   */
  dataFilterReceiveData(event) {
    if (typeof event.data.filterOperation != undefined) {
      this.filterOperation = event.data.filterOperation;
    } else {
      this.filterOperation = [];
    }
  }

  /** Método para detectar el idioma de la aplicación */
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
      this.activeLang = this.languageReceive;
    });
  }
  /** Fin Métodos para el uso de la internacionalización */

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }

}
