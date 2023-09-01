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

import { Component, OnInit, NgZone, Input } from '@angular/core';
import { first } from 'rxjs/operators';

declare var Tour: any;
declare var $: any;

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {

  tour: any;

  @Input() dataTour: any = [
    { element: '.pruebasTour1', title: 'Title of my step 1', content: 'Content of my step 1', placement: 'bottom', backdrop: true },
    { element: '.pruebasTour2', title: 'Title of my step 1', content: 'Content of my step 1', placement: 'bottom', backdrop: true },
  ];

  /**
   * Config para el
   */
  @Input() debugTour: boolean = false;
  @Input() storageTour: boolean = false;
  @Input() backdropTour: boolean = false;

  constructor(public ngZone: NgZone) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.tour = new Tour({                           
          debug: this.debugTour,
          storage: this.storageTour,
          backdrop: this.backdropTour,
          template: "<div class='popover tour'>\
				    <div class='arrow'></div>\
				    <h3 class='popover-title'>\
				    </h3>\
				    <div class='popover-content'></div>\
				    <div class='popover-navigation'>\
				        <button class='btn btn-default' data-role='prev'><span class='glyphicon glyphicon-arrow-left' aria-hidden='true'></span></button>\
				        <span data-role='separator'></span>\
				        <button class='btn btn-default' data-role='next'><span class='glyphicon glyphicon-arrow-right' aria-hidden='true'></span></button>\
				        <button class='btn btn-danger' data-role='end'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button>\
				    </div>\
				  </div>",
      });

      this.dataTour.forEach(data => {
        this.tour.addStep({
          element: data.element,
          title: data.title,
          content: data.content,
          placement: data.placement,
          backdrop: data.backdrop,
        });
      });
    });
  }

  initTour() {
    this.tour.init();
    this.tour.restart();
  }

}
