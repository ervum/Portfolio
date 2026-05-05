import { Component, ElementRef, EventEmitter, HostListener, Output, computed, inject, input, model, effect, type Signal, type WritableSignal, type ModelSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FancyDropdownItemType, FancyUIElementTypeType, Undefinable } from '@ervum/types';

import { ContainerComponent } from '../container/container';

import { InterfaceService } from '../../../../core/services/interface/interface';
import { TypewriterDirective } from '../../../directives/typewriter/typewriter.directive';



@Component({
  selector: 'FancyDropdown',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    TypewriterDirective
  ],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  host: {
    '[class.FancyDropdown--Primary]': 'EffectiveType() === "Primary"',
    '[class.FancyDropdown--Secondary]': 'EffectiveType() === "Secondary"',
    '[class.FancyDropdown--Open]': 'IsOpen'
  }
})
export class DropdownComponent {
  private readonly InterfaceService: InterfaceService = inject(InterfaceService);
  private readonly ElementRef: ElementRef<HTMLElement> = inject(ElementRef);

  public Items = input<FancyDropdownItemType[]>([]);
  public SelectedItem: ModelSignal<Undefinable<FancyDropdownItemType>> = model<Undefinable<FancyDropdownItemType>>();
  
  @Output() SelectionChange: EventEmitter<FancyDropdownItemType> = new EventEmitter<FancyDropdownItemType>();

  public IsOpen: boolean = false;

  private GlobalType: WritableSignal<FancyUIElementTypeType> = this.InterfaceService.InterfaceType;
  public Type = input<Undefinable<FancyUIElementTypeType>>(undefined);
  public EffectiveType: Signal<FancyUIElementTypeType> = computed(() => this.Type() ?? this.GlobalType());

  /** Displayed text for the trigger label. */
  public TriggerLabel: Signal<string> = computed(() => this.SelectedItem()?.Label ?? 'Select');

  /** Displayed text for each list item. Keyed by item reference. */
  public ItemLabels: Map<FancyDropdownItemType, string> = new Map();

  constructor() {
    // Sync Item Labels when Items input changes
    effect(() => {
      const Items: FancyDropdownItemType[] = this.Items();

      for (const Item of Items) {
        if (!this.ItemLabels.has(Item)) {
          this.ItemLabels.set(Item, Item.Label);
        }
      }
    });
  }

  /** Toggles the dropdown open/closed state. */
  public Toggle(): void {
    this.IsOpen = !this.IsOpen;
  }

  /** Selects an item, closes the dropdown, and updates labels. */
  public Select(Item: FancyDropdownItemType): void {
    const PreviousItem: Undefinable<FancyDropdownItemType> = this.SelectedItem();

    this.SelectedItem.set(Item);
    this.IsOpen = false;
    
    this.SelectionChange.emit(Item);

    if (Item.Action) {
      Item.Action(...(Item.ActionArguments ?? []));
    }

    // Animate the previously selected item appearing back in the list.
    if (PreviousItem) {
      this.ItemLabels.set(PreviousItem, '');
      requestAnimationFrame(() => {
        this.ItemLabels.set(PreviousItem, PreviousItem.Label);
      });
    }
  }

  /** Returns the label for a given item. */
  public GetItemLabel(Item: FancyDropdownItemType): string {
    return this.ItemLabels.get(Item) ?? Item.Label;
  }

  /** Closes the dropdown when clicking outside of it. */
  @HostListener('document:click', ['$event'])
  public OnClickOutside(Event: MouseEvent): void {
    if (!this.ElementRef.nativeElement.contains(Event.target as Node)) {
      this.IsOpen = false;
    }
  }
}
