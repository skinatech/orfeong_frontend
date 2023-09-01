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

import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from "@angular/forms";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { environment } from "src/environments/environment";
import { RestService } from "src/app/services/rest.service";
import { GlobalAppService } from "src/app/services/global-app.service";
import { SweetAlertService } from "src/app/services/sweet-alert.service";

import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ThemePalette } from "@angular/material/core";

export interface ListaBusq {
  id: string;
  val: string;
}
@Component({
  selector: "app-doc-manag-folder-form",
  templateUrl: "./doc-manag-folder-form.component.html",
  styleUrls: ["./doc-manag-folder-form.component.css"],
})
export class DocManagFolderFormComponent implements OnInit {
  @Output() public submitFormEmit = new EventEmitter<any>();
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre de tarjetas del formulario
  @Input() textForm = "Formulario principal expediente";
  // Iconos del formulario
  @Input() initCardHeaderIcon = "fact_check";
  @Input() initCardHeaderIconDatos = "library_books";
  /** BreadcrumbOn  */
  @Input() statusBreadcrumbOn: boolean = true; // Muestra los BreadcrumbOn
  @Input() breadcrumbOn = [{ name: "Gestión documental", route: "/documentManagement" }];
  @Input() breadcrumbRouteActive = "Expedientes";
  @Input() cardRadiStatus: boolean = false;
  @Input() dataRadicados: any = [];
  // Valida typo
  validTextType: boolean = false;

  // Variable del formulario
  moduleForm: UntypedFormGroup;
  resResolveResponse: any;
  resResolveResponseErr: any;
  resSerlistSeries: any;
  resSerlistSeriesErr: any;
  resSerlistSubseries: any;
  resSerlistSubseriesErr: any;
  resSerlistDependencia: any;
  resSerlistDependenciaErr: any;
  resSerlistUser: any;
  resSerlistUserErr: any;

  // Autentificacion
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = "/setting/folder-index";
  // Variables de consumo de servicios
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;
  // Variables para el boton flotante
  iconMenu: string = "save";

  listSeries: any;
  listSubseries: any;
  listDependencias: any;
  listUsuarios: any;
  gdExpedientesDependencias: any;

  public minDate: Date;
  public maxDate: Date;

  /** slide-toggle  */
  color: ThemePalette = "primary";
  msgExisteFisicamente: string = "No";

  /** lists filtered + namelist by search keyword */
  filteredlistSeries: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistSubseries: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistDependencias: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredgdExpedientesDependencias: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistUsuarios: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    public lhs: LocalStorageService,
    public restService: RestService,
    public globalAppService: GlobalAppService,
    public sweetAlertService: SweetAlertService
  ) {
    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      nombreGdExpediente: new UntypedFormControl("", Validators.compose([Validators.required])),
      descripcionGdExpediente: new UntypedFormControl("", Validators.compose([Validators.required])),
      fechaProcesoGdExpediente: new UntypedFormControl("", Validators.compose([Validators.required])),
      existeFisicamenteGdExpediente: new UntypedFormControl(false, Validators.compose([Validators.required])),
      idGdTrdSerie: new UntypedFormControl("", Validators.compose([Validators.required])),
      idGdTrdSubserie: new UntypedFormControl("", Validators.compose([Validators.required])),
      idGdTrdDependencia: new UntypedFormControl("", Validators.compose([Validators.required])),
      idUser: new UntypedFormControl("", Validators.compose([Validators.required])),
      /** Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listSeriesFilter: new UntypedFormControl(
        "",
        Validators.compose([
          // Validators.required
        ])
      ),
      listSubseriesFilter: new UntypedFormControl(
        "",
        Validators.compose([
          // Validators.required
        ])
      ),
      listDependenciasFilter: new UntypedFormControl(
        "",
        Validators.compose([
          // Validators.required
        ])
      ),
      listUsuariosFilter: new UntypedFormControl(
        "",
        Validators.compose([
          // Validators.required
        ])
      ),
      idGdExpedientesDependencias: new UntypedFormControl(),
      gdExpedientesDependenciasFilter: new UntypedFormControl(),
    });
    // Asignación de fechas por defecto
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();

    // listen for search field value changes Series
    this.moduleForm.controls["listSeriesFilter"].valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterBanks("listSeries");
    });
    // listen for search field value changes Subseries
    this.moduleForm.controls["listSubseriesFilter"].valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterBanks("listSubseries");
    });
    // listen for search field value changes Dependencias
    this.moduleForm.controls["listDependenciasFilter"].valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterBanks("listDependencias");
    });
    // listen for search field value changes Usuarios
    this.moduleForm.controls["listUsuariosFilter"].valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterBanks("listUsuarios");
    });
    // listen for search field value changes Dependencias
    this.moduleForm.controls["gdExpedientesDependenciasFilter"].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks("gdExpedientesDependencias");
      });
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      if (this.paramOID != 0) {
        this.onSearchId(this.paramOID, this.authorization);
        this.validateInputsDisabled();
      } else {
        /** Llamado de los servicios para las listas */
        this.getListSeries();
        this.getListDependencia();
        this.getListDependenciaAll();
      }
    });
  }

  /** Campos a desactivar cuando es una actualización */
  validateInputsDisabled() {
    this.moduleForm.controls["idGdTrdSerie"].disable();
    this.moduleForm.controls["idGdTrdSerie"].updateValueAndValidity();
    this.moduleForm.controls["idGdTrdSubserie"].disable();
    this.moduleForm.controls["idGdTrdSubserie"].updateValueAndValidity();
    this.moduleForm.controls["idGdTrdDependencia"].disable();
    this.moduleForm.controls["idGdTrdDependencia"].updateValueAndValidity();
    this.moduleForm.controls["idUser"].disable();
    this.moduleForm.controls["idUser"].updateValueAndValidity();
  }

  submitForm() {
    if (this.moduleForm.valid) {
      // console.log( this.moduleForm.value );
      this.submitFormEmit.emit(this.moduleForm.value);
    } else {
      this.sweetAlertService.sweetInfo("Algo está mal", "");
    }
  }

  /*
   * param - id del rol a buscar
   * param - authori variable de la autorizacion del localstorage
   */
  onSearchId(id, authori) {
    // loading Active
    this.sweetAlertService.sweetLoading();
    const params = {
      id: this.paramOID,
    };

    this.restService
      .restGetParams(this.versionApi + "gestionDocumental/expedientes/index-one", params, authori)
      .subscribe(
        (res) => {
          this.resSerFormSubmit = res;
          // console.log( this.resSerFormSubmit );
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerFormSubmit, true, this.redirectionPath).then((res) => {
            let resResolveResponse = res;
            if (resResolveResponse == true) {
              if (this.resSerFormSubmit.data) {
                for (let name in this.resSerFormSubmit.data) {
                  if (this.moduleForm.controls[name]) {
                    this.moduleForm.controls[name].setValue(this.resSerFormSubmit.data[name]);
                  }
                }
              }

              /** Procesar listados que llegan en el mismo servicio */
              if (typeof this.resSerFormSubmit.listService != "undefined") {
                this.listSeries = this.resSerFormSubmit.listService.listSeries;
                this.filteredlistSeries.next(this.listSeries.slice());

                this.listSubseries = this.resSerFormSubmit.listService.listSubseries;
                this.filteredlistSubseries.next(this.listSubseries.slice());

                this.listDependencias = this.resSerFormSubmit.listService.listDependencias;
                this.filteredlistDependencias.next(this.listDependencias.slice());

                this.listUsuarios = this.resSerFormSubmit.listService.listUsuarios;
                this.filteredlistUsuarios.next(this.listUsuarios.slice());
              }
              /** Procesar listados que llegan en el mismo servicio */

              const paramsDepeAll = {
                idGdTrdDependencia: this.resSerFormSubmit.data.idGdTrdDependencia,
              };
              this.getListDependenciaAll("gestionDocumental/expedientes/dependencias-list-all-update", paramsDepeAll);

              this.sweetAlertService.sweetClose();
            }
          });
        },
        (err) => {
          this.resSerFormSubmitErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService
            .resolveResponseError(this.resSerFormSubmitErr, true, this.redirectionPath)
            .then((res) => {});
        }
      );
  }

  /**
   * Cuando se hace clic en el botón se envia el formulario
   * @param event
   */
  menuPrimaryReceiveData(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById("sendForm");
    buttonSubmit.click();
  }

  // Llama la lista de las servicios
  getListSeries() {
    this.restService
      .restGet(this.versionApi + "gestionDocumental/expedientes/series-list", this.authorization)
      .subscribe(
        (data) => {
          this.resSerlistSeries = data;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerlistSeries).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.listSeries = this.resSerlistSeries.data;
              // load the list initial
              this.filteredlistSeries.next(this.listSeries.slice());
            }
          });
        },
        (err) => {
          this.resSerlistSeriesErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerlistSeriesErr).then((res) => {});
        }
      );
  }

  // Llama la lista de las servicios
  getListSuberies(event) {
    let data = {
      id: event,
    };

    this.restService
      .restGetParams(this.versionApi + "gestionDocumental/expedientes/subseries-list", data, this.authorization)
      .subscribe(
        (data) => {
          this.resSerlistSubseries = data;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerlistSubseries).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.listSubseries = this.resSerlistSubseries.data;
              // load the list initial
              this.filteredlistSubseries.next(this.listSubseries.slice());
            }
          });
        },
        (err) => {
          this.resSerlistSubseriesErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerlistSubseriesErr).then((res) => {});
        }
      );
  }

  // Llama la lista de las Dependencias
  getListDependencia() {
    this.restService
      .restGet(this.versionApi + "gestionDocumental/expedientes/dependencias-list", this.authorization)
      .subscribe(
        (data) => {
          this.resSerlistDependencia = data;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerlistDependencia).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.listDependencias = this.resSerlistDependencia.data;
              // load the list initial
              this.filteredlistDependencias.next(this.listDependencias.slice());
            }
          });
        },
        (err) => {
          this.resSerlistDependenciaErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerlistDependenciaErr).then((res) => {});
        }
      );
  }

  getListDependenciaAll(route = "gestionDocumental/expedientes/dependencias-list-all", params = {}) {
    this.restService.restGetParams(`${this.versionApi}${route}`, params, this.authorization).subscribe(
      (responseApi) => {
        this.globalAppService.resolveResponse(responseApi).then((responseGlobal) => {
          if (responseGlobal == true) {
            this.gdExpedientesDependencias = responseApi.data;
            this.filteredgdExpedientesDependencias.next(this.gdExpedientesDependencias.slice());
          }
        });
      },
      (err) => this.globalAppService.resolveResponseError(err)
    );
  }

  // Llama la lista de las Funcionarios
  getListFuncionarios(value) {
    this.restService
      .restGet(this.versionApi + "gestionDocumental/expedientes/funcionarios-list", this.authorization)
      .subscribe(
        (data) => {
          this.resSerlistUser = data;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerlistUser).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              this.listUsuarios = this.resSerlistUser.data;
              // load the list initial
              this.filteredlistUsuarios.next(this.listUsuarios.slice());
            }
          });
        },
        (err) => {
          this.resSerlistUserErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerlistUserErr).then((res) => {});
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
    let search = this.moduleForm.controls[nomList + "Filter"].value;
    if (!search) {
      this["filtered" + nomList].next(this[nomList].slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this["filtered" + nomList].next(
      this[nomList].filter((listOption) => listOption.val.toLowerCase().indexOf(search) > -1)
    );
  }

  MatSlideToggleChangeMulti(event) {
    /** Evaluar si el imput esta checkeado como true o false */
    if (event.checked) {
      this.msgExisteFisicamente = "Si";
    } else {
      this.msgExisteFisicamente = "No";
    }
    /** Fin Evaluar si el imput esta checkeado como true o false */
  }

  onChangeGdExpedientesDependencias(value) {}
}
