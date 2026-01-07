import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { By } from '@angular/platform-browser';
import { DateAdapter } from '@angular/material/core';
import deTranslationFile from 'src/assets/i18n/de.json';
import frTranslationFile from 'src/assets/i18n/fr.json';
import itTranslationFile from 'src/assets/i18n/it.json';
import { AppTestingModule } from '../../../app.testing.module';
import SpyObj = jasmine.SpyObj;

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dateAdapterSpy: SpyObj<DateAdapter<any>>;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dateAdapterSpy = jasmine.createSpyObj<DateAdapter<any>>(['setLocale']);

    await TestBed.configureTestingModule({
      imports: [AppTestingModule, LanguageSwitcherComponent],
      providers: [{ provide: DateAdapter, useValue: dateAdapterSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dateAdapterSpy.setLocale.calls.reset();
  });

  it('should switch to "de"', (done) => {
    component.setLanguage('de').subscribe(() => {
      expect(component.currentLanguage).toBe('de');
      expect(dateAdapterSpy.setLocale).toHaveBeenCalledOnceWith('de');
      done();
    });
  });

  it('should switch to "fr"', (done) => {
    component.setLanguage('fr').subscribe(() => {
      expect(component.currentLanguage).toBe('fr');
      expect(dateAdapterSpy.setLocale).toHaveBeenCalledOnceWith('fr');
      done();
    });
  });

  it('should switch to "it"', (done) => {
    component.setLanguage('it').subscribe(() => {
      expect(component.currentLanguage).toBe('it');
      expect(dateAdapterSpy.setLocale).toHaveBeenCalledOnceWith('it');
      done();
    });
  });

  it('should have translation for all defined keys', () => {
    expect(component.languages[0]).toBe('de');

    const deJson = JSON.parse(JSON.stringify(deTranslationFile));
    const deProperties = propertiesOf(deJson);

    const frJson = JSON.parse(JSON.stringify(frTranslationFile));
    const frProperties = propertiesOf(frJson);

    expect(frProperties).toEqual(deProperties);

    const itJson = JSON.parse(JSON.stringify(itTranslationFile));
    const itProperties = propertiesOf(itJson);

    expect(itProperties).toEqual(deProperties);
  });

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const propertiesOf = (obj: any, results: string[] = []) => {
    const r = results;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (typeof value !== 'object') {
        r.push(key);
      } else if (typeof value === 'object') {
        propertiesOf(value, r);
      }
    });
    return r;
  };

  it('should create links for languages', () => {
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBe(component.languages.length);
  });
});
