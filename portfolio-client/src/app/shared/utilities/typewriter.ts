/**
 * Reusable typewriter animation utility.
 * 
 * Deletes the current text character by character, then types the new text
 * character by character, producing a typing-machine effect.
 */
export class TypewriterAnimator {
  /** The total duration of the animation in milliseconds. */
  private readonly TotalDuration: number;

  /** Monotonically increasing ID used to cancel stale animations. */
  private CurrentAnimationID: number = 0;

  constructor(TotalDuration: number = 1000) {
    this.TotalDuration = TotalDuration;
  }

  /**
   * Animate a text transition from `OldText` to `NewText` within exactly 1 second.
   * 
   * @param OldText  - The text currently displayed.
   * @param NewText  - The text to transition to.
   * @param SetText  - Callback invoked on every frame with the intermediate text.
   * @returns A promise that resolves when the animation completes (or is cancelled).
   */
  public async Animate(
    OldText: string,
    NewText: string,
    SetText: (Text: string) => void,
    AnimateEnabled: boolean = true
  ): Promise<void> {
    if (!AnimateEnabled) {
      SetText(NewText);
      return;
    }
    const AnimationID = ++this.CurrentAnimationID;

    let TotalSteps = OldText.length + NewText.length;
    if (OldText.length > 0) TotalSteps += 1;

    const DelayPerStep = TotalSteps > 0 ? this.TotalDuration / TotalSteps : 0;

    // Delete phase: remove characters one by one from the end.
    if (OldText.length > 0) {
      for (let i = OldText.length; i >= 0; i--) {
        if (this.CurrentAnimationID !== AnimationID) return;
        SetText(OldText.substring(0, i));
        if (DelayPerStep > 0) await this.Delay(DelayPerStep);
      }
    } else {
      SetText('');
    }

    // Type phase: add characters one by one.
    for (let i = 1; i <= NewText.length; i++) {
      if (this.CurrentAnimationID !== AnimationID) return;
      SetText(NewText.substring(0, i));
      if (DelayPerStep > 0) await this.Delay(DelayPerStep);
    }
  }

  /** Cancel any in-flight animation. */
  public Cancel(): void {
    this.CurrentAnimationID++;
  }

  private Delay(Ms: number): Promise<void> {
    return new Promise(Resolve => setTimeout(Resolve, Ms));
  }
}
