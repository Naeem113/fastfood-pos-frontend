import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  Type,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-drawer',
  imports: [CommonModule, DrawerModule],
  templateUrl: './drawer.html',
})
export class Drawer implements OnChanges {
  @Input() visible = false;
  @Input() title = '';
  @Input() width = '600px';
  @Input() position: 'left' | 'right' = 'right';

  @Input() component!: Type<any>;
  @Input() data?: any;
  @Output() visibleChange = new EventEmitter<boolean>();
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  ngOnChanges(changes: SimpleChanges) {
    if(this.visible) {
      this.loadComponent();
    }
  }

  loadComponent() {
    this.container.clear();

    const ref = this.container.createComponent(this.component);

    if (this.data) {
      ref.setInput('data', this.data); // ✅ THIS is the fix
    }
  }

  onClose() {
    this.container.clear();
  }

  handleHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onClose();
  }
}
