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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsCustomComponent } from './reports-custom.component';

describe('ReportsCustomComponent', () => {
  let component: ReportsCustomComponent;
  let fixture: ComponentFixture<ReportsCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
