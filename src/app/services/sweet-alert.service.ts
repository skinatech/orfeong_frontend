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

import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  htmlSweet: any = [];
  resSerLenguage: any; // Variable para guardar la respuesta del servicio de idiomas
  textLanguage: string;

  constructor( private http: HttpClient ) { }

  sweetLoading(titleSweet: string = '') {
    Swal({
      title: titleSweet,
      buttonsStyling: true,
      confirmButtonClass: "loadingModal", // Se agrega clase en .css principal para ocultar el botón
      allowEscapeKey: false,
      allowOutsideClick: false,
      imageUrl: "./assets/img/logos/orfeo_ng_gif.gif"
    });
    //Swal.showLoading();
  }

  sweetInfoText(titleSweet: string, html: any, type: any = 'error') {
    let titleTranslate: string;

    this.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // Asignación de los mensajes según el idioma
      titleTranslate = this.resSerLenguage[titleSweet];
      if ( !titleTranslate ) {
        titleTranslate = titleSweet;
      }
      Swal({
        title: titleTranslate,
        html: html,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info",
        allowEscapeKey: false,
        allowOutsideClick: false,
        type: type,
      }).catch(Swal.noop);

    });
  }

  sweetInfo(titleSweet: string, html: any) {

    let titleTranslate: string;

    this.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // Asignación de los mensajes según el idioma
      titleTranslate = this.resSerLenguage[titleSweet];
      if ( !titleTranslate ) {
        titleTranslate = titleSweet;
      }

      this.htmlSweet = '';
      Object.keys(html).forEach(keyname => {
        var text = this.resSerLenguage[html[keyname]];
        if ( !text ) {
          this.htmlSweet = this.htmlSweet + html[keyname] + '<br>';
        } else {
          this.htmlSweet = this.htmlSweet + text + '<br>';
        }
        // this.htmlSweet = this.htmlSweet + html[keyname] + '<br>';
      });

      Swal({
        title: titleTranslate,
        html: this.htmlSweet,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info",
        allowEscapeKey: false,
        allowOutsideClick: false,
        type: 'error',
      }).catch(Swal.noop);

    });
  }

  showSwal(type, titleMessage, message, html?:any) {

    let titleTranslate: string;

    this.text18nGet().then((res) => {
      this.resSerLenguage = res;
      // Asignación de los mensajes según el idioma
      titleTranslate = this.resSerLenguage[titleMessage];
      // Valida titulo
      if ( !titleTranslate ) {
        titleTranslate = titleMessage;
      }

      if (type == 'success-message') {
        Swal({
          title: titleTranslate,
          width: '800px',
          text: message,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-success",
          type: "success"
        }).catch(Swal.noop);
      } else if (type == 'title-and-text') {
        Swal({
          title: titleTranslate,
          text: message,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-info",
        }).catch(Swal.noop);
      }
    });

  }


  showContentDocs(message?:any) {

    Swal({
      title: '',
      width: '800px',
      text: message,
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      type: "success"
    }).catch(Swal.noop);
  
  }

  sweetClose() {
    Swal.close();
  }

  // Para los mensajes de confirmarción siempre será a la derecha y en la parte superior
  /**
   * @param colorStatus Color que se desea mostrar
   * @param msg Mensaje que se desea mostrar
   * Recibe un texto plano en la variable msg o un array con los mensajes Ejemplo:
   * Texto plano: msg = 'Texto a mostrar';
   * Array mensajes: msg = [ 'Texto que se muestra 1', 'Texto para mostrar numero dos 2' ];
   * @param from ubicación
   * @param align aliniación
   */
  showNotification( colorStatus: any,  msg: any, timer:number = 3000 ,from = 'top', align = 'right' ) {

    // const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    // const color = Math.floor((Math.random() * 6) + 1);
    let messagesNotifi: any = [];
    // Verifica si la variable msg es un arreglo.
    if ( Array.isArray(msg) ) {
      messagesNotifi = msg;
    } else {
      messagesNotifi.push( msg );
    }

    // Recorre los mensajes siempre como un array
    messagesNotifi.forEach(function (value) {

      $.notify({
        icon: 'notifications',
        message: value
      }, {
        // type: type[ color ],
          type: colorStatus,
          timer: timer,
          placement: {
              from: from,
              align: align
          },
          template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
            '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
            '<i class="material-icons" data-notify="icon">notifications</i> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
              '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });
    });

  }

  showNotificationLoading( colorStatus: any = 'info',  msg: any = 'Loading', from = 'top', align = 'right' ) {

    // const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    // const color = Math.floor((Math.random() * 6) + 1);
    $.notify({
      icon: 'notifications',
      message: msg
    },
      {
      // type: type[ color ],
        type: colorStatus,
        timer: 9000,
        placement: {
            from: from,
            align: align
        },
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 role="alert">' +
            '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  </button>' +
              '<div class="d-flex justify-content-center">' +
                '<div class="spinner-border" role="status">' +
                  '<span class="sr-only">Loading...</span>' +
                '</div>' +
              '</div>' +
          '</div>'+
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });

  }

  showNotificationClose() {
    $.notifyClose();
  }

  /** Trae los textos del idiona dependiendo lo caque trae en el localStorage */
  text18nGet() {

    if (localStorage.getItem('language')) {
      this.textLanguage = 'assets/i18n/' + localStorage.getItem('language');
    } else {
      this.textLanguage = 'assets/i18n/' + 'es';
    }

    return new Promise(resolve => {
      this.http.get( this.textLanguage + '.json').subscribe(data => {
        resolve(data);
        // console.log(data);
      }, err => {
        // console.log(err);
      });
    });
  }

}
