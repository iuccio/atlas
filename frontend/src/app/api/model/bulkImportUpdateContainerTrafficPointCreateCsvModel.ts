/**
 * Atlas API
 *
 * Contact: TechSupport-ATLAS@sbb.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { BulkImportLogEntry } from './bulkImportLogEntry';
import { TrafficPointCreateCsvModel } from './trafficPointCreateCsvModel';


export interface BulkImportUpdateContainerTrafficPointCreateCsvModel { 
    bulkImportId?: number;
    lineNumber?: number;
    object?: TrafficPointCreateCsvModel;
    attributesToNull?: Array<string>;
    inNameOf?: string;
    bulkImportLogEntry?: BulkImportLogEntry;
}

