# Pull Request (PR) Source Branch

-   code: `src/ruleSourceBranchName.ts`
-   rule failing output is: `warn` (⚠️ )

Properly naming the source branch is important for maintaining a clean and manageable Git history, as well as for avoiding issues with Git synchronization and case-insensitive file systems (such as macOS).

-   **Slash Limit:** The source branch name should contain no more than one slash (`/`). Multiple slashes can lead to complications, especially during Git synchronization.

-   **Case Sensitivity:** The source branch name should be entirely in lowercase. Using uppercase letters can cause issues on case-insensitive file systems, making it difficult to switch branches or causing errors during cloning.

-   **Why These Rules?** Adhering to these naming conventions ensures that our Git operations run smoothly across different operating systems and minimizes the risk of sync issues. It also makes it easier to understand the branch's purpose at a glance.

-   **Exceptions:** While these are general guidelines, there may be exceptional cases where deviations are acceptable. However, it's advisable to stick to these rules for the sake of consistency and to avoid potential issues.

---

## Custom Configuration

Disable this rule:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        rule-source-branch: 'false'
```

---

-   [Back to README](../../README.md)
