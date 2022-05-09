import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDragDropComponent } from './file-drag-drop.component';
import {MatIconModule} from '@angular/material/icon';
import { DndDirective } from './dnd.directive';



@NgModule({
  declarations: [
    FileDragDropComponent,
    DndDirective
  ],
  exports: [
    FileDragDropComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class FileDragDropModule { }
