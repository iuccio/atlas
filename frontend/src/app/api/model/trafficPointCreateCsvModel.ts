/**
 * Atlas API
 *
 * Contact: TechSupport-ATLAS@sbb.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SpatialReference } from './spatialReference';
import { TrafficPointElementType } from './trafficPointElementType';


export interface TrafficPointCreateCsvModel { 
    sloid?: string;
    validFrom?: Date;
    validTo?: Date;
    trafficPointElementType?: TrafficPointElementType;
    parentSloid?: string;
    stopPointSloid?: string;
    number?: number;
    designation?: string;
    designationOperational?: string;
    length?: number;
    boardingAreaHeight?: number;
    compassDirection?: number;
    east?: number;
    north?: number;
    spatialReference?: SpatialReference;
    height?: number;
}
export namespace TrafficPointCreateCsvModel {
}


