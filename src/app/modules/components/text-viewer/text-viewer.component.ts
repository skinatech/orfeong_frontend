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

import { ConvertParamsBase64Helper } from '../../../helpers/convert-params-base64.helper';

import { RestService } from '../../../services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { GlobalAppService } from 'src/app/services/global-app.service';

@Component({
  selector: 'app-text-viewer',
  templateUrl: './text-viewer.component.html',
  styleUrls: ['./text-viewer.component.css']
})
export class TextViewerComponent implements OnInit {

  @Input() reuteLoadView: string;
  @Input() panelHeadingStatus: boolean = true;
  @Input() routeBotonUpdateView: string;
  @Input() classSection: string = "content";

  responseServiceView: any;
  paramId: any;
  dataRows: any;
  comment: string = "";
  
  @Input() initCardHeaderIcon: string = 'build';
  @Input() textFormView: string = 'Detalle';

  @Input() redirectionPath: string = '/dashboard';
  authorization: any;


  constructor(public restService: RestService, private route: ActivatedRoute, private router: Router, public lhs: LocalStorageService, public globalAppService: GlobalAppService) {
    this.paramId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.getDataService( );
    });
  }

  getDataService() {
    let params = {
      id: ConvertParamsBase64Helper(this.paramId)
    };

    this.restService.restGetParams(this.reuteLoadView, params, this.authorization )
      .subscribe((res) => {
        this.responseServiceView = res;

        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceView, true, this.redirectionPath).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            for (let result of this.responseServiceView.data) {
              if (result.text) {
                this.comment = result.value;
              }
            }
            this.dataRows = this.responseServiceView.data;
          }
        });

      }, (err) => {
        this.responseServiceView = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceView, true, this.redirectionPath).then((res) => {});
      }
    );
  }
}