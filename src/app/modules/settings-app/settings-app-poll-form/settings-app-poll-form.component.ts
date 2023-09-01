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
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from '../../../services/activate-translate.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-settings-app-poll-form',
  templateUrl: './settings-app-poll-form.component.html',
  styleUrls: ['./settings-app-poll-form.component.css']
})
export class SettingsAppPollFormComponent implements OnInit, OnDestroy {

  @Output() public submitFormEmit = new EventEmitter<any>();
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Formulario principal de encuesta';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'rule';
  @Input() initCardHeaderIconDatos = 'library_books';
  // Ruta a redirigir
  redirectionPath = '/setting/poll-index';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Configuración', 'route': this.redirectionPath },
  ];
  @Input() breadcrumbRouteActive = 'Encuesta';
  // Parametro para agregar edificios
  @Input() statusButtonAdd: boolean = false;
  /** Las variables para mostrar la alerta informativa  */
  @Input() initialNotificationClassAlert: string = 'alert alert-info alert-with-icon';
  @Input() initialNotificationMessageArray: any = [ 'textFormSurvey' ];
  // Valida typo
  validTextType: boolean = false;
  // Variable del formulario
  moduleForm: UntypedFormGroup;
  // Autentificacion
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Variables de consumo de servicios
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;
  // Variables para el boton flotante
  iconMenu: string = 'save';

  /** Variables de internacionalización */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public restService: RestService, public sweetAlertService: SweetAlertService,
    public globalAppService: GlobalAppService, private translate: TranslateService, private activateTranslateService: ActivateTranslateService) {
    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      nombreCgEncuesta: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      /*preguntaCgEncuestaPregunta: new FormControl('', Validators.compose([
        Validators.required
      ])),*/
      preguntas: this.formBuilder.array([]),
    });

    this.detectLanguageInitial();
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
    this.detectLanguageChange();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      // Busca registro
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

    this.restService.restGetParams( this.versionApi + 'configuracionApp/encuestas/index-one', params, authori).subscribe(
      (res) => {
        this.resSerFormSubmit = res;
        // console.log( this.resSerFormSubmit );
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerFormSubmit, true, this.redirectionPath ).then((res) => {
          let resResolveResponse = res;
          if (resResolveResponse == true) {
            if (this.resSerFormSubmit.data) {
              for (let name in this.resSerFormSubmit.data) {
                if (this.moduleForm.controls[name] && name != 'preguntas') {
                  this.moduleForm.controls[name].setValue(this.resSerFormSubmit.data[name]);
                }
                if (name == 'preguntas') {
                  // console.log(this.resSerFormSubmit.data[name]);
                  for ( let valPre in this.resSerFormSubmit.data.preguntas) {
                    this.addItem(this.resSerFormSubmit.data.preguntas[valPre]);
                  }
                }
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

  submitForm() {
    if (this.moduleForm.valid) {
      if (this. moduleForm.get('preguntas')['controls'].length == 0) {
        let errors = { error: this.translate.instant('La encuesta debe contener al menos una pregunta') };
        this.sweetAlertService.sweetInfo('Algo está mal', errors);
      } else {
        this.submitFormEmit.emit(this.moduleForm.value);
      }
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  /**
   * Metodo que crea un item en un formArray con la información de los remitentes
   */
  addItem( data: string = '' ) {
    const preg = this.moduleForm.get('preguntas') as UntypedFormArray;
    // this.preguntas = this.moduleForm.get('preguntas') as FormArray;
    preg.push(this.formBuilder.group({
      preguntaCgEncuestaPregunta: new UntypedFormControl( data, Validators.compose([
        Validators.required
      ])),
    }));
  }

  /**
   * Elimina todos las preguntas
   * @param data es el index del formArray de preguntas
   */
  deleteAllItem(data) {
    const preg = this.moduleForm.get('preguntas') as UntypedFormArray;
    preg.removeAt(data);
  }

  /**
   * @param event
   * Cuando se hace clic en el botón se envia el formulario
   */
  menuPrimaryReceiveData(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById('sendForm');
    buttonSubmit.click();
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
