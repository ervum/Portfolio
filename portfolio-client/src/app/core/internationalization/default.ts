export type TranslationDictionary = {
  LanguageCode: string;
  Portfolio: string;
  SignIn: string;
  SignUp: string;
  RememberMe: string;
  Email: string;
  PhoneNumber: string;
  Username: string;
  UserIdentifier: string;
  Password: string;
  LanguageName_English: string;
  LanguageName_Spanish: string;
  AccountRecovery: string;
  Recover: string;
  Continue: string;
  RecoveryIntro: string;
  Home: string;
  OR: string;
  ExtensionWarningTooltip: string;
};

export const DefaultDictionary: TranslationDictionary = {
  LanguageCode: 'en',
  
  Portfolio: 'Portfolio',
  SignIn: 'Sign In',
  SignUp: 'Sign Up',
  RememberMe: 'Remember me',

  Email: 'Email',
  PhoneNumber: 'Phone number',
  Username: 'Username',
  UserIdentifier: 'User Identifier',
  Password: 'Password',

   LanguageName_English: 'English',
   LanguageName_Spanish: 'Spanish',
 
   AccountRecovery: 'Account recovery',
   Recover: 'recover',
   Continue: 'Continue',
   RecoveryIntro: "I'd like to recover my",
   
   Home: 'HOME',
   OR: 'OR',

   ExtensionWarningTooltip: 'A third-party extension is modifying this page. Some parts of the interface may appear visually different from the original design.',
 };
