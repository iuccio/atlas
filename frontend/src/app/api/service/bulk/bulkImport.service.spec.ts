import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {BulkImportService} from "./bulkImport.service";
import {ApplicationType} from "../../model/applicationType";
import {BusinessObjectType} from "../../model/businessObjectType";
import {ImportType} from "../../model/importType";
import {BulkImportRequest} from "../../model/bulkImportRequest";
import {provideHttpClient} from "@angular/common/http";

describe('BulkImportService', () => {
  let service: BulkImportService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BulkImportService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    service = TestBed.inject(BulkImportService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call downloadTemplate with the correct URL', () => {
    const applicationType = ApplicationType.Sepodi;
    const objectType = BusinessObjectType.ServicePoint;
    const importType = ImportType.Create;
    service.downloadTemplate(applicationType, objectType, importType)
      .subscribe(response => {
        expect(response).toBeTruthy();
      });

    const req = httpTestingController.expectOne(request =>
      request.method === 'GET' &&
      request.url.includes('/bulk-import-service/v1/import/bulk/template/')
    );

    expect(req.request.responseType).toEqual('blob');
  });

  it('should throw an error in getBulkImportResults if id is null', () => {
    expect(() => service.getBulkImportResults(null as any))
      .toThrowError(`Required parameter 'id' is null or undefined.`);
  });

  it('should call startBulkImport with correct URL, method and FormData body', () => {
    const bulkImportRequest: BulkImportRequest = {
      applicationType: ApplicationType.Sepodi,
      objectType: BusinessObjectType.ServicePoint,
      importType: ImportType.Create
    };
    const file = new Blob(['Test'], { type: 'text/plain' });

    service.startBulkImport(bulkImportRequest, file).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne(r =>
      r.method === 'POST' &&
      r.url.endsWith('/bulk-import-service/v1/import/bulk')
    );
    expect(req.request.body instanceof FormData).toBeTrue();

    const formData: FormData = req.request.body;

    expect(formData.has('bulkImportRequest')).toBeTrue();
    expect(formData.has('file')).toBeTrue();

  });

});
