import { StorageEngine } from '@ngxs/storage-plugin';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable()
export class customStorage implements StorageEngine{

    length: number;

    constructor(
        public platform : Platform,
        public nativeStorage : NativeStorage
    ) {
        console.log(this.platform);
    }
    
    getItem(key: string) {
        if (key !== 'undefined' && typeof key !== 'undefined' && key !== null) {
            return this.platform.ready().then(() => {
                if(this.platform.is("desktop") || this.platform.is("mobile")){
                    return sessionStorage.getItem(key);
                }
                else if(this.platform.is("android")){
                    return this.nativeStorage.getItem(key)
                        .then(
                            (data) => {
                                console.log(data);
                                return data
                            },
                            (error) => {
                                console.log(error);
                                return;
                            }
                        );
                }
            });
        }
    }

    setItem(key: string, val: any) {
        if (key !== 'undefined' && typeof key !== 'undefined' && key !== null) {
            return this.platform.ready().then(() => {
                if(this.platform.is("desktop") || this.platform.is("mobile")){
                    return sessionStorage.setItem(key,val);
                }
                else if(this.platform.is("android")){
                    return this.nativeStorage.setItem(key, val)
                        .then(
                            () => {
                                console.log("Data saved");
                            },
                            (error) => {
                                console.log("Error while saving data");
                                console.log(error);
                            }
                        );
                }
            });
        }
    }

    removeItem(key: string) {
        if (key !== 'undefined' && typeof key !== 'undefined' && key !== null) {
            return this.platform.ready().then(() => {
                if(this.platform.is("desktop") || this.platform.is("mobile")){
                    return sessionStorage.removeItem(key);
                }
                else if(this.platform.is("android")){
                    return this.nativeStorage.remove(key)
                        .then(
                            () => {
                                console.log("Data removed");
                            },
                            (error) => {
                                console.log("Error while removing data");
                                console.log(error);
                            }
                        );
                }
            });
        }
    }

    clear() {
        return this.platform.ready().then(() => {
            if(this.platform.is("desktop") || this.platform.is("mobile")){
                return sessionStorage.clear();
            }
            else if(this.platform.is("android")){
                return this.nativeStorage.clear()
                    .then(
                        () => {
                            console.log("Data cleared");
                        },
                        (error) => {
                            console.log("Error while clear data");
                            console.log(error);
                        }
                    );
            }
        });
    }


}