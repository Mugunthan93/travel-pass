import { environment } from 'src/environments/environment';


export const place_api = {
    url: "https://maps.googleapis.com/maps/api/js?key=" + environment.places_api + "&callback=initMap"
}