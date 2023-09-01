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

import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router, Routes, ActivatedRoute } from '@angular/router';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConvertParamsBase64Helper } from '../../../helpers/convert-params-base64.helper';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from '../../../services/activate-translate.service';
import swal from 'sweetalert2';
import { EncryptService } from 'src/app/services/encrypt.service';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-filing-create',
  templateUrl: './filing-create.component.html',
  styleUrls: ['./filing-create.component.css']
})
export class FilingCreateComponent implements OnInit, OnDestroy {

    // Autorizacion de localstorage
    authorization: string;
    // Nombre del formulario
    textForm = 'Formulario principal de radicación'; // i18n
    // Ruta a redirigir
    redirectionPath = '/filing/filing-index/false';
    /** BreadcrumbOn  */
    @Input() breadcrumbOn = [
      { 'name': 'Radicación', 'route': '/filing' },
      { 'name': 'Radicación estándar', 'route': '/filing/filing-index/false' }
    ];
    breadcrumbRouteActive = 'Crear';

    // Ruta Submit
    routeSubmit = environment.apiUrl + environment.versionApiDefault + 'radicacion/radicados/create';

    // Version api
    versionApi = environment.versionApiDefault;
    fieldsDisable: boolean = false;

    /** Variablres para modulo de radiacación email */
    radicacionEmail: boolean = false;
    dataUserEmail: any;
    mailBox: string;
    dataEmail: any;
    dataMailSkina: any;
    hashMailSkina: any;
    affairStatus: boolean = false;
    affairmsg: string;
    fromAddressEmail: string;
    /**
     * Configuraciones para los servicios
     */
    resSerFormSubmit: any;
    resSerFormSubmitErr: any;

    // variable que guarda el id que llega por Get
    paramiD: string;
    paramOID: any = 0;

    paramsGET: string;
    paramsOGET: any;

    activeLang: string;
    languageReceive: any;
    subscriptionTranslateService$: Subscription;

     menuButtonsSelectOne: any = [

      { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
      { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
      { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },

    ];
    menuButtons: any = this.menuButtonsSelectOne;

    /** Variables para traer el texto de confirmacion */
    titleMsg: string;
    textMsg: string;
    bntCancelar: string;
    btnConfirmacion: string;
    resSerLenguage: any;
    validateDuplicate = true; // Valida si el radicado se puede duplicar

    constructor(public sweetAlertService: SweetAlertService, private route: ActivatedRoute, private authService: AuthService, public restService: RestService, public lhs: LocalStorageService,
      private translate: TranslateService, private activateTranslateService: ActivateTranslateService, private encryptService: EncryptService, private http: HttpClient,
      private router: Router, public globalAppService: GlobalAppService) {
      this.paramsGET = this.route.snapshot.paramMap.get('params'); // Se reciben el parametro GET
      /** Idioma inical */
      this.detectLanguageInitial();
    }

    ngOnInit() {
      /** Detectando si se ejecuta cambio de idioma */
      this.detectLanguageChange();
      // Hace el llamado del token
      this.getTokenLS();
      this.menuButtons = this.menuButtonsSelectOne;
      this.analizeGetParams();
    }

    /** Funcion que analiza el localStorage y los parametros recibidos para determinar el tipo de radicacion */
    analizeGetParams() {
      if (this.paramsGET != null) {

        // Obtener la informacion de la radicacion mail los parametros GET
        this.paramsOGET = ConvertParamsBase64Helper(this.paramsGET);

        // Obtener la informacion de la radicacion mail desde el localStorage
        this.hashMailSkina =  localStorage.getItem(environment.hashMailSkina);

        // Comparar datos del localStorage con los recibidos por parametros GET
        if (this.paramsOGET == this.hashMailSkina) {
          this.dataMailSkina = this.authService.decryptAES(this.hashMailSkina);
          this.dataUserEmail = this.authService.decryptAES(localStorage.getItem(environment.hashMailSkina));

          this.mailBox = this.dataMailSkina.mailBox;
          this.dataEmail = this.dataMailSkina.dataEmail;

          this.fromAddressEmail = this.dataEmail[0].fromAddress; // Asignando el correo a buscar para colocarlo como remitente
          if ( this.dataEmail.length == 1 ) {
            this.affairStatus = true;
            this.affairmsg = this.dataEmail[0].subject;
          } else {
            this.affairStatus = true;

            this.affairmsg = this.translate.instant('asuntoRadicacionEmailMasiva');
            let affairmsg = this.translate.instant(this.affairmsg) + ': ';
            this.dataEmail.forEach(element => {
              affairmsg = affairmsg + element.subject + ', ';
            });
            affairmsg = affairmsg.substr(0, (affairmsg.length - 2));
            if (affairmsg.length <= 150) {
              this.affairmsg = affairmsg;
            }
          }
          // Asigna al form que es radicado email
          this.radicacionEmail = true;

        } else {
          this.router.navigate(['/dashboard']);
        }
      }
    }

    // Método para obtener el token que se encuentra encriptado en el local storage
    getTokenLS() {
      // Se consulta si el token se envió como input //
      this.lhs.getToken().then((res: string) => {
        this.authorization = res;
      });
    }

    submitFormReceive(dataSubmit) {

      let data = dataSubmit.data;
      let fileUpload = dataSubmit.fileUpload;

      // Valida si hay un cliente si hay algun registro nuevo lo agrega a remitentes
      if (!data['idCliente']) {

        let dataRemitentes = [{
          idCliente: '',
          idTipoPersona: data['idTipoPersona'],
          nombreCliente: data['nombreCliente'],
          numeroDocumentoCliente: data['numeroDocumentoCliente'],
          direccionCliente: data['direccionCliente'],
          idNivelGeografico3: data['idNivelGeografico3'],
          idNivelGeografico2: data['idNivelGeografico2'],
          idNivelGeografico1: data['idNivelGeografico1'],
          correoElectronicoCliente: data['correoElectronicoCliente'],
          telefonoCliente: data['telefonoCliente'],
          /** Espacio para personalizacion del cliente */
          /** Fin Espacio para personalizacion del cliente */
        }];
        data['remitentes'] = dataRemitentes;
      }
      if (this.validateDuplicate) {
        data['field-validate'] = true;
      }

      let dataForm = {
        data: data,
        dataEmail: {
          mailBox: this.mailBox,
          dataEmail: this.dataEmail,
          dataUserEmail: this.dataUserEmail,
        },
      };

      // Cargando true
      this.sweetAlertService.sweetLoading();


      const formData = new FormData();
      formData.append('fileUpload', fileUpload);

      this.encryptService.generateRouteGetParams(this.routeSubmit, dataForm, this.authorization).then((res) => {
        let urlEndSend: any = res;

        /** Comsumo de servicio  */
        this.http.post(urlEndSend, formData, {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.authorization,
            'language': localStorage.getItem('language') ? localStorage.getItem('language') : 'es'
          }),
          reportProgress: true,
          observe: 'events'

        }).subscribe((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress: // Cuando el archivo está siendo cargado
            break;
            case HttpEventType.Response: // Cuando termina la carga
                if (event.body) {
                  this.resSerFormSubmit = event.body;
                  // Desencriptar respuesta del servicio
                  this.encryptService.decryptAES(this.resSerFormSubmit.encrypted, this.authorization).then((res) => {
                    let resSerFormSubmitDecrypt: any = res;
                    // Evaluar respuesta del servicio
                    this.globalAppService.resolveResponse(resSerFormSubmitDecrypt, false, this.redirectionPath).then((res) => {
                      const responseResolveResponse = res;
                      if (responseResolveResponse == true) {

                        if ( resSerFormSubmitDecrypt.data == 'duplicate' ) {
                          this.confirmDuplicateFiling(resSerFormSubmitDecrypt['message'], dataSubmit);
                        } else {

                          this.sweetAlertService.showNotification( 'success', resSerFormSubmitDecrypt['message'], 5000);
                          localStorage.setItem( environment.hashMenuButtonRadi, this.authService.encryptAES(resSerFormSubmitDecrypt['dataTransacciones'], false));

                          // Valida la cantidad de remitentes si son muchos remitentes envia al index
                          if ( data['remitentes'].length > 1) {
                            this.router.navigate(['/' + '/filing/filing-index/false']);
                          } else {
                            this.router.navigate(['/' + '/filing/filing-update' + '/' + resSerFormSubmitDecrypt['idRadiRadicado']]);
                          }
                        }

                      }
                    });
                    // Fin Evaluar respuesta del servicio
                  });
                  // Fin Desencriptar respuesta del servicio
                }
            break;
          }

        }, (err) => {
          this.resSerFormSubmitErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, false, this.redirectionPath).then((res) => { });
        });
        /** Fin Comsumo de servicio  */

      });

    }

    /**
     * Función que confirma si desea duplicar el radicado
     * @params msj mensaje que muestra en la confirmación
     * @params data data del servicio submitFormReceive que llega
     */
    confirmDuplicateFiling(msj, dataSubmit) {

      this.globalAppService.text18nGet().then((res) => {
        this.resSerLenguage = res;
        // console.log( this.resSerLenguage );
        this.titleMsg = '';
        this.textMsg = msj;
        let textAceptar = this.resSerLenguage['btnConfirmar'];
        let textCancelar = this.resSerLenguage['Cancelar'];

        swal({
          title: this.titleMsg,
          text: this.textMsg,
          type: 'success',
          showCancelButton: true,
          cancelButtonText: textCancelar,
          confirmButtonText: textAceptar,
          cancelButtonClass: 'btn btn-danger',
          confirmButtonClass: 'btn btn-success',
          buttonsStyling: false
        }).then( (result) => {

          // Entra a dupliar el radicado por confirmación del usuario
          if (result.value) {
            this.validateDuplicate = false;
            dataSubmit.data['field-validate'] = false;
            this.submitFormReceive(dataSubmit);
          }

        });

      });
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
