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

/** Librería para encriptar y desencriptar */
import * as CryptoJS from "crypto-js";
/** Importación de environment */
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EncryptService {
  constructor() {}

  /**
   * Método para generar una ruta GET con parametros de solicitud
   * @param routeBase ruta del servicio
   * @param params Parámetros de la petición
   * @param authorization Token de autorización
   */
  generateRouteGetParams(routeBase: string, params, authorization: string) {
    return new Promise((resolve) => {
      let dataEncypt = this.encryptAES(params, authorization, true);
      let urlParams = routeBase + "?request=" + dataEncypt;
      resolve(urlParams);
    });
  }

  /**
   * Método para encriptar objeto a una cadena en formato AES
   * @param data [Object] Objeto con parametros a encriptar
   * @param authorization [string] Token de autorización
   * @param base64 [boolean] True = Encriptar y codificar a base64
   */
  public encryptAES(data: any, authorization: string, base64 = false) {
    try {
      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), `${authorization}${environment.llaveAES}`).toString();
      if (base64 == true) {
        encrypted = btoa(encrypted);
        encrypted = encrypted.replace(/_/g, "/");
        encrypted = encrypted.replace(/-/g, "+");
        return encrypted;
      } else {
        return encrypted;
      }
    } catch (error) {
      return "null";
    }
  }

  /**
   * Método para desencriptar una cadena en formato AES
   * @param encrypted [string] Variable a desenciptar
   * @param authorization [string] Token de autorización
   * @param base64 [boolean] True = Decodificar base64
   */
  public decryptAES(encrypted: any, authorization: string, base64 = false) {
    return new Promise((resolve) => {
      try {
        if (base64 == true) {
          let stringB64 = encrypted.replace("/", /_/g);
          stringB64 = stringB64.replace("+", /-/g);
          stringB64 = atob(encrypted);

          const decrypted = CryptoJS.AES.decrypt(stringB64, `${authorization}${environment.llaveAES}`).toString(
            CryptoJS.enc.Utf8
          );
          const jsonParseDecrypted = JSON.parse(decrypted);
          resolve(jsonParseDecrypted);
        } else {
          const decrypted = CryptoJS.AES.decrypt(encrypted, `${authorization}${environment.llaveAES}`).toString(
            CryptoJS.enc.Utf8
          );
          const jsonParseDecrypted = JSON.parse(decrypted);
          resolve(jsonParseDecrypted);
        }
      } catch (error) {
        resolve(null);
      }
    });
  }
}
