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

import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-unlock-main',
  templateUrl: './unlock-main.component.html',
  styleUrls: ['./unlock-main.component.css']
})
export class UnlockMainComponent implements OnInit, OnDestroy {

  nameUser: string = "Skina Tech";

  constructor() { }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('lock-page');
    body.classList.add('off-canvas-sidebar');
    const card = document.getElementsByClassName('card')[0];
    setTimeout(function() {
      // after 1000 ms we add the class animated to the login/register card
      card.classList.remove('card-hidden');
    }, 700);
  }

  ngOnDestroy(){
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('lock-page');
    body.classList.remove('off-canvas-sidebar');
  }
}