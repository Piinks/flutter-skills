---
name: personal-framework-release-blog
description: Drafts the "Framework" section of the Flutter release blog. Use when preparing release announcements to analyze commits, verify PR inclusion (including reverts/relands), and group changes into thematic narratives like Material/Cupertino updates, Web, and Accessibility.
---

# Personal Framework Release Blog

This skill guides the process of drafting the "What's New in the Framework" section for a Flutter release blog post. It focuses on creating a narrative of evolution rather than a simple list of changes.

## Workflow

### 1. Setup and Theme Identification
Compare the previous stable tag to the new release tag.
- **Analyze**: `git log --oneline <old_tag>..<new_tag>`
- **Propose Themes**: Identify 4-6 high-level themes (e.g., Material & Cupertino, Web, Accessibility, Tooling, Foundations).

### 2. Iterative Drafting (Per Theme)
For each approved theme:
1. **Gather PRs**: Find relevant PRs in the commit log.
2. **Critically Analyze**: Use `gh pr view <PR_NUMBER> --json title,body,files` to understand the true impact.
3. **Verify Inclusion**:
   - Check for reverts: `git log --grep "Revert.*#<pr_number>"`
   - If reverted, look for relands and verify they merged before the release cutoff.
   - Verify ancestor status: `git merge-base --is-ancestor <MERGE_COMMIT> <RELEASE_TAG>`
4. **Draft Narrative**: Group related changes into a cohesive story. Use sentence case for headers. Focus on *why* the change matters.

### 3. Special Sections
- **Deprecations and Breaking Changes**: 
  - Consult the official breaking changes list.
  - Search code for new `@Deprecated` tags: `git diff <old_tag>..<new_tag> -- lib/ | grep -E '^\+' | grep '@Deprecated'`
- **Material & Cupertino Decoupling**: Mention the strategic freeze and transition to standalone `material_ui` and `cupertino_ui` packages.

### 4. Finalization
- **Tone and Style**: Ensure the draft matches the professional, engaging, and developer-focused tone of previous release blogs. See [sample-blog.md](references/sample-blog.md) for a reference implementation.
- **Introduction**: Write a compelling intro highlighting the "story" of the release.

- **Summary**: Conclude with the impact on the developer experience.
- **Review**: Ensure consistent tone, present tense, and descriptive links.

## Principles
- **Specific and Explicit**: List affected widgets/APIs directly.
- **Inclusive Language**: Avoid "we/our"; use "developers" or passive voice ("A feature is available").
- **Reference PRs**: Always link to PR numbers (e.g., `[#123456](https://github.com/flutter/flutter/pull/123456)`).
- **Narrative over Lists**: Weave updates into a compelling story.
