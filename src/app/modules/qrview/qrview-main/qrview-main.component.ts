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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../../environments/environment';
import swal from 'sweetalert2';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-qrview-main',
  templateUrl: './qrview-main.component.html',
  styleUrls: ['./qrview-main.component.css']
})
export class QrviewMainComponent implements OnInit {

  paramId: any;
  messageErrorToken: string = 'El token es inválido o se encuentra vencido, por favor solicítalo de nuevo';
  titleErrorToken: string = 'Token inválido!';
  resService: any;
  
  fechaFirma: any;
  horaFirma: any;
  codigoDependencia: any;
  nombreDependencia: any;
  nombreUserDetallesFirma: string = '';
  apellidoUserDetallesFirma: string = '';
  labelRadiFirma: string = '';
  numeroRadicadoFirma: string = '';
  creacionRadiFirma: any;
  asuntoRadiFirma: any;

  nombreDocumento: string = '';
  fechaDocumento: string = '';

  statusRadiPadre: boolean = false;
  numeroRadiPadre: string = '';
  titleRadiPadre: string = '';
  labelRadiPadre: string = '';

  constructor(private authService: AuthService, private router: Router, public sweetAlertService: SweetAlertService, private route: ActivatedRoute, private translate: TranslateService,) {
    
  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('register-page');
    body.classList.add('off-canvas-sidebar');

    this.getIdRequest();
  }

  getIdRequest() {
    this.route.params.subscribe(params => {
      this.paramId = params['params'];
      let paramSend = {
        idQr: this.paramId
      }
      this.onSearch(paramSend);
    });
  }

  onSearch(param) {
    this.sweetAlertService.sweetLoading();

    //console.log(param);

    this.authService.authPost( environment.versionApiDefault + 'site/view-qr', param)
      .subscribe((res) => {
        this.resService = res;

        this.fechaFirma = this.resService.data.fechaFirma;
        this.horaFirma = this.resService.data.horaFirma;
        this.codigoDependencia = this.resService.data.codigoDependencia;
        this.nombreDependencia = this.resService.data.nombreDependencia;
        this.nombreUserDetallesFirma = this.resService.data.nombreUserDetallesFirma;
        this.apellidoUserDetallesFirma = this.resService.data.apellidoUserDetallesFirma;
        this.labelRadiFirma = this.resService.data.labelRadiFirma;
        this.numeroRadicadoFirma = this.resService.data.numeroRadicadoFirma;
        this.creacionRadiFirma = this.resService.data.creacionRadiFirma;
        this.asuntoRadiFirma = this.resService.data.asuntoRadiFirma;
        
        this.nombreDocumento = this.resService.data.nombreDocumento;
        this.fechaDocumento = this.resService.data.fechaDocumento;

        this.statusRadiPadre = this.resService.data.statusRadiPadre;
        this.numeroRadiPadre = this.resService.data.numeroRadiPadre;
        this.titleRadiPadre = this.resService.data.titleRadiPadre;
        this.labelRadiPadre = this.resService.data.labelRadiPadre;

        this.sweetAlertService.sweetClose();

      }, (err) => {
        let error = this.translate.instant(this.messageErrorToken);
        let errors = {
          error: [error]
        }
        this.sweetAlertService.sweetInfo(this.titleErrorToken, errors);
        this.router.navigate(["/login"]);
        return false;
      }
    );
  };

  ngOnDestroy(){
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('register-page');
    body.classList.remove('off-canvas-sidebar');
  }

}
