import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';

import { MapComponent } from './map.component';
import { AppTestingModule } from '../../../app.testing.module';
import { MAP_STYLES } from './map-options';
import { CoordinatePairWGS84, MapService } from './map.service';
import maplibregl, { Map } from 'maplibre-gl';
import { BehaviorSubject } from 'rxjs';
import { PermissionService } from '../../../core/auth/permission/permission.service';
import { adminPermissionServiceMock } from '../../../app.testing.mocks';
import { SERVICE_POINT_MIN_ZOOM } from './map-style';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  const clickedGeographyCoordinatesSubject =
    new BehaviorSubject<CoordinatePairWGS84>({
      lat: 0,
      lng: 0,
    });

  const mapCanvasMock = document.createElement('canvas');
  let mapSpy: Record<
    | 'once'
    | 'flyTo'
    | 'getCanvas'
    | 'on'
    | 'off'
    | 'fire'
    | 'getZoom'
    | 'setZoom'
    | 'zoomTo'
    | 'zoomOut',
    ReturnType<typeof vi.fn>
  >;
  let mapServiceSpy: Mocked<
    Pick<
      MapService,
      | 'initMap'
      | 'switchToStyle'
      | 'removeMap'
      | 'initMapEvents'
      | 'placeMarkerAndFlyTo'
    >
  > & {
    clickedGeographyCoordinates: BehaviorSubject<CoordinatePairWGS84>;
    servicePointsShown: BehaviorSubject<boolean>;
    mapInitialized: BehaviorSubject<boolean>;
  };
  let markerSpy: Mocked<
    Pick<maplibregl.Marker, 'addTo' | 'setLngLat' | 'remove'>
  >;

  beforeEach(async () => {
    mapSpy = {
      once: vi.fn(),
      flyTo: vi.fn(),
      getCanvas: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      fire: vi.fn(),
      getZoom: vi.fn(),
      setZoom: vi.fn(),
      zoomTo: vi.fn(),
      zoomOut: vi.fn(),
    };
    mapSpy.getCanvas.mockReturnValue(mapCanvasMock);

    mapServiceSpy = {
      initMap: vi.fn(),
      switchToStyle: vi.fn(),
      removeMap: vi.fn(),
      initMapEvents: vi.fn(),
      placeMarkerAndFlyTo: vi.fn(),
      clickedGeographyCoordinates: clickedGeographyCoordinatesSubject,
      servicePointsShown: new BehaviorSubject(false),
      mapInitialized: new BehaviorSubject(false),
    };
    mapServiceSpy.initMap.mockReturnValue(mapSpy as unknown as Map);

    markerSpy = {
      addTo: vi.fn(),
      setLngLat: vi.fn(),
      remove: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AppTestingModule, MapComponent],
      providers: [
        { provide: MapService, useValue: mapServiceSpy },
        { provide: PermissionService, useValue: adminPermissionServiceMock },
      ],
    }).compileComponents();

    vi.spyOn(maplibregl, 'Marker').mockImplementation(
      () => markerSpy as unknown as maplibregl.Marker
    );
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open map style selection', () => {
    expect(component.showMapStyleSelection).toBe(false);

    component.toggleStyleSelection();
    expect(component.showMapStyleSelection).toBe(true);
  });

  it('should switch map style selection via service', () => {
    mapServiceSpy.switchToStyle.mockImplementation((i) => i);

    const newStyle = MAP_STYLES[1];
    component.switchToStyle(newStyle);

    expect(mapServiceSpy.switchToStyle).toHaveBeenCalled();
    expect(component.currentMapStyle).toEqual(newStyle);
    expect(component.showMapStyleSelection).toBe(false);
  });

  it('should toggle legend', () => {
    expect(component.showMapLegend).toBe(false);

    component.toggleLegend();
    expect(component.showMapLegend).toBe(true);

    component.toggleLegend();
    expect(component.showMapLegend).toBe(false);
  });

  it('should increase zoom when zoomIn() is called', () => {
    component.zoomIn();
    expect(component.map.zoomTo).toHaveBeenCalledWith(
      component.map.getZoom() + 0.75,
      {
        duration: 500,
      }
    );
  });

  it('should decrease zoom when zoomOut() is called', () => {
    component.zoomOut();
    expect(component.map.zoomTo).toHaveBeenCalledWith(
      component.map.getZoom() - 0.75,
      {
        duration: 500,
      }
    );
  });

  it('should zoom to SERVICE_POINT_MIN_ZOOM', () => {
    component.zoomToServicePointMin();
    expect(component.map.zoomTo).toHaveBeenCalledWith(SERVICE_POINT_MIN_ZOOM, {
      duration: 500,
    });
  });

  it('should center into swiss country when goHome() is called', () => {
    component.goHome();
    expect(component.map.flyTo).toHaveBeenCalledWith({
      center: [8.2275, 46.8182],
      zoom: 7.25,
      speed: 0.8,
    });
  });
});
