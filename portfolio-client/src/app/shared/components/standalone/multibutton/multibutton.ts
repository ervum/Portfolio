import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Nullable, FancyUIElementTypeType, FancyUIElementStyleType, FancyMultiButtonDisplayModeType, FancyMultiButtonIndicatorType, FancyMultibuttonItemType } from '@ervum/types';
import { ContainerComponent } from '../container/container';

@Component({
  selector: 'FancyMultibutton',
  imports: [
    CommonModule,
    ContainerComponent
  ],
  templateUrl: './multibutton.html',
  styleUrl: './multibutton.scss',
})
export class MultibuttonComponent {
  /** Currently selected button index. */
  public SelectedIndex: number = 0;

  /** Left position (percent) for the indicator, centered under the selected button. 
  public get IndicatorPositionPercent(): number {
    const n: number = ((this.Items?.length) ?? 0);
  
    return (n > 0) ? ((((this.SelectedIndex) + 0.5) / n) * 100) : 0;
  } */

  public SelectButton(Index: number): void {
    if (Index === this.SelectedIndex) return;

    this.SelectedIndex = Index;
    this.selectedIndexChange.emit(Index);

    const item = this.Items[Index];

    if (item && (item.Action)) {
      item.Action(...((item.ActionArguments) ?? []));
    }
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

  @Input() Items: FancyMultibuttonItemType[] = [];

  @Input() Type: Nullable<FancyUIElementTypeType> = 'Primary';
  @Input() Styled: Nullable<FancyUIElementStyleType> = 'Standard';
  @Input() BorderStyled: Nullable<FancyUIElementStyleType> = 'Standard';

  @Input() DisplayMode: Nullable<FancyMultiButtonDisplayModeType> = 'Text';

  /** Shape of the selection indicator below the buttons: Circle, Dash, or Arrow.
  @Input() Indicator: Nullable<FancyMultiButtonIndicatorType> = 'Circle'; */

  // #endregion

  // #region Outputs

  @Output() selectedIndexChange = new EventEmitter<number>();

  // #endregion
}