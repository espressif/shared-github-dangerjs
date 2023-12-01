# BOT comment Output Instructions format

-   code: `src/outputInstructions.ts`

This section of the documentation describes the functionality and use of a custom script designed to automate additional instructions for Pull Request (PR) authors.

## Always shown

-   **Personalized Greeting:** Greeting the PR author, acknowledging their contribution to the project.

-   **Collapsible Instruction Sections:** Detailed instructions are offered in a collapsible format, making the comment section cleaner and more organized.

    -   The **first section** covers **general instructions about the PR linter DangerJS**, its role, and its limitations.
    -   The **second section** provides information on the **review and merge process**, giving authors a clear understanding of what to expect.

-   **Dynamic Messages:** Messages are dynamically generated based on the PR's content and the type of issues detected by DangerJS.

## Conditionally shown

-   **Contributions Guide Link:** If set, the output instructions contain a link to the project's Contributions Guide, offering guidance on best practices.

-   **Contributor License Agreement (CLA):** If set, A reminder to read and sign the CLA..

-   **GitLab Mirror Project:** For projects that are only GitLab public mirror, the output instructions contain additional instructions about the synchronization and review process between GitHub and the internal Git repository.

---

## Custom Configuration

To disable additional instructions, keeping only the table with Danger issues:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        instructions: 'false'
```

When the GitHub repository serves as a public mirror of an internal GitLab project, this setting extends the Review instructions in the collapsible section:

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        instructions-gitlab-mirror: 'true'
```

If a Contributions Guide file is specified, a reminder with the link is included in the output:

> 📘 Please review the project's [Contributions Guide](../../CONTRIBUTING.md) for key guidelines on code ...

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        instructions-contributions-file: 'CONTRIBUTING.md'
```

If a Contributor License Agreement link is specified, a reminder with the link is included in the output:

> 🖊️ Please also make sure you have **read and signed** the [Contributor License Agreement](https://cla-assistant.io/espressif/project1) for this project.

<!-- prettier-ignore -->
```yaml
    - name: DangerJS pull request linter
      uses: espressif/shared-github-dangerjs@v1
      with:
        instructions-cla-link: 'https://cla-assistant.io/espressif/project1'
```

---

-   [Back to README](../../README.md)
