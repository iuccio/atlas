import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import { MapService } from './map.service';
import { AuthService } from '../../../core/auth/auth.service';
import {
  DragRotateHandler,
  GeoJSONSource,
  Map,
  MapGeoJSONFeature,
  MapMouseEvent,
  Marker,
  ScrollZoomHandler,
  TwoFingersTouchZoomRotateHandler,
} from 'maplibre-gl';
import { SpatialReference } from '../../../api';
import { MAP_STYLES } from './map-options';
import { Router } from '@angular/router';

describe('MapService', () => {
  const authService: Partial<AuthService> = {};

  let markerSpy: Mocked<Pick<Marker, 'addTo' | 'setLngLat' | 'remove'>>;
  let mapSpy: Mocked<
    Pick<
      Map,
      | 'flyTo'
      | 'getCanvas'
      | 'on'
      | 'fire'
      | 'getSource'
      | 'setZoom'
      | 'getZoom'
      | 'setCenter'
      | 'setLayoutProperty'
      | 'resize'
    >
  >;

  let service: MapService;
  let router: Router;

  beforeEach(() => {
    markerSpy = {
      addTo: vi.fn(),
      setLngLat: vi.fn(),
      remove: vi.fn(),
    };

    mapSpy = {
      on: vi.fn().mockImplementation(() => {}),
      flyTo: vi.fn(),
      getCanvas: vi.fn(),
      fire: vi.fn(),
      getSource: vi.fn().mockReturnValue({
        setData: vi.fn(),
      }),
      setZoom: vi.fn(),
      getZoom: vi.fn(),
      setCenter: vi.fn(),
      setLayoutProperty: vi.fn(),
      resize: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });
    service = TestBed.inject(MapService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init map', () => {
    const localMapSpy = {
      setMaxZoom: vi.fn(),
      setMinZoom: vi.fn(),
      resize: vi.fn(),
      once: vi.fn(),
      hasImage: vi.fn(),
      addImage: vi.fn(),
      setZoom: vi.fn(),
      on: vi.fn(),
      setCenter: vi.fn(),
      setLayoutProperty: vi.fn(),
      getSource: vi.fn(),
      dragRotate: {
        disable: vi.fn(),
      } as unknown as DragRotateHandler,
      touchZoomRotate: {
        disableRotation: vi.fn(),
      } as unknown as TwoFingersTouchZoomRotateHandler,
      scrollZoom: {
        setWheelZoomRate: vi.fn(),
        setZoomRate: vi.fn(),
      } as unknown as ScrollZoomHandler,
    };

    vi.spyOn(service, 'createMap').mockReturnValue(
      localMapSpy as unknown as Map
    );
    vi.spyOn(service, 'deselectServicePoint').mockImplementation(() => {});

    const htmlDivElement = document.createElement('div');
    const map = service.initMap(htmlDivElement);

    // call all listeners for coverage
    localMapSpy.once.mock.calls.forEach((call: unknown[]) => {
      const listener = call[1] as ((e: unknown) => void) | undefined;
      if (listener) {
        listener(undefined);
      }
    });

    expect(map).toBeTruthy();
  });

  it('should fly to coordinates on map', () => {
    const localMapSpy = {
      flyTo: vi.fn(),
      resize: vi.fn(),
      once: vi.fn(),
    };
    localMapSpy.flyTo.mockReturnValue(localMapSpy);

    service.map = localMapSpy as unknown as Map;

    service.centerOn({
      north: 46.96096807883433,
      east: 7.448919722210154,
      spatialReference: SpatialReference.Wgs84,
    });

    expect(localMapSpy.flyTo).toHaveBeenCalled();
  });

  it('should deselect service point', () => {
    const setDataSpy = vi.fn();
    const localMapSpy = {
      ...mapSpy,
      getSource: vi.fn().mockReturnValue({ setData: setDataSpy }),
    };
    service.map = localMapSpy as unknown as Map;
    service.deselectServicePoint();

    expect(localMapSpy.getSource).toHaveBeenCalledWith('current_coordinates');
    expect(
      (service.map.getSource('current_coordinates') as GeoJSONSource).setData
    ).toHaveBeenCalledWith({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: {},
    });
  });

  it('should switch to different map style', () => {
    const localMapSpy = {
      setLayoutProperty: vi.fn(),
    };
    service.map = localMapSpy as unknown as Map;

    service.switchToStyle(MAP_STYLES[3]);

    expect(localMapSpy.setLayoutProperty).toHaveBeenCalledWith(
      'osm',
      'visibility',
      'visible'
    );
  });

  it('should remove map', () => {
    const localMapSpy = {
      remove: vi.fn(),
    };
    service.map = localMapSpy as unknown as Map;

    service.removeMap();

    expect(localMapSpy.remove).toHaveBeenCalledWith();
  });

  it('should build popup information correctly', () => {
    const features = [
      {
        geometry: {
          coordinates: [7.439133524894714, 46.94883407094761],
        },
        properties: {
          number: 8507000,
          designationOfficial: 'Bern',
          id: 10019,
          type: 'STOP_POINT_AND_FREIGHT_SERVICE_POINT',
        },
      },
    ] as unknown as MapGeoJSONFeature[];

    const result = service.buildServicePointPopupInformation(features);
    expect(result).toEqual(
      '<a href="service-point-directory/service-points/8507000"><b>85 07000</b> - Bern</a> <br/>'
    );
  });

  it('should show popup on features coordinates', () => {
    service.map = mapSpy as unknown as Map;
    const mouseEvent = {
      features: [
        {
          geometry: {
            coordinates: [7.439133524894714, 46.94883407094761],
          },
          properties: {
            number: 8507000,
            designationOfficial: 'Bern',
            id: 10019,
            type: 'STOP_POINT_AND_FREIGHT_SERVICE_POINT',
          },
        },
      ],
    } as unknown as MapMouseEvent & { features?: MapGeoJSONFeature[] };

    vi.spyOn(service.popup, 'addTo').mockImplementation(() => service.popup);
    service.showServicePointPopup(mouseEvent);

    expect(service.popup.getLngLat().lat).toEqual(46.94883407094761);
    expect(service.popup.getLngLat().lng).toEqual(7.439133524894714);
  });

  it('should select service point on click if only one is on coordinates', () => {
    const localMapSpy = {
      getZoom: vi.fn().mockReturnValue(12),
    };
    service.map = localMapSpy as unknown as Map;

    const mouseEvent = {
      features: [
        {
          geometry: {
            coordinates: [7.439133524894714, 46.94883407094761],
          },
          properties: {
            number: 8507000,
            designationOfficial: 'Bern',
            id: 10019,
            type: 'STOP_POINT_AND_FREIGHT_SERVICE_POINT',
          },
        },
      ],
    } as unknown as MapMouseEvent & { features?: MapGeoJSONFeature[] };

    vi.spyOn(service.selectedElement, 'next').mockImplementation(() => {});
    service.onClick(mouseEvent);

    expect(service.selectedElement.next).toHaveBeenCalled();
  });

  it('should fix popup on click if only multiple service points are on coordinates', () => {
    // Given
    const localMapSpy = {
      getZoom: vi.fn().mockReturnValue(12),
    };
    service.map = localMapSpy as unknown as Map;

    const mouseEvent = {
      features: [
        {
          geometry: {
            coordinates: [7.439133524894714, 46.94883407094761],
          },
          properties: {
            number: 8507000,
            designationOfficial: 'Bern',
            id: 10019,
            type: 'STOP_POINT_AND_FREIGHT_SERVICE_POINT',
          },
        },
        {
          geometry: {
            coordinates: [7.439133524894714, 46.94883407094761],
          },
          properties: {
            number: 8507001,
            designationOfficial: 'Bern Bhf Aufzug',
            id: 10019,
            type: 'STOP_POINT',
          },
        },
      ],
    } as unknown as MapMouseEvent & { features?: MapGeoJSONFeature[] };
    expect(service.keepPopup).toBe(false);

    vi.spyOn(service.selectedElement, 'next').mockImplementation(() => {});
    vi.spyOn(service, 'setPopupToFixed').mockImplementation(() => {});

    // when
    service.onClick(mouseEvent);

    // then
    expect(service.selectedElement.next).not.toHaveBeenCalled();
    expect(service.keepPopup).toBe(true);
    expect(service.setPopupToFixed).toHaveBeenCalled();
  });

  it('should add marker to map and fly to coordinates', () => {
    service.coordinateSelectionMode = true;

    const latLngCoordinates = { lat: 40, lng: -74 };
    markerSpy.setLngLat.mockReturnValue(markerSpy as unknown as Marker);
    service.marker = markerSpy as unknown as Marker;
    service.map = mapSpy as unknown as Map;

    service.placeMarkerAndFlyTo(latLngCoordinates);

    expect(markerSpy.setLngLat).toHaveBeenCalledWith(latLngCoordinates);
    expect(markerSpy.addTo).toHaveBeenCalledWith(service.map);
    expect(mapSpy.flyTo).toHaveBeenCalled();
  });

  it('should show popup on sector features coordinates', () => {
    service.map = mapSpy as unknown as Map;
    const mouseEvent = {
      features: [
        {
          geometry: {
            coordinates: [7.439133524894714, 46.94883407094761],
          },
          properties: {
            sloid: 'ch:1:sloid:7000:0:2:1',
            trafficPointSloid: 'ch:1:sloid:7000:0:2',
            designation: 'A',
          },
        },
      ],
    } as unknown as MapMouseEvent & { features?: MapGeoJSONFeature[] };

    vi.spyOn(service.popup, 'addTo').mockImplementation(() => service.popup);
    service.showSectorPopup(mouseEvent);

    expect(service.popup.getLngLat().lat).toEqual(46.94883407094761);
    expect(service.popup.getLngLat().lng).toEqual(7.439133524894714);
  });

  it('should navigate to sector detail on click', () => {
    // Given
    const localMapSpy = {
      getZoom: vi.fn().mockReturnValue(12),
    };
    service.map = localMapSpy as unknown as Map;

    const mouseEvent = {
      features: [
        {
          geometry: {
            coordinates: [7.439133524894714, 46.94883407094761],
          },
          properties: {
            servicePointNumber: 8507000,
            sloid: 'ch:1:sloid:7000:0:2:1',
            trafficPointSloid: 'ch:1:sloid:7000:0:2',
            designation: 'A',
          },
        },
      ],
    } as unknown as MapMouseEvent & { features?: MapGeoJSONFeature[] };

    vi.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
    service.onSectorClicked(mouseEvent);

    expect(router.navigate).toHaveBeenCalledWith([
      'service-point-directory',
      'service-points',
      8507000,
      'traffic-point-elements',
      'ch:1:sloid:7000:0:2',
      'sectors',
      'ch:1:sloid:7000:0:2:1',
    ]);
  });
});
