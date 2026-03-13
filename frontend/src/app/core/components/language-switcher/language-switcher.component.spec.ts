import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { By } from '@angular/platform-browser';
import { DateAdapter } from '@angular/material/core';
import deTranslationFile from 'src/assets/i18n/de.json';
import frTranslationFile from 'src/assets/i18n/fr.json';
import itTranslationFile from 'src/assets/i18n/it.json';
import { TranslateService } from '@ngx-translate/core';
import { mock } from 'vitest-mock-extended';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dateAdapter: Mocked<Pick<DateAdapter<any>, 'setLocale'>>;
  const translateService = mock<TranslateService>();
  translateService.use.mockReturnValue(of());

  beforeEach(() => {
    // Mocking
    dateAdapter = { setLocale: vi.fn() };

    // Config
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: DateAdapter, useValue: dateAdapter },
        { provide: TranslateService, useValue: translateService },
      ],
    });

    // Arrangement
    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should switch to "de"', () => {
    component.setLanguage('de').subscribe(() => {
      expect(component.currentLanguage).toBe('de');
      expect(dateAdapter.setLocale).toHaveBeenCalledExactlyOnceWith('de');
    });
  });

  it('should switch to "fr"', () => {
    component.setLanguage('fr').subscribe(() => {
      expect(component.currentLanguage).toBe('fr');
      expect(dateAdapter.setLocale).toHaveBeenCalledExactlyOnceWith('fr');
    });
  });

  it('should switch to "it"', () => {
    component.setLanguage('it').subscribe(() => {
      expect(component.currentLanguage).toBe('it');
      expect(dateAdapter.setLocale).toHaveBeenCalledExactlyOnceWith('it');
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
