import { Component, Input, Output, EventEmitter, signal, WritableSignal, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Nullable, FancyUIElementTypeType, FancyMultiButtonDisplayModeType, HorizontalPositionType, VerticalPositionType, FancyMultiButtonIndicatorStyleType, FancyMultibuttonItemType, Undefinable } from '@ervum/types';
import { ContainerComponent } from '../container/container';

import { InterfaceService } from '../../../../core/services/interface/interface';
import { TypewriterDirective } from '../../../directives/typewriter/typewriter.directive';



@Component({
  selector: 'FancyMultibutton',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    TypewriterDirective
  ],
  templateUrl: './multibutton.html',
  styleUrl: './multibutton.scss',
  host: {
    '[class.FancyMultibutton--Vertical]': 'Vertical',
    '[class.FancyMultibutton--Primary]': 'EffectiveType() === "Primary"',
    '[class.FancyMultibutton--Secondary]': 'EffectiveType() === "Secondary"'
  }
})
export class MultibuttonComponent {
  private readonly InterfaceService = inject(InterfaceService);

  /** Currently selected button index. */
  @Input() public SelectedIndex: number = 0;
  public HoveredIndex: WritableSignal<Nullable<number>> = signal<number | null>(null);

  /** Selects a button by index and invokes its action if defined. */
  public SelectButton(Index: number): void {
    if (Index === this.SelectedIndex) return;

    this.SelectedIndex = Index;
    this.SelectedIndexChange.emit(Index);

    const Item = this.Items[Index];

    if (Item && (Item.Action)) {
      Item.Action(...((Item.ActionArguments) ?? []));
    }
  }

  /** Sets the hovered button index. */
  public OnHover(Index: number): void {
    this.HoveredIndex.set(Index);
  }

  /** Clears the hovered button index. */
  public OnUnhover(): void {
    this.HoveredIndex.set(null);
  }

  /** Constructs a CSS `url()` string for an icon asset. */
  public GetIconUrl(IconName: string): string {
    return `url(assets/icons/${IconName}.png)`;
  }

  public get GetBaseClasses(): Record<string, boolean> {
    const DefaultSide: string = this.Vertical ? 'Left' : 'Below';
    const ActiveSide: string = this.IndicatorSide || DefaultSide;

    return {
      [`FancyMultibutton--Vertical`]: this.Vertical,
      [`IndicatorPosition--${ActiveSide}`]: true
    };
  }

  public get GetWrapperClasses(): Record<string, boolean> {
    return {
      'Hovering--First': this.HoveredIndex() === 0,
      'Hovering--Last': this.HoveredIndex() !== null && this.HoveredIndex() === this.Items.length - 1,
      ...this.GetBaseClasses
    };
  }

  public get GetContentStyles(): Record<string, number> {
    return {
      '--selected-index': this.SelectedIndex,
      '--button-count': this.Items.length
    };
  }

  public get GetHighlightClasses(): Record<string, boolean> {
    return {
      'Hovering--Selected': this.HoveredIndex() === this.SelectedIndex,
      'Hovering--First': this.HoveredIndex() === 0 && this.SelectedIndex === 0,
      'Hovering--Last': this.HoveredIndex() !== null && this.HoveredIndex() === this.Items.length - 1 && this.SelectedIndex === this.Items.length - 1
    };
  }

  public GetButtonClasses(Index: number): Record<string, boolean> {
    return {
      'FancyMultibutton--Selected': this.SelectedIndex === Index,
      'Hovering--Self': this.HoveredIndex() === Index,
      'Hovering--First': Index === 0,
      'Hovering--Last': Index === this.Items.length - 1
    };
  }

  public GetIconStyles(Label: string): Record<string, string> {
    return {
      '--icon-url': this.GetIconUrl(Label)
    };
  }

  // #region Inputs

  @Input() Items: FancyMultibuttonItemType[] = [];

  /** The global interface type signal. */
  private GlobalType = this.InterfaceService.InterfaceType;

  /** Local type override. */
  public Type = input<Undefinable<FancyUIElementTypeType>>(undefined);

  /** The final type to use. */
  public EffectiveType = computed(() => (this.Type() ?? this.GlobalType()));

  @Input() DisplayMode: Nullable<FancyMultiButtonDisplayModeType> = 'Text';
  
  @Input() Vertical: boolean = false;
  @Input() IndicatorSide: Nullable<HorizontalPositionType | VerticalPositionType> = null;
  @Input() IndicatorType: FancyMultiButtonIndicatorStyleType = 'Dash';

  @Input() ShowHighlight: boolean = false;
  @Input() ShowIndicator: boolean = false;

  // #endregion

  // #region Outputs

  @Output() SelectedIndexChange = new EventEmitter<number>();

  // #endregion
}
