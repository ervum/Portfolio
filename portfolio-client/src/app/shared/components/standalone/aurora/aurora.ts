import { Component, ElementRef, HostListener, ViewChild, AfterViewInit, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { NGStylesType } from '@ervum/types';



interface RGBColor {
  R: number;
  G: number;
  B: number;
}

interface AuroraSphere {
  /** Pre-computed inline styles (position, size, background, CSS custom properties). */
  Styles: NGStylesType;
}

/** Smoothing factor for exponential lerp (0 = no smoothing, 1 = instant). */
const MOUSE_SMOOTHING: number = 0.12;



@Component({
  selector: 'Aurora',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aurora.html',
  styleUrls: ['./aurora.scss']
})
export class AuroraComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('Container') ContainerRef!: ElementRef<HTMLDivElement>;

  // #region Inputs

  /** Number of gradient spheres to generate. */
  @Input() SphereCount: number = 5;

  /** Minimum sphere diameter (in vw units). */
  @Input() MinimumSize: number = 14;
  /** Maximum sphere diameter (in vw units). */
  @Input() MaximumSize: number = 22;

  /** Minimum vertical position (in percentage). */
  @Input() MinimumTop: number = 0;
  /** Maximum vertical position (in percentage). */
  @Input() MaximumTop: number = 100;
  /** Minimum horizontal position (in percentage). */
  @Input() MinimumLeft: number = 0;
  /** Maximum horizontal position (in percentage). */
  @Input() MaximumLeft: number = 100;

  /** Minimum parallax speed. */
  @Input() MinimumSpeed: number = -20;
  /** Maximum parallax speed. */
  @Input() MaximumSpeed: number = 20;

  /** Minimum rotation speed. */
  @Input() MinimumRotationSpeed: number = -0.8;
  /** Maximum rotation speed. */
  @Input() MaximumRotationSpeed: number = 0.8;

  /** Minimum scale speed. */
  @Input() MinimumScaleSpeed: number = 0.1;
  /** Maximum scale speed. */
  @Input() MaximumScaleSpeed: number = 0.2;

  /** Minimum sphere opacity. */
  @Input() MinimumOpacity: number = 0.3;
  /** Maximum sphere opacity. */
  @Input() MaximumOpacity: number = 0.5;

  /** Minimum wave offset. */
  @Input() MinimumWaveOffset: number = 0;
  /** Maximum wave offset. */
  @Input() MaximumWaveOffset: number = 3;

  /** Minimum animation delay (in seconds). */
  @Input() MinimumAnimationDelay: number = 0;
  /** Maximum animation delay (in seconds). */
  @Input() MaximumAnimationDelay: number = 4;

  // #endregion

  // #region State

  public Spheres: AuroraSphere[] = [];

  /** CSS classes for each wave layer (data-driven instead of hardcoded HTML). */
  public readonly WaveLayers: string[] = [
    'Aurora-Wave Aurora-Wave--1',
    'Aurora-Wave Aurora-Wave--2',
    'Aurora-Wave Aurora-Wave--3'
  ];

  private readonly IsBrowser: boolean;

  /** Raw mouse position (normalized -1 to +1). Updated instantly on mousemove. */
  private RawMouseX: number = 0;
  private RawMouseY: number = 0;

  /** Smoothed mouse position (lerped toward raw). Used for CSS variable output. */
  private SmoothedX: number = 0;
  private SmoothedY: number = 0;

  /** Smoothed angle that handles ±π wrap-around. Stored in radians. */
  private SmoothedAngle: number = 0;

  /** Active render loop handle for cancellation. */
  private AnimationFrameID: number | null = null;

  // #endregion

  // #region Color Palette

  /** Color palette for random gradient generation. */
  private readonly ColorPalette: RGBColor[] = [
    { R: 139, G: 92,  B: 246 },   // Purple
    { R: 236, G: 72,  B: 153 },   // Pink
    { R: 124, G: 58,  B: 237 },   // Deep Purple
    { R: 79,  G: 70,  B: 229 },   // Indigo
    { R: 219, G: 39,  B: 119 },   // Magenta
    { R: 6,   G: 182, B: 212 },   // Cyan
    { R: 59,  G: 130, B: 246 },   // Blue
    { R: 14,  G: 165, B: 233 },   // Sky Blue
  ];

  // #endregion



  constructor(@Inject(PLATFORM_ID) private PlatformID: object) {
    this.IsBrowser = isPlatformBrowser(this.PlatformID);
  }

  ngOnInit(): void {
    this.GenerateSpheres();
  }

  ngAfterViewInit(): void {
    if (!this.IsBrowser) return;

    this.StartRenderLoop();
  }

  ngOnDestroy(): void {
    this.StopRenderLoop();
  }

  // #region Render Loop

  /**
   * Starts a continuous render loop that smoothly lerps CSS variables toward the target mouse position.
   * This decouples the animation frame rate from the mouse event rate.
   */
  private StartRenderLoop(): void {
    if (!this.IsBrowser) return;

    const Loop = (): void => {
      this.UpdateSmoothedValues();
      this.ApplyCSSVariables();

      this.AnimationFrameID = requestAnimationFrame(Loop);
    };

    this.AnimationFrameID = requestAnimationFrame(Loop);
  }

  /** Cancels the active render loop. */
  private StopRenderLoop(): void {
    if (this.AnimationFrameID !== null) {
      cancelAnimationFrame(this.AnimationFrameID);
      this.AnimationFrameID = null;
    }
  }

  /**
   * Exponentially smooths the current position toward the raw mouse position.
   * Also smooths the angle with wrap-around handling to prevent 360° snaps.
   */
  private UpdateSmoothedValues(): void {
    this.SmoothedX += (this.RawMouseX - this.SmoothedX) * MOUSE_SMOOTHING;
    this.SmoothedY += (this.RawMouseY - this.SmoothedY) * MOUSE_SMOOTHING;

    const TargetAngle: number = Math.atan2(this.SmoothedY, this.SmoothedX);

    // Compute the shortest angular delta, wrapping around ±π.
    let AngleDelta: number = (TargetAngle - this.SmoothedAngle);
    AngleDelta = AngleDelta - Math.round(AngleDelta / (2 * Math.PI)) * (2 * Math.PI);

    this.SmoothedAngle += AngleDelta * MOUSE_SMOOTHING;
  }

  /** Writes the current smoothed values to the container's CSS custom properties. */
  private ApplyCSSVariables(): void {
    const Container: HTMLDivElement | undefined = this.ContainerRef?.nativeElement;
    if (!Container) return;

    const DistanceSquared: number = (this.SmoothedX * this.SmoothedX) + (this.SmoothedY * this.SmoothedY);

    Container.style.setProperty('--Mouse-X', this.SmoothedX.toFixed(4));
    Container.style.setProperty('--Mouse-Y', this.SmoothedY.toFixed(4));
    Container.style.setProperty('--Mouse-Distance', Math.sqrt(DistanceSquared).toFixed(4));
    Container.style.setProperty('--Mouse-Angle', this.SmoothedAngle.toFixed(4));
  }

  // #endregion

  // #region Mouse Tracking

  /**
   * Updates the raw target position on every mouse move.
   * The render loop handles smoothing — this just sets the target.
   * On re-entry after leaving the viewport, the lerp naturally
   * smooths from the current sphere position to the new mouse position.
   */
  @HostListener('window:mousemove', ['$event'])
  OnMouseMove(Event: MouseEvent): void {
    if (!this.IsBrowser) return;

    this.RawMouseX = ((Event.clientX / window.innerWidth) * 2) - 1;
    this.RawMouseY = ((Event.clientY / window.innerHeight) * 2) - 1;
  }

  // #endregion

  // #region Sphere Generation

  /**
   * Populates `Spheres` with randomized styles within the configured bounds.
   * All per-sphere visual properties are packed into a single `Styles` object
   * that the template applies via `[ngStyle]`.
   */
  private GenerateSpheres(): void {
    this.Spheres = [];

    for (let i = 0; i < this.SphereCount; i++) {
      this.Spheres.push({
        Styles: {
          'top':                      `${this.RandomBetween(this.MinimumTop, this.MaximumTop)}%`,
          'left':                     `${this.RandomBetween(this.MinimumLeft, this.MaximumLeft)}%`,
          'width':                    `${this.RandomBetween(this.MinimumSize, this.MaximumSize)}vw`,
          'height':                   `${this.RandomBetween(this.MinimumSize, this.MaximumSize)}vw`,
          'background':               this.GenerateRandomGradient(),
          'animation-delay':          `${this.RandomBetween(this.MinimumAnimationDelay, this.MaximumAnimationDelay).toFixed(2)}s`,
          '--Sphere-Opacity':         `${this.RandomBetween(this.MinimumOpacity, this.MaximumOpacity).toFixed(3)}`,
          '--Sphere-Speed':           `${this.RandomBetween(this.MinimumSpeed, this.MaximumSpeed).toFixed(2)}`,
          '--Sphere-RotationSpeed':   `${this.RandomBetween(this.MinimumRotationSpeed, this.MaximumRotationSpeed).toFixed(3)}`,
          '--Sphere-ScaleSpeed':      `${this.RandomBetween(this.MinimumScaleSpeed, this.MaximumScaleSpeed).toFixed(3)}`,
          '--Sphere-WaveOffset':      `${this.RandomBetween(this.MinimumWaveOffset, this.MaximumWaveOffset).toFixed(2)}`
        }
      });
    }
  }

  // #endregion

  // #region Gradient Generation

  /** Returns a random number between `Minimum` and `Maximum`. */
  private RandomBetween(Minimum: number, Maximum: number): number {
    return (Math.random() * (Maximum - Minimum)) + Minimum;
  }

  /** Returns a random color from the palette. */
  private RandomColor(): RGBColor {
    return this.ColorPalette[(Math.random() * this.ColorPalette.length) | 0];
  }

  /** Formats an RGBColor into an `rgba()` CSS string. */
  private RGBA(Color: RGBColor, Opacity: number): string {
    return `rgba(${Color.R}, ${Color.G}, ${Color.B}, ${Opacity.toFixed(2)})`;
  }

  /** Builds a randomized CSS gradient string using colors from `ColorPalette`. */
  private GenerateRandomGradient(): string {
    const Roll: number = Math.random();

    const Color1: RGBColor = this.RandomColor();
    const Color2: RGBColor = this.RandomColor();
    const Opacity1: number = this.RandomBetween(0.4, 0.8);
    const Opacity2: number = this.RandomBetween(0.4, 0.8);

    const Position1: number = (this.RandomBetween(20, 40)) | 0;
    const Position2: number = (this.RandomBetween(50, 70)) | 0;
    const Position3: number = (this.RandomBetween(60, 80)) | 0;

    if (Roll < 0.5) {
      return `
        radial-gradient(circle at ${Position1}% ${Position1}%, ${this.RGBA(Color1, Opacity1)}, transparent ${Position2}%),
        radial-gradient(circle at ${Position3}% ${100 - Position3}%, ${this.RGBA(Color2, Opacity2)}, transparent ${Position3}%)
      `;
    }

    if (Roll < 0.8) {
      const Angle: number = (this.RandomBetween(0, 360)) | 0;
      return `conic-gradient(from ${Angle}deg, ${this.RGBA(Color1, Opacity1)}, ${this.RGBA(Color2, Opacity2)}, ${this.RGBA(Color1, Opacity1)})`;
    }

    const Color3: RGBColor = this.RandomColor();
    const Opacity3: number = this.RandomBetween(0.3, 0.6);

    return `
      radial-gradient(circle at ${Position1}% ${Position1}%, ${this.RGBA(Color1, Opacity1)}, transparent ${Position2}%),
      radial-gradient(circle at ${Position3}% ${Position1}%, ${this.RGBA(Color2, Opacity2)}, transparent ${Position3}%),
      radial-gradient(circle at ${100 - Position1}% ${100 - Position1}%, ${this.RGBA(Color3, Opacity3)}, transparent ${Position2}%)
    `;
  }

  // #endregion
}