# Number of Commits in Pull Request (PR)

-   code: `src/ruleNumberOfCommits.ts`
-   rule failing output is:
    -   `message` (📖) - if exceeded soft limit; default 2 commits
    -   `warn`(⚠️ ) - if exceeded hard limit; default 5 commits; catching mostly forgotten squash after development

When creating a Pull Request (PR), it's usually best to keep the number of commits to a minimum. Here's a guideline:

-   **Aim for Fewer Commits:** Try to keep the number of commits in one PR low. Generally, more than 2 commits within one PR is not recommended.

-   **When to Split Commits:** Sometimes, splitting your changes into more commits can be helpful. But balance this with keeping the git branch history clean and simple.

-   **Why This Matters:** Having fewer commits helps make the history of changes more understandable. It keeps things organized, making it easier for everyone to follow along.

---

## Custom Configuration

Disable this rule:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        rule-max-commits: 'false'
```

Set **soft limit** custom allowed number of commits in PR for 4 (if exceeded, throw `message` (📖)):

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        max-commits-info: '4'
```

Set **hard limit** of custom allowed number of commits in PR for 7 (if exceeded, throw `warn`(⚠️ )) :

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        max-commits-warn: '7'
```

Set custom **soft limit** 4 allowed commits (if exceeded, throw `message` (📖)) **and** custom **hard limit** 7 allowed commits (if exceeded, throw `warn`(⚠️ )) :

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        max-commits-info: '4'
        max-commits-warn: '7'
```

---

-   [Back to README](../../README.md)
