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

import { FloatingButtonService } from 'src/app/services/floating-button.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import swal from 'sweetalert2';

import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  versionApi = environment.versionApiDefault;
  authorization: any;


  /* variables servicios */
  resServices: any;
  resServicesErr: any;

  /** Variables para traer el texto de confirmacion */
  titleMsg: string;
  textMsg: string;
  bntCancelar: string;
  btnConfirmacion: string;
  resSerLenguage: any;

  constructor(public restService: RestService, private floatingButtonService: FloatingButtonService, public lhs: LocalStorageService, public globalAppService: GlobalAppService,  public sweetAlertService: SweetAlertService) { 
  }
  

  /**
   * Metodo generar plantilla PDF 
   * @param dataIdRadicados array id radicados 
   */

  transactionTempleteCorrespondence(dataIdRadicados,authorization, action = 'correspondenceTemplate'){ 

    let route = '';
    if (action == 'correspondenceTemplateExcel') {
      route = 'radicacion/transacciones/correspondence-template-excel';
    } else if (action == 'correspondenceTemplate') {
      route = 'radicacion/transacciones/correspondence-template';
    }

    let params = {
      ButtonSelectedData: dataIdRadicados 
    };
    this.sweetAlertService.showNotificationLoading();

    this.restService.restPost(this.versionApi + route, params, authorization).subscribe((res) => {
        this.resServices = res;

        this.globalAppService.resolveResponse(this.resServices, false).then((res) => {
          const responseResolveResponse = res;
          this.sweetAlertService.showNotificationClose();
          
          if (responseResolveResponse == true) {

            if(this.resServices.datafile){
              this.downloadFile(this.resServices.datafile,this.resServices.nombreDoc );
            }

              this.sweetAlertService.showNotification('success', this.resServices.message);
          }

        });

        }, (err) => {
          this.resServicesErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServicesErr).then((res) => { });
        }
    );
        
  }

  /**
   * Descarga el archivo que llega en base64
   * @param file el  en base 64
   * @param nameDownload nombre del archivo
   */
  downloadFile(file, nameDownload) {

		const linkSource = `data:application/octet-stream;base64,${file}`;
		const downloadLink = document.createElement("a");

		downloadLink.href = linkSource;
		downloadLink.download = nameDownload;
    downloadLink.click();
    this.sweetAlertService.sweetClose();
  }

  /**
   * Metodo Devolver radicado
   * @param data Parametros de la peticion
   * @param dataIdRadicados array id radicados 
   */
  transactionReturnDelivery(data, dataIdRadicados){

    // Cambia el los mensajes de texto del componete para confirmar la eliminacion
    this.globalAppService.text18nGet().then((res) => {

      this.resSerLenguage = res;
      // console.log( this.resSerLenguage );
      this.titleMsg = this.resSerLenguage.titleMsg;
      this.textMsg = this.resSerLenguage['textMsgRadiReturn'];
      this.bntCancelar = this.resSerLenguage['bntCancelarSendMail'];
      this.btnConfirmacion = this.resSerLenguage['btnConfirmar'];

      swal({
        title: this.titleMsg,
        text: this.textMsg,
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: this.bntCancelar,
        confirmButtonText: this.btnConfirmacion,
        cancelButtonClass: 'btn btn-danger',
        confirmButtonClass: 'btn btn-success',
        buttonsStyling: false
      }).then((result) => {

        if(result.value){

          //this.sweetAlertService.showNotificationLoading();

            let params = {
              data: data,
              ButtonSelectedData: dataIdRadicados 
            };

            let status:boolean = false;
        
            this.restService.restPost(this.versionApi + 'radicacion/transacciones/return-delivery', params, this.authorization).subscribe((res) => {
                this.resServices = res;
        
                this.globalAppService.resolveResponse(this.resServices, false).then((res) => {
                  const responseResolveResponse = res;

                  //this.sweetAlertService.showNotificationClose();
                  if (responseResolveResponse == true) {
                    for ( let key in this.resServices.notificacion) {
                      this.sweetAlertService.showNotification(this.resServices.notificacion[key]['type'], this.resServices.notificacion[key]['message'] );
                    }
                  }
                });
        
                }, (err) => {
                  this.resServicesErr = err;
                  // Evaluar respuesta de error del servicio
                  this.globalAppService.resolveResponseError(this.resServicesErr).then((res) => { });
                }
            );
        }

      });
    });

  }


  /**
   * Metodo Devolver radicado
   * @param observacion Parametros de la peticion
   * @param dataIdRadicados array id radicados 
   */
  transactionReturnFiling(dataIdRadicados,observacion, action){

      // Cambia el los mensajes de texto del componete para confirmar la eliminacion
      this.globalAppService.text18nGet().then((res) => {

        this.resSerLenguage = res;
        // console.log( this.resSerLenguage );
        this.titleMsg = this.resSerLenguage.titleMsg;
        this.textMsg = this.resSerLenguage['textMsgRadiReturn'];
        this.bntCancelar = this.resSerLenguage['bntCancelarSendMail'];
        this.btnConfirmacion = this.resSerLenguage['btnConfirmar'];
  
        swal({
          title: this.titleMsg,
          text: this.textMsg,
          type: 'warning',
          showCancelButton: true,
          cancelButtonText: this.bntCancelar,
          confirmButtonText: this.btnConfirmacion,
          cancelButtonClass: 'btn btn-danger',
          confirmButtonClass: 'btn btn-success',
          buttonsStyling: false
        }).then((result) => {

          if(result.value){

            //this.sweetAlertService.showNotificationLoading();

              let params = {
                observacion: observacion,
                ButtonSelectedData: dataIdRadicados 
              };

              let status:boolean = false;
          
              this.restService.restPost(this.versionApi + 'radicacion/transacciones/return-filing', params, this.authorization).subscribe((res) => {
                  this.resServices = res;
          
                  this.globalAppService.resolveResponse(this.resServices, false).then((res) => {
                    const responseResolveResponse = res;

                    //this.sweetAlertService.showNotificationClose();

                    if (responseResolveResponse == true) {
                      for ( let key in this.resServices.data) {
                        this.sweetAlertService.showNotification(this.resServices.notificacion[key]['type'], this.resServices.notificacion[key]['message'] );
                      }

                          if(this.resServices.data){
                             //this.floatingButtonService.changeReturnFiling(dataIdRadicados, this.resServices.data, action);
                          }

                      return status;

                    }
                  });
          
                  }, (err) => {
                    this.resServicesErr = err;
                    // Evaluar respuesta de error del servicio
                    this.globalAppService.resolveResponseError(this.resServicesErr).then((res) => { });
                  }
              );
          }

        });
      });

  }

  
  /**
   * Metodo Accion / Transaccion  programar agenda de radicado 
   * @param data Parametros de la peticion
   * @param dataIdRadicados array id radicados 
   */
  transactionSchedule(data, dataIdRadicados) {

    let params = {
      data: data,
      ButtonSelectedData: dataIdRadicados 
    };

    this.restService.restPost(this.versionApi + 'radicacion/transacciones/schedule', params, this.authorization).subscribe((res) => {
        this.resServices = res;

        this.globalAppService.resolveResponse(this.resServices, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resServices['message'] );
          }
        });

        }, (err) => {
          this.resServices = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resServices).then((res) => { });
        }
    );

  }

}
