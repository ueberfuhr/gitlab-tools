import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-file-drag-drop',
  templateUrl: './file-drag-drop.component.html',
  styleUrls: ['./file-drag-drop.component.scss']
})
export class FileDragDropComponent {

  @Input() accept = '*';
  @Output() fileDropped = new EventEmitter<File>();

  fileBrowseHandler($event: Event): void {
    const files = ($event.target as any).files as File[];
    if (files && files.length > 0) {
      this.fileDropped.emit(files[0]);
    }
  }

  onFileDropped($event: File) {
    this.fileDropped.emit($event);
  }
}
