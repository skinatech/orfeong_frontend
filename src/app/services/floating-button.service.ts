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

import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FloatingButtonService {

  @Output() clickChangeStatus: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickChangeStatusAnulation: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickTransactionReasign: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickTransactionReturnFiling: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickTransactionVobo: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickTransactionCopyInformaded: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickTransactionFinalizeFiling: EventEmitter<any> = new EventEmitter<any>();

  @Output() clickChangeTransactionDelivered: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickChangeTransactionReturnDelivered: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickChangeTransactionShipping: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickTransactionShippingReady: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickTransactionArchiveFiling: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickDownloadRotulos: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickApplyForLoan: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickApproveLoan: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickCancelLoan: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickReturnLoan: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickManualTransfer: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickDownloadFuit: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickAcceptTransfer: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickRejectTransfer: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickArchiveFolder: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickReturnPqrToCitizen: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickWithdrawal: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  // Change status
  changeStatus(data) {
    this.clickChangeStatus.emit(data);
  }

  // Shipping
  changeShipping(data, dataObserva) {
    let dataShipping= {
      ButtonSelectedData: data,
      dataObserva: dataObserva,
    };
    this.clickChangeTransactionShipping.emit( dataShipping );
  }

  //
  changeReturnDelivered(data, dataObserva) {
    let dataReturnDelivered = {
      ButtonSelectedData: data,
      dataObserva: dataObserva,
    };
    this.clickChangeTransactionReturnDelivered.emit( dataReturnDelivered );
  }

  //
  changeDelivered(data) {
    let dataDelivered = {
      ButtonSelectedData: data,
    };
    this.clickChangeTransactionDelivered.emit( dataDelivered );
  }

  // returnFiling
  changeReturnFiling(data, dataObserva, action) {
    let dataReturnfiling = {
      ButtonSelectedData: data,
      data: dataObserva,
      action: action
    };
    this.clickTransactionReturnFiling.emit( dataReturnfiling );
  }

  // annulation
  changeStatusAnulacion(data, dataObserva, action) {
    let dataAnnulment = {
      ButtonSelectedData: data,
      data: dataObserva,
      action: action
    };
    this.clickChangeStatusAnulation.emit( dataAnnulment );
  }

  // send
  changeTransactionReasign(data, dataObserva, action) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataObserva,
      action: action
    };
    this.clickTransactionReasign.emit( dataTransa );
  }

  // vobo
  changeTransactionVobo(data, dataObserva, action) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataObserva,
      action: action
    };
    this.clickTransactionVobo.emit( dataTransa );
  }

  // copyInformaded
  changeTransactionCopyInfo(data, dataObserva, action) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataObserva,
      action: action
    };
    this.clickTransactionCopyInformaded.emit( dataTransa );
  }

  // FinalizeFiling
  changeTransactionFinalizeFiling(data, dataObserva, action) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataObserva,
      action: action
    };
    this.clickTransactionFinalizeFiling.emit( dataTransa );
  }

  // Shipping Ready
  changeTransactionShippingReady(data) {
    let dataTransa = {
      ButtonSelectedData: data,
    };
    this.clickTransactionShippingReady.emit( dataTransa );
  }

  // Archive Filing
  changeTransactionArchiveFiling(data, dataModal) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal
    };
    this.clickTransactionArchiveFiling.emit( dataTransa );
  }

  // Download Rotulos
  changeDownloadRotulos(data, dataModal) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal
    };
    this.clickDownloadRotulos.emit( dataTransa );
  }

  // Apply For Loan
  changeApplyForLoan(data, dataModal, routeProcess) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal,
      route: routeProcess
    };
    this.clickApplyForLoan.emit( dataTransa );
  }

  // Approve Loan
  changeApproveLoan(data, dataModal, routeProcess) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal,
      route: routeProcess
    };
    this.clickApproveLoan.emit( dataTransa );
  }
  // Cancel Loan
  changeCancelLoan(data, dataModal, routeProcess) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal,
      route: routeProcess
    };
    this.clickCancelLoan.emit( dataTransa );
  }
  // Return Loan
  changeReturnLoan(data, dataModal, routeProcess) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal,
      route: routeProcess
    };
    this.clickReturnLoan.emit( dataTransa );
  }
  // Manual Transfer
  changeManualTransfer(data, dataModal) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal
    };
    this.clickManualTransfer.emit( dataTransa );
  }
  // Download Fuit
  changeDownloadFuit(data) {
    let dataTransa = {
      ButtonSelectedData: data
    };
    this.clickDownloadFuit.emit( dataTransa );
  }
  // Accept Transfer
  changeAcceptTransfer(data) {
    let dataTransa = {
      ButtonSelectedData: data
    };
    this.clickAcceptTransfer.emit( dataTransa );
  }
  // Reject Transfer
  changeRejectTransfer(data, dataModal) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal
    };
    this.clickRejectTransfer.emit( dataTransa );
  }
  // Archive Folder
  changeArchiveFolder(data, dataModal) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal
    };
    this.clickArchiveFolder.emit( dataTransa );
  }
  // Return Pqr To Citizen
  changeReturnPqrToCitizen(data, dataModal) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal
    };
    this.clickReturnPqrToCitizen.emit( dataTransa );
  }
  // Withdrawal
  changeTransactionWithdrawal(data, dataModal) {
    let dataTransa = {
      ButtonSelectedData: data,
      data: dataModal
    };
    this.clickWithdrawal.emit( dataTransa );
  }

}
