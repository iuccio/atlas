import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppTestingModule } from '../../../../app.testing.module';
import { SectorGroupDetailResolver } from './sector-group-detail-resolver.service';
import { of } from 'rxjs';
import { SectorGroupService } from '../../../../api/service/sepodi/sector-group.service';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { mock, mockDeep } from 'vitest-mock-extended';

describe('SectorDetailResolver', () => {
  const sectorGroupService = mock<SectorGroupService>();
  let resolver: SectorGroupDetailResolver;

  beforeEach(() => {
    sectorGroupService.getSectorGroup.mockReturnValue(
      of([
        {
          trafficPointSloid: 'ch:1:sloid:7000::1',
          validFrom: new Date('2014-12-14'),
          validTo: new Date('2014-12-14'),
          designation: 'A',
          sloid: 'ch:1:sloid:7000::1:1',
        },
      ])
    );

    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        SectorGroupDetailResolver,
        {
          provide: SectorGroupService,
          useValue: sectorGroupService,
        },
      ],
    });
    resolver = TestBed.inject(SectorGroupDetailResolver);
  });

  it('should create', () => {
    expect(resolver).toBeTruthy();
  });

  it('should get versions from service to display', () => {
    const mockRoute = mockDeep<ActivatedRouteSnapshot>({
      paramMap: convertToParamMap({
        sectorSloid: 'ch:1:sloid:7000::1:1',
      }),
    });

    const resolvedVersion = resolver.resolve(mockRoute);

    resolvedVersion.subscribe((versions) => {
      expect(versions.length).toBe(1);
      expect(versions[0].sloid).toBe('ch:1:sloid:7000::1:1');
    });
  });
});
