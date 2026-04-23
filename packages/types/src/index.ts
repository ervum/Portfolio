///          Shared Types          \\\
export type AnyFunction = ((...Arguments: any[]) => (any));
export type Void = (null | undefined);

export type Nullable<T> = (T | null)
export type Undefinable<T> = (T | undefined);
export type Voidable<T> = (T | Void);

export type StringBooleanType = ('True' | 'False');



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

export interface LoginData {
  UserIdentifier: string,
  Password: string
};

export interface RegisterData {
  Email: string,
  PhoneNumber: string,
  Username: string,
  Password: string
};



///          Client Types          \\\
/////      User  Interfaces      \\\\\
export type FancyUIElementTypeType = ('Primary' | 'Secondary');
export type FancyUIElementStyleType = ('Standard' | 'Backgroundless');

export type FancyUIElementFocusStateType = ('Focusing' | 'Focused' | 'Unfocusing' | 'Unfocused');
export type FancyUIElementLoadStatusType = ('Idle' | 'Loading' | 'Success' | 'Error');

export type NGStylesType = { [key: string]: string };

/////      Fancy Multibutton     \\\\\
export type FancyMultiButtonDisplayModeType = ('Text' | 'Icon');
export type FancyMultiButtonIndicatorStyleType = ('Dot' | 'Dash');

export type HorizontalPositionType = ('Left' | 'Right');
export type VerticalPositionType = ('Above' | 'Below');

export interface FancyMultibuttonItemType {
  Label: string,
  Action?: AnyFunction,
  ActionArguments?: unknown[]
};

/////        Fancy Button        \\\\\
export type FancyButtonIconStateType = ('AtCenter' | 'Exiting' | 'OffScreen' | 'Entering');

/////        Fancy Textbox       \\\\\
export type FancyTextboxOrderType = ('First' | 'Intermediate' | 'Last' | 'Unique');

/////       Fancy Dropdown       \\\\\
export interface FancyDropdownItemType {
  ID?: string,
  Label: string,
  Action?: AnyFunction,
  ActionArguments?: unknown[]
};

/////       Fancy Checkbox       \\\\\