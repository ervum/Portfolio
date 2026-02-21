import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Nullable, FancyUIElementTypeType, FancyUIElementStyleType, FancyButtonIconStateType, NGStylesType } from '@ervum/types';



@Component({
  selector: 'FancyButton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class ButtonComponent implements OnInit {  
  // #region Configuration & State
  
  private readonly IconsBasePath = '../../../../../assets/icons/';

  /** Custom cubic-bezier for a "snap" feel on interaction. */
  private readonly TransitionStyle: string = '1.0s cubic-bezier(0.86, 0, 0.07, 1)';
  /** List of SCSS properties to transition upon event. */
  private readonly TransitionProperties: string[] = ['transform', 'border-radius', 'clip-path'];
  
  /** Defines the expansion limit of the ripple effect (in percentage). */
  private readonly MaximumRippleSize: number = 150.0;

  private EntryIsQueued: boolean = false;
  private ExitIsQueued: boolean = false;

  private IsPointerDown: boolean = false;

  /** Computed transition string combining properties and style. */
  private RippleTransition: string = '';
  public RippleStyles: NGStylesType = {};

  public IconStatus: FancyButtonIconStateType = 'AtCenter';
  
  // #endregion

  // #region Logic & Helpers

  /**
   * Triggers the visual ripple expansion or contraction.
   * 
   * - Uses `requestAnimationFrame` to ensure style updates align with the render cycle.
   * @param Size - Target size of the ripple (0% to collapse, >100% to fill).
   */
  private RippleButton(Event: PointerEvent, Size: number): void {
    requestAnimationFrame(() => {
      this.RippleStyles = {
        'clip-path': `circle(${Size}% at ${Event.offsetX}px ${Event.offsetY}px`,

        'transition': (this.RippleTransition)
      };
    });
  }
  
  /**
   * Determines the UI theme based on the inversion state.
   * 
   * - If `Inverted` equals `true`, swaps `Primary` <-> `Secondary`.
   */
  private GetUIType(Inverted: boolean): boolean {
    let IsOfTypePrimary: boolean = ((this.Type) === 'Primary');

    return (Inverted ? !IsOfTypePrimary : IsOfTypePrimary);
  }

  private GetTypeClass(Inverted: boolean): Record<string, boolean> {
    const UIType: boolean = this.GetUIType(Inverted);

    return {
      'FancyButton--Primary': UIType,
      'FancyButton--Secondary': !UIType,
    };
  }

  public OnIconAnimationEnd(): void {
    if ((this.IconStatus) === 'Exiting') {
      this.ExitIsQueued = false;
      this.IconStatus = 'OffScreen';

      if (this.EntryIsQueued) {
        this.EntryIsQueued = false;
        
        requestAnimationFrame(() => (this.IconStatus = 'Entering'));
      }
    } else if ((this.IconStatus) === 'Entering') {
      this.EntryIsQueued = false;
      this.IconStatus = 'AtCenter';

      if (this.ExitIsQueued) {
        this.ExitIsQueued = false;
        
        requestAnimationFrame(() => (this.IconStatus = 'Exiting'));
      }
    }
  }

  // #endregion

  // #region Style & Class Getters

  public get ButtonIconStyle(): string {
    if (!(this.Icon)) {
      return '';
    }
    
    return `url(${this.IconsBasePath}${this.Icon}.png)`;
  }

  public GetWrapperClasses(Inverted: boolean): Record<string, boolean> {
    return {
      ...this.GetTypeClass(Inverted),
      
      'FancyButton--Centered': ((this.Centered) === true)
    };
  }

  public GetButtonClasses(Inverted: boolean): Record<string, boolean> {
    return {
      ...this.GetTypeClass(Inverted),

      [`FancyButton--${this.Styled}`]: true
    };
  }

  public GetIconClasses(Inverted: boolean): Record<string, boolean> {
    return {
      ...this.GetTypeClass(Inverted),
      
      'FancyButton-Icon--Entering': ((this.IconStatus) === 'Entering'),
      'FancyButton-Icon--Exiting': ((this.IconStatus) === 'Exiting'),

      [`FancyButton--${this.IconStyled}`]: true
    };
  }

  // #endregion

  // #region Inputs

  @Input() BorderSpacing: Nullable<number> = 0.03;

  @Input() Padding: Nullable<number> = -3.0;

  @Input() Label: Nullable<string> = 'Button';
  @Input() Icon: Nullable<string> = 'next';

  @Input() Type: Nullable<FancyUIElementTypeType> = 'Primary';
  
  @Input() Styled: Nullable<FancyUIElementStyleType> = 'Standard';
  @Input() IconStyled: Nullable<FancyUIElementStyleType> = 'Standard';
  
  @Input() Centered: Nullable<boolean> = false;

  // #endregion

  // #region Outputs

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

  // #endregion

  // #region Lifecycle & View Access

  /** 
   * Reference to the background wrapper for calculating ripple state directly from the DOM.
   * 
   * **NOTE: Used to extract current `clip-path` values during interactions.**
   */
  @ViewChild('InvertedWrapper', { static: true }) InvertedWrapperElementReference!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    // Dynamic construction of the transition string for all monitored properties
    this.TransitionProperties.forEach((TransitionProperty, i) => {
      this.RippleTransition += `${TransitionProperty} ${this.TransitionStyle}`;  

      if (i !== (this.TransitionProperties.length - 1)) {
        this.RippleTransition += ', ';
      }
    });

    this.RippleStyles = {
      'clip-path': 'circle(0% at center)',

      'transition': (this.RippleTransition)
    };
  }

  // #endregion

  // #region Event Handlers

  public OnFocus(): void { this.Focus.emit(); }
  public OnUnfocus(): void { this.Unfocus.emit(); }

  public OnHover(): void { this.Hover.emit(); }
  /**
   * Handles mouse movement to update ripple origin or state.
   * 
   * Complexity Alert - This method accesses `window.getComputedStyle` during a `mousemove` event. 
   * - This triggers a forced reflow/layout invalidation.
   * - While functional, it may impact performance on low-end devices during rapid movement.
   */
  public OnMove(Event: PointerEvent): void {
    this.Move.emit();
    
    const X: number = (Event.offsetX);
    const Y: number = (Event.offsetY);
    const CirclePosition: string = `at ${X}px ${Y}px`;

    const InvertedWrapperElement: HTMLDivElement = (this.InvertedWrapperElementReference.nativeElement);

    let CurrentRippleSize: number = 0;

    // TODO: Optimize this check. Reading computed styles on every move frame is expensive.
    if ((this.InvertedWrapperElementReference) && InvertedWrapperElement) {
      const ClipCircle: (RegExpExecArray | null) = /circle\(\s*([0-9.]+)%/i.exec(window.getComputedStyle(InvertedWrapperElement).getPropertyValue('clip-path') || '');

      if (ClipCircle && ClipCircle[1]) {
        CurrentRippleSize = parseFloat(ClipCircle[1]);
      }
    }
    
    // If ripple is closed, snap the hidden origin to the mouse cursor instantly (no transition) so the next click expands from the correct location.
    if (CurrentRippleSize === 0) {
      this.RippleStyles = {
        'clip-path': `circle(0% ${CirclePosition})`,

        'transition': (this.RippleTransition)
      };

      requestAnimationFrame(() => {
        const Styles: NGStylesType = { ... (this.RippleStyles) };
        delete Styles['transition'];

        this.RippleStyles = Styles;
      });
    } else {
      // If pointer is down and moving, drag the expanded ripple with the cursor
      if (this.IsPointerDown) {
        this.RippleStyles = {
          'clip-path': `circle(${this.MaximumRippleSize}% ${CirclePosition})`,

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
  public OnUnhover(): void {
    this.Unhover.emit();

    this.RippleStyles = {
      'clip-path': 'circle(0% at center)',

      'transition': (this.RippleTransition)
    };

    if (((this.IconStatus) === 'Exiting') || ((this.IconStatus) === 'OffScreen')) {
      this.EntryIsQueued = true;
    }
  }

  public OnCancel(): void { this.Cancel.emit(); }

  public OnDown(Event: PointerEvent): void {
    this.Down.emit();

    this.IsPointerDown = true;
    this.RippleButton(Event, this.MaximumRippleSize);

    if ((this.IconStatus) === 'AtCenter') {
      this.ExitIsQueued = true;
      this.IconStatus = 'Exiting';
    } else if ((this.IconStatus) === 'Entering') {
      this.ExitIsQueued = true;
    }
  }

  public OnUp(Event: PointerEvent): void {
    this.Up.emit();

    this.IsPointerDown = false;
    this.RippleButton(Event, 0);

    if (((this.IconStatus) === 'Exiting') || ((this.IconStatus) === 'OffScreen')) {
      this.EntryIsQueued = true;
    }
  }
 
  public OnKeyDown(): void { this.KeyDown.emit(); }
  public OnKeyUp(): void { this.KeyUp.emit(); }

  public OnWheel(): void { this.Wheel.emit(); }

  // #endregion
}