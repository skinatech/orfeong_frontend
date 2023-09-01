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

import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { ActivateTranslateService } from 'src/app/services/activate-translate.service';

import { PasswordValidator } from "../../../custom-validators/password.validator";
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-users-users-form',
  templateUrl: './users-users-form.component.html',
  styleUrls: ['./users-users-form.component.css']
})
export class UsersUsersFormComponent implements OnInit, OnDestroy {

  @ViewChild('inputFile', { static: true }) inputFile: ElementRef;
  @Output() public submitFormEmit = new EventEmitter<any>();
  // Autentificacion
  authorization: string;
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre del boton
  @Input() textButtonForm = 'Enviar';
  // Nombre de tarjetas del formulario
  @Input() textFormRol = 'Formulario principal de usuarios';
  @Input() textFormDatos = 'Datos del usuario';
  // Valida nombre rol
  validTextType: boolean = false;
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'person';
  @Input() initCardHeaderIconDatos = 'library_books';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Gestión de usuarios', 'route': '/users/users-index/false' }
  ];
  @Input() breadcrumbRouteActive = 'Administrar usuarios';
  @Input() maxSize:number = 5242880; // Maximo de peso permitido por defecto 5MB
  @Input() maxSizeText: string = '5MB';
  @Input() validateFile: any = [{ type: 'png' }];
  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  /** lists filtered + namelist by search keyword */
  filteredlistTipIdens: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistRoles: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistTipUsers: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistDependencias: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  /** Variables para llamarlas listas de tipos de identificacion */
  responseServicelistTipIdens: any;
  responseServicelistTipIdensErr: any;
  listTipIdens: any;
  /** Variables para llamarlas listas de tipos de usuario */
  responseServicelistTipUsers: any;
  responseServicelistTipUsersErr: any;
  listTipUsers: any;
  /** Variables para llamarlas listas de roles */
  responseServicelistRoles: any;
  responseServicelistRolesErr: any;
  listRoles: any;
  /** Variables para llamarlas listas de dependencias */
  responseServicelistDependencias: any;
  responseServicelistDependenciasErr: any;
  listDependencias: any;

  notificationErrExtArray: any = [];
  notificationErrExt: string = 'Solo es permitido archivos';
  resSerLenguage: any;

  /** Validaciones de moduleForm */
  validNumberType: boolean = false;
  validEmailType: boolean = false;

  mensaMinCaracteres: boolean = false;
  contrasenaIgual: boolean = false;
  /**Variable del formulario */
  moduleForm: UntypedFormGroup;

  listsldap: any = [
    { id: 10, val: 'Si' },
    { id: 0, val: 'No' },
  ];

  iconMenu: string = 'save';

  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  viewFirma: boolean = false;
  imagePathFirma: string = '';

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public sweetAlertService: SweetAlertService, public restService: RestService, private authService: AuthService, public globalAppService: GlobalAppService, private activateTranslateService: ActivateTranslateService, private translate: TranslateService) {
    /**
     * Configuración del formulario para el login
     */
    this.moduleForm = this.formBuilder.group(
      {
        idUserTipo: new UntypedFormControl('', Validators.compose([
          Validators.required
        ])),
        idRol: new UntypedFormControl('', Validators.compose([
          Validators.required
        ])),
        nombreUserDetalles: new UntypedFormControl('', Validators.compose([
          Validators.required
        ])),
        apellidoUserDetalles: new UntypedFormControl('', Validators.compose([
          Validators.required
        ])),
        idTipoIdentificacion: new UntypedFormControl('', Validators.compose([
          Validators.required
        ])),
        documento: new UntypedFormControl('', Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$")
        ])),
        email: new UntypedFormControl('', Validators.compose([
          Validators.required,
          Validators.email
        ])),
        cargoUserDetalles: new UntypedFormControl('', Validators.compose([
          Validators.required
        ])),
        ldap: new UntypedFormControl('', Validators.compose([
          Validators.required
        ])),
        idGdTrdDependencia: new UntypedFormControl('', Validators.compose([
          Validators.required
        ])),
        username: new UntypedFormControl('', Validators.compose([
          Validators.required
        ])),
        fileUpload: new UntypedFormControl('', Validators.compose([
          // Validators.required
        ])),
        password: new UntypedFormControl(
          "",
          Validators.compose([
            Validators.minLength(6)
            // Validators.required,
            //Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[$@$!%*?&¿¡!~#]).{6,30}')
          ])
        ),
        passwordConfirma: new UntypedFormControl(
          "",
          Validators.compose([Validators.minLength(6) ])
        ),
        /** Campos para hacer la busqueda en las listas este deben llamarse 
         * Como las listas + Filter
         */
        listTipUsersFilter: new UntypedFormControl('', Validators.compose([
          // Validators.required
        ])),
        listRolesFilter: new UntypedFormControl('', Validators.compose([
          // Validators.required
        ])),
        listTipIdensFilter: new UntypedFormControl('', Validators.compose([
          // Validators.required
        ])),
        listDependenciasFilter: new UntypedFormControl('', Validators.compose([
          // Validators.required
        ])),
      },
      { validator: this.checkIfMatchingPasswords("password", "passwordConfirma") }
    );
  }

  ngOnInit() {
    // Posicionando scroll al inicio
    window.scroll(0, 0);
    // Hace el llamado del token
    this.getTokenLS();

    // listen for search field value changes
    this.moduleForm.controls['listTipUsersFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listTipUsers');
      });

    // listen for search field value changes
    this.moduleForm.controls['listRolesFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listRoles');
    });

    // listen for search field value changes
    this.moduleForm.controls['listTipIdensFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listTipIdens');
    });

    // listen for search field value changes
    this.moduleForm.controls['listDependenciasFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
    this.filterBanks('listDependencias');
    });

    /**
     * Detectando si se ejecuta cambio de idioma
     */
    this.detectLanguageChange();

  }

  /**
   * Método de analiza si es un correo válido y lo separa en partes para obtener el nombre del usuario
   * de ser válido, le sugiere al usuario si se coloca el valor que se encuentra antes del @ en el campo "username"
   */
   onChangeEmail() {
    var emailValue = this.moduleForm.controls['email'].value;
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(emailValue)) {
      var emailAnalize = /^([^]+)@(\w+).(\w+)$/.exec(emailValue);
      var [,nombre,servidor,dominio] = emailAnalize;

      if (nombre != this.moduleForm.controls['username'].value) {
        let titleMsg = this.translate.instant('titleMsgChangeUsername');
        let textMsg = this.translate.instant('textMsgChangeUsername') + nombre + '?';
        let bntCancelar = this.translate.instant('bntCancelar');
        let btnConfirmacion = this.translate.instant('btnConfirmar');
  
        swal({
          title: titleMsg,
          text: textMsg,
          type: 'info',
          showCancelButton: true,
          cancelButtonText: bntCancelar,
          confirmButtonText: btnConfirmacion,
          cancelButtonClass: 'btn btn-danger',
          confirmButtonClass: 'btn btn-success',
          buttonsStyling: false
        }).then((result) => {
          if (result.value) {
            this.moduleForm.controls['username'].setValue(nombre);
          }
        });
      }
    }
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: UntypedFormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      let cant = passwordInput.value.length;
      if (cant > 0 && cant < 6) {
        this.mensaMinCaracteres = true;
      } else {
        this.mensaMinCaracteres = false;
      }
      if (passwordInput.value !== passwordConfirmationInput.value) {
        this.contrasenaIgual = true;
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        this.contrasenaIgual = false;
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      /** Llamado de los servicios */
      this.getListUserTipo();
      this.getListRoles();
      this.getListidentifi();
      this.getDependencias();

      if (this.paramOID != 0) {
        this.onSearchId(this.paramOID, this.authorization);
      }
    });
  }

  submitForm() {
    if (this.moduleForm.valid) {
      const formData = new FormData();
      formData.append('fileUpload', this.moduleForm.get('fileUpload').value);
      this.submitFormEmit.emit({ dataForm: this.moduleForm.value, dataFile: formData});
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  getListidentifi() {
    let versionApi = environment.versionApiDefault;
    this.authService.authGet(versionApi + 'site/id-type-index').subscribe(
      (data) => {
        this.responseServicelistTipIdens = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServicelistTipIdens, true, '/users/users-index/false').then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listTipIdens = this.responseServicelistTipIdens.data;
            // load the initial list
            this.filteredlistTipIdens.next(this.listTipIdens.slice());
          }
        });
      }, (err) => {
        this.responseServicelistTipIdensErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServicelistTipIdensErr, true, '/users/users-index/false').then((res) => { });
      }
    );
  }

  getListUserTipo() {
    let versionApi = environment.versionApiDefault;
    this.restService.restGet(versionApi + 'users/user-tipo/index', this.authorization).subscribe(
      (data) => {
        this.responseServicelistTipUsers = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServicelistTipUsers, true, '/users/users-index/false').then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listTipUsers = this.responseServicelistTipUsers.data;
            // load the initial list
            this.filteredlistTipUsers.next(this.listTipUsers.slice());
          }
        });
      }, (err) => {
        this.responseServicelistTipUsersErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServicelistTipUsersErr, true, '/users/users-index/false').then((res) => { });
      }
    );
  }

  getListRoles() {
    let versionApi = environment.versionApiDefault;
    this.restService.restGet(versionApi + 'roles/roles/index-list', this.authorization).subscribe(
      (data) => {
        this.responseServicelistRoles = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServicelistRoles).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listRoles = this.responseServicelistRoles.data;
            // load the initial list
            this.filteredlistRoles.next(this.listRoles.slice());
          }
        });
      }, (err) => {
        this.responseServicelistRolesErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServicelistRolesErr).then((res) => { });
      }
    );
  }

  getDependencias() {
    let versionApi = environment.versionApiDefault;
    this.restService.restGet(versionApi + 'gestionDocumental/trd-dependencias/index-list', this.authorization).subscribe(
      (data) => {
        this.responseServicelistDependencias = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServicelistDependencias).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listDependencias = this.responseServicelistDependencias.data;
            // load the initial list
            this.filteredlistDependencias.next(this.listDependencias.slice());
          }
        });
      }, (err) => {
        this.responseServicelistDependenciasErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServicelistDependenciasErr).then((res) => { });
      }
    );

  }

  /*
  * param - id del rol a buscar
  * param - authori variable de la autorizacion del localstorage
  */
  onSearchId(id, authori) {
    this.sweetAlertService.sweetLoading();
    let params = {
      id: this.paramOID
    };

    this.restService.restGetParams(environment.versionApiDefault + 'user/index-one', params, authori).subscribe(
      (res) => {
        this.responseServiceFormSubmit = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceFormSubmit, true, '/users/').then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            if (this.responseServiceFormSubmit.data) {
              for (let name in this.responseServiceFormSubmit.data) {
                if (this.moduleForm.controls[name]) {
                  this.moduleForm.controls[name].setValue(this.responseServiceFormSubmit.data[name]);
                }
              }
            }
            if (this.responseServiceFormSubmit.datafile) {
              this.renderImg(this.responseServiceFormSubmit.datafile);
            }
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.responseServiceFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, true, '/users/users-index').then((res) => { });
      }
    );
  }

  renderImg(file) {
    this.imagePathFirma = file;
    this.viewFirma = true;
  }

  numberValidationType(e) {
    if (e) {
      this.validNumberType = true;
    } else {
      this.validNumberType = false;
    }
  }

  /**
   * Por cada archivo permite validar lo
   * @param event
   */
  onSelectedFile(event) {

    if (event.target.files.length > 0) {

      // console.log(event.target.files[0]);

      this.validateFileExtension(event.target.files[0]).then((res) => {
        if (res) {
          // if (event.target.files[0].size > this.maxSize) {
            /*let msjmaxTamanyo: any;

            this.sweetAlertService.text18nGet().then((res) => {
              this.resSerLenguage = res;
              msjmaxTamanyo = this.resSerLenguage['Solo es permitido cargar'];
              msjmaxTamanyo = msjmaxTamanyo + ' ' + this.maxSizeText;
              this.sweetAlertService.sweetInfoText('El archivo es muy pesado', msjmaxTamanyo );
            });*/

          // } else {
            this.moduleForm.controls['fileUpload'].setValue(event.target.files[0]);

          // }
        } else {
          this.sweetAlertService.sweetInfoText('Archivo no válido', this.notificationErrExt + ' ' + this.notificationErrExtArray.join());
          // this.inputFile.nativeElement.value = '';
        }
      });
    }
  }

  /**
   * Valida la extensión del archivo que será cargado
   * @param nameFile nombre del archivo a cargar
   */
  validateFileExtension(nameFile) {
    return new Promise<boolean>((resolve) => {
      let extensionAcepted = false;
      this.notificationErrExtArray = [];
      // const extension = nameFile.name.split('.')[1].toLowerCase();
      const extensionArr = nameFile.name.split('.');
      const extension = extensionArr.pop().toLowerCase();
      this.validateFile.forEach(element => {
        this.notificationErrExtArray.push("." + element.type);
        if (extension == element.type) {
          extensionAcepted = true;
        }
      });

      resolve(extensionAcepted);
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

  /**
   *
   * @param event
   * Cuando se hace clic en el botón se envia el formulario
   */
  menuPrimaryReceiveData(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById('sendForm');
    buttonSubmit.click();
  }

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

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }
}
