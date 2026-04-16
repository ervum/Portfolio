import { Component, EventEmitter, Input, Output, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerComponent } from '../container/container';

import { FancyUIElementTypeType, HorizontalPositionType, Undefinable } from '@ervum/types';
import { InterfaceService } from '../../../../core/services/interface/interface';



@Component({
  selector: 'FancyCheckbox',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent
  ],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  host: {
    '[class.FancyCheckbox--Primary]': 'EffectiveType() === "Primary"',
    '[class.FancyCheckbox--Secondary]': 'EffectiveType() === "Secondary"'
  }
})
export class CheckboxComponent {
  private InterfaceService = inject(InterfaceService);

  @Input() Checked: boolean = false;
  
  /** The global interface type signal. */
  private GlobalType = this.InterfaceService.InterfaceType;

  /** Local type override. */
  public Type = input<Undefinable<FancyUIElementTypeType>>(undefined);

  /** The final type to use. */
  public EffectiveType = computed(() => (this.Type() ?? this.GlobalType()));
  
  @Input() Label: string = '';
  @Input() LabelPosition: HorizontalPositionType = 'Right';
  
  @Output() CheckedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public Toggle(): void {
    this.Checked = !(this.Checked);
    this.CheckedChange.emit(this.Checked);
  }
}

