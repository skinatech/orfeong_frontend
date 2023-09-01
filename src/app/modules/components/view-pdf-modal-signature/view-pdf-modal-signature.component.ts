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

import { Component, OnInit, Output, EventEmitter, AfterViewChecked, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { environment } from 'src/environments/environment';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';
import { table } from 'console';

export interface DialogDataSignature {
  idDocument: any;
  initCardHeaderIcon: any;
  textForm: any;
  ruoteServiceDocuments: any;
  redirectionPath: any;
  dataDocumentos: any;
}

@Component({
  selector: 'app-view-pdf-modal-signature',
  template: '',
  styleUrls: ['./view-pdf-modal-signature.component.css']
})
export class ViewPdfModalSignatureComponent implements OnInit {

  @Output() public closeModalEmiter = new EventEmitter<any>(); // Data a retornar
  // Variable para dar tamaño al dialog
  widthDialog = '95%';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'library_books';
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Vista del documento';
  // Ruta a ejecutar
  @Input() ruoteServiceDocuments: any = 'radicacion/documentos/upload-document';
  // Objeto que se envia al back como parametro request
  @Input() idDocument: object;
  // Ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  @Input() redirectionPath = '/dashboard';
  // Data adicionar para enviar al servicio
  @Input () dataDocumentos: any;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // hace le llamado del dialogo
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog() {

    const dialogRef = this.dialog.open(ViewPdfModalSignatureDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        idDocument: this.idDocument,
        initCardHeaderIcon: this.initCardHeaderIcon,
        textForm: this.textForm,
        ruoteServiceDocuments: this.ruoteServiceDocuments,
        redirectionPath: this.redirectionPath,
        dataDocumentos: this.dataDocumentos
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      let respuesta = res;
      if (!respuesta) {
        respuesta = { event: 'close', status: false, data: [] };
      }
      this.closeComponent(respuesta);
    });
  }

  /*** Método para cerrar o destruir el componente desde el padre ***/
  closeComponent(respuesta) {
    this.closeModalEmiter.emit(respuesta);
  }

}


@Component({
  selector: 'app-view-pdf-modal-signature-dialog',
  templateUrl: './view-pdf-modal-signature.component.html',
  styleUrls: ['./view-pdf-modal-signature.component.css']
})

export class ViewPdfModalSignatureDialog implements OnInit, AfterViewChecked {

  /**Variable del formulario */
  initCardHeaderIcon: any; // Icono del formulario
  textForm: string; // titulo del formulrio
  ruoteServiceDocuments: any; // Ruta a ejecutar
  redirectionPath: any; // Ruta redireccionar
  idDocument: any; // id Del documento a descargar
  dataDocumentos: any; // Data adicional para enviar al servicio

  validTextType: boolean = false;
  // Version api
  versionApi = environment.versionApiDefault;

  // Autentificacion
  authorization: string;

  // Variables de consumo de servicios
  responseService: any;
  responseServiceErr: any;

  // textAlertViewPdfStatus: boolean = false;
  textAlertViewPdfStatus: boolean = true;
  textAlertViewPdf: string;
  styleIframe: any = {
    'display': 'none'
  };
  styleContent: any = {
    'height': '150px'
  };

  viewPdfStatus: boolean = true;
  colGrip: string = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
  styleContentNew: any = {
    'height': '500px'
  };

  /*** pdfOpen ***/
  pdfAsArray: any;
  urlTemplate: string;
  binaryData: any = [];
  dataPdf: any;
  raw: any;
  rawLength: any;

  typeRenderFile: string = "application/pdf";

  constructor(
    public dialogRef: MatDialogRef<ViewPdfModalSignatureDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogDataSignature,
    public sweetAlertService: SweetAlertService, private globalAppService: GlobalAppService,
    public lhs: LocalStorageService, public restService: RestService
  ) {

    /**
    * Configuración del formulario
    */
    this.initCardHeaderIcon = this.data.initCardHeaderIcon;
    this.textForm = this.data.textForm;
    this.idDocument = this.data.idDocument;
    this.ruoteServiceDocuments = this.data.ruoteServiceDocuments;
    this.redirectionPath = this.data.redirectionPath;
    this.dataDocumentos = this.data.dataDocumentos;
  }

  ngOnInit() {
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.dowloadDocuments(this.idDocument, this.authorization);
    });
  }

  ngAfterViewChecked() {
    $('.cdk-global-overlay-wrapper').css('z-index', '1000');
    $('.cdk-overlay-pane').css('overflow', 'auto');
  }

  closeDialog() {
    this.dialogRef.close({ event: 'close', status: false, data: [] });
  }

  dowloadDocuments(idDocument, authorization) {

    let data = {
      ButtonSelectedData: {
        0: {
          id: idDocument
        }
      }
    };

    if ( this.dataDocumentos ) {
      data['ButtonSelectedData'][0] = this.dataDocumentos;
    }

    this.sweetAlertService.sweetLoading();

    this.restService.restPut(this.versionApi + this.ruoteServiceDocuments, data, authorization).subscribe(
      (res) => {
        this.responseService = res;
        this.globalAppService.resolveResponse(this.responseService, false).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {

            this.viewPdfStatus = true;
            this.styleIframe = {
              'display': 'block'
            };
            this.styleContent = this.styleContentNew;

            console.log(' --- ');
            console.log(this.responseService.datafile);

            this.urlTemplate = 'assets/dist/pdfViewJs/viewer.html?file=';
            document.getElementById('frameViewPdf').setAttribute('src', window.atob(this.responseService.datafile));

            // Cargando false
            this.sweetAlertService.sweetClose();
          } else {
            this.closeDialog();
          }
        });

      }, (err) => {
        this.responseServiceErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceErr).then((res) => { });
        this.closeDialog();
      }
    );
  }
}