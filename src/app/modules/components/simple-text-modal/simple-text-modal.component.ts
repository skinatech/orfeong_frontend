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

import { Component, OnInit, Output, Inject, EventEmitter, Input, AfterViewChecked } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  dataDialog: any;
  initCardHeaderStatus: any;
  initCardHeaderIcon: any;
  initCardHeaderTitle: any;
  modalNotificationStatus: boolean;
  modalNotificationClassAlert: string;
  modalNotificationMessage: string;
  dataText: string;
}

@Component({
  selector: 'app-simple-text-modal',
  template: '',
  styleUrls: ['./simple-text-modal.component.css']
})
export class SimpleTextModalComponent implements OnInit {

  // Variable para dar tamaño al dialog
  @Input() widthDialog = '75%';
  @Output() public closeModalEmiter = new EventEmitter<any>(); // Data a retornar al formulario
  @Input() initCardHeaderStatusMod = true;
  @Input() initCardHeaderIconMod: string;
  @Input() initCardHeaderTitleMod: string;

  /** Variables para mostrar la alerta informativa  */
  @Input() modalNotificationStatus: boolean = false;
  @Input() modalNotificationClassAlert;
  @Input() modalNotificationMessage: string;

  @Input() dataText: string; // Data del texto a mostrar

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.openDialog();
  }

  /** Metodo que abre el dialogo para digitar los filtros */
  openDialog( ) {

    const dialogRef = this.dialog.open( SimpleTextDialog, {
      disableClose: false,
      width: this.widthDialog,
      data: {
        dataDialog: {},
        initCardHeaderStatus: this.initCardHeaderStatusMod,
        initCardHeaderIcon: this.initCardHeaderIconMod,
        initCardHeaderTitle: this.initCardHeaderTitleMod,
        modalNotificationStatus: this.modalNotificationStatus,
        modalNotificationClassAlert: this.modalNotificationClassAlert,
        modalNotificationMessage: this.modalNotificationMessage,
        dataText: this.dataText,
      }
    });
    dialogRef.afterClosed().subscribe( res => {
      let respuesta = res;
      if ( !respuesta ) {
        respuesta = {event: 'close', status: false , data: [] };
      }
      // console.log('Respuesta al cerrar el dialogo');
      // console.log(respuesta);
      this.closeComponent(respuesta);
    });
  }

  /*** Método para cerrar o destruir el componente desde el padre ***/
  closeComponent( respuesta ) {
    this.closeModalEmiter.emit(respuesta);
  }

}


@Component({
  selector: 'app-simple-text-dialog',
  templateUrl: './simple-text-modal.component.html',
  styleUrls: ['./simple-text-modal.component.css']
})

export class SimpleTextDialog implements OnInit, AfterViewChecked {

  initCardHeaderStatus: boolean;
  initCardHeaderIcon: string;
  initCardHeaderTitle: string;
  // Variables para notificacion
  modalNotificationStatus: boolean = false;
  modalNotificationClassAlert: string = 'alert alert-info alert-with-icon';
  modalNotificationMessage: string;
  dataText: string; // texto que se muestra

  constructor(public dialogRef: MatDialogRef<SimpleTextDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    // Asigna los valores que llegan por input
    this.initCardHeaderStatus = this.data.initCardHeaderStatus;
    this.initCardHeaderIcon = this.data.initCardHeaderIcon;
    this.initCardHeaderTitle = this.data.initCardHeaderTitle;

    this.modalNotificationStatus = this.data.modalNotificationStatus;
    this.modalNotificationClassAlert = this.data.modalNotificationClassAlert;
    this.modalNotificationMessage = this.data.modalNotificationMessage;
    this.dataText = this.data.dataText;
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    $('.cdk-global-overlay-wrapper').css('z-index', '1000');
    $('.cdk-overlay-pane').css('overflow', 'auto');
  }

}