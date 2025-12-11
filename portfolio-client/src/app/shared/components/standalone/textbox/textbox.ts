import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

export type Boolean = ('True' | 'False');

export type TextboxType = ('Primary' | 'Secondary');
export type TextboxStyle = ('Standard' | 'Backgroundless');

export type TextboxBorderAnimation = ('Above' | 'Below');

export type TextboxOrder = ('First' | 'Intermediate' | 'Last' | 'Unique');

export type FocusState = ('Focusing' | 'Focused' | 'Unfocusing' | 'Unfocused');

@Component({
  selector: 'FancyTextbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './textbox.html',
  styleUrl: './textbox.scss'
})
export class TextboxComponent {
  public TextboxStyles: { [key: string]: string } = {};
  
  public InputValue: string = '';
  public FocusState: FocusState = 'Unfocused';

  private FocusTimeoutID: any = null;
  private AnimationStartTime: number = 0;

  private readonly IconsBasePath = '../../../../../assets/icons/';

  private readonly AnimationDurationIn: number = 2000;
  private readonly AnimationDurationOut: number = 2000;
  
  private readonly AnimationModes: Record<Boolean, [FocusState, FocusState, number]> = {
    'True': ['Unfocused', 'Unfocusing', (this.AnimationDurationOut)],
    'False': ['Focused', 'Focusing', (this.AnimationDurationIn)]
  };
  
  public get TextboxIconStyle(): string {
    if (!this.Icon) {
      return '';
    }
    
    return `url(${(this.IconsBasePath)}${(this.Icon)}.png)`;
  }

  private Wait(ms: number): Promise<void> {
    return new Promise((Resolve) => setTimeout(Resolve, ms));
  }

  private ParseBoolean(b: boolean): Boolean {
    return (b ? 'True' : 'False');
  }

  private async AnimateTextbox(Mode: boolean): Promise<void> {
    const AnimationMode: [FocusState, FocusState, number] = this.AnimationModes[this.ParseBoolean(Mode)];
    const InverseAnimationMode: [FocusState, FocusState, number] = this.AnimationModes[this.ParseBoolean(!Mode)];
  
    clearTimeout(this.FocusTimeoutID);

    if (((this.FocusState) === AnimationMode[0]) || ((this.FocusState) === AnimationMode[1])) {
      let AnimationTimeElapsed: number = (performance.now() - (this.AnimationStartTime));

      if (AnimationTimeElapsed <= AnimationMode[2]) { 
        await this.Wait(AnimationMode[2] - AnimationTimeElapsed); 
      }

      this.FocusState = InverseAnimationMode[1];
      this.AnimationStartTime = performance.now();

      this.FocusTimeoutID = setTimeout(() => {
        this.FocusState = InverseAnimationMode[0];
      }, (this.AnimationDurationIn));
    }
  }

  @Input() MaximumLength: number = 30; 
  @Input() Placeholder: string = '';
  @Input() Icon: string = '';

  @Input() Type: TextboxType = 'Primary';

  @Input() Styled: TextboxStyle = 'Standard';
  @Input() IconStyled: TextboxStyle = 'Backgroundless';

  @Input() BorderAnimation: TextboxBorderAnimation = 'Above';

  @Input() Order: TextboxOrder = 'Unique';

  @Output() Submit: EventEmitter<void> = new EventEmitter<void>();

  @Output() Select: EventEmitter<void> = new EventEmitter<void>();
  @Output() Unselect: EventEmitter<void> = new EventEmitter<void>();

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
 
  OnSubmit(): void { this.Submit.emit(); }

  async OnSelect(): Promise<void> { 
    this.Select.emit(); 

    this.AnimateTextbox(true);
  
  }
  async OnUnselect(): Promise<void> {
    this.Unselect.emit(); 

    this.AnimateTextbox(false);
  }

  OnHover(): void { this.Hover.emit(); }
  OnMove(): void { this.Move.emit(); }
  OnUnhover(): void { this.Unhover.emit(); }

  OnFocus(): void { 
    this.Focus.emit();

    this.AnimateTextbox(true);
  }
  OnUnfocus(): void { 
    this.Unfocus.emit();

    this.AnimateTextbox(false);
  }

  OnCancel(): void { this.Cancel.emit(); }

  OnDown(): void { this.Down.emit(); }
  OnUp(): void { this.Up.emit(); }

  OnKeyDown(): void { this.KeyDown.emit(); }
  OnKeyUp(): void { this.KeyUp.emit(); }

  OnWheel(): void { this.Wheel.emit(); }
}