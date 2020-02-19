import { StorageEngine } from '@ngxs/storage-plugin';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';

export class customStorage implements StorageEngine{

    length: number;
    

    constructor(
        public platform : Platform,
        public nativeStorage : NativeStorage
    ){
    }
    
    getItem(key: string) {
        return from(this.nativeStorage.getItem(key))
            .pipe(
                tap(
                (appData) => {
                    return appData;
                }) 
            );
    }
    setItem(key: string, val: any) : Observable<boolean> {
        return from(this.nativeStorage.setItem(key,val))
            .pipe(
                tap(
                () => {
                    console.log(key + " is saved");
                    return true;
                })
            );
    }
    removeItem(key: string) : Observable<boolean> {
        return from(this.nativeStorage.remove(key))
            .pipe(
                tap(
                () => {
                    console.log(key + " is removed");
                    return true;
                })
            );
    }
    clear() : Observable<boolean>{
        return from(this.nativeStorage.clear())
            .pipe(
                tap(
                    () => {
                       console.log("app data is cleared"); 
                       return true;
                    }
                )
            );
    }


}