///          Shared Types          \\\
export type AnyFunction = ((...Arguments: any[]) => (any));



///          Server Types          \\\
export type ConfigurationType = {
    URL: string,
    Port: number,

    ProxyURL: string,
    SlashedProxyURL: string
};

export type DatabaseConfigurationType = {
  Host: string,
  Port: number,
  User: string,
  Password: string,
  Name: string
};

export type SecretsType = {
  Database: DatabaseConfigurationType
};

export type ServerConfigurationType = (ConfigurationType & SecretsType);



///          Client Types          \\\
/////        Fancy Button        \\\\\
export type FancyButtonTypeType = ('Primary' | 'Secondary');
export type FancyButtonStyleType = ('Standard' | 'Backgroundless');

export type NGStylesType = { [key: string]: string };

/////        Fancy Textbox       \\\\\
export type StringBooleanType = ('True' | 'False');

export type FancyTextboxTypeType = ('Primary' | 'Secondary');
export type FancyTextboxStyleType = ('Standard' | 'Backgroundless');

export type FancyTextboxBorderAnimationType = ('Above' | 'Below');

export type FancyTextboxOrderType = ('First' | 'Intermediate' | 'Last' | 'Unique');

export type UIElementFocusStateType = ('Focusing' | 'Focused' | 'Unfocusing' | 'Unfocused');

/////      Fancy Multibutton      \\\\\
export interface FancyButtonConfiguration {
  BorderSpacing?: number,

  Label?: string,

  Padding?: number,

  Type?: FancyButtonTypeType,
  Styled?: FancyButtonStyleType,

  Hover?: AnyFunction,
  Move?: AnyFunction,
  Unhover?: AnyFunction,

  Focus?: AnyFunction,
  Unfocus?: AnyFunction,
  
  Cancel?: AnyFunction,

  Down?: AnyFunction,
  Up?: AnyFunction,

  KeyDown?: AnyFunction,
  KeyUp?: AnyFunction,

  Wheel?: AnyFunction
}