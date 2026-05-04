import { Component, ElementRef, HostListener, ViewChild, AfterViewInit, OnInit, OnDestroy, Inject, PLATFORM_ID, inject, effect, input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Nullable, Undefinable, RGBColor, AuroraSphere } from '@ervum/types';

import { InterfaceService } from '../../../../core/services/interface/interface';
import { MouseSmoothing } from '../../../constants';



@Component({
  selector: 'Aurora',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aurora.html',
  styleUrls: ['./aurora.scss']
})
export class AuroraComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('Container') ContainerRef!: ElementRef<HTMLDivElement>;

  private InterfaceService: InterfaceService = inject(InterfaceService);

  // #region Inputs

  /** Number of gradient spheres to generate. */
  public SphereCount = input(5);

  /** Minimum sphere diameter (in vw units). */
  public MinimumSize = input(14);
  /** Maximum sphere diameter (in vw units). */
  public MaximumSize = input(22);

  /** Minimum vertical position (in percentage). */
  public MinimumTop = input(0);
  /** Maximum vertical position (in percentage). */
  public MaximumTop = input(100);

  /** Minimum horizontal position (in percentage). */
  public MinimumLeft = input(0);
  /** Maximum horizontal position (in percentage). */
  public MaximumLeft = input(100);

  /** Minimum parallax speed. */
  public MinimumSpeed = input(-20);
  /** Maximum parallax speed. */
  public MaximumSpeed = input(20);

  /** Minimum rotation speed. */
  public MinimumRotationSpeed = input(-0.8);
  /** Maximum rotation speed. */
  public MaximumRotationSpeed = input(0.8);

  /** Minimum scale speed. */
  public MinimumScaleSpeed = input(0.1);
  /** Maximum scale speed. */
  public MaximumScaleSpeed = input(0.2);

  /** Minimum sphere opacity. */
  public MinimumOpacity = input(0.3);
  /** Maximum sphere opacity. */
  public MaximumOpacity = input(0.5);



  /** Minimum animation delay (in seconds). */
  public MinimumAnimationDelay = input(0);
  /** Maximum animation delay (in seconds). */
  public MaximumAnimationDelay = input(4);

  // #endregion

  // #region State

  public Spheres: AuroraSphere[] = [];

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
  private AnimationFrameID: Nullable<number> = null;

  // #endregion

  constructor(@Inject(PLATFORM_ID) private PlatformID: object) {
    this.IsBrowser = isPlatformBrowser(this.PlatformID);

    // Regenerate gradients when the theme toggles
    effect(() => {
      this.InterfaceService.InterfaceType();
      
      if (this.Spheres.length > 0) {
        this.RegenerateGradients();
      }
    });
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
    this.SmoothedX += (this.RawMouseX - this.SmoothedX) * MouseSmoothing;
    this.SmoothedY += (this.RawMouseY - this.SmoothedY) * MouseSmoothing;

    const TargetAngle: number = Math.atan2(this.SmoothedY, this.SmoothedX);

    // Compute the shortest angular delta, wrapping around ±π.
    let AngleDelta: number = (TargetAngle - this.SmoothedAngle);
    AngleDelta = AngleDelta - Math.round(AngleDelta / (2 * Math.PI)) * (2 * Math.PI);
    this.SmoothedAngle += AngleDelta * MouseSmoothing;
  }

  /** Writes the current smoothed values to the container's CSS custom properties. */
  private ApplyCSSVariables(): void {
    const Container: Undefinable<HTMLDivElement> = this.ContainerRef?.nativeElement;
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

    for (let i: number = 0; i < this.SphereCount(); i++) {
      this.Spheres.push({
        Styles: {
          'top':                      `${this.RandomBetween(this.MinimumTop(), this.MaximumTop())}%`,
          'left':                     `${this.RandomBetween(this.MinimumLeft(), this.MaximumLeft())}%`,
          'width':                    `${this.RandomBetween(this.MinimumSize(), this.MaximumSize())}vw`,
          'height':                   `${this.RandomBetween(this.MinimumSize(), this.MaximumSize())}vw`,
          'background':               this.GenerateRandomGradient(),
          'animation-delay':          `${this.RandomBetween(this.MinimumAnimationDelay(), this.MaximumAnimationDelay()).toFixed(2)}s`,
          '--Sphere-Opacity':         `${this.RandomBetween(this.MinimumOpacity(), this.MaximumOpacity()).toFixed(3)}`,
          '--Sphere-Speed':           `${this.RandomBetween(this.MinimumSpeed(), this.MaximumSpeed()).toFixed(2)}`,
          '--Sphere-RotationSpeed':   `${this.RandomBetween(this.MinimumRotationSpeed(), this.MaximumRotationSpeed()).toFixed(3)}`,
          '--Sphere-ScaleSpeed':      `${this.RandomBetween(this.MinimumScaleSpeed(), this.MaximumScaleSpeed()).toFixed(3)}`,

        }
      });
    }
  }

  /**
   * Regenerates only the background gradients for existing spheres.
   * Used during theme transitions to update colors without resetting positions.
   */
  private RegenerateGradients(): void {
    for (const Sphere of this.Spheres) {
      Sphere.Styles['background'] = this.GenerateRandomGradient();
    }
  }

  // #endregion

  // #region Gradient Generation

  /** Returns a random number between `Minimum` and `Maximum`. */
  private RandomBetween(Minimum: number, Maximum: number): number {
    return (Math.random() * (Maximum - Minimum)) + Minimum;
  }

  /** Converts HSL values to an RGBColor. */
  private HSLToRGB(H: number, S: number, L: number): RGBColor {
    S /= 100;
    L /= 100;

    const k: (n: number) => number = (n: number) => (n + H / 30) % 12;
    const a: number = S * Math.min(L, 1 - L);
    const f: (n: number) => number = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return {
      R: Math.round(255 * f(0)),
      G: Math.round(255 * f(8)),
      B: Math.round(255 * f(4))
    };
  }

  /** Generates a completely random pastel color. */
  private RandomColor(): RGBColor {
    const Hue: number = this.RandomBetween(0, 360);
    const Saturation: number = this.RandomBetween(70, 100);
    const Lightness: number = this.RandomBetween(70, 85);
    
    return this.HSLToRGB(Hue, Saturation, Lightness);
  }

  /** Formats an RGBColor into an `rgba()` CSS string. */
  private RGBA(Color: RGBColor, Opacity: number): string {
    return `rgba(${Color.R}, ${Color.G}, ${Color.B}, ${Opacity.toFixed(2)})`;
  }

  /** Builds a randomized CSS gradient string using randomly generated pastel colors. */
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