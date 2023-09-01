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

import { Injectable } from "@angular/core";
import io from "socket.io-client";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SocketioService {
  socket: any;
  dataSocket: any; // data a enviar

  socketConnect(idUSer) {
    console.log(environment.SOCKET_ENDPOINT);
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socketEmit(environment.socketConnect, idUSer);
  }

  socketEmit(channel, data) {
    this.socket.emit(channel, data);
  }

  socketOn(channel: string) {
    return new Observable((subscriber) => {
      this.socket.on(channel, (data) => {
        subscriber.next(data);
      });
    });
  }

  socketDisconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}