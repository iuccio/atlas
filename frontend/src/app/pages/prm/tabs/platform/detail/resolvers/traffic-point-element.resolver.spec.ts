import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';

import { Observable, of } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  RouterStateSnapshot,
} from '@angular/router';
import { trafficPointElementResolver } from './traffic-point-element.resolver';
import { BERN_WYLEREGG_TRAFFIC_POINTS } from '../../../../../../../test/data/traffic-point-element';
import { AppTestingModule } from '../../../../../../app.testing.module';
import { ReadTrafficPointElementVersion } from '../../../../../../api';
import { TrafficPointElementService } from '../../../../../../api/service/sepodi/traffic-point-element.service';

describe('TrafficPointElementResolver', () => {
  let trafficPointElementService: Mocked<
    Pick<TrafficPointElementService, 'getTrafficPointElement'>
  >;

  beforeEach(() => {
    trafficPointElementService = {
      getTrafficPointElement: vi.fn(),
    };
    trafficPointElementService.getTrafficPointElement.mockReturnValue(
      of(BERN_WYLEREGG_TRAFFIC_POINTS)
    );

    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        {
          provide: TrafficPointElementService,
          useValue: trafficPointElementService,
        },
      ],
    });
  });

  it('should get traffic point from sepodi', () => {
    const mockRoute = {
      paramMap: convertToParamMap({ platformSloid: 'ch:1:sloid:89008:0:1' }),
    } as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() =>
      trafficPointElementResolver(mockRoute, {} as RouterStateSnapshot)
    ) as Observable<ReadTrafficPointElementVersion[]>;

    result.subscribe((versions) => {
      expect(versions.length).toBe(2);
      expect(versions[0].sloid).toBe('ch:1:sloid:89008:0:1');
    });
  });
});
