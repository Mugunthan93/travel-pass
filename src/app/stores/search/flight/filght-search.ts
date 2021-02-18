

export class BaseFlightSearch {

    constructor() {

    }

    getCabinClass(cls: string) {
        if (cls == "all") {
            return "1";
        }
        if (cls == "economy") {
            return "2";
        }
        else if (cls == "premium economy") {
            return "3";
        }
        else if (cls == "bussiness") {
            return "4";
        }
        else if (cls == "first class") {
            return "6";
        }
    }
}