import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Nullable, FancyUIElementStyleType, FancyUIElementTypeType, FancyTextboxOrderType, FancyTextboxBorderAnimationType, FancyUIElementFocusStateType, StringBooleanType } from '@ervum/types';

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
  // #region Configuration & State

  private readonly IconsBasePath = '../../../../../assets/icons/';

  private readonly AnimationDurationIn: number = 2000;
  private readonly AnimationDurationOut: number = 2000;
  
  /**
   * Configuration for animation states based on the boolean mode.
   * - Used to determine if the component is currently in a state that opposes the desired action.
   * 
   * **Structure:** `[CurrentStateCheck, TransitioningState, Duration]`
   * 
   * 1. `True` (Opening): Checks against `Unfocused`/`Unfocusing`.
   * 2. `False` (Closing): Checks against `Focused`/`Focusing`.
   */
  private readonly AnimationModes: Record<StringBooleanType, [FancyUIElementFocusStateType, FancyUIElementFocusStateType, number]> = {
    'True': ['Unfocused', 'Unfocusing', (this.AnimationDurationOut)],
    'False': ['Focused', 'Focusing', (this.AnimationDurationIn)]
  };
  
  private FocusTimeoutID: Nullable<ReturnType<typeof setTimeout>>;
  private AnimationStartTime: number = 0;

  public TextboxStyles: { [key: string]: string } = {};
  
  public InputValue: string = '';
  public FocusState: FancyUIElementFocusStateType = 'Unfocused';

  // #endregion

  // #region Style & Class Getters

  /**
   * Base classes used by almost every element.
   * 
   * - Includes: `Type` and `Style`.
   * 1. **Type**: (`Primary` | `Secondary`)
   * 2. **Style**: (`Standard` | `Backgroundless`)
   */
  private get GetBaseClasses(): Record<string, boolean> {
    return {
      [`FancyTextbox--${this.Type}`]: true,
      [`FancyTextbox--${this.Styled}`]: true
    };
  }

  /**
   * Order classes used by wrappers and overlays to determine border radius and positioning.
   * 
   * - Includes: `First`, `Intermediate`, `Last` and `Unique`.
   */
  private get GetOrderClasses(): Record<string, boolean> {
    return {
      [`FancyTextbox--${this.Order}`]: true
    };
  }

  /** Class Getter for `.FancyTextbox-Icon-Container`. */
  public get GetIconContainerClasses(): Record<string, boolean> {
    return {
      ...(this.GetBaseClasses),
      ...(this.GetOrderClasses),

      [`FancyTextbox--Icon${this.IconStyled}`]: true
    };
  }

  /** Class Getter for `.FancyTextbox-Content`. */
  public get GetContentClasses(): Record<string, boolean> {
    return {
      [`FancyTextbox--${this.Styled}`]: true
    };
  }

  /** Class Getter for `.FancyTextbox-Placeholder` and `.FancyTextbox-Border`. */
  public get GetOverlayClasses(): Record<string, boolean> {
    return {
      ...(this.GetBaseClasses),
      ...(this.GetOrderClasses),
      
      'FancyTextboxBorder--AnimationBelow': ((this.BorderAnimation) === 'Below')
    };
  }

  /** Class Getter for `.FancyTextbox` and `.FancyTextbox-Icon`. */
  public get GetInputClasses(): Record<string, boolean> {
    return (this.GetBaseClasses);
  }

  /**
   * Constructs the background image URL for the icon.
   * @returns `url(...)` string or empty string if no icon is set.
   * 
   * **NOTE: Hardcodes extension to `.png`.**
   */
  public get TextboxIconStyle(): string {
    if (!(this.Icon)) {
      return '';
    }
    
    return `url(${this.IconsBasePath}${this.Icon}.png)`;
  }

  public get HasText(): boolean {
    return ((this.InputValue.length) > 0);
  }

  // #endregion

  // #region Logic & Helpers

  private Wait(ms: number): Promise<void> {
    return new Promise((Resolve) => setTimeout(Resolve, ms));
  }

  private ParseBoolean(b: boolean): StringBooleanType {
    return (b ? 'True' : 'False');
  }

  /**
   * Orchestrates the focus/blur animation logic.
   * 
   * 1. Determines the "Opposite" state (`AnimationMode`) vs the "Target" state (`InverseAnimationMode`).
   * 2. Checks if the component is currently in the "Opposite" state (i.e, trying to Focus while Unfocused).
   * 3. Calculates elapsed time to handle interruptions (i.e., focusing while in the middle of unfocusing).
   * 4. Waits for any pending previous animation to complete if necessary.
   * 5. Sets the transition state (`Focusing` / `Unfocusing`) and schedules the final state.
   * 
   * @param Mode - `true` to Focus/Select, `false` to Unfocus/Unselect.
   */
  private async AnimateTextbox(Mode: boolean): Promise<void> {
    const AnimationMode: [FancyUIElementFocusStateType, FancyUIElementFocusStateType, number] = this.AnimationModes[this.ParseBoolean(Mode)];
    const InverseAnimationMode: [FancyUIElementFocusStateType, FancyUIElementFocusStateType, number] = this.AnimationModes[this.ParseBoolean(!Mode)];
  
    clearTimeout(this.FocusTimeoutID);

    // If current state matches the "Start" or "Transition" phase of the opposing mode
    if (((this.FocusState) === AnimationMode[0]) || ((this.FocusState) === AnimationMode[1])) {
      let AnimationTimeElapsed: number = (performance.now() - (this.AnimationStartTime));

      // Wait for the previous animation to finish if interrupted
      if (AnimationTimeElapsed <= AnimationMode[2]) { 
        await this.Wait(AnimationMode[2] - AnimationTimeElapsed); 
      }

      // Begin new transition
      this.FocusState = InverseAnimationMode[1];
      this.AnimationStartTime = performance.now();

      // Schedule final state
      this.FocusTimeoutID = setTimeout(() => {
        this.FocusState = InverseAnimationMode[0];
      }, (this.AnimationDurationIn));
    }
  }

  // #endregion

  // #region Inputs

  @Input() MaximumLength: Nullable<number> = 30; 
  @Input() Placeholder: Nullable<string> = '';
  @Input() Icon: Nullable<string> = '';

  @Input() Type: Nullable<FancyUIElementTypeType> = 'Primary';

  @Input() Styled: Nullable<FancyUIElementStyleType> = 'Standard';
  @Input() IconStyled: Nullable<FancyUIElementStyleType> = 'Backgroundless';

  @Input() BorderAnimation: Nullable<FancyTextboxBorderAnimationType> = 'Above';

  @Input() Order: Nullable<FancyTextboxOrderType> = 'Unique';

  // #endregion

  // #region Outputs

  @Output() Submit: EventEmitter<void> = new EventEmitter<void>();

  @Output() Select: EventEmitter<void> = new EventEmitter<void>();
  @Output() Unselect: EventEmitter<void> = new EventEmitter<void>();

  @Output() Focus: EventEmitter<void> = new EventEmitter<void>();
  @Output() Unfocus: EventEmitter<void> = new EventEmitter<void>();

  @Output() Hover: EventEmitter<void> = new EventEmitter<void>();
  @Output() Move: EventEmitter<void> = new EventEmitter<void>();
  @Output() Unhover: EventEmitter<void> = new EventEmitter<void>();

  @Output() Cancel: EventEmitter<void> = new EventEmitter<void>();

  @Output() Down: EventEmitter<void> = new EventEmitter<void>();
  @Output() Up: EventEmitter<void> = new EventEmitter<void>();

  @Output() KeyDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() KeyUp: EventEmitter<void> = new EventEmitter<void>();
  
  @Output() Wheel: EventEmitter<void> = new EventEmitter<void>();
 
  // #endregion

  // #region Event Handlers

  public OnSubmit(): void { this.Submit.emit(); }

  public async OnSelect(): Promise<void> { 
    this.Select.emit(); 

    this.AnimateTextbox(true);
  
  }
  public async OnUnselect(): Promise<void> {
    this.Unselect.emit(); 

    this.AnimateTextbox(false);
  }

  public OnFocus(): void { 
    this.Focus.emit();

    this.AnimateTextbox(true);
  }
  public OnUnfocus(): void { 
    this.Unfocus.emit();

    this.AnimateTextbox(false);
  }

  public OnHover(): void { this.Hover.emit(); }
  public OnMove(): void { this.Move.emit(); }
  public OnUnhover(): void { this.Unhover.emit(); }

  public OnCancel(): void { this.Cancel.emit(); }

  public OnDown(): void { this.Down.emit(); }
  public OnUp(): void { this.Up.emit(); }

  public OnKeyDown(): void { this.KeyDown.emit(); }
  public OnKeyUp(): void { this.KeyUp.emit(); }

  public OnWheel(): void { this.Wheel.emit(); }

  // #endregion
}