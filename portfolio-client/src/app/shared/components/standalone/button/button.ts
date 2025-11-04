import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonType = ('Primary' | 'Secondary');
export type ButtonStyle = ('Standard' | 'Backgroundless');

export type IsString = (string | null);

export type Styles = { [key: string]: string };

export type CalculatedV1 = { 
  OldSize: number,
  
  Size: number,
  Unit: IsString,

  Result: string
};

@Component({
  selector: 'FancyButton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class ButtonComponent {  
  public RippleStyles: Styles = {};
  public InvertedRippleStyles: Styles = {};

  public get ButtonStyles(): { [key: string]: any } {
    const NewHeight: CalculatedV1 = this.CalculateVector((this.Height), (0.9 - (this.BorderSpacing)));
    var NewWidth: string;

    const OldHeight: number = (NewHeight.OldSize);
    const OldWidth: number = (this.CalculateVector((this.Width), 0.9).OldSize);

    const ButtonAspectRatio: number = (OldWidth / OldHeight);

    const SizeUnit: IsString = (NewHeight.Unit);

    const HeightDifference: number = (OldHeight - (NewHeight.Size));

    if (SizeUnit == '%') {
      NewWidth = `${(HeightDifference * ButtonAspectRatio)}${SizeUnit}`;
    } else {
      NewWidth = `${(OldWidth - (OldHeight - (NewHeight.Size)))}${SizeUnit}`;
    }

    return {
      'height': (NewHeight.Result),
      'width': NewWidth,

      'top': `${(this.Padding)}px`
    };
  }

  /* private Wait(ms: number): Promise<void> {
    return new Promise((Resolve) => setTimeout(Resolve, ms));
  } */

  private CalculateVector(SizeString: string | null, Factor: number): CalculatedV1 {
    if (!SizeString) {
      return {
        OldSize: 0,

        Size: 0,
        Unit: 'px',

        Result: '0px'
      };
    }
    
    const SizeParts: (RegExpMatchArray | null) = SizeString.match(/^(-?\d*\.?\d+)(.*)$/);

    if (!SizeParts) {
      return { 
        OldSize: 0,

        Size: 0,
        Unit: null,

        Result: SizeString
      };
    }

    const OldSize: number = parseFloat(SizeParts[1]);
    
    const Size: number = (OldSize * Factor);
    const Unit: string = SizeParts[2];

    return {
      OldSize: OldSize,

      Size: Size,
      Unit: Unit,

      Result: `${Size}${Unit}`
    };
  }

  private InvertButton(Event: PointerEvent, Size: number): void {
    const CirclePosition: string = `at ${(Event.offsetX)}px ${(Event.offsetY)}px`;

    requestAnimationFrame(() => {
      this.RippleStyles = {
        'clip-path': `circle(${Size}% ${CirclePosition})`
      };

      this.InvertedRippleStyles = {
        'clip-path': `circle(${(150 - Size)}% ${CirclePosition})`
      };
    });
  }

  @Input() Height: string = '0px';
  @Input() Width: string = '0px'; 

  @Input() BorderSpacing: number = 0.03;

  @Input() Label: string = 'Button';

  @Input() Padding: number = -3;
  
  @Input() Type: ButtonType = 'Primary';
  @Input() Styled: ButtonStyle = 'Standard';

  @Output() Focus: EventEmitter<void> = new EventEmitter<void>();
  @Output() Unfocus: EventEmitter<void> = new EventEmitter<void>();

  @Output() Cancel: EventEmitter<void> = new EventEmitter<void>();

  @Output() Down: EventEmitter<void> = new EventEmitter<void>();
  @Output() Up: EventEmitter<void> = new EventEmitter<void>();
  
  @Output() KeyDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() KeyUp: EventEmitter<void> = new EventEmitter<void>();
  
  @Output() Wheel: EventEmitter<void> = new EventEmitter<void>();

  OnFocus(): void { this.Focus.emit(); }
  OnUnfocus(): void {
    this.Unfocus.emit();

    this.RippleStyles = {
      'clip-path': 'circle(0% at center)'
    };

    this.InvertedRippleStyles = {
      'clip-path': 'circle(200% at center)'
    };
  }

  OnCancel(): void { this.Cancel.emit(); }

  OnDown(Event: PointerEvent): void {
    this.Down.emit(); 
    
    this.InvertButton(Event, 150);
  }
  OnUp(Event: PointerEvent): void {
    this.Up.emit();

    this.InvertButton(Event, 0);
  }

  OnKeyDown(): void { this.KeyDown.emit(); }
  OnKeyUp(): void { this.KeyUp.emit(); }

  OnWheel(): void { this.Wheel.emit(); }
}
