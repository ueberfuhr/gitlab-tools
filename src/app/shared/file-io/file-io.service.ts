import { Injectable } from '@angular/core';
import {ProgressService} from '../progress-view/progress.service';
import {defer, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileIOService {

  constructor(private readonly progressService: ProgressService) { }

  importTextFromFile(file: File): Observable<string> {
    // HTML5 FileReader API
    return defer(() => {
      const handle = this.progressService.start({
        title: 'Reading file...',
        mode: 'indeterminate'
      });
      const subject = new Subject<string>();
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        handle.finish();
        subject.next(e.target?.result as string);
        subject.complete();
      };
      reader.onerror = handle.finish;
      reader.readAsText(file);
      return subject.asObservable();
    });
  }



}
