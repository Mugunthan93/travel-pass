import { environment } from 'src/environments/environment';


export const place_api : any = {
    url: "https://maps.googleapis.com/maps/api/js?key=" + environment.map_js_key + "&callback=initMap"
}