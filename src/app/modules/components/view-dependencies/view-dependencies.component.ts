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
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-dependencies',
  templateUrl: './view-dependencies.component.html',
  styleUrls: ['./view-dependencies.component.css']
})
export class ViewDependenciesComponent implements OnInit {

  // Autentificacion
  authorization: string;
  // Parametro de operaciones
  @Input() paramOID = 0;
  paramId: any;
  // Nombre del boton
  @Input() textButtonView = 'Enviar';
  // Nombre del formulario
  @Input() textFormView = 'Nombre dependencia';
  // Boton para update
  @Input() initBotonUpdateRoute = '';
  // Icono que se muestra
  @Input() initCardHeaderIcon = 'dns';
  // Ruta a consultar
  @Input() reuteLoadView: string;
  // Ruta para update
  @Input() reuteUpdateName: string = 'gestionDocumental/trd/update-name';
  // Evaluar respuesta del servicio
  @Input() isredirectionPath: boolean = true; // Define si se utiliza la redireccion en caso de no tener permisos de acceso
  @Input() redirectionPath: string = '/dashboard'; // Ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  // Variable que recibe los id's de las dependencias
  @Input() dataIdDepe: any;
  // Variable que recibe si se puede editar
  @Input() showEditField: any = false;
  notificationHeaderStatus: boolean = false; // Si la variable showEditField es igual a true este header debe mostrarse
  idShowEditField: string = '' ; // Se deja por defecto vacio, para cuando el campo showEditField este en true pase a llenarse con algo
  
  @Input() statusSuport: boolean = false; // Si la variable llega en true quiere decir que la trd tiene soporte cargado
  @Input() statusRule: boolean = false; // Si la variable llega en true quiere decir que la trd tiene norma cargado
  // Valida typo
  validTextType: boolean = false;
  // Version api
  versionApi: any = environment.versionApiDefault;
  // Variables para el formulario
  dependencias: any; // Dependencias TRD
  series: any; // Series TRD
  subseries: any; // Sub-series TRD
  dataSubseries: any; // Data de las Sub-series
  tipDocumentales: any; // Tipos documentales TRD

  responseServiceView: any;
  responseServiceViewErr: any;
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;

  constructor(public restService: RestService, private route: ActivatedRoute, private router: Router, public sweetAlertService: SweetAlertService, public lhs: LocalStorageService, public globalAppService: GlobalAppService,
    private authService: AuthService) {
    this.paramId = this.route.snapshot.paramMap.get('id');
    this.paramOID = ConvertParamsBase64Helper(this.paramId); // Se pasa al html como componete para que reciba el ID
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();

    // Verifica que sea true
    if ( this.showEditField) {
      // Le asigna un valor para que el acordeon no se oculte
      this.idShowEditField = 'NO';
      // Se muestra el header
      this.notificationHeaderStatus = true;
    }
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      if (this.paramOID != 0) {
        this.getCallUrl(this.authorization);
      }

    });
  }

  /**
   * Funcion que llama del localStorage los id's de las dependencias
   * @param authorization // Autorización para ejecutar un servicio
   */
  getCallUrl(authorization) {

    this.dataIdDepe = this.authService.decryptAES( localStorage.getItem( environment.dataIdDepe ) );
    // console.log(this.dataIdDepe);
    // console.log( this.reuteLoadView );
    // localStorage.removeItem( environment.dataIdDepe );

    if ( !this.dataIdDepe ) {
      this.dataIdDepe = [0];
    }

    let params = {
      id: this.paramOID,
      data: this.dataIdDepe
    };

    this.restService.restGetParams( this.versionApi + this.reuteLoadView, params, authorization).subscribe(
      (res) => {
        this.responseServiceView = res;
        // console.log( this.responseServiceView );
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceView, this.isredirectionPath, this.redirectionPath).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {

            this.dependencias = this.responseServiceView.dataDep;
            this.statusSuport = this.responseServiceView.dataDep[0].soporte; 
            this.statusRule = this.responseServiceView.dataDep[0].norma; 
            this.series = this.responseServiceView.dataSeries;
            this.subseries = this.responseServiceView.dataSubseries;
            this.dataSubseries = this.responseServiceView.data;
            this.tipDocumentales = this.responseServiceView.dataTipDoc;

          }
        });
      }, (err) => {
        this.responseServiceViewErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceViewErr, this.isredirectionPath, this.redirectionPath).then((res) => { });
      }
    );
  }

  /**
   * Funcion que recive el valor event donde trae el case que utiliza el servicio para guardar el campo
   * @param event // trae toda la información del campo
   * @param id // id de la tabla o campo a modificar
   */
  changeName( event, id ) {

    let data = {
      id: id,
      nombre: event.target.value,
      modulo: event.target.id
    };

    // console.log('data');
    // console.log(data);

    this.restService.restPut( this.versionApi + this.reuteUpdateName, data, this.authorization)
      .subscribe((res) => {
        this.resSerFormSubmit = res;
        // console.log(this.resSerFormSubmit);
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerFormSubmit, false ).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resSerFormSubmit.message );
          }
        });
      }, (err) => {
        this.resSerFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, false ).then((res) => { });
      }
    );

  }

}
