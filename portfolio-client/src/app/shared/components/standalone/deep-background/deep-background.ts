import { Component, OnInit, inject, computed, type Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackgroundPalette } from '@ervum/types';

import { InterfaceService } from '../../../../core/services/interface/interface';



@Component({
  selector: 'DeepBackground',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deep-background.html',
  styleUrl: './deep-background.scss'
})
export class DeepBackgroundComponent {
  private InterfaceService: InterfaceService = inject(InterfaceService);

  /** Number of blob layers. */
  public readonly BlobCount: number = 4;

  /**
   * Generates a random palette on construction.
   * Both dark and light variants share the same random hue so
   * switching themes feels like a tonal shift rather than a new palette.
   */
  private readonly GeneratedPalette = this.GenerateRandomPalettes();

  /** Active palette based on current theme */
  public ActivePalette: Signal<BackgroundPalette> = computed(() => {
    const Theme = this.InterfaceService.InterfaceType();
    return Theme === 'Primary'
      ? this.GeneratedPalette.Dark
      : this.GeneratedPalette.Light;
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

  // #region Palette Generation

  /** Returns a random number between `Min` and `Max`. */
  private RandomBetween(Min: number, Max: number): number {
    return Math.random() * (Max - Min) + Min;
  }

  /**
   * Converts HSL to a hex color string.
   * H: 0–360, S: 0–100, L: 0–100.
   */
  private HSLToHex(H: number, S: number, L: number): string {
    S /= 100;
    L /= 100;

    const k = (n: number) => (n + H / 30) % 12;
    const a = S * Math.min(L, 1 - L);
    const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const R = Math.round(255 * f(0));
    const G = Math.round(255 * f(8));
    const B = Math.round(255 * f(4));

    return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
  }

  /**
   * Generates a paired Dark + Light palette around a single random hue.
   *
   * **Dark (Primary):** Near-black colors with very low saturation (3–8%)
   * and very low lightness (1–4%). The result is almost pure black with
   * the faintest whisper of color — never noticeably red, green, etc.
   *
   * **Light (Secondary):** Near-white colors with moderate saturation (40–70%)
   * and high lightness (92–98%). The result is soft pastels that are
   * unmistakably light without being harsh.
   */
  private GenerateRandomPalettes(): { Dark: BackgroundPalette; Light: BackgroundPalette } {
    const BaseHue = this.RandomBetween(0, 360);

    const HueNames = ['Ocean', 'Forest', 'Crimson', 'Violet', 'Amber', 'Teal', 'Rose', 'Slate'];
    const Name = HueNames[Math.floor(Math.random() * HueNames.length)];

    // Generate 4 dark colors: near-black with barely perceptible tint
    const DarkColors: string[] = [];
    for (let i = 0; i < 4; i++) {
      const Hue = BaseHue + this.RandomBetween(-30, 30);
      const Saturation = this.RandomBetween(3, 8);
      const Lightness = this.RandomBetween(1, 4);
      DarkColors.push(this.HSLToHex(Hue, Saturation, Lightness));
    }

    // Generate 4 light colors: near-white with soft pastel tint
    const LightColors: string[] = [];
    for (let i = 0; i < 4; i++) {
      const Hue = BaseHue + this.RandomBetween(-30, 30);
      const Saturation = this.RandomBetween(40, 70);
      const Lightness = this.RandomBetween(92, 98);
      LightColors.push(this.HSLToHex(Hue, Saturation, Lightness));
    }

    return {
      Dark:  { Name: `Deep-${Name}`,  Colors: DarkColors },
      Light: { Name: `Soft-${Name}`,  Colors: LightColors }
    };
  }

  // #endregion
}
