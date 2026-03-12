import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import { GeoJSONSource, Map, MapGeoJSONFeature } from 'maplibre-gl';
import { TrafficPointMapService } from './traffic-point-map.service';
import { MapService } from './map.service';
import { BehaviorSubject, of } from 'rxjs';
import { MAP_TRAFFIC_POINT_LAYER_NAME } from './map-style';
import { BERN_WYLEREGG_TRAFFIC_POINTS } from '../../../../test/data/traffic-point-element';
import { TrafficPointElementInternalService } from '../../../api/service/sepodi/traffic-point-element-internal.service';
import { Point } from 'geojson';

describe('TrafficPointMapService', () => {
  let service: TrafficPointMapService;

  let mapServiceSpy: Mocked<
    Pick<MapService, 'centerOn' | 'mapInitialized' | 'map'>
  >;
  let sourceSpy: Mocked<Pick<GeoJSONSource, 'setData'>>;
  let mapSpy: Mocked<Pick<Map, 'getSource'>>;
  let trafficPointElementInternalService: {
    getTrafficPointsOfServicePointValidToday: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    sourceSpy = {
      setData: vi.fn().mockImplementation(() => {}),
    };
    mapSpy = {
      getSource: vi.fn().mockReturnValue(sourceSpy),
    };
    mapServiceSpy = {
      centerOn: vi.fn(),
      mapInitialized: new BehaviorSubject<boolean>(true),
      map: mapSpy as unknown as Map,
    };

    trafficPointElementInternalService = {
      getTrafficPointsOfServicePointValidToday: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MapService,
          useValue: mapServiceSpy,
        },
        {
          provide: TrafficPointElementInternalService,
          useValue: trafficPointElementInternalService,
        },
      ],
    });
    service = TestBed.inject(TrafficPointMapService);
  });

  it('should build popup information correctly', () => {
    const features = [
      {
        geometry: {
          coordinates: [7.439133524894714, 46.94883407094761],
        },
        properties: {
          sloid: 'ch:1:sloid:0:245',
          designation: 'A',
          type: 'BORDING_PLATFORM',
          servicePointNumber: 857000,
        },
      },
    ] as unknown as MapGeoJSONFeature[];

    const result =
      TrafficPointMapService.buildTrafficPointPopupInformation(features);
    expect(result).toEqual(
      '<a href="service-point-directory/service-points/857000/traffic-point-elements/ch:1:sloid:0:245">A - ch:1:sloid:0:245</a> <br/>'
    );
  });

  it('should display TrafficPoints on map', () => {
    trafficPointElementInternalService.getTrafficPointsOfServicePointValidToday.mockReturnValue(
      of(BERN_WYLEREGG_TRAFFIC_POINTS)
    );

    service.displayTrafficPointsOnMap(8507000);

    expect(mapServiceSpy.map.getSource).toHaveBeenCalledWith(
      MAP_TRAFFIC_POINT_LAYER_NAME
    );
    expect(sourceSpy.setData).toHaveBeenCalled();
    const data = sourceSpy.setData.mock.calls.at(
      -1
    )?.[0] as GeoJSON.FeatureCollection;
    expect(data.features).toHaveLength(2);
  });

  it('should clear TrafficPoints on map', () => {
    service.clearDisplayedTrafficPoints();

    expect(sourceSpy.setData).toHaveBeenCalled();
    const data = sourceSpy.setData.mock.calls.at(
      -1
    )?.[0] as GeoJSON.FeatureCollection;
    expect(data.features).toHaveLength(0);
  });

  it('should display current TrafficPointVersion on map', () => {
    service.displayCurrentTrafficPoint({
      north: 46.96102079646,
      east: 7.44908190053,
      spatialReference: 'WGS84',
    });

    expect(mapServiceSpy.map.getSource).toHaveBeenCalledWith(
      'current_traffic_point'
    );
    expect(sourceSpy.setData).toHaveBeenCalled();
    const data = sourceSpy.setData.mock.calls.at(
      -1
    )?.[0] as GeoJSON.Feature<Point>;
    expect(data.geometry.coordinates).toEqual([7.44908190053, 46.96102079646]);
  });
});
