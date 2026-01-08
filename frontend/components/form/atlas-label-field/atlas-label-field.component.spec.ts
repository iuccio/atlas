import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtlasLabelFieldComponent } from '@atlas/form';
import { FieldExample } from '../../../src/app/core/form-components/text-field/field-example';
import { By } from '@angular/platform-browser';
import { translateServiceProvider } from '../../../src/app/app.testing.mocks';

describe('AtlasLabelFieldComponent', () => {
  let component: AtlasLabelFieldComponent;
  let fixture: ComponentFixture<AtlasLabelFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [translateServiceProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(AtlasLabelFieldComponent);
    component = fixture.componentInstance;
  });

  it('should translate without arg', () => {
    const fieldExample: FieldExample = {
      label: 'label',
      translate: true,
      numberOfChars: 2,
    };
    expect(component.translate(fieldExample)).toEqual('label');
  });

  it('should translate with arg', () => {
    const fieldExample: FieldExample = {
      label: 'hallo',
      translate: true,
      numberOfChars: 2,
      arg: { key: 'key', value: 'value' },
    };
    expect(component.translate(fieldExample)).toEqual('hallo');
  });

  it('should return only label', () => {
    const fieldExample: FieldExample = {
      label: '',
    };
    expect(component.translate(fieldExample)).toEqual('');
  });

  it('should translate without arg', () => {
    const fieldExample: FieldExample = {
      label: 'hallo',
      translate: true,
      numberOfChars: 2,
    };
    component.fieldExamples = [fieldExample];
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.font-regular-sm'));
    expect(element.nativeElement.textContent).toEqual('hallo');
  });
});
