import { Component, input, inject, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Undefinable } from '@ervum/types';

import { ContainerComponent } from '../container/container';
import { InterfaceService } from '../../../../core/services/interface/interface';



/**
 * A small, interactive button component that can display an icon or a text label.
 * It uses the FancyContainer for its background and adapts to the global interface theme.
 */
@Component({
  selector: 'FancyMinibutton',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  templateUrl: './minibutton.html',
  styleUrl: './minibutton.scss',
})
export class MinibuttonComponent {
  /** The global interface service for theme synchronization. */
  public InterfaceService: InterfaceService = inject(InterfaceService);

  /** Optional text label to display inside the button. */
  public Label: InputSignal<Undefinable<string>> = input<Undefinable<string>>(undefined);

  /** Optional icon path to display inside the button. */
  public Icon: InputSignal<Undefinable<string>> = input<Undefinable<string>>(undefined);
}
