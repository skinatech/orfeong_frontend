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

import { UntypedFormControl } from '@angular/forms';

export function ValidatorTypeFileInputFile(types: any) {
    return function (control: UntypedFormControl) {
        const file = control.value;

        if(file) {
            const extension = file.name.split('.')[1].toLowerCase();

            types.forEach(data => {
                if(data.type.toLowerCase() !== extension.toLowerCase()) {
                    return {
                        validatorTypeFileInputFile: true
                    };
                }
            });
        
            return null;
        }
        return null;
    };
}