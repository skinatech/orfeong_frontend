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

/**
 * Librería para encriptar y desencriptar
 */
import CryptoJS from "crypto-js";

/**
 * Importación de environment
 */
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  constructor(private router: Router) {}

  /**
   * Obtener el token guardado en el local storage generado por la sesión
   */
  getToken(url: string = "dashboard") {
    return new Promise((resolve) => {
      try {
        let respuesta = localStorage.getItem(environment.hashSkina);
        let tokenDecrypted = this.decryptAES(respuesta);
        if (tokenDecrypted != null) {
          if (typeof tokenDecrypted.data != undefined) {
            if (typeof tokenDecrypted.data.accessToken != undefined) {
              let accessToken = tokenDecrypted.data.accessToken;
              resolve(accessToken);
            } else {
              this.router.navigate(["/" + url]);
            }
          } else {
            this.router.navigate(["/" + url]);
          }
        } else {
          this.router.navigate(["/" + url]);
        }
      } catch (error) {
        this.router.navigate(["/" + url]);
      }
    });
  }

  /**
   * Obtener los datos del usuario guardado en el local storage generado por la sesión
   */
  getUser(url: string = "dashboard") {
    return new Promise((resolve) => {
      try {
        let respuesta = localStorage.getItem(environment.hashSkina);
        let tokenDecrypted = this.decryptAES(respuesta);
        if (tokenDecrypted != null) {
          if (typeof tokenDecrypted.data != undefined) {
            let userData = tokenDecrypted.data;
            resolve(userData);
          } else {
            this.router.navigate(["/" + url]);
          }
        } else {
          this.router.navigate(["/" + url]);
        }
      } catch (error) {
        this.router.navigate(["/" + url]);
      }
    });
  }

  /**
   * Método para desencriptar una cadena en formato AES
   * @param encrypted Variable a desenciptar
   */
  public decryptAES(encrypted: any) {
    try {
      let decrypted = CryptoJS.AES.decrypt(encrypted, environment.llaveAES).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  }
}
