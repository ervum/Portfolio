import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges, inject, input, computed, type Signal, type WritableSignal, type InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Nullable, Undefinable, FancyUIElementTypeType, FancyButtonIconStateType, NGStylesType } from '@ervum/types';

import { ContainerComponent } from '../container/container';

import { InterfaceService } from '../../../../core/services/interface/interface';
import { TypewriterDirective } from '../../../directives/typewriter/typewriter.directive';



@Component({
  selector: 'FancyButton',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    TypewriterDirective
  ],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[class.FancyButton--Primary]': 'EffectiveType() === "Primary"',
    '[class.FancyButton--Secondary]': 'EffectiveType() === "Secondary"'
  }
})
export class ButtonComponent implements OnInit, OnChanges {
  private readonly InterfaceService: InterfaceService = inject(InterfaceService);
  // #region Configuration & State

  private readonly IconsBasePath: string = '../../../../../assets/icons/';

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
    if (!(this.Icon())) {
      return '';
    }

    return `url(${this.IconsBasePath}${this.Icon()}.png)`;
  }

  /** Inline styles for the normal wrapper. */
  public get GetWrapperStyles(): NGStylesType {
    return {};
  }

  public get GetIconStyles(): NGStylesType {
    if (!(this.ButtonIconStyle)) {
      return {};
    }

    return {
      '-webkit-mask-image': this.ButtonIconStyle,
      'mask-image': this.ButtonIconStyle
    };
  }

  public GetWrapperClasses(): Record<string, boolean> {
    return {
      ...this.GetTypeClass(),

      'FancyButton--Centered': ((this.Centered()) === true)
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

  public BorderSpacing: InputSignal<Nullable<number>> = input<Nullable<number>>(0.03);

  public Padding: InputSignal<Nullable<number>> = input<Nullable<number>>(-3.0);

  public Label: InputSignal<Nullable<string>> = input<Nullable<string>>('');

  public Icon: InputSignal<Nullable<string>> = input<Nullable<string>>('arrow');

  public HasIcon: InputSignal<boolean> = input<boolean>(true);

  /** The global interface type signal. */
  private GlobalType: WritableSignal<FancyUIElementTypeType> = this.InterfaceService.InterfaceType;

  /** Local type override. */
  public Type: InputSignal<Undefinable<FancyUIElementTypeType>> = input<Undefinable<FancyUIElementTypeType>>(undefined);

  /** The final type to use. */
  public EffectiveType: Signal<FancyUIElementTypeType> = computed(() => this.Type() ?? this.GlobalType());

  public Centered: InputSignal<Nullable<boolean>> = input<Nullable<boolean>>(false);

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
  }

  ngOnChanges(Changes: SimpleChanges): void {
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

  public OnKeyDown(Event: KeyboardEvent): void {
    this.KeyDown.emit();

    if ((Event.key === 'Enter') || (Event.key === ' ')) {
      this.Up.emit();
      Event.preventDefault();
    }
  }
  public OnKeyUp(): void { this.KeyUp.emit(); }

  public OnWheel(): void { this.Wheel.emit(); }

  // #endregion
}