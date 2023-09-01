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

import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from '../../../services/activate-translate.service';

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-arc-manag-physical-space-form',
  templateUrl: './arc-manag-physical-space-form.component.html',
  styleUrls: ['./arc-manag-physical-space-form.component.css']
})
export class ArcManagPhysicalSpaceFormComponent implements OnInit, OnDestroy {

  @Output() public submitFormEmit = new EventEmitter<any>();
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Parametro para agregar edificios
  @Input() statusButtonAdd: boolean = false;
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Datos del edificio';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'business';
  @Input() initCardHeaderIconDatos = 'library_books';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Gestión de archivo', 'route': '/archiveManagement' },
  ];
  @Input() breadcrumbRouteActive = 'Edificio';
  // Valida typo
  validTextType: boolean = false;
  dataForm = []; // Guarda los datos del formulario
  // viewDataForm = []; // Guarda los datos del formulario para mostrar los
  viewDataForm = Object.keys;
  nombreGaBodega: UntypedFormArray; // Guarda los datos del formulario
  // Variable del formulario
  moduleForm: UntypedFormGroup;
  resResolveResponse: any;
  resResolveResponseErr: any;
  resSerlistDepart: any;
  resSerlistDepartErr: any;
  resSerlistMunicipios: any;
  resSerlistMunicipiosErr: any;
  resSerlistEdificios: any;
  resSerlistEdificiosErr: any;

  // Autentificacion
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/archiveManagement/physical-space-index';
  // Variables de consumo de servicios
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;
  // Variables para el boton flotante
  iconMenu: string = 'save';
  dataLang: any;
  listDepart: any;
  listMunicipios: any;
  listEdificios: any;
  listCuerpo = [{id: 'A', val: 'A'}, {id: 'B', val: 'B'}];

  /** Las variables para mostrar la alerta informativa  */
  @Input() initialNotificationClassAlert: string = 'alert alert-info alert-with-icon';
  @Input() initialNotificationStatus = false; // muestra la notificacion
  @Input() initialNotificationMessage = 'textFormPhysicalSpace';

  /** lists filtered + namelist by search keyword */
  filteredlistDepart: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistMunicipios: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistCuerpo: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistEdificios: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>();

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  /** Variables de internacionalización */
  activeLang: string;
  languageReceive: any;

  subscriptionTranslateService$: Subscription;

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public restService: RestService,
    public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService,
    private translate: TranslateService, private activateTranslateService: ActivateTranslateService
  ) {

    this.detectLanguageInitial();

    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      selectGaEdificio: new UntypedFormControl('', Validators.compose([])),
      nombreGaEdificio: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idDepartamentoGaEdificio: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idMunicipioGaEdificio: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      numeroPiso: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ])),
      numeroGaPiso: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      nombreGaBodega: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      cantidadRackGaBodegaContenido: new UntypedFormControl('', Validators.compose([
        // Validators.required,
        // Validators.pattern("^[1-9]*$")
      ])),
      cantidadEstanteGaBodegaContenido: new UntypedFormControl('', Validators.compose([
        // Validators.required,
        // Validators.pattern("^[1-9]*$")
      ])),
      cantidadEntrepanoGaBodegaContenido: new UntypedFormControl('', Validators.compose([
        // Validators.required
        // Validators.pattern("^[1-9]*$")
      ])),
      cantidadCajaGaBodegaContenido: new UntypedFormControl('', Validators.compose([
        // Validators.required
        // Validators.pattern("^[1-9]*$")
      ])),
      cuerpoGaBodegaContenido: new UntypedFormControl('', Validators.compose([
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
      listCuerpoFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });

  }

  ngOnInit() {
    // Detectando si se ejecuta cambio de idioma
    this.detectLanguageChange();
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
    this.moduleForm.controls['listCuerpoFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listCuerpo');
    });
  }

  submitForm() {
    if (this.moduleForm.valid) {
      this.moduleForm.controls['numeroGaPiso'].setValue(this.dataForm);
      // console.log( this.moduleForm.value );
      this.submitFormEmit.emit(this.moduleForm.value);
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      /** Llamado de los servicios para las listas */
      this.getListDepart();
      this.getListEdificios();

      if (this.paramOID != 0) {
        this.onSearchId(this.paramOID, this.authorization);
      }
    });
  }

  /*
  * param - id del rol a buscar
  * param - authori variable de la autorizacion del localstorage
  */
  onSearchId(id, authori) {

    // loading Active
    this.sweetAlertService.sweetLoading();
    let params = {
      id: this.paramOID
    };

    this.restService.restGetParams( this.versionApi + 'gestionArchivo/espacio-fisico/index-one', params, authori).subscribe(
      (res) => {
        this.resSerFormSubmit = res;
        // console.log( this.resSerFormSubmit );
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerFormSubmit, true, this.redirectionPath ).then((res) => {
          let resResolveResponse = res;
          if (resResolveResponse == true) {
            if (this.resSerFormSubmit.data) {
              for (let name in this.resSerFormSubmit.data) {
                if (this.moduleForm.controls[name]) {
                  this.moduleForm.controls[name].setValue(this.resSerFormSubmit.data[name]);
                }
                // Hace llamado a municios
                if ( name == 'idDepartamentoGaEdificio' ) {
                  this.getListMunicipio(this.resSerFormSubmit.data[name]);
                }
                // Asigna el valor al numero piso
                if ( name == 'numeroGaPiso'){
                  this.moduleForm.controls['numeroPiso'].setValue(this.resSerFormSubmit.data[name]);
                }
              }

              if (this.resSerFormSubmit.canUpdate == false) {
                this.moduleForm.controls['nombreGaEdificio'].disable();
                this.moduleForm.controls['idDepartamentoGaEdificio'].disable();
                this.moduleForm.controls['idMunicipioGaEdificio'].disable();
                this.moduleForm.controls['numeroPiso'].disable();
              }
            }
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.resSerFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, true, this.redirectionPath ).then((res) => { });
      }
    );
  }

  typeInputEdificio = 'input' // input | select
  changeInputEdificio(){
    if(this.typeInputEdificio == 'input'){
      this.typeInputEdificio = 'select';
    }else{
      this.typeInputEdificio = 'input';
    }
  }

  onSelectEdificio(event){
    this.moduleForm.controls['nombreGaEdificio'].setValue(this.moduleForm.controls['selectGaEdificio'].value);
    this.typeInputEdificio = 'input'
  }

  /**
   * funcion que agrega el item al formulario
   */
  addItem () {

      // let numPiso = (this.moduleForm.controls['numeroPiso'].value != '' ? this.moduleForm.controls['numeroPiso'].value : 1 );
      let numPiso = this.moduleForm.controls['numeroPiso'].value;
      let nomBodega = this.moduleForm.controls['nombreGaBodega'].value;
      let canRack = this.moduleForm.controls['cantidadRackGaBodegaContenido'].value;
      let canEstante = this.moduleForm.controls['cantidadEstanteGaBodegaContenido'].value;
      let canEntrepanyo = this.moduleForm.controls['cantidadEntrepanoGaBodegaContenido'].value;
      let canCaja = this.moduleForm.controls['cantidadCajaGaBodegaContenido'].value;
      let cuerpo = this.moduleForm.controls['cuerpoGaBodegaContenido'].value;
      // Verifica los mensajes según el idioma
      this.sweetAlertService.text18nGet().then( (res) => {
        this.dataLang = res;
        // Valida piso
        if ( numPiso == '' ) {
          this.sweetAlertService.sweetInfo('Algo está mal', [this.dataLang['El piso es obligatorio']]);
          return false;
        }
        // Valida nombre del área de archivo (anteriromente bodega)
        else if ( nomBodega == '' ) {
          this.sweetAlertService.sweetInfo('Algo está mal', [this.dataLang['El área de archivo es obligatoria']]);
          return false;
        }

        let data = {
          numeroGaPiso: numPiso ? numPiso : 1,
          nombreGaBodega: nomBodega,
          cantidadRackGaBodegaContenido: ( canRack != '' && canRack != 0 ? canRack : 1),
          cantidadEstanteGaBodegaContenido: ( canEstante != '' && canEstante != 0 ? canEstante : 1),
          cantidadEntrepanoGaBodegaContenido: (canEntrepanyo != '' && canEntrepanyo != 0 ? canEntrepanyo : 1),
          cantidadCajaGaBodegaContenido: (canCaja != '' && canCaja != 0 ? canCaja : 1),
          cuerpoGaBodegaContenido: cuerpo
        };

        this.createItem(data);
      });

  }

  /**
   * Metodo que crea un item
   * @param data del remitente
   */
  createItem(data) {

    // Data del contenido del área de archivo (anteriromente bodega)
    let dataBodega = {
      cantidadRackGaBodegaContenido: data.cantidadRackGaBodegaContenido,
      cantidadEstanteGaBodegaContenido: data.cantidadEstanteGaBodegaContenido,
      cantidadEntrepanoGaBodegaContenido: data.cantidadEntrepanoGaBodegaContenido,
      cantidadCajaGaBodegaContenido: data.cantidadCajaGaBodegaContenido,
      cuerpoGaBodegaContenido: data.cuerpoGaBodegaContenido
    };

    // Estructura del área de archivo con el cotenido del área de archivo (anteriromente bodega)
    let estructura: any = {};
    estructura[data.nombreGaBodega] = dataBodega;
    // Verifica si existe el piso
    if (this.dataForm.hasOwnProperty(data.numeroGaPiso)) {
      // Valida si existe el área de archivo (anteriromente bodega)
      if (this.dataForm[data.numeroGaPiso]['nombreGaBodega'].hasOwnProperty(data.nombreGaBodega)) {
        // Asigna los valores al área de archivo existente (anteriromente bodega)
        this.validarRegistroExistente(this.dataForm[data.numeroGaPiso]['nombreGaBodega'][data.nombreGaBodega] , dataBodega);
        this.dataForm[data.numeroGaPiso]['nombreGaBodega'][data.nombreGaBodega] = dataBodega;
      } else {
        // crea el área de archivo con el contenido (anteriromente bodega)
        Object.assign(this.dataForm[data.numeroGaPiso]['nombreGaBodega'], estructura);
      }
    } else {
      // crea el piso con el área de archivo (anteriromente bodega)
      this.dataForm[data.numeroGaPiso] = {'nombreGaBodega' : estructura };
    }
  }

  validarRegistroExistente(data1, data2) {
    if (
      data1.cantidadCajaGaBodegaContenido == data2.cantidadCajaGaBodegaContenido &&
      data1.cantidadEntrepanoGaBodegaContenido == data2.cantidadEntrepanoGaBodegaContenido &&
      data1.cantidadRackGaBodegaContenido == data2.cantidadRackGaBodegaContenido &&
      data1.cantidadEstanteGaBodegaContenido == data2.cantidadEstanteGaBodegaContenido &&
      data1.cuerpoGaBodegaContenido == data2.cuerpoGaBodegaContenido
    ) {
      let errors = { error: this.translate.instant('Estos datos han sido ingresados ​​previamente') };
      this.sweetAlertService.sweetInfo('Algo está mal', errors);
    }
  }

  /**
   * Funcion que elimina los valores agregados en un objeto tiene que tener minimo un piso y un área de archivo (anteriromente bodega)
   * @param index Key de objeto
   * @param campo
   * @param piso // Solo se envia cuando es área de archivo (anteriromente bodega)
   */
  deleteItem(index, campo, piso = 0 ) {
    switch (campo) {
      case 'Piso':
          if ( Object.keys(this.dataForm).length > 1 ) {
            delete this.dataForm[index];
          }
      break;
      case 'Bodega':
        // console.log(  Object.keys(this.dataForm[piso]['nombreGaBodega']).length );
        if ( Object.keys(this.dataForm[piso]['nombreGaBodega']).length > 1 ) {
          delete this.dataForm[piso]['nombreGaBodega'][index];
        }
      break;

    }
  }

  // Llama la lista de los edificios
  getListEdificios() {

    this.restService.restGet(this.versionApi + 'gestionArchivo/espacio-fisico/list-edificios', this.authorization).subscribe(
      (data) => {
        this.resSerlistEdificios = data;
        //Evaluar la respuesta del servcicio
        this.globalAppService.resolveResponse(this.resSerlistEdificios).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listEdificios = this.resSerlistEdificios.dataidGaEdificio;
            //load the list initial
            this.filteredlistEdificios.next(this.listEdificios.slice());
          }
        });
      }, (err) => {
        this.resSerlistEdificiosErr = err.message;
        // Evalua respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistEdificiosErr).then((res) => {})
      }
    );
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
            this.filteredlistCuerpo.next(this.listCuerpo.slice());
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

  /**Function only nunmber  */
  isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  /**
   *
   * @param event
   * Cuando se hace clic en el botón se envia el formulario
   */
  menuPrimaryReceiveData(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById('sendForm');
    buttonSubmit.click();
  }

  /** Métodos para el uso de la internacionalización */
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
    });
  }
  /** Fin Métodos para el uso de la internacionalización */

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }
}
