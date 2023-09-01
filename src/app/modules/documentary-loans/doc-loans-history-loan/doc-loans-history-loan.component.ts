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

import { Component, OnInit } from '@angular/core';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { ActivatedRoute } from '@angular/router';
import { typeViewHistoryLoans } from '../resources/enums/history-loans.enum';

@Component({
  selector: 'app-doc-loans-history-loan',
  templateUrl: './doc-loans-history-loan.component.html',
  styleUrls: ['./doc-loans-history-loan.component.css']
})
export class DocLoansHistoryLoanComponent implements OnInit {
  // Autorizacion de localstorage
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  paramType: string;
  // Nombre del formulario
  textFormView = 'Histórico del préstamo';
  // Ruta a consultar en el ViewList
  reuteLoadView: string;
  // Icono del ViewList
  initCardHeaderIcon = 'date_range';
  // Ruta a redirigir
  redirectionPath: string
  /** BreadcrumbOn */
  breadcrumbOn: Array<{ name: string, route: string }>;
  breadcrumbRouteActive = 'Histórico';

  constructor(private route: ActivatedRoute, public lhs: LocalStorageService, public sweetAlertService: SweetAlertService, public restService: RestService) { 
    this.paramiD = this.route.snapshot.paramMap.get('id');
    this.paramOID = ConvertParamsBase64Helper(this.paramiD);
    this.paramType = this.route.snapshot.paramMap.get('type');
  }

  ngOnInit() {
    if (this.paramType === typeViewHistoryLoans.HISTORY_LOAN) {
      this.reuteLoadView = 'gestionArchivo/prestamo-documental/historical-loan';
      this.redirectionPath = '/documentaryLoans/manage-loan-index';
      this.breadcrumbOn = [
        { name: 'Préstamos documentales', route: '/documentaryLoans' },
        { name: 'Administrar préstamo', route: this.redirectionPath }
      ];
    }

    if (this.paramType === typeViewHistoryLoans.HISTORY_LOAN_FILES) {
      this.reuteLoadView = 'gestionArchivo/prestamo-documental/historical-loan-files';
      this.redirectionPath = '/documentaryLoans/manage-loan-of-files';
      this.breadcrumbOn = [
        { name: 'Préstamos documentales', route: '/documentaryLoans' },
        { name: 'Administrar préstamo de expedientes', route: this.redirectionPath }
      ];
    }
  }
}
