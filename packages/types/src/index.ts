///          Shared Types          \\\
export type AnyFunction = ((...Arguments: any[]) => (any));
export type Nullable<T> = (T | undefined);

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



///          Client Types          \\\
/////      User  Interfaces      \\\\\
export type FancyUIElementTypeType = ('Primary' | 'Secondary');
export type FancyUIElementStyleType = ('Standard' | 'Backgroundless');

export type FancyUIElementFocusStateType = ('Focusing' | 'Focused' | 'Unfocusing' | 'Unfocused');
export type FancyUIElementLoadStatusType = ('Idle' | 'Loading' | 'Success' | 'Error');

export type NGStylesType = { [key: string]: string };

/////        Fancy Textbox       \\\\\
export type FancyTextboxBorderAnimationType = ('Above' | 'Below');
export type FancyTextboxOrderType = ('First' | 'Intermediate' | 'Last' | 'Unique');

/////         Fancy Button       \\\\\
export type FancyButtonIconStateType = ('AtCenter' | 'Exiting' | 'OffScreen' | 'Entering');

/////      Fancy Multibutton     \\\\\
export type FancyMultiButtonDisplayModeType = ('Text' | 'Icon');
export type FancyMultiButtonIndicatorType = ('circle' | 'dash' | 'arrow');