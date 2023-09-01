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

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AuthService } from '../../../services/auth.service';
import { RestService } from '../../../services/rest.service';
import { GlobalAppService } from '../../../services/global-app.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from '../../../services/activate-translate.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-help-main',
  templateUrl: './help-main.component.html',
  styleUrls: ['./help-main.component.css']
})
export class HelpMainComponent implements OnInit, OnDestroy {

  /** Variables para el componente top-nav-bar */
  topNavBarTitle: string = 'Ayuda';
  topNavBarRouteActive: string = '';
  topNavBarOn: string = '';
  /** Fin Variables para el componente top-nav-bar */

  lastPoppedUrl: string;
  location: Location;

  // Autorizacion de localstorage
  authorization: string = '';
  // Ruta a redirigir
  redirectionPath = '/dashboard';
  /** Clases de los contenedores iniciales */
  classMainConten: string = '';
  classContainerFluid: string = '';
  classDataTableResponsive = 'table-responsive maxHeightDataTable'; // Preguntar a Jenny si se utiliza el max-height
  //Data del usuario
  hashLocalStorage: any;

  /** Variables para internacionalizacion */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  /** Variables para control de inactividad */
  userTimeOutSessionMin: any;
  subscriptionBnIdle$: Subscription;

  /*** Services ***/
  jsonManualesLoad: any = [];
  responseService: any;

  constructor(private router: Router, location: Location, private lhs: LocalStorageService, 
    private authService: AuthService, public restService: RestService, public globalAppService: GlobalAppService,
    private translate: TranslateService, private activateTranslateService: ActivateTranslateService,
    private bnIdle: BnNgIdleService) {
    this.location = location;
    /** Idioma inical */
    this.detectLanguageInitial();
  }

  ngOnInit() {
    /** Detectando si se ejecuta cambio de idioma */
    this.detectLanguageChange();

    this.getTokenLS();
    this.calculateSessionInactivity('');
  } 

  /** Método para obtener el token que se encuentra encriptado en el local storage */
  getTokenLS() {
    /** Se consulta solo si el token no se recibió como Input() */
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.hashLocalStorage = this.authService.decryptAES( localStorage.getItem( environment.hashSkina ) );

      this.jsonManuales();
    });
  }

  jsonManuales() {
    this.globalAppService.manualesGet().then((res) => {
      this.responseService = res;
      this.jsonManualesLoad = this.responseService['manuales'];
    });
  }

  /** Es requerido por la plantilla pero no se conoce su función */
  public isMap() {
    if (this.location.prepareExternalUrl(this.location.path()) === '/maps/fullscreen') {
      return true;
    } else {
      return false;
    }
  }

  /** Métodos para el uso de la internacionalización */
  detectLanguageInitial() {
    if (localStorage.getItem('language')) {
      this.activeLang = localStorage.getItem('language');
    } else {
      this.activeLang = 'es';
    }
    this.translate.setDefaultLang(this.activeLang);
  }

  detectLanguageChange() {
    this.subscriptionTranslateService$ = this.activateTranslateService.activateLanguageChange.subscribe(language => {
      this.languageReceive = language;
      this.translate.setDefaultLang(this.languageReceive);
    });
  }
  /** Fin Métodos para el uso de la internacionalización */

  /**
   * Metodo para inicializar la funcionalidad de inactividad
   * @params autho authorization
   */
   calculateSessionInactivity(autho) {
    let minutes = environment.timeOutSessionMin;

    this.callLocalStorageHashTimeOut().then( (res) => {
      this.userTimeOutSessionMin = res;
      if ( this.userTimeOutSessionMin) {
        minutes = this.userTimeOutSessionMin;
      }
      let seconds = minutes * 60;

      this.subscriptionBnIdle$ = this.bnIdle.startWatching(seconds).subscribe((res) => {
        if (res) {
          // Busca si hay un modal en el cuerpo
          const body = document.getElementsByTagName('body')[0];
          const modalBackdrop = document.getElementsByClassName('mat-dialog-container')[0];
          // Valida ai hay un modal 
          if( modalBackdrop) {
            // Elimina el modal
            body.classList.remove('mat-dialog-container');
            modalBackdrop.remove();
          }
          this.restService.logout(autho, 'inactividad');
        }
      });
    });

  }

  /**
   * Inicio Decoradores utilizados para conocer si se utiliza el mouse o el teclado
   * Se debe cambiar la metodología en caso de que el sistema se ponga lento o aparezcan muchos logs de advertencias como el siguiente:
   * [Violation] 'requestIdleCallback' handler took 62ms
   */
  @HostListener('click', ['$event.target'])onClick(btn) {
    if (!!this.subscriptionBnIdle$) {
      this.bnIdle.resetTimer();
    }
    
  }

  @HostListener('window:keydown', ['$event']) handleKeyDown(event: KeyboardEvent) {
    if (!!this.subscriptionBnIdle$) {
      this.bnIdle.resetTimer();
    }
  }
  /** Fin Decoradores utilizados para conocer si se utiliza el mouse o el teclado */

  /** Función que obtiene el tiempo de sessión para inactividad en el local storage */
  callLocalStorageHashTimeOut() {
    return new Promise(resolve => {
      let timeOutLS = localStorage.getItem( environment.hashTimeOut );
      resolve(timeOutLS);
    });
  }

  ngOnDestroy() {
    if (!!this.subscriptionBnIdle$) this.subscriptionBnIdle$.unsubscribe();
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }

}
