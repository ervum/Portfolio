import { Injectable, signal, WritableSignal, computed, type Signal } from '@angular/core';

import { FancyUIElementTypeType } from '@ervum/types';

import { Translations, type TranslationDictionary } from '../../internationalization';



@Injectable({
  providedIn: 'root'
})
export class InterfaceService {
  /** The global interface type (Primary / Secondary) */
  public InterfaceType: WritableSignal<FancyUIElementTypeType> = signal<FancyUIElementTypeType>('Primary');

  /** The global interface language */
  public Language: WritableSignal<string> = signal<string>('English');

  /** Whether the typewriter animation is enabled */
  public Typewriter: WritableSignal<boolean> = signal<boolean>(true);

  /** Active translation dictionary */
  public readonly T: Signal<TranslationDictionary> = computed(() => (Translations[this.Language()] || Translations['English']));

  /**
   * Toggles the global interface type between Primary and Secondary.
   */
  public ToggleInterfaceType(): void {
    this.InterfaceType.update(CurrentType => (CurrentType === 'Primary') ? 'Secondary' : 'Primary');
  }

  /**
   * Sets the global interface type.
   */
  public SetInterfaceType(Type: FancyUIElementTypeType): void {
    this.InterfaceType.set(Type);
  }

  /**
   * Sets the global interface language.
   */
  public SetLanguage(Language: string): void {
    this.Language.set(Language);
  }
}
