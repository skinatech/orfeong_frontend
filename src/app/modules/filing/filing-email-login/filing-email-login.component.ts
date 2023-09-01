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

import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';


import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AuthService } from 'src/app/services/auth.service';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filing-email-login',
  templateUrl: './filing-email-login.component.html',
  styleUrls: ['./filing-email-login.component.css']
})
export class FilingEmailLoginComponent implements OnInit {

  // Variables del formulario
  moduleForm: UntypedFormGroup;
  // Autentificacion
  authorization: string;
  initCardHeaderIcon = 'assignment';
  textForm = 'Radicación email';

  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Radicación', 'route': '/filing' }
  ];
  @Input() breadcrumbRouteActive = 'Radicación email';

  /**
   * Configuraciones para los servicios
   */
  responseLogin: any;
  responseLoginErr: any;
  // Version api
  versionApi = environment.versionApiDefault;

  constructor( private formBuilder: UntypedFormBuilder,
               private router: Router,
               private authService: AuthService,

               public globalAppService: GlobalAppService,
               public sweetAlertService: SweetAlertService,
               public restService: RestService,
               public lhs: LocalStorageService) {
    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      username: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      password: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  ngOnInit() {
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  submitForm() {

      //this.moduleForm.controls['recaptcha'].setValue(null); // Limpiando el valor del campo captcha utilizado
      this.sweetAlertService.sweetLoading();
      
      this.restService.restPost(this.versionApi + 'radicacion/radicacion-email/login-email', this.moduleForm.value ,this.authorization).subscribe((data) => {

        this.responseLogin = data; 
    
        this.globalAppService.resolveResponse(this.responseLogin).then((res) => {
          let responseResolverRespuesta = res;
          if (responseResolverRespuesta == true) {

            if(!this.responseLogin.connection){
              this.sweetAlertService.sweetInfo('Algo está mal', this.responseLogin.message);
            }else{
              
              //Construccion de solo data para login
              let dataUser = {
                data: this.responseLogin.data,
                userLoginApp: this.responseLogin.userLoginApp
              };
              localStorage.removeItem( environment.hashMailInitialListSkina );
              localStorage.setItem(environment.hashMailSkina, this.authService.encryptAES( dataUser, false) );

              this.sweetAlertService.sweetClose();
              this.router.navigate(['/filing/filing-email-index']);

            }
          } 
        });
    
      }, (err) => {
        this.responseLoginErr = err;
        let errorService = {
          error: ['Error de conexión']
        };
        this.sweetAlertService.sweetInfo('Algo está mal', errorService);
      });

  }

}
