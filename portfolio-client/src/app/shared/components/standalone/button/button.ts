import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
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
export class ButtonComponent implements OnInit {  
  public RippleStyles: Styles = {};

  private IsPointerDown: boolean = false;

  private RippleTransition: string = '';

  private readonly TransitionStyle: string = '1.0s cubic-bezier(0.86, 0, 0.07, 1)';
  private readonly TransitionProperties: string[] = ['transform', 'border-radius', 'clip-path'];
  
  private readonly MaximumRippleSize: number = 150.0;

  private InvertButton(Event: PointerEvent, Size: number): void {
    requestAnimationFrame(() => {
      this.RippleStyles = {
        'clip-path': `circle(${Size}% at ${(Event.offsetX)}px ${(Event.offsetY)}px`,

        'transition': (this.RippleTransition)
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

  @ViewChild('InvertedWrapper', { static: true }) InvertedWrapperElementReference!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.TransitionProperties.forEach((TransitionProperty, i) => {
      this.RippleTransition += `${TransitionProperty} ${(this.TransitionStyle)}`;  

      if (i !== (this.TransitionProperties.length - 1)) {
        this.RippleTransition += ', ';
      }
    });

    this.RippleStyles = {
      'clip-path': 'circle(0% at center)',

      'transition': (this.RippleTransition)
    };
  }

  OnFocus(): void { this.Focus.emit(); }
  OnUnfocus(): void { this.Unfocus.emit(); }

  OnHover(): void { this.Hover.emit(); }
  OnMove(Event: PointerEvent): void {
    this.Move.emit();
    
    const X: number = (Event.offsetX);
    const Y: number = (Event.offsetY);
    const CirclePosition: string = `at ${X}px ${Y}px`;

    const InvertedWrapperElement: HTMLDivElement = (this.InvertedWrapperElementReference.nativeElement);

    let CurrentRippleSize: number = 0;

    if ((this.InvertedWrapperElementReference) && InvertedWrapperElement) {
      const ClipCircle: (RegExpExecArray | null) = /circle\(\s*([0-9.]+)%/i.exec(window.getComputedStyle(InvertedWrapperElement).getPropertyValue('clip-path') || '');

      if (ClipCircle && ClipCircle[1]) {
        CurrentRippleSize = parseFloat(ClipCircle[1]);
      }
    }
    
    if (CurrentRippleSize === 0) {
      this.RippleStyles = {
        'clip-path': `circle(0% ${CirclePosition})`,

        'transition': (this.RippleTransition)
      };

      requestAnimationFrame(() => {
        const Styles: Styles = { ... (this.RippleStyles) };
        delete Styles['transition'];

        this.RippleStyles = Styles;
      });
    } else {
      if (this.IsPointerDown) {
        this.RippleStyles = {
          'clip-path': `circle(${(this.MaximumRippleSize)}% ${CirclePosition})`,

          'transition': (this.RippleTransition)
        };
      } /* else {
        this.RippleStyles = {
          'clip-path': `circle(0% ${CirclePosition})`,

          'transition': (this.RippleTransition)
        };
      } */
    }
  }
  OnUnhover(): void {
    this.Unhover.emit();

    this.RippleStyles = {
      'clip-path': 'circle(0% at center)',

      'transition': (this.RippleTransition)
    };
  }

  OnCancel(): void { this.Cancel.emit(); }

  OnDown(Event: PointerEvent): void {
    this.Down.emit(); 
    
    this.IsPointerDown = true;
    this.InvertButton(Event, (this.MaximumRippleSize));
  }
  OnUp(Event: PointerEvent): void {
    this.Up.emit();

    this.IsPointerDown = false;
    this.InvertButton(Event, 0);
  }

  OnKeyDown(): void { this.KeyDown.emit(); }
  OnKeyUp(): void { this.KeyUp.emit(); }

  OnWheel(): void { this.Wheel.emit(); }
}
