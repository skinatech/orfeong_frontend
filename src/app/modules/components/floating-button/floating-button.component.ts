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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.css']
})
export class FloatingButtonComponent implements OnInit {

  /**
   * Configuraciones para el botón flotante
   *
   * Estilo para el botón, json abierto a css
   */
  public spin: boolean = true;
  public direction = 'up';
  public animationMode = 'fling';

  @Input() styleButtonFloat: any = {
    'right': '30px',
    'z-index': 10000,
    'position': 'fixed',
    'bottom': '15px',
    'color': 'red'
  };

  /**
   * Nombre del icono principal
   */
  @Input() iconMenu: string = 'menu';

  /**
   * Data del menu a desplegar
   */
  @Input() menuButtons: any;
  /**
   * Data del style para el button del icono
   */
  @Input() styleButtonIcon: any;
  /**
  * Data del style para el icono
  */
  @Input() styleIcon: any;
  /**
   * Data para recibir el texto del title
   */
  @Input() titleButton: any;
  /**
   * Data para recibir el texto del title
   */
  @Input() statusInitialScroll: boolean = true; // Posicionar automaticamente el scroll al inicio del componente
  /**
   * Emite la data completa del botón al que se le haga clic
   */  
  @Output() public menuEmiterData = new EventEmitter<any>();
  @Output() public menuPrimaryEmiterData = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    if(this.statusInitialScroll) {
      window.scroll(0, 0); // Posicionando scroll al inicio
    }
  }
  
  /**
   * Haciendo clic en un botón del menu se enviara la data al padre
   * @param data
   */
  menuButtonClick(data) {
    this.menuEmiterData.emit(data);
  }

  menuButtonPrimaryClick() {
    this.menuPrimaryEmiterData.emit({ data: true });
  }

  /** Validar si el boton es un array vacio o no tiene data para ocultar los botones */
  validDataMenu() {
    if (Array.isArray(this.menuButtons)) {
      if (this.menuButtons.length == 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
