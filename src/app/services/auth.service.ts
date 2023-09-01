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

import { Injectable, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import CryptoJS from "crypto-js";

/**
 * Importación de environment
 */
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  responseAuth: any;
  responseAuthError: any = {
    status: "",
    data: "",
  };
  responseAuthDecrypt: any;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Metodo que valida en estado del token antes del ingreso al routing
   */
  public isAuthenticated(hashSkina): Observable<Response> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };

    return this.http.post<Response>(
      environment.apiUrl + environment.versionApiDefault + "site/validate-access-token",
      "jsonSend=" + encodeURIComponent(JSON.stringify(hashSkina)),
      httpOptions
    );
  }

  /**
   * Metodo para validar el el token y retornar una promesa
   */
  public validateToken(hashSkina): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };

    return this.http
      .post(
        environment.apiUrl + environment.versionApiDefault + "site/validate-access-token",
        "jsonSend=" + encodeURIComponent(JSON.stringify(hashSkina)),
        httpOptions
      )
      .pipe(map((response) => {
        return response;
      }), catchError((e: any) => throwError(() => this.errorHandlAuth(e)))
      )
      
  }

  /**
   * Método para realizar petición POST
   * @param action ruta del servicio
   * @param data Parámetros de la petición
   */
  public authPost(action: string, data: any, resOnlyDecrypt: boolean = true): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };

    let dataEncypt = this.encryptAES(data);
    let dataSend = encodeURIComponent(JSON.stringify(dataEncypt));
    let jsonParams = "jsonSend=" + dataSend;

    return this.http
      .post(environment.apiUrl + action, jsonParams, httpOptions)
      .pipe(map((response) => {
        this.responseAuth = response;

        /**
         * Si el retorno debe ser solo la cadena desencriptada o se adiciona el hash
         */
        if (resOnlyDecrypt === true) {
          this.responseAuthDecrypt = this.decryptAES(this.responseAuth.encrypted);
        } else {
          this.responseAuthDecrypt = this.decryptAES(this.responseAuth.encrypted);
          this.responseAuthDecrypt.encrypted = this.responseAuth.encrypted;
        }

        return this.responseAuthDecrypt;
      }), catchError((e: any) => throwError(()=>this.errorHandl(e)))
      )
  }

  /**
   * Método para realizar petición GET
   * @param action ruta del servicio
   */
  public authGet(action): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };

    return this.http
      .get(environment.apiUrl + action, httpOptions)
      .pipe(map((response) => {
        this.responseAuth = response;
        this.responseAuthDecrypt = this.decryptAES(this.responseAuth.encrypted);
        return this.responseAuthDecrypt;
      }), catchError((e: any) => throwError(()=>this.errorHandl(e)))
      )
  }

  /**
   * Método para realizar petición GET con parametros para la solicitud
   * @param action ruta del servicio
   * @param params Parámetros de la petición
   */
  public authGetParams(action, params): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };

    let dataEncypt = this.encryptAES(params, true);
    let urlParams = "?request=" + dataEncypt;

    return this.http
      .get(environment.apiUrl + action + urlParams, httpOptions)
      .pipe(map((response) => {
        this.responseAuth = response;
        this.responseAuthDecrypt = this.decryptAES(this.responseAuth.encrypted);
        return this.responseAuthDecrypt;
      }), catchError((e: any) => throwError(()=>this.errorHandl(e)))
      )
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

  /**
   * Método para encriptar objeto a una cadena en formato AES
   * @param data Objeto con parametros a encriptar
   */
  public encryptAES(data: any, base64: boolean = false) {
    try {
      let encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        environment.llaveAES
        // ,{
        //   keySize: 128 / 8,
        //   iv: environment.llaveAES,
        //   mode: CryptoJS.mode.CBC,
        //   padding: CryptoJS.pad.Pkcs7
        // }
      ).toString();
      if (base64 == true) {
        encrypted = btoa(encrypted);
        encrypted = encrypted.replace(/_/g, "/");
        encrypted = encrypted.replace(/-/g, "+");
        return encrypted;
      } else {
        return encrypted;
      }
    } catch (error) {
      //console.log('error en la encriptación front-end');
      return "null";
    }
  }

  /**  */
  public errorHandl(error: any) {
    this.responseAuth = error;
    /**
     * Validar el status del error para desencriptar respuesta cuando se necesita
     */
    if (this.responseAuth.status == 322) {
      this.responseAuthError.data = this.decryptAES(this.responseAuth.error.encrypted);
    } else if (this.responseAuth.status == 330) {
      this.responseAuthError.data = this.decryptAES(this.responseAuth.error.encrypted);
    } else if (this.responseAuth.status == 390) {
      this.responseAuthError.data = this.decryptAES(this.responseAuth.error.encrypted);
    } else {
      this.responseAuthError.data = this.responseAuth.error;
    }
    this.responseAuthError.status = this.responseAuth.status;
    return this.responseAuthError;
  }

  public errorHandlAuth(err: any) {
    return false;
  }
}
