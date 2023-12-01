# Contributing Guide

By following these guidelines, you'll contribute effectively to our project, ensuring code quality, maintainability, and seamless collaboration.

If you want to contribute to _Shared GitHub DangerJS_ project, here's what you need to know:

-   [Contributing Guide](#contributing-guide)
    -   [Code and Testing](#code-and-testing)
    -   [Guidelines and Best Practices](#guidelines-and-best-practices)
    -   [Documentation and Maintenance](#documentation-and-maintenance)
    -   [Tools and Extensions](#tools-and-extensions)
    -   [Local Testing](#local-testing)

## Code and Testing

-   **Code Style and Structure:**

    -   **Pre-Commit Hooks:** Install pre-commit hooks in this repository using the `pre-commit install` command.

    -   **Readable Code Structure:** Structure your code in a readable manner. The main logic should be in the default rule function, with implementation details in helper functions. Avoid nested `if` statements and unnecessary `else` statements to maintain code clarity and simplicity.

    -   **Remove Debug Statements:** Remove any debug statements (e.g., `console.log`) from your rules.

    -   **Handling Rule Exit Points:** All exit points from the rule must be handled by `recordRuleExitStatus` function. Expected outputs are `Passed`, `Failed`, `Passed (with suggestions)`, or `Skipped (<optional text>)`.

    -   **Environment Variables:** For any new rule, add all necessary environment variables to the `action.yml` file's variables section and `src/configParameters.ts`. Ensure these are properly described in the documentation.

    -   **Rule Output Formatting:** If your rule produces output that is formatted in a more complicated way (e.g., nesting, output from loops), test the final output in a test project. Include a thumbnail of its appearance in your pull request (PR) for clearer understanding and review.

-   **Code Formatting and Linting:**

    -   **Prettier and ESLint:** This project uses `Prettier` for code formatting and `ESLint` for linting. These checks will run as part of the pre-commit hooks and the CI pipeline.

    -   **IDE Extensions:** It is recommended for developers to install `Prettier` and `ESLint` extensions in your IDE (typically VS Code) to ensure code consistency.

-   **Creating New DangerJS rules:**

    -   When creating a new DangerJS rule, ensure it includes thorough tests. Reference existing rules for guidance.

    -   Consider whether the new rule is universally applicable across all Espressif projects.

    -   If it's specific to a single project or a small group of projects, the rule should be disabled by default.

-   **Updating Existing Danger Rules:** When updating an existing Danger rule, ensure new features or behavioral changes are covered by additional tests.

-   **Automated Tests:** Each Danger rule (e.g. `src/rulePrSize.ts`) must have an automated test in test directory (e.g. `tests/rulePrSize.test.ts`). We aim for full test coverage, so **partial tests will not be accepted**. The tests should cover all typical usage scenarios as well as edge cases to ensure robustness.

-   **Testing Tool:** We use the npm module `jest` for testing. It is recommended to run `npm test` frequently during development to ensure that all aspects of your code are functioning as expected.

## Guidelines and Best Practices

-   **No Breaking Changes:** Since this project is used as shared CI across many projects, **breaking changes to existing code are strictly prohibited**.

-   **Release Tags:** Though the project uses release tags, most external projects that import this CI reference the `v1` branch.

## Documentation and Maintenance

-   **Changelog:** Update the `CHANGELOG.md` when making changes to the project.

-   **Documentation:** Regularly check and update the documentation to keep it current.

    -   **Rule Descriptions:** Each Danger rule should have a description in the documentation. This should include what the rule does, its usefulness, any configurable parameters, and examples of both good and bad outputs.
    -   **PR Descriptions and Documentation:** When contributing, describe all changes or new features in the PR (Pull Request) description as well as in the documentation.
    -   **Updates to Existing Rules:** When making changes to an existing rule, review the existing documentation to ensure it is up-to-date with the changes.

## Tools and Extensions

-   **Pre-Commit Hooks:** Installing pre-commit (`pip install pre-commit`) and the project's pre-commit hooks (`pre-commit install`) is mandatory. Unformatted code will be not accepted.
-   **Recommended VS Code Extensions:** These extensions can help your development of this project:
    -   `streetsidesoftware.code-spell-checker`
    -   `kisstkondoros.vscode-codemetrics`
    -   `Orta.vscode-jest`
    -   `esbenp.prettier-vscode`
    -   `rvest.vs-code-prettier-eslint`

## Local Testing

Avoid waiting for the GitLab pipeline by testing DangerJS rules locally:

-   **Environment Setup:** Rename `.env.sample` to `.env` and add the GitLab token to `DANGER_GITLAB_API_TOKEN`. Source the env to export all variables to your shell:

    ```sh
    source .env
    ```

-   **Installing Dependencies:** Run `npm install` on your local machine to install project dependencies, including dev dependencies such as type checkers and the test framework.

-   **Running DangerJS Locally:** Use command to run DangerJS in your local shell, just like in the CI pipeline:

    ```sh
    npx danger --dangerfile=src/dangerfile.ts pr <url_of_pull_request>
    ```

-   **Simplifying Local Testing:**

    -   **Temporary Rule Isolation:** For faster development, you can temporarily comment out other Danger rules in `dangerfile.ts` and retain only the rule you are working on.

    -   **Restoring Dangerfile:** Don’t forget to restore (uncomment) the temporarily suppressed lines in `dangerfile.ts` before pushing your changes.

    -   **Running Specific Tests:** To run a specific test file only, use the command:

        ```sh
        npx jest tests/<test_file_name>.test.ts
        ```

        ... for example:

        ```sh
        npx jest tests/rulePrDescription.test.ts
        ```

    -   **Monitoring Output:** Pay attention to the terminal output during local testing. This unformatted Markdown output is the equivalent of the feedback message provided by the Danger bot in the actual project PR.

---

👏**Thank you for your contributions.**
