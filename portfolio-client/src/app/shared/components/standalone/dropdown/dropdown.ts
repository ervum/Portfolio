import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, OnChanges, SimpleChanges, Output, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FancyDropdownItemType, FancyUIElementTypeType, Undefinable } from '@ervum/types';

import { ContainerComponent } from '../container/container';
import { InterfaceService } from '../../../../core/services/interface/interface';
import { TypewriterAnimator } from '../../../utilities/typewriter';



@Component({
  selector: 'FancyDropdown',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent
  ],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  host: {
    '[class.FancyDropdown--Primary]': 'EffectiveType() === "Primary"',
    '[class.FancyDropdown--Secondary]': 'EffectiveType() === "Secondary"',
    '[class.FancyDropdown--Open]': 'IsOpen'
  }
})
export class DropdownComponent implements OnInit, OnChanges {
  private readonly InterfaceService = inject(InterfaceService);
  private readonly ElementRef = inject(ElementRef);

  @Input() Items: FancyDropdownItemType[] = [];
  @Input() SelectedItem: Undefinable<FancyDropdownItemType>;
  
  @Output() SelectionChange = new EventEmitter<FancyDropdownItemType>();

  public IsOpen: boolean = false;

  private GlobalType = this.InterfaceService.InterfaceType;
  public Type = input<Undefinable<FancyUIElementTypeType>>(undefined);
  public EffectiveType = computed(() => this.Type() ?? this.GlobalType());

  /** Displayed text for the trigger label (animated). */
  public TriggerDisplayLabel: string = 'Select';

  /** Displayed text for each list item (animated). Keyed by item reference. */
  public ItemDisplayLabels: Map<FancyDropdownItemType, string> = new Map();

  /** Typewriter animator for the trigger label. */
  private TriggerTypewriter = new TypewriterAnimator();

  /** Typewriter animators for list item labels, keyed by item. */
  private ItemTypewriters: Map<FancyDropdownItemType, TypewriterAnimator> = new Map();

  ngOnInit(): void {
    if (!this.SelectedItem && this.Items.length > 0) {
      this.SelectedItem = this.Items[0];
    }

    this.TriggerDisplayLabel = this.SelectedItem?.Label ?? 'Select';

    for (const Item of this.Items) {
      this.ItemDisplayLabels.set(Item, Item.Label);
      this.ItemTypewriters.set(Item, new TypewriterAnimator());
    }
  }

  ngOnChanges(Changes: SimpleChanges): void {
    if (Changes['Items'] && !Changes['Items'].firstChange) {
      for (const Item of this.Items) {
        if (!this.ItemDisplayLabels.has(Item)) {
          this.ItemDisplayLabels.set(Item, Item.Label);
          this.ItemTypewriters.set(Item, new TypewriterAnimator());
        }
      }

      if (this.SelectedItem) {
        const MatchingItem: Undefinable<FancyDropdownItemType> = this.Items.find(Item => 
          (Item.ID !== undefined && Item.ID === this.SelectedItem?.ID) || 
          (Item.ID === undefined && Item.Label === this.SelectedItem?.Label)
        );

        if (MatchingItem) {
          this.SelectedItem = MatchingItem;

          if (this.TriggerDisplayLabel !== MatchingItem.Label) {
            this.TriggerTypewriter.Animate(
              this.TriggerDisplayLabel,
              MatchingItem.Label,
              (Text: string) => { this.TriggerDisplayLabel = Text; },
              this.InterfaceService.Typewriter()
            );
          }
        } else if (this.Items.length > 0) {
          this.SelectedItem = this.Items[0];
          this.TriggerDisplayLabel = this.SelectedItem.Label;
        } else {
          this.SelectedItem = undefined;
          this.TriggerDisplayLabel = 'Select';
        }
      }
    }
  }

  /** Toggles the dropdown open/closed state. */
  public Toggle(): void {
    this.IsOpen = !this.IsOpen;
  }

  /** Selects an item, closes the dropdown, and animates the label transition. */
  public Select(Item: FancyDropdownItemType): void {
    const PreviousItem = this.SelectedItem;

    this.SelectedItem = Item;
    this.IsOpen = false;
    
    this.SelectionChange.emit(Item);

    if (Item.Action) {
      Item.Action(...(Item.ActionArguments ?? []));
    }

    // Animate trigger: delete old label, type new label.
    this.TriggerTypewriter.Animate(
      this.TriggerDisplayLabel,
      Item.Label,
      (Text: string) => { this.TriggerDisplayLabel = Text; },
      this.InterfaceService.Typewriter()
    );

    // Animate the previously selected item appearing in the list.
    if (PreviousItem) {
      const Typewriter = this.ItemTypewriters.get(PreviousItem) ?? new TypewriterAnimator();

      Typewriter.Animate(
        '',
        PreviousItem.Label,
        (Text: string) => { this.ItemDisplayLabels.set(PreviousItem, Text); },
        this.InterfaceService.Typewriter()
      );
    }
  }

  /** Returns the animated display label for a given item. */
  public GetItemDisplayLabel(Item: FancyDropdownItemType): string {
    return this.ItemDisplayLabels.get(Item) ?? Item.Label;
  }

  /** Closes the dropdown when clicking outside of it. */
  @HostListener('document:click', ['$event'])
  public OnClickOutside(Event: MouseEvent): void {
    if (!this.ElementRef.nativeElement.contains(Event.target)) {
      this.IsOpen = false;
    }
  }
}
