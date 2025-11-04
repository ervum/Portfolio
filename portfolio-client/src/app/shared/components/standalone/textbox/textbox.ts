import { Component, EventEmitter, Inject, Input, Output, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { FormsModule } from '@angular/forms';

export type TextboxType = ('Primary' | 'Secondary');
export type TextboxStyle = ('Standard' | 'Backgroundless');

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
export class TextboxComponent implements AfterViewInit {
  public FancyTextboxStyles: { [key: string]: string } = {};
  
  public InputValue: string = '';
  public FocusState: FocusState = 'Unfocused';

  private FocusTimeoutID: any = null;
  private AnimationStartTime: number = 0;

  private readonly AnimationDurationIn: number = 2000;
  private readonly AnimationDurationOut: number = 2000;

  private Wait(ms: number): Promise<void> {
    return new Promise((Resolve) => setTimeout(Resolve, ms));
  }
  
  @ViewChild('Wrapper') private WrapperElementReference!: ElementRef;

  @Input() MaximumLength: number = 30; 
  @Input() Placeholder: string = '';

  @Input() Type: TextboxType = 'Primary';
  @Input() Styled: TextboxStyle = 'Standard';

  @Output() Submit: EventEmitter<void> = new EventEmitter<void>();

  @Output() Select: EventEmitter<void> = new EventEmitter<void>();
  @Output() Unselect: EventEmitter<void> = new EventEmitter<void>();

  @Output() Focus: EventEmitter<void> = new EventEmitter<void>();
  @Output() Unfocus: EventEmitter<void> = new EventEmitter<void>();

  @Output() Cancel: EventEmitter<void> = new EventEmitter<void>();

  @Output() Down: EventEmitter<void> = new EventEmitter<void>();
  @Output() Up: EventEmitter<void> = new EventEmitter<void>();

  @Output() KeyDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() KeyUp: EventEmitter<void> = new EventEmitter<void>();
  
  @Output() Wheel: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    @Inject(PLATFORM_ID) private PlatformID: Object,
        
    private ChangeDetectorReference: ChangeDetectorRef
  ) {}

  /*
    ngOnInit(): void {
      if (isPlatformBrowser(this.PlatformID)) {
        this.AnimationFrameID = requestAnimationFrame(this.Update.bind(this));
      } 
    }
  */

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.PlatformID)) {
      const WrapperElement: HTMLElement = (this.WrapperElementReference.nativeElement);
      const WrapperStyles: CSSStyleDeclaration = window.getComputedStyle(WrapperElement);

      const WrapperHeight: number = (WrapperElement.offsetHeight);
      const WrapperAspectRatioWidth: number = parseFloat(WrapperStyles.getPropertyValue('aspect-ratio').split('/')[0]);

      const Offset: number = 10.0;
      const AspectRatioDifference: number = 1.5;

      this.FancyTextboxStyles = { 
        'width': `${(WrapperHeight * (WrapperAspectRatioWidth - AspectRatioDifference)) - Offset}px`,
        'padding-left': `${((WrapperHeight * AspectRatioDifference) + Offset)}px`
      };
      
      this.ChangeDetectorReference.detectChanges();
    }
  }
  
  /*
    ngOnDestroy(): void {
      if (isPlatformBrowser(this.PlatformID) && (this.AnimationFrameID)) {
        cancelAnimationFrame(this.AnimationFrameID);
      }
    }

    Update(): void {
      this.AnimationFrameID = requestAnimationFrame(this.Update.bind(this));
    }
  */
 
  OnSubmit(): void { this.Submit.emit(); }

  async OnSelect(): Promise<void> { 
    this.Select.emit(); 
    
    clearTimeout(this.FocusTimeoutID);

    if (((this.FocusState) === 'Unfocused') || ((this.FocusState) === 'Unfocusing')) {
      let AnimationTimeElapsed: number = (performance.now() - (this.AnimationStartTime));

      if (AnimationTimeElapsed <= (this.AnimationDurationOut)) { await this.Wait((this.AnimationDurationOut) - AnimationTimeElapsed); }

      this.FocusState = 'Focusing';
      this.AnimationStartTime = performance.now();

      this.FocusTimeoutID = setTimeout(() => {
        this.FocusState = 'Focused';
      }, (this.AnimationDurationIn));
    }
  }
  async OnUnselect(): Promise<void> {
    this.Unselect.emit(); 

    clearTimeout(this.FocusTimeoutID);

    if (((this.FocusState) === 'Focused') || ((this.FocusState) === 'Focusing')) {
      let AnimationTimeElapsed: number = (performance.now() - (this.AnimationStartTime));

      if (AnimationTimeElapsed <= (this.AnimationDurationIn)) { await this.Wait((this.AnimationDurationIn) - AnimationTimeElapsed); }
      
      this.FocusState = 'Unfocusing';
      this.AnimationStartTime = performance.now();

      this.FocusTimeoutID = setTimeout(() => {
        this.FocusState = 'Unfocused';
      }, (this.AnimationDurationOut));
    }
  }

  OnFocus(): void { 
    this.Focus.emit(); 

  }
  OnUnfocus(): void { 
    this.Unfocus.emit(); 
  }

  OnCancel(): void { this.Cancel.emit(); }

  OnDown(): void { this.Down.emit(); }
  OnUp(): void { this.Up.emit(); }

  OnKeyDown(): void { this.KeyDown.emit(); }
  OnKeyUp(): void { this.KeyUp.emit(); }

  OnWheel(): void { this.Wheel.emit(); }
}