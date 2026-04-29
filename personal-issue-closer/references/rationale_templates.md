# Common Closing Rationales

When investigating old issues in the Flutter repository, look for these common reasons they may be eligible for closing. Use these as templates for your closing comments.

## 1. Superseded by Newer Testing Packages
Flutter's testing ecosystem has evolved significantly. Many old requests for testing features in `flutter_driver` or `flutter_test` are now solved by `integration_test` or more modern APIs.
- **Example**: Requests for complex finders in `flutter_driver`.
- **Rationale**: Recommend using `integration_test` and the `WidgetTester` API.

## 2. Documentation and Lints
Many older issues are requests for better documentation or "gotcha" warnings that have since been addressed by:
- Improved API docs.
- The `flutter_lints` package (e.g., `use_build_context_synchronously`).
- New language features (e.g., sound null safety, records).

## 3. Tooling Improvements (DevTools)
Issues requesting performance monitoring or debugging aids are often now better served by the Flutter DevTools suite.
- **Rationale**: Point the user toward the specific DevTools view (Performance, Network, Inspector) that fulfills the need.

## 4. Material 3 / Modern Standards
Requests for specific visual behaviors in Material 2 widgets may be obsolete if the framework has moved to Material 3 and the new components handle the behavior differently or more correctly.

## 5. Stale Proposals
Proposals from 5+ years ago with no recent activity or community "upvotes" (thumbs up) may be closed if they no longer align with the framework's architectural direction.

## 6. Resolved by Modern Widget Updates
Older requests for basic features in fundamental widgets (like `Form`, `TextField`, or `AppBar`) have often been resolved by newer API additions.
- **Example**: `onChanged` added to `Form`, `toolbarHeight` added to `AppBar`.
- **Rationale**: Point to the specific property or widget that now fulfills the requirement.

## 7. Obsolete Legacy Widgets
Issues concerning widgets that have been deprecated or replaced (e.g., the legacy `Input` widget) should be closed as the framework has moved on to better abstractions like `TextField`.


---
**Reminder**: Every closing comment MUST end with:
"If there is more work to do here, please let us know by filing a new issue with up to date information. Thanks!"

