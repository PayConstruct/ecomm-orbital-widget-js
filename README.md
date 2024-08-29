# template-orbital-shared-packages

This repository serves as a template for creating shared NPM packages within the orbital team. It utilizes GitHub Actions to automate the development workflow.

## Getting Started

To use this template, follow these steps:

1. **Clone the repository**: Start by cloning the template repository to your local machine using the following command:

```bash
git clone https://github.com/PayConstruct/template-orbital-shared-packages.git
```

2. **Install dependencies**: Navigate to the cloned repository directory and install the necessary dependencies by running:

```bash
yarn 
```

3. **Create a new package**: To create a new package, push your code to the `prd` branch with the desired package name in the `package.json` file.

4. **Develop your package**: Open the `packages` directory and start developing your package. Write your code in the `src` directory and export it using the `index.ts` file.

5. **Test your package**: You can add tests for your package inside the `tests` directory. The tests will be automatically run by GitHub Actions on each push to the `prd` branch.

6. **Publish your package**: Once your code is ready, push it to the `prd` branch. GitHub Actions will automatically build and publish your package to the npm registry.

## Customization

You can customize the template repository to fit your specific needs. Here are a few things you may want to consider:

- Update the `name` field in the `package.json` file to match the desired package name.
