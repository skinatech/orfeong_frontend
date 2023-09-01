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

import { Component, OnInit,Input } from '@angular/core';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';

@Component({
  selector: 'app-filing-update',
  templateUrl: './filing-update.component.html',
  styleUrls: ['./filing-update.component.css']
})
export class FilingUpdateComponent implements OnInit {
  
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
    breadcrumbRouteActive = 'Actualizar';
    routeSubmit = 'radicacion/radicados/update';
    
    // Version api
    versionApi = environment.versionApiDefault;
    fieldsDisable: boolean = true;
    /**
     * Configuraciones para los servicios
     */
    resSerFormSubmit: any;
    resSerFormSubmitErr: any;
    // variable que guarda el id que llega por Get
    paramiD: string;
    paramOID: string;

    menuButtons: any[] = [];

    constructor(public sweetAlertService: SweetAlertService, public restService: RestService, public lhs: LocalStorageService, private router: Router,
      private route: ActivatedRoute, public globalAppService: GlobalAppService) {
      // Se recibe el id
      this.paramiD = this.route.snapshot.paramMap.get('id');
      // Se pasa al html como componete para que reciba el ID
      this.paramOID = ConvertParamsBase64Helper(this.paramiD);
    }
  


    ngOnInit() {
      // Hace el llamado del token
      this.getTokenLS();
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

      /** Se asigna el valor del id del usuario que se está actualizando */
      data['id'] = this.paramOID;
      /**
       * Cargando true
       */
      /** Se reasigna el valor para enviar la estructura correcta al backend */

        // console.log(data);
        // console.log(JSON.stringify(data) );
  
        this.restService.restPut(this.versionApi + this.routeSubmit, data, this.authorization)
          .subscribe((res) => {
            this.resSerFormSubmit = res;
            // console.log( this.responseServiceFormSubmit );
            // Evaluar respuesta del servicio
            this.globalAppService.resolveResponse(this.resSerFormSubmit, false).then((res) => {
              const responseResolveResponse = res;
              if (responseResolveResponse == true) {
                //console.log(this.resSerFormSubmit);
                this.sweetAlertService.showNotification( 'success', this.resSerFormSubmit['message'], 3000);
                this.menuButtons = this.resSerFormSubmit['dataTransacciones'];

                // Carga los valores al formulario segun lo que llega de base de datos
                //this.statusUpdate = this.resSerlistGeneral.dataUpdate.statusUpdate;
                //this.loadFormChange(this.resSerlistGeneral.dataUpdate.dataUpdate);
                // Verificar cuando le de OK para cargar
                // this.consultaOperaciones();
              }
              // Cargando false
              // this.sweetAlertService.sweetClose();
            });
          }, (err) => {
            this.resSerFormSubmitErr = err;
            // Evaluar respuesta de error del servicio
            this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, false).then((res) => { });
          }
        );

    }

}
