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

import { AbstractControl } from '@angular/forms';

export function PasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {

  //Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[$@$!%*?&¿¡!~#]).{1,30}')
  let hasNumber = /\d/.test(control.value);
  let hasLower = (/[áéíóúàèìòù]/.test(control.value)) || (/[a-z]/.test(control.value));
  let hasUpper = (/[ÁÉÍÓÚÀÈÌÒÙ]/.test(control.value)) || (/[A-Z]/.test(control.value));
  let hasCharacter = /[$@$!%*?&¿¡~#_-]/.test(control.value);
  //console.log('Num, Upp, Low, specialCharacter', hasNumber, hasUpper, hasLower, hasCharacter);
  const valid1 = hasNumber && hasUpper && hasLower;
  const valid2 = hasNumber && hasUpper && hasCharacter;
  const valid3 = hasNumber && hasLower && hasCharacter;
  const valid4 = hasLower && hasUpper && hasCharacter;
  if (valid1) {
    return null;
  } else if (valid2) {
    return null;
  } else if (valid3) {
    return null;
  } else if (valid4) {
    return null;
  } else {
    // return what´s not valid
    return { 'charactersValidation': true };
  }
}