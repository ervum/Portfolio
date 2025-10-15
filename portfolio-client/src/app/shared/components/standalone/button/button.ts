import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonType = ('Primary' | 'Secondary');

@Component({
  selector: 'FancyButton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class ButtonComponent {
  @Input() Label: string = 'Button';
  @Input() ButtonType: ButtonType = 'Primary';

  @Output() Focus: EventEmitter<void> = new EventEmitter<void>();
  @Output() Unfocus: EventEmitter<void> = new EventEmitter<void>();
  @Output() Cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() Down: EventEmitter<void> = new EventEmitter<void>();
  @Output() Up: EventEmitter<void> = new EventEmitter<void>();
  @Output() KeyDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() KeyUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() Wheel: EventEmitter<void> = new EventEmitter<void>();

  OnFocus(): void {
    this.Focus.emit();
  }
  OnUnfocus(): void {
    this.Unfocus.emit();
  }

  OnCancel(): void {
    this.Cancel.emit();
  }

  OnDown(): void {
    this.Down.emit();
  }
  OnUp(): void {
    this.Up.emit();
  }

  OnKeyDown(): void {
    this.KeyDown.emit();
  }
  OnKeyUp(): void {
    this.KeyUp.emit();
  }

  OnWheel(): void {
    this.Wheel.emit();
  }
}
