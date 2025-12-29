import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent } from '../button/button';

@Component({
  selector: 'FancyMultibutton',
  imports: [ButtonComponent],
  templateUrl: './multibutton.html',
  styleUrl: './multibutton.scss',
})
export class MultibuttonComponent {
  @Input() Buttons: string[] = [];

  @Output() Hover: EventEmitter<void> = new EventEmitter<void>();
  @Output() Move: EventEmitter<void> = new EventEmitter<void>();
  @Output() Unhover: EventEmitter<void> = new EventEmitter<void>();

  @Output() Focus: EventEmitter<void> = new EventEmitter<void>();
  @Output() Unfocus: EventEmitter<void> = new EventEmitter<void>();

  @Output() Cancel: EventEmitter<void> = new EventEmitter<void>();

  @Output() Down: EventEmitter<void> = new EventEmitter<void>();
  @Output() Up: EventEmitter<void> = new EventEmitter<void>();
  
  @Output() KeyDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() KeyUp: EventEmitter<void> = new EventEmitter<void>();
  
  @Output() Wheel: EventEmitter<void> = new EventEmitter<void>();

  OnFocus(): void { this.Focus.emit(); }
  OnUnfocus(): void { this.Unfocus.emit(); }

  OnHover(): void { this.Hover.emit(); }
  OnMove(): void { this.Move.emit(); }
  OnUnhover(): void { this.Unhover.emit(); }

  OnCancel(): void { this.Cancel.emit(); }

  OnDown(): void { this.Down.emit(); }
  OnUp(): void { this.Up.emit(); }

  OnKeyDown(): void { this.KeyDown.emit(); }
  OnKeyUp(): void { this.KeyUp.emit(); }

  OnWheel(): void { this.Wheel.emit(); }
}
