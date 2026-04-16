import { Component, Input, Output, EventEmitter, signal, WritableSignal, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Nullable, FancyUIElementTypeType, FancyMultiButtonDisplayModeType, HorizontalPositionType, VerticalPositionType, FancyMultiButtonIndicatorStyleType, FancyMultibuttonItemType, Undefinable } from '@ervum/types';
import { ContainerComponent } from '../container/container';

import { InterfaceService } from '../../../../core/services/interface/interface';



@Component({
  selector: 'FancyMultibutton',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent
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
  private InterfaceService = inject(InterfaceService);

  /** Currently selected button index. */
  public SelectedIndex: number = 0;
  public HoveredIndex: WritableSignal<number | null> = signal<number | null>(null);

  public SelectButton(Index: number): void {
    if (Index === this.SelectedIndex) return;

    this.SelectedIndex = Index;
    this.selectedIndexChange.emit(Index);

    const item = this.Items[Index];

    if (item && (item.Action)) {
      item.Action(...((item.ActionArguments) ?? []));
    }
  }

  public OnHover(Index: number): void {
    this.HoveredIndex.set(Index);
  }

  public OnUnhover(): void {
    this.HoveredIndex.set(null);
  }

  public GetIconUrl(IconName: string): string {
    return `url(assets/icons/${IconName}.png)`;
  }

  public get GetBaseClasses(): Record<string, boolean> {
    const defaultSide = this.Vertical ? 'Left' : 'Below';
    const activeSide = this.IndicatorSide || defaultSide;

    return {
      [`FancyMultibutton--Vertical`]: this.Vertical,
      [`IndicatorPosition--${activeSide}`]: true
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

  @Output() selectedIndexChange = new EventEmitter<number>();

  // #endregion
}
