import { Component, OnInit, ElementRef, ViewChild, HostListener, Inject, inject, PLATFORM_ID, OnDestroy, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { InterfaceService } from '../../../../core/services/interface/interface';

interface RGBColor {
  R: number;
  G: number;
  B: number;
}

interface Sphere {
  Id: number;
  Styles: Record<string, string>;
}

@Component({
  selector: 'Aurora',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aurora.html',
  styleUrl: './aurora.scss'
})
export class AuroraComponent implements OnInit, OnDestroy {
  @ViewChild('Container') private ContainerRef!: ElementRef<HTMLDivElement>;

  private InterfaceService: InterfaceService = inject(InterfaceService);

  private IsBrowser: boolean;
  private AnimationFrameId: number | null = null;
  private ResizeObserver: ResizeObserver | null = null;

  public Spheres: Sphere[] = [];

  // #region Mouse Tracking & Parallax

  private MouseX: number = 0;
  private MouseY: number = 0;
  private TargetMouseX: number = 0;
  private TargetMouseY: number = 0;

  @HostListener('window:mousemove', ['$event'])
  public OnMouseMove(Event: MouseEvent): void {
    this.TargetMouseX = (Event.clientX / window.innerWidth) - 0.5;
    this.TargetMouseY = (Event.clientY / window.innerHeight) - 0.5;
  }

  @HostListener('window:deviceorientation', ['$event'])
  public OnDeviceOrientation(Event: DeviceOrientationEvent): void {
    if (Event.beta && Event.gamma) {
      // Mapping tilt to parallax
      this.TargetMouseX = (Event.gamma / 45); // Approx range -45 to 45
      this.TargetMouseY = (Event.beta / 45);
    }
  }

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
    if (this.IsBrowser) {
      this.StartAnimationLoop();
      this.ObserveResize();
    }
  }

  ngOnDestroy(): void {
    if (this.AnimationFrameId) cancelAnimationFrame(this.AnimationFrameId);
    if (this.ResizeObserver) this.ResizeObserver.disconnect();
  }

  private ObserveResize(): void {
    this.ResizeObserver = new ResizeObserver(() => this.GenerateSpheres());
    this.ResizeObserver.observe(document.body);
  }

  /** Populates the Spheres array based on screen density. */
  private GenerateSpheres(): void {
    if (!this.IsBrowser) return;

    const Width = window.innerWidth;
    const Height = window.innerHeight;
    const SphereCount = Math.max(4, Math.floor((Width * Height) / 150000));

    this.Spheres = Array.from({ length: SphereCount }).map((_, Index) => ({
      Id: Index,
      Styles: this.CreateSphereStyles()
    }));
  }

  /** Re-calculates gradients for existing spheres (used for theme transitions). */
  private RegenerateGradients(): void {
    this.Spheres = this.Spheres.map(Sphere => ({
      ...Sphere,
      Styles: {
        ...Sphere.Styles,
        background: this.GenerateRandomGradient()
      }
    }));
  }

  private CreateSphereStyles(): Record<string, string> {
    const Size = this.RandomBetween(250, 550);
    const Speed = this.RandomBetween(0.5, 2);
    const RotationSpeed = this.RandomBetween(0.1, 0.5);
    const ScaleSpeed = this.RandomBetween(0.05, 0.2);

    return {
      width: `${Size}px`,
      height: `${Size}px`,
      top: `${this.RandomBetween(-10, 110)}%`,
      left: `${this.RandomBetween(-10, 110)}%`,
      background: this.GenerateRandomGradient(),
      '--Sphere-Speed': Speed.toString(),
      '--Sphere-RotationSpeed': RotationSpeed.toString(),
      '--Sphere-ScaleSpeed': ScaleSpeed.toString(),
      '--Sphere-Opacity': this.RandomBetween(0.3, 0.7).toString()
    };
  }

  // #region Gradient Generation

  /** Returns a random number between `Minimum` and `Maximum`. */
  private RandomBetween(Minimum: number, Maximum: number): number {
    return (Math.random() * (Maximum - Minimum)) + Minimum;
  }

  /** Converts HSL values to an RGBColor. */
  private HSLToRGB(H: number, S: number, L: number): RGBColor {
    S /= 100;
    L /= 100;
    const k = (n: number) => (n + H / 30) % 12;
    const a = S * Math.min(L, 1 - L);
    const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      R: Math.round(255 * f(0)),
      G: Math.round(255 * f(8)),
      B: Math.round(255 * f(4))
    };
  }

  /** Generates a completely random pastel color. */
  private RandomColor(): RGBColor {
    const Hue = this.RandomBetween(0, 360);
    const Saturation = this.RandomBetween(70, 100);
    const Lightness = this.RandomBetween(70, 85);
    
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

    if (Roll < 0.33) {
      return `radial-gradient(circle at center, ${this.RGBA(Color1, Opacity1)} 0%, transparent 70%)`;
    } else if (Roll < 0.66) {
      return `linear-gradient(${this.RandomBetween(0, 360)}deg, ${this.RGBA(Color1, Opacity1)} 0%, ${this.RGBA(Color2, Opacity2)} 100%)`;
    } else {
      return `radial-gradient(circle at 30% 30%, ${this.RGBA(Color1, Opacity1)} 0%, ${this.RGBA(Color2, Opacity2)} 50%, transparent 100%)`;
    }
  }

  // #endregion

  private StartAnimationLoop(): void {
    const Tick = () => {
      // Smooth lerp for parallax
      this.MouseX += (this.TargetMouseX - this.MouseX) * 0.05;
      this.MouseY += (this.TargetMouseY - this.MouseY) * 0.05;

      const Distance = Math.sqrt(this.MouseX * this.MouseX + this.MouseY * this.MouseY);
      const Angle = Math.atan2(this.MouseY, this.MouseX);

      if (this.ContainerRef) {
        const Style = this.ContainerRef.nativeElement.style;
        Style.setProperty('--Mouse-X', this.MouseX.toString());
        Style.setProperty('--Mouse-Y', this.MouseY.toString());
        Style.setProperty('--Mouse-Distance', Distance.toString());
        Style.setProperty('--Mouse-Angle', Angle.toString());
      }

      this.AnimationFrameId = requestAnimationFrame(Tick);
    };
    Tick();
  }
}
