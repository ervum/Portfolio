import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Undefinable, FancyUIElementTypeType } from '@ervum/types';

import { InterfaceService } from '../../../../core/services/interface/interface';



@Component({
    selector: 'FancyContainer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './container.html',
    styleUrl: './container.scss',
    host: {
        '[class.FancyContainer--Primary]': 'EffectiveType() === "Primary"',
        '[class.FancyContainer--Secondary]': 'EffectiveType() === "Secondary"'
    }
})
export class ContainerComponent {
    private InterfaceService = inject(InterfaceService);

    /** The global interface type signal. */
    private GlobalType = this.InterfaceService.InterfaceType;

    /** 
     * Local type override. 
     * Starts as undefined to detect if it was provided in the template.
     */
    public Type = input<Undefinable<FancyUIElementTypeType>>(undefined);

    /** 
     * The final type to use. 
     * Uses the local override if specified, otherwise follows the global theme.
     */
    public EffectiveType = computed(() => this.Type() ?? this.GlobalType());
}

