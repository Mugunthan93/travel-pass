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

  checkDir(dirPath: string, dirName: string): Observable<boolean> {
    return from(this.file.checkDir(this.file.externalRootDirectory + dirPath, dirName));
  }

  checkFile(filePath: string, fileName: string): Observable<boolean> {
    return from(this.file.checkFile(this.file.externalRootDirectory + filePath, fileName));
  }

  createDir(dirPath: string, dirName: string): Observable<DirectoryEntry> {
    return from(this.file.createDir(this.file.externalRootDirectory + dirPath, dirName, true));
  }

  createFile(filePath: string, fileName: string) : Observable<FileEntry> {
    return from(this.file.createFile(this.file.externalRootDirectory + filePath, fileName, true));
  }

  downloadFile(url: string, dirPath: string): Observable<FileEntry> {
  
    const transferObj : FileTransferObject = this.fileTransfer.create();
    return from(transferObj.download(url, this.file.externalRootDirectory + dirPath))
      .pipe(
        map(
          (file: FileEntry) => {
            return file;
          }
        )
      )
  }
}
