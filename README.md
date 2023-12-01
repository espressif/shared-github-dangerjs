<div align="center">
    <img src="docs/espressif-danger.png" width="800"></a>
    <h1>Espressif Shared GitHub DangerJS</h1>
    <hr>
    <!-- Gitlab Badges -->
    <img alt="Codebase tests (Jest)" src="https://github.com/espressif/shared-github-dangerjs/workflows/Codebase%20tests%20(Jest)/badge.svg" />
    <hr>
</div>

**Welcome to the DangerJS Pull Request linter!**

This is GitHub action that can be used across different Espressif GitHub repositories and helps make sure that contributors Pull Requests (PRs) follow a specific style.

It checks things like:

-   sufficient merge request descriptions
-   meaningful commit messages in conventional commit style
-   size of changes in MR
-   simple branch git history
-   source and target branch

Because DangerJS does this automatically, human reviewers can focus more on code changes and spend their time reviewing PRs more productively.

---

-   [Usage in Your Project](#usage-in-your-project)
-   [DangerJS rules](#dangerjs-rules)
-   [UI output](#ui-output)
-   [Configuration Options](#configuration-options)
-   [Project issues](#project-issues)
-   [Contributing](#contributing)

## Usage in Your Project

To integrate DangerJS, add GitHub workflow `.github/workflows/dangerjs.yml` to your project with this content:

<!-- prettier-ignore -->
```yaml
name: DangerJS Pull Request linter
on:
  pull_request_target:
    types: [opened, edited, reopened, synchronize]

permissions:
  pull-requests: write
  contents: write

jobs:
  pull-request-style-linter:
    runs-on: ubuntu-latest
    steps:
    - name: Check out PR head
      uses: actions/checkout@v4
      with:
        ref: ${{ github.event.pull_request.head.sha }}

    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

-   **GitHub token** This token is automatically obtained from the GitHub project and its specific permissions are set in the yaml workflow file. Avoid adding unnecessarily high permissions to this token, keep it set as in the example above.

---

**🤝 Quick Integration:** If your goal is to add Shared GitHub DangerJS into your project with the default Espressif settings, **then at this point you're all set!**

For custom configurations, refer to the descriptions of individual rules to learn how to tweak them to your needs.

---

## DangerJS rules

-   [Pull Request sufficient Description](docs/rules/rulePrDescription.md)
-   [Pull Request Maximum Commits](docs/rules/ruleNumberOfCommits.md)
-   [Pull Request Commit Messages](docs/rules/ruleCommitMessages.md)
-   [Pull Request Size](docs/rules/rulePrSize.md)
-   [Pull Request Source Branch name](docs/rules/ruleSourceBranchName.md)
-   [Pull Request Target Branch name](docs/rules/ruleTargetBranch.md)

## UI output

-   [BOT comment Output Instructions format](docs/rules/outputInstructions.md)

---

## Configuration Options

If your project has specific needs, Shared GitHub DangerJS can be configured to meet them.

**Here is complete list of configurable parameters:**

| Parameter                                              | CI Variable                            | Type | Default value                                      |
| ------------------------------------------------------ | -------------------------------------- | ---- | -------------------------------------------------- |
| Enable rule PR Description                             | `rule-description`                     | str  | `"true"` (use `"false"` to disable this rule)      |
| Enable rule PR Lint Commit Messages                    | `rule-commit-messages`                 | str  | `"true"` (use `"false"` to disable this rule)      |
| Enable rule PR Size (changed lines)                    | `rule-size-lines`                      | str  | `"true"` (use `"false"` to disable this rule)      |
| Enable rule PR Source branch name                      | `rule-source-branch`                   | str  | `"true"` (use `"false"` to disable this rule)      |
| Enable rule PR Target branch name                      | `rule-target-branch`                   | str  | `"true"` (use `"false"` to disable this rule)      |
| Enable rule PR Too Many Commits                        | `rule-max-commits`                     | str  | `"true"` (use `"false"` to disable this check)     |
| Commit message allowed "Type"s                         | `commit-messages-types`                | str  | `"change,ci,docs,feat,fix,refactor,remove,revert"` |
| Commit message maximum length "Body" line              | `commit-messages-max-body-line-length` | str  | `"100"`                                            |
| Commit message maximum length "Summary"                | `commit-messages-max-summary-length`   | str  | `"72"`                                             |
| Commit message minimum length "Summary"                | `commit-messages-min-summary-length`   | str  | `"20"`                                             |
| Ignore sections of PR description when counting length | `description-ignore-sections`          | str  | `"related,release,breaking"`                       |
| Maximum changed code lines in PR                       | `max-size-lines`                       | str  | `"1000"`                                           |
| Maximum commits in PR (soft limit, throw `info`)       | `max-commits-info`                     | str  | `"2"`                                              |
| Maximum commits in PR (hard limit, throw `warn`)       | `max-commits-warn`                     | str  | `"5"`                                              |
| Minimum length of PR description                       | `description-min-length`               | str  | `"50"`                                             |

These values can be defined in your project `DangerJS Pull Request linter` workflow, for example like this:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        instructions-contributions-file: 'CONTRIBUTING.md'
        instructions-cla-link: 'https://cla-assistant.io/espressif/test'
        instructions-gitlab-mirror: 'true'
        max-commits-info: '3'
        max-commits-warn: '6'
```

See more config options in [DangerJS rules](#dangerjs-rules).

---

## Project issues

If you encounter any issues, feel free to report them in the [project's issues](https://github.com/espressif/shared-github-dangerjs/issues) or create Pull Request with your suggestion.

## Contributing

📘 If you are interested in contributing to this project, see the [project Contributing Guide](CONTRIBUTING.md).

---
