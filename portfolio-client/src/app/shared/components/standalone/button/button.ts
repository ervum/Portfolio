import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Nullable, Undefinable, FancyUIElementTypeType, FancyButtonIconStateType, NGStylesType } from '@ervum/types';
import { ContainerComponent } from '../container/container';

import { InterfaceService } from '../../../../core/services/interface/interface';
import { TypewriterAnimator } from '../../../utilities/typewriter';



@Component({
  selector: 'FancyButton',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent
  ],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[class.FancyButton--Primary]': 'EffectiveType() === "Primary"',
    '[class.FancyButton--Secondary]': 'EffectiveType() === "Secondary"'
  }
})
export class ButtonComponent implements OnInit, OnChanges {
  private readonly InterfaceService = inject(InterfaceService);
  // #region Configuration & State

  private readonly IconsBasePath = '../../../../../assets/icons/';

  private EntryIsQueued: boolean = false;
  private ExitIsQueued: boolean = false;

  public IconStatus: FancyButtonIconStateType = 'AtCenter';
  
  private Observer!: ResizeObserver;

  // #endregion

  // #region Logic & Helpers

  /**
   * Determines the UI theme.
   */
  private GetUIType(): boolean {
    return ((this.EffectiveType()) === 'Primary');
  }

  private GetTypeClass(): Record<string, boolean> {
    const UIType: boolean = this.GetUIType();

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

  /** Inline styles for the normal wrapper (icon URL). */
  public get GetWrapperStyles(): NGStylesType {
    return {
      '--Icon-URL': this.ButtonIconStyle
    };
  }

  public GetWrapperClasses(): Record<string, boolean> {
    return {
      ...this.GetTypeClass(),

      'FancyButton--Centered': ((this.Centered) === true)
    };
  }

  public GetButtonClasses(): Record<string, boolean> {
    return {
      ...this.GetTypeClass()
    };
  }

  public GetIconClasses(): Record<string, boolean> {
    return {
      ...this.GetTypeClass(),

      'FancyButton-Icon--Entering': ((this.IconStatus) === 'Entering'),
      'FancyButton-Icon--Exiting': ((this.IconStatus) === 'Exiting'),
      'FancyButton-Icon--OffScreen': ((this.IconStatus) === 'OffScreen')
    };
  }

  // #endregion

  // #region Inputs

  @Input() BorderSpacing: Nullable<number> = 0.03;

  @Input() Padding: Nullable<number> = -3.0;

  @Input() Label: Nullable<string> = 'Button';

  /** The label text actually rendered in the template (animated). */
  public DisplayLabel: string = 'Button';

  /** Shared typewriter animator for label transitions. */
  private LabelTypewriter = new TypewriterAnimator();
  @Input() Icon: Nullable<string> = 'next';

  /** The global interface type signal. */
  private GlobalType = this.InterfaceService.InterfaceType;

  /** Local type override. */
  public Type = input<Undefinable<FancyUIElementTypeType>>(undefined);

  /** The final type to use. */
  public EffectiveType = computed(() => this.Type() ?? this.GlobalType());

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

  @ViewChild('ButtonElement', { static: true }) ButtonElementReference!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {

    this.DisplayLabel = this.Label ?? 'Button';
  }

  ngOnChanges(Changes: SimpleChanges): void {
    if (Changes['Label'] && !Changes['Label'].firstChange) {
      const OldLabel = Changes['Label'].previousValue ?? 'Button';
      const NewLabel = Changes['Label'].currentValue ?? 'Button';

      this.LabelTypewriter.Animate(
        OldLabel,
        NewLabel,
        (Text: string) => { this.DisplayLabel = Text; },
        this.InterfaceService.Typewriter()
      );
    }
  }

  // #endregion

  // #region Event Handlers

  public OnFocus(): void { this.Focus.emit(); }
  public OnUnfocus(): void { this.Unfocus.emit(); }

  public OnHover(): void { this.Hover.emit(); }
  public OnMove(Event: PointerEvent): void {
    this.Move.emit();
  }

  public OnUnhover(): void {
    this.Unhover.emit();

    if ((this.IconStatus) === 'OffScreen') {
      this.IconStatus = 'Entering';
    } else if ((this.IconStatus) === 'Exiting') {
      this.EntryIsQueued = true;
    }
  }

  public OnCancel(): void { this.Cancel.emit(); }

  public OnDown(Event: PointerEvent): void {
    this.Down.emit();

    if ((this.IconStatus) === 'AtCenter') {
      this.ExitIsQueued = true;
      this.IconStatus = 'Exiting';
    } else if ((this.IconStatus) === 'Entering') {
      this.ExitIsQueued = true;
    }
  }

  public OnUp(Event: PointerEvent): void {
    this.Up.emit();

    (Event.currentTarget as HTMLElement)?.blur();

    if ((this.IconStatus) === 'OffScreen') {
      this.IconStatus = 'Entering';
    } else if ((this.IconStatus) === 'Exiting') {
      this.EntryIsQueued = true;
    }
  }

  public OnKeyDown(): void { this.KeyDown.emit(); }
  public OnKeyUp(): void { this.KeyUp.emit(); }

  public OnWheel(): void { this.Wheel.emit(); }

  // #endregion
}