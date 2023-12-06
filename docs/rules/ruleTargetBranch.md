# Pull Request (PR) Target Branch

-   code: `src/ruleTargetBranch.ts`
-   rule failing output is: `warn` (⚠️ )

Selecting the appropriate target branch for a pull request (PR) is important for a seamless integration process and maintaining an organized Git history. It ensures that changes are merged into the correct branch, avoiding potential conflicts or errors.

-   **Default Branch as Target:** The target branch for the pull request **must be the default branch** of the project. This ensures a consistent flow and minimizes the risk of merging changes into the wrong branch.

-   **Why This Rule?** Using the default branch as the target for PRs maintains uniformity and order in our repository. It simplifies the process for contributors and maintainers alike, making it easier to manage the project's development.

-   **Exceptions:** In certain situations, targeting a branch other than the default may be necessary. These cases should be rare and well-justified to avoid confusion and maintain the integrity of the project's codebase.

---

## Custom Configuration

To disable this rule:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        rule-target-branch: 'false'
```

---

-   [Back to README](../../README.md)
