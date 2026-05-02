import { Component, OnInit, inject, signal, WritableSignal, computed, type Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterfaceService } from '../../../../core/services/interface/interface';

interface BackgroundPalette {
  Name: string;
  Colors: string[];
}

@Component({
  selector: 'DeepBackground',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deep-background.html',
  styleUrl: './deep-background.scss'
})
export class DeepBackgroundComponent implements OnInit {
  private InterfaceService: InterfaceService = inject(InterfaceService);

  // Curated palettes for Dark (Primary) and Light (Secondary) themes
  private readonly PrimaryPalettes: BackgroundPalette[] = [
    { Name: 'Deep-Ocean', Colors: ['#010205', '#020408', '#000000', '#030610'] },
    { Name: 'Midnight-Forest', Colors: ['#010502', '#020804', '#000000', '#031006'] },
    { Name: 'Void-Crimson', Colors: ['#050101', '#080202', '#000000', '#100303'] },
    { Name: 'Abyssal-Purple', Colors: ['#020105', '#040208', '#000000', '#060310'] }
  ];

  private readonly SecondaryPalettes: BackgroundPalette[] = [
    { Name: 'Sky-Mist', Colors: ['#eef2ff', '#e0e7ff', '#ffffff', '#dbeafe'] },
    { Name: 'Garden-Dew', Colors: ['#f0fdf4', '#dcfce7', '#ffffff', '#bbf7d0'] },
    { Name: 'Morning-Rose', Colors: ['#fff1f2', '#ffe4e6', '#ffffff', '#fecdd3'] },
    { Name: 'Cream-Soft', Colors: ['#fffaf0', '#fef3c7', '#ffffff', '#fde68a'] }
  ];

  // The index of the randomly selected palette (persists for the session)
  private readonly RandomIndex: number = Math.floor(Math.random() * 4);

  /** Active palette based on current theme and random index */
  public ActivePalette: Signal<BackgroundPalette> = computed(() => {
    const Theme = this.InterfaceService.InterfaceType();
    return Theme === 'Primary' 
      ? this.PrimaryPalettes[this.RandomIndex] 
      : this.SecondaryPalettes[this.RandomIndex];
  });

  /** CSS Variables to be applied to the host */
  public BackgroundStyles: Signal<Record<string, string>> = computed(() => {
    const Palette = this.ActivePalette();
    return {
      '--BG-Color-1': Palette.Colors[0],
      '--BG-Color-2': Palette.Colors[1],
      '--BG-Color-3': Palette.Colors[2],
      '--BG-Color-4': Palette.Colors[3]
    };
  });

  ngOnInit(): void {
    console.log(`[DeepBackground] Initialized with mood: ${this.ActivePalette().Name}`);
  }
}
