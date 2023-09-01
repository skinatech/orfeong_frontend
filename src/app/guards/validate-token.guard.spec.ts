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

import { TestBed, async, inject } from '@angular/core/testing';

import { ValidateTokenGuard } from './validate-token.guard';

describe('ValidateTokenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidateTokenGuard]
    });
  });

  it('should ...', inject([ValidateTokenGuard], (guard: ValidateTokenGuard) => {
    expect(guard).toBeTruthy();
  }));
});