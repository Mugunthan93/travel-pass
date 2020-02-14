export interface Picker{
    columnData : Column[],
    buttonData : Button[]
}

export interface Column{
    name : string;
    options : Option[]
}

export interface Option{
    text : string;
    value : number
}

export interface Button {
    text : string;
    role? : string;
    handler? : any;
}

export interface RoundTrip {
    From : string,
    To : string,
    DepartDate : string,
    ReturnDate : string,
    Persons : Picker;
    Class : Picker
}

export interface MultiCity {
    
}

export interface searchTrip {

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


export interface OneWayTrip{
    origin : City,
    destination : City,
    departureDate : string,
    persons : Picker,
    class : Picker
}

export interface searchType{
    AdultCount : string,
    ChildCount : string,
    InfantCount : string,
    JourneyType : number,
    Segments : Segment[],
    Sources : string[],
    prefferedAirline : []
}
    
export interface Segment{
    Origin: string
    Destination: string
    FlightCabinClass: string
    PreferredDepartureTime: string
    PreferredArrivalTime: string
}