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

import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { EncryptService } from 'src/app/services/encrypt.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { ActivateTranslateService } from 'src/app/services/activate-translate.service';
import { TranslateService } from '@ngx-translate/core';

import { RestService } from '../../../services/rest.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.css']
})
export class ViewPdfComponent implements OnDestroy, OnInit {

  versionApi: string = "version1/";

  // statusloading: boolean = true;
  textloading: string = "Cargando documento...";

  textAlertViewPdfStatus: boolean = false;
  textAlertViewPdf: string;
  styleIframe: any = {
    'display': 'none'
  };
  styleContent: any = {
    'height': '150px'
  };

  viewPdfStatus: boolean = true;
  @Input() colGrip: string = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
  @Input() styleContentNew: any = {
    'height': '500px'
  };
  @Input() routeDownloadFile: string = "descarga-archivos/download-base64";
  //@Input() fileDownload: any; //ej: { 'route': 'pruebas/acta.pdf' };
  @Input() fileDownload: any;
  @Input() typeRenderFile: string = "application/pdf";

  /*** Variables de los servicion ***/
  responseServiceFile: any;

  /*** pdfOpen ***/
  pdfAsArray: any;
  urlTemplate: string;
  binaryData: any = [];
  dataPdf: any;
  raw: any;
  rawLength: any;

  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  authorization: any;
  notificationErrExtArray: any = [];
  notificationErrExt: string = 'Solo es permitido archivos';

  constructor(public restService: RestService, public lhs: LocalStorageService, private sweetAlertService: SweetAlertService, private encryptService: EncryptService, private globalAppService: GlobalAppService, private translate: TranslateService, private activateTranslateService: ActivateTranslateService) { this.detectLanguageInitial(); }

  ngOnInit() {
    this.downloadFileService();
    this.getTokenLS();
    this.detectLanguageChange();
  }


  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  downloadFileService() {

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.versionApi + this.routeDownloadFile, this.fileDownload, this.authorization).subscribe((res) => {
      this.responseServiceFile = res;

      if (this.responseServiceFile.status) {
        this.viewPdfStatus = true;
        this.styleIframe = {
          'display': 'block'
        };
        this.styleContent = this.styleContentNew;
        this.openPdf(this.responseServiceFile.data);
      } else {
        this.textAlertViewPdf = this.responseServiceFile.data[0];
        this.viewPdfStatus = false;
        // Cargando false
        this.sweetAlertService.sweetClose();
        this.textAlertViewPdfStatus = true;
      }
    });
  }

  openPdf(fileBase64) {
    if (this.viewPdfStatus) {
      this.pdfAsArray = this.convertDataURIToBinary(fileBase64);
      this.urlTemplate = 'assets/dist/pdfViewJs/viewer.html?file=';
      this.binaryData = [];
      this.binaryData.push(this.pdfAsArray);
      this.dataPdf = window.URL.createObjectURL(new Blob(this.binaryData, { type: this.typeRenderFile }));
      document.getElementById('frameViewPdf').setAttribute('src', this.urlTemplate + encodeURIComponent(this.dataPdf));
    }
  }

  convertDataURIToBinary(base64) {
    this.raw = window.atob(base64);
    this.rawLength = this.raw.length;
    var array = new Uint8Array(new ArrayBuffer(this.rawLength));
    for (var i = 0; i < this.rawLength; i++) {
      array[i] = this.raw.charCodeAt(i);
    }

    return array;
  }

  /** Métodos para el uso de la internacionalización */
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
  /** Fin Métodos para el uso de la internacionalización */

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }
}
