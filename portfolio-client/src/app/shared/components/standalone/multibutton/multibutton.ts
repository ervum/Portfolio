import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Nullable, FancyUIElementTypeType, FancyUIElementStyleType, FancyMultiButtonDisplayModeType, FancyMultiButtonIndicatorType } from '@ervum/types';

@Component({
  selector: 'FancyMultibutton',
  imports: [CommonModule],
  templateUrl: './multibutton.html',
  styleUrl: './multibutton.scss',
})
export class MultibuttonComponent {
  /** Currently selected button index. */
  public SelectedIndex: number = 0;

  /** Left position (percent) for the indicator, centered under the selected button. */
  public get IndicatorPositionPercent(): number {
    const n: number = ((this.Labels?.length) ?? 0);

    return (n > 0) ? ((((this.SelectedIndex) + 0.5) / n) * 100) : 0;
  }

  public SelectButton(Index: number): void {
    if (Index === this.SelectedIndex) return;

    this.SelectedIndex = Index;
    this.selectedIndexChange.emit(Index);
  }

  public GetIconUrl(IconName: string): string {
    return `url(assets/icons/${IconName}.png)`;
  }

  public get GetBaseClasses(): Record<string, boolean> {
    return {
      [`FancyMultibutton--${this.Type}`]: true,
      [`FancyMultibutton--${this.Styled}`]: true
    };
  }

  // #region Inputs

  @Input() Labels: string[] = [];

  @Input() Type: Nullable<FancyUIElementTypeType> = 'Primary';
  @Input() Styled: Nullable<FancyUIElementStyleType> = 'Standard';
  @Input() BorderStyled: Nullable<FancyUIElementStyleType> = 'Standard';

  @Input() DisplayMode: Nullable<FancyMultiButtonDisplayModeType> = 'Text';

  /** Shape of the selection indicator below the buttons: circle, dash, or arrow. */
  @Input() Indicator: Nullable<FancyMultiButtonIndicatorType> = 'circle';

  // #endregion

  // #region Outputs

  @Output() selectedIndexChange = new EventEmitter<number>();

  // #endregion
}