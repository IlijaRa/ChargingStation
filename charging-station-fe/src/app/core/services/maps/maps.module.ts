export interface IResult {
    id?: string;
    geometry?: IGeometry;
    properties?: IProperties;
}

export interface IGeometry {
    type?: string;
    coordinates?: number[];
}

export interface IProperties {
    feature_type?: string;
    full_address?: string;
    place_formatted?: string;
}

export interface IAddressResult {
    id?: string;
    name?: string;
    latitude?: number;
    longitude?: number;
}