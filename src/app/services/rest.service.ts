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
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { map, catchError } from 'rxjs/operators';

/** Librería para encriptar y desencriptar */
import CryptoJS from "crypto-js";
/** Importación de environment */
import { environment } from "../../environments/environment";
/** Servicio de consulta al local storage */
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GlobalAppService } from "./global-app.service";
import { SweetAlertService } from "./sweet-alert.service";

@Injectable({
  providedIn: "root",
})
export class RestService {
  responseRest: any;
  responseRestError: any = {
    status: "",
    data: "",
  };
  responseRestDecrypt: any;
  resLogout: any;
  resLogoutErr: any;
  dataLogin = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    public globalAppService: GlobalAppService,
    public sweetAlertService: SweetAlertService,
    public lhs: LocalStorageService
  ) {}

  /**
   * Método para realizar petición POST
   * @param action ruta del servicio
   * @param data Parámetros de la petición
   */
  public restPost(action: string, data: any, authorization: string, resDecrypt: boolean = true): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + authorization,
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };
    let dataEncypt = this.encryptAES(data, authorization);
    let dataSend = encodeURIComponent(JSON.stringify(dataEncypt));
    let jsonParams = "jsonSend=" + dataSend;

    // console.log(jsonParams);

    return this.http
      .post(environment.apiUrl + action, jsonParams, httpOptions)
      .pipe(map((response) => {
        this.responseRest = response;

        /**
         * Si el retorno debe ser el hash el parametro resDecrypt debe ser falso
         */
        if (resDecrypt === true) {
          this.responseRestDecrypt = this.decryptAES(this.responseRest.encrypted, authorization);
        } else {
          this.responseRestDecrypt = this.responseRest.encrypted;
        }

        /** Consultar si llega un archivo por fuera de la cadena encriptada */
        if (typeof this.responseRest.datafile !== "undefined") {
          this.responseRestDecrypt.datafile = this.responseRest.datafile;
        }
        return this.responseRestDecrypt;
      }), catchError((e: any) => throwError(()=>this.errorHandl(e, authorization)))
      )
  }

  /**
   * Método para realizar petición PUT
   * @param action ruta del servicio
   * @param data Parámetros de la petición
   */
  public restPut(action: string, data: any, authorization: string, resDecrypt: boolean = true): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + authorization,
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };
    let dataEncypt = this.encryptAES(data, authorization);
    let dataSend = encodeURIComponent(JSON.stringify(dataEncypt));
    let jsonParams = "jsonSend=" + dataSend;

    // console.log(jsonParams);

    return this.http
      .put(environment.apiUrl + action, jsonParams, httpOptions)
      .pipe(map((response) => {
        this.responseRest = response;

        /**
         * Si el retorno debe ser el hash el parametro resDecrypt debe ser falso
         */
        if (resDecrypt === true) {
          this.responseRestDecrypt = this.decryptAES(this.responseRest.encrypted, authorization);
        } else {
          this.responseRestDecrypt = this.responseRest.encrypted;
        }

        /**
         * Anexar archivo como variable adicional de la respuesta en caso de que se encuentre declarada
         */
        if (typeof this.responseRest.datafile !== "undefined") {
          this.responseRestDecrypt.datafile = this.responseRest.datafile;
        }

        return this.responseRestDecrypt;
      }), catchError((e: any) => throwError(()=>this.errorHandl(e, authorization)))
      )
  }

  /**
   * Método para realizar petición GET
   * @param action ruta del servicio
   */
  public restGet(action, authorization: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + authorization,
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };
    return this.http
      .get(environment.apiUrl + action, httpOptions)
      .pipe(map((response) => {
        this.responseRest = response;
        this.responseRestDecrypt = this.decryptAES(this.responseRest.encrypted, authorization);
        return this.responseRestDecrypt;
      }), catchError((e: any) => throwError(()=>this.errorHandl(e, authorization)))
      )
  }

  /**
   * Retorna datos del api que viajan sin encriptar
   * @param {string} action
   * @param {string} authorization
   */
  public restGetNotDecrypt(action: string, authorization: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + authorization,
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };

    return this.http
      .get(environment.apiUrl + action, httpOptions)
      .pipe(map((response) => {
        return response;
      }), catchError((e: any) => throwError(()=>this.errorHandl(e, authorization)))
      )
  }

  /**
   * Método para realizar petición GET con parametros para la solicitud
   * @param action ruta del servicio
   * @param params Parámetros de la petición
   */
  public restGetParams(action, params, authorization: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + authorization,
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };

    let dataEncypt = this.encryptAES(params, authorization, true);
    let urlParams = "?request=" + dataEncypt;

    return this.http
      .get(environment.apiUrl + action + urlParams, httpOptions)
      .pipe(map((response) => {
        this.responseRest = response;
        this.responseRestDecrypt = this.decryptAES(this.responseRest.encrypted, authorization);

        /**
         * Anexar archivo como variable adicional de la respuesta en caso de que se encuentre declarada
         */
        if (typeof this.responseRest.datafile !== "undefined") {
          this.responseRestDecrypt.datafile = this.responseRest.datafile;
        }

        return this.responseRestDecrypt;
      }), catchError((e: any) => throwError(()=>this.errorHandl(e, authorization)))
      )
  }

  public restGetParamsNotDecrypt(action, params, authorization: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + authorization,
        language: localStorage.getItem("language") ? localStorage.getItem("language") : "es",
      }),
    };

    const dataEncypt = this.encryptAES(params, authorization, true);
    const urlParams = "?request=" + dataEncypt;

    return this.http
      .get(environment.apiUrl + action + urlParams, httpOptions)
      .pipe(map((response) => {
        const responseGet: any = response;

        /**
         * Anexar archivo como variable adicional de la respuesta en caso de que se encuentre declarada
         */
        if (typeof responseGet.datafile !== "undefined") {
          responseGet.datafile = responseGet.datafile;
        }

        return responseGet;
      }), catchError((e: any) => throwError(()=>this.errorHandl(e, authorization)))
      )
  }

  /**
   * Método para desencriptar una cadena en formato AES
   * @param encrypted Variable a desenciptar
   */
  public decryptAES(encrypted: any, authorization: string) {
    try {
      let decrypted = CryptoJS.AES.decrypt(encrypted, authorization + environment.llaveAES).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  }

  /**
   * Método para encriptar objeto a una cadena en formato AES
   * @param data Objeto con parametros a encriptar
   */
  public encryptAES(data: any, authorization: string, base64: boolean = false) {
    try {
      let encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        authorization + environment.llaveAES
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
  public errorHandl(error: any, authorization: string) {
    this.responseRest = error;
    /**
     * Validar el status del error para desencriptar respuesta cuando se necesita
     */
    if (this.responseRest.status == 322) {
      this.responseRestError.data = this.decryptAES(this.responseRest.error.encrypted, authorization);
    } else if (this.responseRest.status == 401) {
      // No autorizado
      this.responseRestError.data = this.decryptAES(this.responseRest.error.encrypted, authorization);
      this.globalAppService.logout();
      this.sweetAlertService.sweetClose();
    } else if (this.responseRest.status == 330) {
      this.responseRestError.data = this.decryptAES(this.responseRest.error.encrypted, authorization);
    } else if (this.responseRest.status == 390) {
      this.responseRestError.data = this.decryptAES(this.responseRest.error.encrypted, authorization);
    } else {
      this.responseRestError.data = this.responseRest.error;
    }
    this.responseRestError.status = this.responseRest.status;
    return this.responseRestError;
  }

  /**
   * Función para ejecutar logout del usuario que valida si llega el tocken de autorización
   * @param autorizacion
   * @param option // Indica si fue por inactividad o normal
   */
  public logout(autorizacion, option) {
    // Valida si llega tocken de autorización si no la genera el tocken
    if (autorizacion == "") {
      // Método para obtener el token que se encuentra encriptado en el local storage
      this.lhs.getToken().then((res: string) => {
        autorizacion = res;
        // Valida si esta null el campo, por defecto debe estar en nullo
        if (this.dataLogin == null) {
          // Asigna lo que trae en el localStorage
          this.dataLogin = localStorage.getItem(environment.hashSkina);
          if (this.dataLogin != null) {
            // Ejecuta servicio logout
            this.logout_ok(autorizacion, option);
          }
        }
      });
    } else {
      // Ejecuta servicio logout
      this.logout_ok(autorizacion, option);
    }
  }

  /**
   * Función para ejecutar logout del usuario
   * @param autorizacion
   * @param option // Indica si fue por inactividad o normal
   */
  public logout_ok(autorizacion, option) {
    this.sweetAlertService.sweetLoading();
    this.restGet(environment.versionApiDefault + "user/logout", autorizacion).subscribe(
      (res) => {
        this.resLogout = res;

        this.globalAppService.resolveResponse(this.resLogout, false).then((res) => {
          const responseResolveResponse = res;
          this.globalAppService.logout();
          this.sweetAlertService.sweetClose();
          if (option != "normal") {
            this.sweetAlertService.sweetInfo("Algo está mal", ["Cierre de sesión automático por inactividad"]);
          }
        });
      },
      (err) => {
        this.resLogoutErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resLogoutErr).then((res) => {});
      }
    );
  }
}
