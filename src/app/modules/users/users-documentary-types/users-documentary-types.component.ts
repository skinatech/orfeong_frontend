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

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from 'src/app/services/activate-translate.service';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-users-documentary-types',
  templateUrl: './users-documentary-types.component.html',
  styleUrls: ['./users-documentary-types.component.css']
})
export class UsersDocumentaryTypesComponent implements OnInit, OnDestroy {

  // Datos del formulario
  textButtonForm = 'Actualizar'; // Nombre del boton
  textFormRol = 'Modificar tipos documentales del perfil'; // Nombre del formulario
  initCardHeaderIcon = 'person'; // Icono del formulario
  // Autentificacion
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  paramName: string;
  paramOName: string;
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de usuarios', 'route': '/users' },
    { 'name': 'Administrar perfiles', 'route': '/users/roles-index' }
  ];
  breadcrumbRouteActive = 'Actualizar tipos documentales';

  /**
   * Configuraciones para los servicios
   */
  responseServiceDocumentary: any;
  responseServiceDocumentaryErr: any;
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  form: UntypedFormGroup;
  modulos: any;
  operations: any;
  dataOperationsTrue: Array<any> = [];
  /** Boton flotante */
  iconMenu: string = 'save';

  /** Variables de internacionalización */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  msgSelectMinPermiso = {
    'es': 'El perfil debe tener al menos un acceso habilitado',
    'en': 'The profile must have at least one access enabled',
    'br': 'O perfil deve ter pelo menos um acesso ativado',
  };

  constructor( private router: Router, private route: ActivatedRoute, public lhs: LocalStorageService, private formBuilder: UntypedFormBuilder,
    private translate: TranslateService, private activateTranslateService: ActivateTranslateService, public restService: RestService,
    public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService ) {
    this.paramiD = this.route.snapshot.paramMap.get('id'); // Se recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
    this.paramName = this.route.snapshot.paramMap.get('name'); // Se recibe el Nombre
    this.paramOName = ConvertParamsBase64Helper(this.paramName); // Se pasa al html como componete para que reciba el Nombre
   }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
    /**
     * Configuración del formulario para el login
     */
    this.form = this.formBuilder.group({
      idRol: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      idGdTrdTipoDocumental: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });

    // Detecta el lenguaje que esta en el local storage
    this.detectLanguageInitial();
    this.detectLanguageChange();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.getDocumentaryTypesAll( this.authorization );
    });
  }

  getDocumentaryTypesAll( val ) {

    // this.sweetAlerparamOIDtService.sweetLoading();
    let versionApi = environment.versionApiDefault;
    let params = {
      id: this.paramOID
    };

    this.restService.restGetParams(versionApi + 'configuracionApp/tipos-documental/index-all', params, val)
      .subscribe((res) => {
        this.responseServiceDocumentary = res;

        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceDocumentary, true, '/users/roles-index').then( ( res ) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.modulos = this.responseServiceDocumentary.data.modulos;
            this.operations = this.responseServiceDocumentary.data.operaciones;
          }
        });
      }, (err) => {
        this.responseServiceDocumentaryErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceDocumentaryErr, true, '/users/roles-index').then((res) => { });
      }
    );

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

  submit() {

    this.dataOperationsTrue.length = 0; // Limpio el array que contiene los ids de las operaciones
    this.toAssignOperatios(); // Se Corre el metodo que contiene la asiganación de ids de las operaciones
    this.form.controls['idRol'].setValue( this.paramOID ); // Id del rol
    this.form.controls['idGdTrdTipoDocumental'].setValue(this.dataOperationsTrue); // Se pasa el array de ids al campo del formulario

    let versionApi = environment.versionApiDefault;

    if (this.form.valid) {
      if (this.dataOperationsTrue.length === 0) {
        this.sweetAlertService.sweetInfo( 'Algo está mal', [this.msgSelectMinPermiso[this.activeLang]]);
      } else {
        // console.log( this.form.value );
        this.restService.restPut(versionApi + 'roles/roles/create-rol-tipo-documental', this.form.value, this.authorization)
          .subscribe((res) => {
            this.responseServiceFormSubmit = res;
            // Evaluar respuesta del servicio
            this.globalAppService.resolveResponse(this.responseServiceFormSubmit, true, '/users/roles-index').then((res) => {
              let responseResolveResponse = res;
              if (responseResolveResponse == true) {
                // Guarda en el local storage el mensaje
                localStorage.setItem('setFlashText', this.responseServiceFormSubmit.message);
                // Redirecciona a la pagina principal
                this.router.navigate(['/users/roles-index']);
                // Cargando false
                this.sweetAlertService.sweetClose();
              }
            });
          }, (err) => {
            this.responseServiceFormSubmitErr = err;
            // Evaluar respuesta de error del servicio
            this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, true, '/users/roles-index').then((res) => { });
          }
        );
      }

    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }

  }

  /** Metodo para asignar los ids de las operaciones a un array y ese array pasarlo al formulario en el campo operacionesRol */
  toAssignOperatios() {
    this.modulos.forEach(modules => {
        this.operations[modules.name].forEach(operations => {
            if (operations.value == true) {
                this.dataOperationsTrue.push(operations.id);
            }
        });
    });
  }

  validateInputParent(e) {
    this.modulos.forEach(modules => {
      // console.log(modules);
        if (modules.name == e.target.value) {
            modules.value = e.target.checked;
        }
    });

    this.operations[e.target.value].forEach(modules => {
        modules.value = e.target.checked;
    });
  }

  validateInputChildren(e) {
    this.operations[e.target.name].forEach(operations => {
        if (operations.id == e.target.value) {
            operations.value = e.target.checked;
        }
    });

    if (e.target.checked) {
        let countModuleOperation = this.operations[e.target.name].length;
        this.operations[e.target.name].forEach(operations => {
            if (operations.value == e.target.checked) {
                countModuleOperation = countModuleOperation - 1;
            }
        });

        if (countModuleOperation == 0) {
            this.modulos.forEach(modules => {
                if (modules.name == e.target.name) {
                    modules.value = true;
                }
            });
        }

    } else {
        this.modulos.forEach(modules => {
            if (modules.name == e.target.name) {
                modules.value = false;
            }
        });
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
