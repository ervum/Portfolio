# Portfolio Project: Coding Conventions & Standards

This document outlines the strict coding conventions for the Portfolio project. All agentic AI models (Antigravity) MUST adhere to these rules without exception. Do not perform "standard" refactors (e.g., camelCase) that conflict with these rules.

## 1. Naming Conventions
*   **Variable & Property Naming**: Use **PascalCase** for all variables, properties, constants, inputs, and outputs (e.g., `this.IsLoading`, `const Result: string = ...`).
*   **Method Naming**: Use **PascalCase** for all methods and functions (e.g., `public HandleSubmit()`).
*   **Filenames**: Use **kebab-case** for file names (e.g., `textbox.component.ts`), but keep classes in **PascalCase**.

## 2. TypeScript Standards
*   **Explicit Typing**: ALWAYS explicitly type every single variable, `let`, and `const`. Do not rely on type inference (e.g., `let Index: number = 0;` NOT `let Index = 0;`).
*   **Semicolons**: ALWAYS use semicolons at the end of lines when possible. This applies to TS, SCSS, and interfaces.
*   **Angular Signals**: Use Signal-based APIs for all new or refactored components:
    *   Use `input<T>()` instead of `@Input()`.
    *   Use `model<T>()` for two-way bindings.
    *   Use `computed(() => ...)` for derived state.
    *   Access signals using function calls: `this.MySignal()`.

## 3. Template Standards (HTML)
*   **Control Flow**: Use modern Angular control flow syntax (`@if`, `@for`, `@switch`).
*   **Expression Cleanup**: 
    *   Remove redundant parentheses in expressions (e.g., `[ngClass]="IsLoading"` NOT `[ngClass]="(IsLoading)"`).
    *   Remove unnecessary square brackets for static string inputs (e.g., `Icon="phone"` NOT `[Icon]="'phone'"`).

## 4. Styling Standards (SCSS)
*   **Specificity**: NEVER use `!important`. Resolve styling conflicts through proper selector specificity or by overriding base component variables.
*   **Keyframes**: Place global animations in `shared/styles/animations.scss`.
*   **Theming**: Use the global `InterfaceService` and CSS variables for theme-aware styling.

## 5. Interaction Rules
*   **Competent Developer Assumption**: Assume the user is a highly competent developer. Do NOT "fix" intentional deviations from generic framework conventions (like PascalCase) unless explicitly requested.
*   **Spec Files**: Do NOT modify automatically generated files like `.spec.ts` unless it is for naming consistency that doesn't break functionality.
*   **Documentation**: Preserve all existing comments and docstrings unless they are non-explanatory or specifically flagged for removal.

---
*Last Updated: 2026-05-04*
