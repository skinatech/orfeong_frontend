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

import { Component, AfterViewInit, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { ConvertParamsBase64Helper } from '../../../helpers/convert-params-base64.helper';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { environment } from 'src/environments/environment';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { ChangeChildrenService } from '../../../services/change-children.service';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.css']
})
export class ViewHistoryComponent implements OnInit {

  @Input() reuteLoadViewHistorico: string;
  // Autentificacion
  authorization: string;
  // Parametro de operaciones
  @Input() paramOID = 0;
  paramId: any;
  // Nombre del boton
  @Input() textButtonView = 'Enviar';
  // Nombre del formulario
  @Input() textFormView = 'Formulario principal histórico';
  // Boton para update
  @Input() initBotonUpdateRoute = '';
  // Icono que se muestra
  @Input() initCardHeaderIcon = 'date_range';
  @Input() initCardHeaderCollapsIcon = 'featured_play_list';
  // Variable que indica si se desesa mostrar o no el colaps
  @Input() dtCollapStatus: boolean = false;
  // Evaluar respuesta del servicio
  @Input() isredirectionPath: boolean = true; // Define si se utiliza la redireccion en caso de no tener permisos de acceso
  @Input() redirectionPath: string = '/dashboard'; // ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  subscriptionChangeDetectedService: any;
  versionApi = environment.versionApiDefault;
  // Para el proceso del historico del radicado se muestra la data correspondiente
  dataRowsHistorico: any;
  // Variable para ver mas en historico
  statusSeeMoreHistory: boolean = false; // Muestra div ver mas
  statusSeeHistory: boolean = true;
  numberLimitHistory: number; // Limite de 5
  minLimit: number = 5; // Limite de 5

  responseServiceView: any;
  responseServiceViewErr: any;

  constructor(public restService: RestService, private route: ActivatedRoute, private router: Router, public sweetAlertService: SweetAlertService, public lhs: LocalStorageService,
    public globalAppService: GlobalAppService, private changeChildrenService: ChangeChildrenService) {
    this.paramId = this.route.snapshot.paramMap.get('id');
    this.paramOID = ConvertParamsBase64Helper(this.paramId); // Se pasa al html como componete para que reciba el ID
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
  }

  ngAfterViewInit() {
    this.changeDetectedService();
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

  getCallUrl(authori) {

    let params = {
      id: this.paramOID
    };

    // Cargando true
    this.sweetAlertService.sweetLoading();

    this.restService.restGetParams( this.versionApi + this.reuteLoadViewHistorico, params, authori).subscribe(
      (res) => {
        this.responseServiceView = res;
        // console.log(this.responseServiceView);
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceView, this.isredirectionPath, this.redirectionPath).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {

            if (this.responseServiceView.data) {
              this.dataRowsHistorico = this.responseServiceView.data;
              if ( this.dataRowsHistorico.length > this.minLimit ) {
                this.statusSeeMoreHistory = true;
                this.numberLimitHistory = this.minLimit;
              }
            }
            // Agrega titulo
            if ( this.responseServiceView.title ) {
              this.textFormView = this.responseServiceView.title;
            }

          }
          // Cargando false
          this.sweetAlertService.sweetClose();
        });
      }, (err) => {
        this.responseServiceViewErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceViewErr, this.isredirectionPath, this.redirectionPath).then((res) => { });
      }
    );


  }

  changeDetectedService() {
    this.subscriptionChangeDetectedService = this.changeChildrenService.reloadComponent.subscribe(emit => {
      this.getTokenLS();
    });
  }

  ngOnDestroy() {
    if (!!this.subscriptionChangeDetectedService) this.subscriptionChangeDetectedService.unsubscribe();
  }

  /**
   * Fuincion que cambia el estado de ver mas en Documentos
   * @param status // Estado
   * @param module // Modulo a consultar
   */
  seeMoreAndLess(status) {
    if (status) {
      this.numberLimitHistory = this.dataRowsHistorico.length;
    } else {
      this.numberLimitHistory = this.minLimit;
    }

    this.statusSeeHistory = !this.statusSeeHistory;

  }

}
