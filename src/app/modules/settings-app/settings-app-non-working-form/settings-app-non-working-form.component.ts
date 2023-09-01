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

import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';


@Component({
  selector: 'app-settings-app-non-working-form',
  templateUrl: './settings-app-non-working-form.component.html',
  styleUrls: ['./settings-app-non-working-form.component.css']
})
export class SettingsAppNonWorkingFormComponent implements OnInit {

  public minDate: Date;
  public maxDate: Date;

  @Output() public submitFormEmit = new EventEmitter<any>();
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Formulario principal de proveedores';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'alarm_off';
  @Input() initCardHeaderIconDatos = 'library_books';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting/providers-index' },
  ];
  @Input() breadcrumbRouteActive = 'Proveedores de envío';
  // Valida typo
  validTextType: boolean = false;
  // Autentificacion
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/setting/providers-index';
  // Variable del formulario
  moduleForm: UntypedFormGroup;
  // Variables de consumo de servicios
  resSerSeachId: any;
  resSerSeachIdErr: any;
  resResolveResponse: any;
  resResolveResponseErr: any;
  // Variables para el boton flotante
  iconMenu: string = 'save';

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public restService: RestService,
    public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear);
    this.maxDate = new Date(currentYear + 1, 11, 31);

    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      fechaCgDiaNoLaborado: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
  }

  submitForm() {
    if (this.moduleForm.valid) {
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

    this.restService.restGetParams( this.versionApi + 'configuracionApp/dias-no-laborados/index-one', params, authori).subscribe(
      (res) => {
        this.resSerSeachId = res;
        // console.log( this.resSerSeachId );
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerSeachId, true, this.redirectionPath ).then((res) => {
          this.resResolveResponse = res;
          if (this.resResolveResponse == true) {
            if (this.resSerSeachId.data) {
              for (let name in this.resSerSeachId.data) {
                if (this.moduleForm.controls[name]) {
                  this.moduleForm.controls[name].setValue(this.resSerSeachId.data[name]);
                }
              }
            }
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.resSerSeachIdErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerSeachIdErr, true, this.redirectionPath ).then((res) => { });
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

}
