export interface Option {
    text: string;
    value: number
}

export interface Column {
    name: string;
    options: Option[]
}

export interface Button {
    text: string;
    role?: string;
    handler?: any;
}

export interface Picker {
    columnData: Column[],
    buttonData: Button[]
}

export interface City {
    airport_code: string
    airport_name: string
    city_code: string
    city_name: string
    country_code: string
    country_name: string
    currency: string
    nationalty: string
}

/////////////////////////

export interface RoundTrip {
}

export interface MultiCity {

}

export interface OneWayTrip {
    origin: City,
    destination: City,
    departureDate: string,
    persons: string,
    class: string
}

/////////////////////////

export interface searchType {
    AdultCount: string,
    ChildCount: string,
    InfantCount: string,
    JourneyType: number,
    Segments: Segment[],
    Sources: string[],
    prefferedAirline: []
}

export interface Segment {
    Origin: string
    Destination: string
    FlightCabinClass: string
    PreferredDepartureTime: string
    PreferredArrivalTime: string
}