# Commit Messages in a Pull Request (PR)

-   code: `src/ruleCommitMessages.ts`
-   rule failing output is: `warn` (⚠️ )

Following a consistent commit message style helps in keeping the project well-organized and makes the collaboration process smoother.

-   **What Are We Checking?** We're linting all commit messages in the PR to align with Espressif's conventional commit style, using an external npm module called `commitlint`.

-   **If There's an Issue:** If any commit messages don't meet the standards, you'll receive specific instructions on what's wrong and how to fix it.

-   **Strong Recommendation:** Add the [Conventional Precommit Linter](https://github.com/espressif/conventional-precommit-linter) tool to your project as a pre-commit hook. It alerts users about incorrect commit messages when committing, so they don't have to wait for the DangerJS check. The DangerJS check then becomes a fallback for those who don't use pre-commit.

-   **Consistency Between Checks:** Both the DangerJS check and Conventional Precommit Linter follow the same default rules.

---

## Custom Configuration

**❕ Important:** If your project uses a custom configuration for this rule, consider applying the same settings to the [Conventional Precommit Linter](https://github.com/espressif/conventional-precommit-linter) if it's part of your project's pre-commit hooks. This ensures consistency, as both Danger and the pre-commit hook will follow the same logic.

Disable this rule:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        rule-commit-messages: 'false'
```

Add `style` to allowed types of commit message:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        commit-messages-types: 'change,ci,docs,feat,fix,refactor,remove,revert,style'
```

Set allowed minimum summary length between 35 and 65 characters:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        commit-messages-min-summary-length: '35'
        commit-messages-max-summary-length: '60'
```

Set maximum body length to 80 characters:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        commit-messages-max-body-line-length: '80'
```

---

-   [Back to README](../../README.md)
