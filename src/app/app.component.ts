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

import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs/internal/Subscription";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-my-app",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  private _router: Subscription;
  // Autentificacion
  authorization: string;
  dataUser: any;
  dataLogin = null;

  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit() {
    this.translate.setDefaultLang("es");

    this._router = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const body = document.getElementsByTagName("body")[0];
        const modalBackdrop = document.getElementsByClassName("modal-backdrop")[0];
        if (body.classList.contains("modal-open")) {
          body.classList.remove("modal-open");
          modalBackdrop.remove();
        }
      });
  }
}
