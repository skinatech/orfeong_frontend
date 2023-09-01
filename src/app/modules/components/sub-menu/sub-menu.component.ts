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

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from '../../../services/global-app.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from '../../../services/activate-translate.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit, OnDestroy {

  versionApi: string = environment.versionApiDefault;
  authorization: any; // Token de autorización

  @Input() subMenuStatus: boolean = true;
  @Input() subMenuTitle: string;
  @Input() subMenuActive: string;
  @Input() subMenuNotificationStatus: boolean = true;
  @Input() subMenuNotificationClassAlert: string = 'alert alert-info alert-with-icon';
  @Input() subMenuNotificationMessage: string = '';

  responseJsonSubMenus: any;
  subMenuCols = [];

  /** Retorno de servicio que contiene las operaciones disponibles para el usuario */
  responseServiceSubMenu: any;
  dataOperacionesJson: any;

  /** Variables de internacionalización */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  localStorageMenu: any; // Menu guardado en el local storage
  public menuItems: any[];

  constructor(public lss: LocalStorageService, public restService: RestService, public globalAppService: GlobalAppService, private translate: TranslateService, private activateTranslateService: ActivateTranslateService, private authService: AuthService) {
    /**
     * Idioma inical
     */
    this.detectLanguageInitial();
  }

  ngOnInit() {
    this.getTokenLS();
    /**
     * Detectando si se ejecuta cambio de idioma
     */
    this.detectLanguageChange();
  }

  /** Método para obtener el token que se encuentra encriptado en el local storage */
  getTokenLS() {
    this.lss.getToken().then((res: string) => {
      this.authorization = res;
      this.validateAuthOperacionesUser();
    });
  }

  validateAuthOperacionesUser() {

    this.restService.restGet(this.versionApi + 'default/authorization-user', this.authorization)
      .subscribe((res) => {
        this.responseServiceSubMenu = res;
        // console.log( this.responseServiceSubMenu.data );
        this.jsonSubMenu(this.responseServiceSubMenu.data);
      }, err => {
        // console.log(err);
      }
    );
  }

  jsonSubMenu(dataService) {
    this.globalAppService.subMenuGet().then((res) => {
      this.responseJsonSubMenus = res;
      let j = -1;
      this.responseJsonSubMenus[this.subMenuActive].forEach(element => {
        dataService.forEach(elementService => {
          if (element.operacion == elementService) {
            j = j + 1;
            this.subMenuCols[j] = element;
          }
        });
      });
    });
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
      // Toma los valores del local storage y consulta las operaciones
      this.localStorageMenu = this.authService.decryptAES( localStorage.getItem( environment.hashMenu ) );
      this.menuItems = this.localStorageMenu.menu;

      if ( this.responseServiceSubMenu ) {
        this.jsonSubMenu(this.responseServiceSubMenu.data); // Recarga de submenu json
      } else {
        // Toma los valores del local storage y consulta las operaciones
        this.localStorageMenu = this.authService.decryptAES( localStorage.getItem( environment.hashMenu ) );
        this.jsonSubMenu(this.localStorageMenu.operaciones); // Recarga de submenu json
      }

    });
  }
  /** Fin Métodos para el uso de la internacionalización */

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }

}
