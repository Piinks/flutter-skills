# Flutter Code Review Checklist

Use this checklist to ensure high-quality reviews for the Flutter repository.

## 1. Correctness & Logic
- Does the code do what it claims to do?
- Are there any edge cases not handled?
- Is the error handling appropriate?

## 2. Breaking Changes
- Does this change any public API?
- Does it change default behavior that users rely on?
- If yes, has it been flagged? Should it follow the [breaking change policy](https://github.com/flutter/flutter/blob/main/docs/contributing/Tree-hygiene.md#handling-breaking-changes)?

## 3. Performance
- Are we creating unnecessary objects in `build` methods or layout passes (e.g., `Tween` objects)?
- Are we using efficient interpolation (e.g., `ui.lerpDouble`) instead of heavier animations where appropriate?
- Are there any potential memory leaks?

## 4. Documentation
- Are new public members documented with triple-slash (`///`) comments?
- Is the documentation clear, concise, and grammatically correct?
- Do examples follow current best practices?

## 5. Testing
- Are there new tests covering the change?
- Do the tests cover both the "happy path" and edge cases?
- Are there regression tests for any bugs fixed?
- **CRITICAL**: If an issue is found, write a reproduction test to confirm it.

## 6. Style & Conventions
- Does the code follow the [Flutter Style Guide](https://github.com/flutter/flutter/blob/main/docs/contributing/Style-guide-for-Flutter-repo.md)?
- Are names descriptive and idiomatic?
- Is the formatting consistent with the rest of the file?
