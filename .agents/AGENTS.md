# Portfolio Coding Standards & Rules

You MUST strictly follow these rules on every single line of code you write across this repository without exception:

## 1. Type Annotations
- **Always explicitly type-annotate** every single variable, constant, parameter, function/method return value, property, and generic. Never rely on implicit TypeScript type inference for variable or constant declarations (`const Foo: string = ...`, `let Bar: number = ...`).

## 2. PascalCase Naming Convention
- **Always use PascalCase** (`PascalCase`) for ALL identifiers without exception:
  - Variables (`const TranslationDictionary: Record<string, string> = ...`)
  - Constants (`const MaxTimeout: number = 5000`)
  - Parameters (`function Foo(InputString: string): void`)
  - Methods and Functions (`public CalculateValue(): number`)
  - Class Properties (`private ErrorDescriptors: WritableSignal<FieldErrorDescriptor[]>`)
  - Never use camelCase (`fooBar`) or snake_case (`foo_bar`).

## 3. No Abbreviations & Correct English
- **Never abbreviate variable names**. Always write out full, complete, correct English words:
  - Use `Dictionary` instead of `dict`
  - Use `Descriptor` instead of `desc`
  - Use `Message` instead of `msg`
  - Use `Error` instead of `Err`
  - Use `Element` instead of `el`
  - Use `Reference` instead of `ref`
- **Common acronyms or one-letter names are fine**: `i`, `j`, `k`, and other variable names may be written in lowercase, though complete naming such as 'Index' is fine as well. Acronym such as `ID` or `TV` may be used, but they MUST always be written in uppercase (for example, `ID`, never `Id` or `id`).

## 4. Non-Verbose, D.R.Y. Code & Table Lookups
- **Avoid endless `if - else if` chains or repetitive `if` ladders**. Always prefer clean, concise, D.R.Y. code by iterating over arrays (`for...of`) or using declarative lookup tables/maps.

## 5. Organized Types & Constants
- **Types and shared constants must come from a separate types or constants file** (e.g., `@ervum/types` or `packages/types/src/index.ts`) for ease of maintenance and future modifications. Never clutter component files with repetitive interface or type declarations when they can be centralized.
