import { Injectable, signal, WritableSignal } from '@angular/core';
import { FancyUIElementTypeType } from '@ervum/types';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {
  /** The global interface type (Primary / Secondary) */
  public InterfaceType: WritableSignal<FancyUIElementTypeType> = signal<FancyUIElementTypeType>('Primary');

  /**
   * Toggles the global interface type between Primary and Secondary.
   */
  public ToggleInterfaceType(): void {
    this.InterfaceType.update(CurrentType => CurrentType === 'Primary' ? 'Secondary' : 'Primary');
  }

  /**
   * Sets the global interface type.
   */
  public SetInterfaceType(Type: FancyUIElementTypeType): void {
    this.InterfaceType.set(Type);
  }
}
