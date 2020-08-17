import { Injectable } from '@angular/core';
import { File, FileError, DirectoryEntry, FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, catchError, tap, map, retryWhen, take } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private file: File,
    private fileTransfer: FileTransfer,
    private filePath: FilePath,
    private fileOpener: FileOpener
  ) {
  }

  checkDir(dirPath: string, dirName: string): Observable<boolean | FileError> {
    return from(this.file.checkDir(this.file.externalRootDirectory + dirPath, dirName))
      .pipe(
        take(1),
        map(
          (dirExist: boolean | FileError) => {
            console.log(dirExist);
            return dirExist;
          }
        )
      )
  }

  checkFile(filePath: string, fileName: string): Observable<boolean | FileError> {
    return from(this.file.checkFile(this.file.externalRootDirectory + filePath, fileName))
      .pipe(
        take(1),
        map(
          (fileExist: boolean | FileError) => {
            console.log(fileExist);
            return fileExist;
          }
        )
      )
  }

  createDir(dirPath: string, dirName: string): Observable<DirectoryEntry> {
    console.log(this.file.externalRootDirectory + dirPath);
    return from(this.file.createDir(this.file.externalRootDirectory + dirPath, dirName,true))
      .pipe(
        take(1),
        tap(
          (dir: DirectoryEntry) => {
            console.log(dir);
          }
        )
      )
  }

  createFile(filePath: string, fileName: string) : Observable<FileEntry> {
    return from(this.file.createFile(this.file.externalRootDirectory + filePath, fileName, true))
      .pipe(
        take(1),
        tap(
          (file: FileEntry) => {
            console.log(file);
          }
        )
      )
  }

  downloadFile(url: string, dirPath: string): Observable<FileEntry> {
    
    const transferObj : FileTransferObject = this.fileTransfer.create();
    
    return from(transferObj.download(url, this.file.externalRootDirectory + dirPath))
      .pipe(
        take(1),
        map(
          (file: FileEntry) => {
            console.log(file);
            return file;
          }
        )
      )
  }
}
