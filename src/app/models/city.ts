import { response } from './response';

export interface cityListResponse extends response {
    data : city[]
}

export interface city {
    airport_name: string
    airport_code: string
    city_name: string
    city_code: string
    country_name: string
    country_code: string
    nationalty: string
    currency: string
}