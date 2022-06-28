import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appFileDragDropDnd]'
})
export class DndDirective {

  @HostBinding('class.fileover') fileOver = false;
  @Output() fileDropped = new EventEmitter<File>();

  // Dragover listener
  @HostListener('dragover', ['$event'])
  onDragOver(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event'])
  onDragLeave(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event'])
  ondrop(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    let files = (evt as any).dataTransfer.files as File[];
    if (files.length > 0) {
      this.fileDropped.emit(files[0]);
    }
  }
}
