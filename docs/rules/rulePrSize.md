# Pull Request (PR) Size

-   code: `src/rulePRSize.ts`
-   rule failing output is:
    -   `warn`(⚠️ ) - unable read PR, probably empty PR (no code changes pushed)
    -   `message` (📖) - too much lines in PR

Managing the size of an PR is important for an efficient review process. That way we can be sure that the changes are carefully examined and understood.

-   **Size Limit:** The PR should ideally contain changes to fewer than 1000 lines. If the changes exceed this threshold, it's advisable to divide them into smaller PRs.

-   **Why Keep It Small?** Reviewing a very large PR can become difficult and messy quickly. Smaller PRs are easier to handle and understand.

-   **Exceptions:** There may be cases where a large change in one PR is justified, but as a rule of thumb, we generally try to avoid these.

---

## Custom Configuration

Disable this rule:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        rule-size-lines: 'false'
```

---

-   [Back to README](../../README.md)
