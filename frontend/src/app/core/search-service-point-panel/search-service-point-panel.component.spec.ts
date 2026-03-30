import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchServicePointPanelComponent } from './search-service-point-panel.component';
import { Component, Input } from '@angular/core';
import { ServicePointSearchType } from '../search-service-point/service-point-search';
import { translateServiceProvider } from '../../app.testing.mocks';
import { SearchServicePointComponent } from '../search-service-point/search-service-point.component';

@Component({
  selector: 'atlas-search-service-point',
  template: '<h1>SearchServicePointComponent</h1>',
})
class SearchServicePointMockComponent {
  @Input() searchType!: ServicePointSearchType;
}

describe('SearchServicePointPanelComponent', () => {
  let component: SearchServicePointPanelComponent;
  let fixture: ComponentFixture<SearchServicePointPanelComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      providers: [translateServiceProvider],
    })
      .overrideComponent(SearchServicePointPanelComponent, {
        remove: {
          imports: [SearchServicePointComponent],
        },
        add: {
          imports: [SearchServicePointMockComponent],
        },
      })
      .createComponent(SearchServicePointPanelComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle', () => {
    //given
    vi.spyOn(component.toggleEvent, 'emit');
    //when
    component.toggle();
    //then
    expect(component.toggleEvent.emit).toHaveBeenCalledExactlyOnceWith();
    expect(component.showSearchPanel).toBe(false);
  });
});
