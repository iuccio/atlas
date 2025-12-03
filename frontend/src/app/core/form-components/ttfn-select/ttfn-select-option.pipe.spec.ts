import { TimetableFieldNumberSelectOptionPipe } from './ttfn-select-option.pipe';
import { TimetableFieldNumber } from '../../../api';

describe('TimetableFieldNumberSelectOptionPipe', () => {
  let pipe: TimetableFieldNumberSelectOptionPipe;

  beforeEach(() => {
    pipe = new TimetableFieldNumberSelectOptionPipe();
  });

  it('should transform ttfn to select option', () => {
    expect(
      pipe.transform({
        number: '123',
        descriptionOutwardLine1: 'Bern - Thun',
      } as TimetableFieldNumber)
    ).toEqual('123 - Bern - Thun');
  });
});
