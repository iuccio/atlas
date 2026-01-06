import { FormControl } from '@angular/forms';
import { SwissCanton } from '../../../../../api';

export interface TthChangeCantonFormGroup {
  cantonChangeComment: FormControl<string | null | undefined>;
  swissCanton: FormControl<SwissCanton | null | undefined>;
}
