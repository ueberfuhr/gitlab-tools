import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicDownloadService {

  private readonly downloadElement = document.createElement('a');

  public download(options: {
    fileName: string,
    contentType: string,
    content: string
  }) {
    this.downloadElement.setAttribute('href', `data:${options.contentType};charset=utf-8,${encodeURIComponent(options.content)}`);
    this.downloadElement.setAttribute('download', options.fileName);
    this.downloadElement.dispatchEvent(new MouseEvent('click'));
  }

}
