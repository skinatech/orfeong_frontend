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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLicensingMessageComponent } from './login-licensing-message.component';

describe('LoginLicensingMessageComponent', () => {
  let component: LoginLicensingMessageComponent;
  let fixture: ComponentFixture<LoginLicensingMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginLicensingMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginLicensingMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
