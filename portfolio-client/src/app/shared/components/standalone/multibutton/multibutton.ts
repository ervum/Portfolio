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
  public SelectedIndex: number = 0;
  public HoveredIndex: WritableSignal<number | null> = signal<number | null>(null);

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
