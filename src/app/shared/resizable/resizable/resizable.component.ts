import {CdkDragEnd, CdkDragMove} from '@angular/cdk/drag-drop';
import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  Output,
  EventEmitter, ViewChild,
} from '@angular/core';
import {Subject, merge, of} from 'rxjs';
import {tap, auditTime, withLatestFrom} from 'rxjs/operators';

@Component({
  selector: '[resizable]',
  template: `
    <div class="resizable-container" #container>
      <div class="resizable-content" >
        <ng-content></ng-content>
        <div class="resizable-handle" cdkDrag
             (cdkDragStarted)="dragStarted()"
             (cdkDragEnded)="dragEnded($event)"
             (cdkDragMoved)="dragMoved($event)"></div>
      </div>
      <div class="resizable-triangle" *ngIf="sub$ | async">Drag to resize</div>
    </div>
  `,
  styleUrls: ['./resizable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizableComponent {
  @Output() resized = new EventEmitter<DOMRect>();
  @ViewChild("container") container?: ElementRef<HTMLElement>;

  private startSize$ = new Subject<DOMRect>();
  private dragMove$ = new Subject<CdkDragMove>();
  private dragMoveAudited$ = this.dragMove$.pipe(
    withLatestFrom(this.startSize$),
    auditTime(16),
    tap(([{distance}, rect]) => {
      this.elementToResize.style.width = `${rect.width + distance.x}px`;
      this.elementToResize.style.height = `${rect.height + distance.y}px`;
    })
  );

  sub$ = merge(this.dragMoveAudited$, of(true));

  constructor(private el: ElementRef<HTMLElement>) {
  }

  private get elementToResize(): HTMLElement {
    return (this.container ? this.container : this.el).nativeElement;
  }

  dragStarted(): void {
    this.startSize$.next(this.elementToResize.getBoundingClientRect());
  }

  dragEnded($event: CdkDragEnd): void {
    $event.source._dragRef.reset();
    this.resized.emit(this.elementToResize.getBoundingClientRect());
  }

  dragMoved($event: CdkDragMove): void {
    this.dragMove$.next($event);
  }
}
