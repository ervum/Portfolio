import { Component, inject, signal, ViewChild, WritableSignal, computed, type Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginData, RegisterData, FancyMultibuttonItemType, AuthenticationFormFieldType, AuthenticationTabType, FieldErrorDescriptor, ErrorRegistry, Undefinable } from '@ervum/types';

import { MultibuttonComponent } from '../shared/components/standalone/multibutton/multibutton';
import { ButtonComponent } from '../shared/components/standalone/button/button';
import { TextboxComponent } from '../shared/components/standalone/textbox/textbox';
import { CheckboxComponent } from '../shared/components/standalone/checkbox/checkbox';
import { ContainerComponent } from '../shared/components/standalone/container/container';
import { TooltipComponent } from '../shared/components/standalone/tooltip/tooltip';

import { TypewriterDirective } from '../shared/directives/typewriter/typewriter.directive';
import { SlideUpDownDirective } from '../shared/directives/slide-up-down/slide-up-down.directive';

import { AuthenticationService } from '../core/services/authentication/authentication';
import { InterfaceService } from '../core/services/interface/interface';
import { NavigationService } from '../core/services/navigation/navigation';

import { forkJoin, timer } from 'rxjs'; 



@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    CommonModule,

    MultibuttonComponent,
    ButtonComponent,
    TextboxComponent,
    CheckboxComponent,
    ContainerComponent,
    TooltipComponent,

    TypewriterDirective,
    SlideUpDownDirective
],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss'
})
export class AuthenticationComponent {
  @ViewChild('MainIdentifierTextbox') private MainIdentifierTextbox!: TextboxComponent;
  @ViewChild('EmailTextbox') private EmailTextbox!: TextboxComponent;
  @ViewChild('PhoneNumberTextbox') private PhoneNumberTextbox!: TextboxComponent;
  @ViewChild('PasswordTextbox') private PasswordTextbox!: TextboxComponent;
  
  private AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private NavigationService: NavigationService = inject(NavigationService);
  public InterfaceService: InterfaceService = inject(InterfaceService);

  private readonly TargetFormFields: AuthenticationFormFieldType[] = ['Email', 'PhoneNumber', 'UserIdentifier', 'Password'];

  /**
   * Error descriptors store the translation key and an optional field key for programmatic replacement of "[1]".
   */
  private readonly ErrorDescriptorSignalMap: Record<AuthenticationFormFieldType, WritableSignal<FieldErrorDescriptor[]>> = this.TargetFormFields.reduce(
    (Accumulator: Record<AuthenticationFormFieldType, WritableSignal<FieldErrorDescriptor[]>>, FormField: AuthenticationFormFieldType): Record<AuthenticationFormFieldType, WritableSignal<FieldErrorDescriptor[]>> => {
      Accumulator[FormField] = signal([]);

      return Accumulator;
    },
    {} as Record<AuthenticationFormFieldType, WritableSignal<FieldErrorDescriptor[]>>
  );

  public readonly ErrorActiveSignalMap: Record<AuthenticationFormFieldType, WritableSignal<boolean>> = this.TargetFormFields.reduce(
    (Accumulator: Record<AuthenticationFormFieldType, WritableSignal<boolean>>, FormField: AuthenticationFormFieldType): Record<AuthenticationFormFieldType, WritableSignal<boolean>> => {
      Accumulator[FormField] = signal(false);

      return Accumulator;
    },
    {} as Record<AuthenticationFormFieldType, WritableSignal<boolean>>
  );

  public readonly ErrorMessageMap: Record<AuthenticationFormFieldType, Signal<string>> = this.TargetFormFields.reduce(
    (Accumulator: Record<AuthenticationFormFieldType, Signal<string>>, FormField: AuthenticationFormFieldType): Record<AuthenticationFormFieldType, Signal<string>> => {
      Accumulator[FormField] = computed((): string => this.TranslateDescriptors(this.ErrorDescriptorSignalMap[FormField]()));

      return Accumulator;
    },
    {} as Record<AuthenticationFormFieldType, Signal<string>>
  );

  public CurrentFormType: WritableSignal<AuthenticationTabType> = signal<AuthenticationTabType>('Sign In');

  public AuthenticationButtons: Signal<FancyMultibuttonItemType[]> = computed((): FancyMultibuttonItemType[] => [
    {
      Label: this.InterfaceService.T().SignIn,
      Action: (): void => {
        const IsFromSignUp: boolean = (this.CurrentFormType() === 'Sign Up');

        let HasVisibleErrors: boolean = false;
        
        for (const [_, ErrorActiveSignal] of Object.entries(this.ErrorActiveSignalMap)) {
          if (ErrorActiveSignal() === true) {
            HasVisibleErrors = true;

            break;
          }
        }

        this.ResetErrors();

        if (IsFromSignUp && HasVisibleErrors) {
          setTimeout((): void => {
            this.CurrentFormType.set('Sign In');
          }, 400);
        } else {
          this.CurrentFormType.set('Sign In');
        }
      }
    },

    {
      Label: this.InterfaceService.T().SignUp,
      Action: (): void => {
        this.ResetErrors();
        this.CurrentFormType.set('Sign Up');
      }
    }
  ]);
  
  public get IsLoading(): Record<string, boolean> {
    return this.InterfaceService.GetStatusClasses();
  }
  
  /** Classes for the form fields wrapper (sign-up expanded state). */
  public get GetFormFieldsClasses(): Record<string, boolean> {
    return {
      'Is-SignUp': (this.CurrentFormType() === 'Sign Up')
    };
  }

  /**
   * Translates error descriptors using the active language.
   * If both general ("IsGeneral") and specific errors are present, the general one takes priority.
   * Programmatically replaces "[1]" with the translated field name.
   */
  private TranslateDescriptors(Descriptors: FieldErrorDescriptor[]): string {
    if (!Descriptors || (Descriptors.length === 0)) {
      return '';
    }

    const Dictionary: Record<string, string> = (this.InterfaceService.T() as Record<string, string>);

    const GeneralErrorDescriptor: Undefinable<FieldErrorDescriptor> = Descriptors.find(
      (Descriptor: FieldErrorDescriptor): boolean => (Descriptor.IsGeneral === true)
    );
    const TargetDescriptors: FieldErrorDescriptor[] = GeneralErrorDescriptor ? [GeneralErrorDescriptor] : Descriptors;

    return TargetDescriptors.map((Descriptor: FieldErrorDescriptor): string => {
      let Message: string = Dictionary[Descriptor.Key] ?? Descriptor.RawMessage ?? Descriptor.Key;

      if (Descriptor.FieldKey && Message.includes('[1]')) {
        let FieldName: string = Dictionary[Descriptor.FieldKey] ?? Descriptor.FieldKey;

        if (Message.indexOf('[1]') !== 0) {
          FieldName = FieldName.toLowerCase();
        }

        Message = Message.split('[1]').join(FieldName);
      }

      return Message;
    }).join(' ');
  }

  public ResetErrors(): void {
    for (const FormField of this.TargetFormFields) {
      this.ErrorActiveSignalMap[FormField].set(false);
    }
  }

  private DisplayErrorTooltips(ErrorObject: any): void {
    this.ResetErrors(); 

    if (!ErrorObject || !ErrorObject.error) {
      this.ErrorDescriptorSignalMap['Password'].set([{ Key: 'Error_00_000', IsGeneral: true }]);
      this.ErrorActiveSignalMap['Password'].set(true);
      
      return;
    }

    const Messages: string[] = Array.isArray(ErrorObject.error.message)
      ? ErrorObject.error.message
      : [ErrorObject.error.message || ErrorObject.error];

    const ErrorDescriptorMap: Record<AuthenticationFormFieldType, FieldErrorDescriptor[]> = this.TargetFormFields.reduce(
      (Accumulator: Record<AuthenticationFormFieldType, FieldErrorDescriptor[]>, FormField: AuthenticationFormFieldType): Record<AuthenticationFormFieldType, FieldErrorDescriptor[]> => {
        Accumulator[FormField] = [];

        return Accumulator;
      },
      {} as Record<AuthenticationFormFieldType, FieldErrorDescriptor[]>
    );
    
    for (const Message of Messages) {
      const ErrorCodeSections: string[] = Message.split(':');

      const PropertyName: AuthenticationFormFieldType = (ErrorCodeSections[0].trim() as AuthenticationFormFieldType);
      const RawCode: string = (ErrorCodeSections[1] ?? '00_000').trim();
      const ResolvedCode: string = (RawCode in ErrorRegistry) ? RawCode : '00_000';

      ErrorDescriptorMap[PropertyName].push({
        Key: `Error_${ResolvedCode}`,
        FieldKey: PropertyName,
        RawMessage: Message,
        IsGeneral: (ErrorRegistry[ResolvedCode].IsGeneral === true)
      });
    }

    for (const FormField of this.TargetFormFields) {
      const CurrentDescriptors: FieldErrorDescriptor[] = ErrorDescriptorMap[FormField];

      if (CurrentDescriptors.length > 0) {
        this.ErrorDescriptorSignalMap[FormField].set(CurrentDescriptors);
        this.ErrorActiveSignalMap[FormField].set(true);
      }
    }

    setTimeout((): void => {
      this.ResetErrors();
    }, 5000);
  }

  /** Navigates back to the home page. */
  public NavigateToHome(): void {
    this.NavigationService.NavigateWithAnimation('home');
  }

  /** Delegates to the appropriate sign-in or sign-up handler based on the current form type. */
  public HandleSubmit(): void {
    if (this.CurrentFormType() === 'Sign In') {
      this.HandleSignIn();
    } else {
      this.HandleSignUp();
    }
  }

  /** Initiates the account recovery flow. */
  public HandleAccountRecovery(): void {
    this.NavigationService.NavigateWithAnimation('authentication/recovery');
  }

  /** Sends a sign-in request with the current form values. */
  public HandleSignIn(): void {
    console.log('Sign-In attempt initiated from the Authentication Component!');
    
    this.ResetErrors();
    this.InterfaceService.SetStatus('Loading');
    
    const UserPayload: LoginData = {
      UserIdentifier: ((this.MainIdentifierTextbox?.InputValue) ?? ''),
      Password: ((this.PasswordTextbox?.InputValue) ?? '')
    };

    forkJoin([
      this.AuthenticationService.Login(UserPayload),

      timer(50)
    ]).subscribe({
      next: (Response: [LoginData, number]): void => {
        // TODO: Remove before production — logs sensitive user data (password, email, etc.)
        console.log('Successfully signed in:', Response);

        this.InterfaceService.SetStatus('Success');
      },
      error: (ErrorObject: unknown): void => {
        console.error('Error signing in:', ErrorObject);

        this.InterfaceService.SetStatus('Error');
        this.DisplayErrorTooltips(ErrorObject);
      }
    });
  }

  /** Sends a sign-up request with the current form values. */
  public HandleSignUp(): void {
    console.log('Sign-Up attempt initiated from the Authentication Component!');
    
    this.ResetErrors();
    this.InterfaceService.SetStatus('Loading');

    const UserPayload: RegisterData = {
      Email: ((this.EmailTextbox?.InputValue) ?? ''),
      PhoneNumber: ((this.PhoneNumberTextbox?.InputValue) ?? ''),

      Username: ((this.MainIdentifierTextbox?.InputValue) ?? ''),
      Password: ((this.PasswordTextbox?.InputValue) ?? '')
    };

    forkJoin([
      this.AuthenticationService.Register(UserPayload),

      timer(50)
    ]).subscribe({
      next: (Response: [RegisterData, number]): void => {
        // TODO: Remove before production — logs sensitive user data (password, email, etc.)
        console.log('Successfully signed up:', Response);

        this.InterfaceService.SetStatus('Success');
      },
      error: (ErrorObject: unknown): void => {
        console.error('Error signing up:', ErrorObject);

        this.InterfaceService.SetStatus('Error');
        this.DisplayErrorTooltips(ErrorObject);
      }
    });
  }

  /** Toggles the global interface theme with a circular ripple transition from the click origin. */
  public ToggleTheme(Event: MouseEvent): void {
    this.InterfaceService.ToggleInterfaceTypeWithTransition(Event.clientX, Event.clientY);
  }
}
