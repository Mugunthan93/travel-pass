import { from, Observable, of } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { map, tap } from 'rxjs/operators';

export class Android {

    constructor(
        private nativeStorage: NativeStorage
    ){

    }

    storeSession(user){
        return from(this.nativeStorage.setItem('user', user))
          .pipe(
            () => {
              console.log("android session saved");
              return null;
            }
          )
    }
    
    getSession(){
        return from(this.nativeStorage.getItem('user'))
        .pipe(
        map(
        (sessionData) => {
            let parsedData = JSON.parse(sessionData);
            return parsedData;
        })
        )
    }

    clearSession() {
    return from(this.nativeStorage.clear())
        .pipe(
        map(
            () => {
            console.log("android session cleared");
            return null;
            }
        )
        );
    }

}

export class Desktop {

    constructor() {

    }

    storeSession(user) {
        return of(sessionStorage.setItem("user", JSON.stringify(user)));
    }
    
    getSession(){
        return of(sessionStorage.getItem("user"))
            .pipe(
                map(
                    (sessionData) => {
                        let parsedData = JSON.parse(sessionData);
                        return parsedData;
                    })
            );
    }

    clearSession() {
    return of(sessionStorage.removeItem("user"));
    }

}