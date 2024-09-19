# Contribution Guide: Explainers

Welcome to the Explainers section of the Web3 Compass repository! This folder houses educational content on various Web3 topics, presented in an easily digestible format. We appreciate your interest in contributing to this knowledge base. Please follow this guide to ensure your contributions align with our standards and maintain the quality of our educational resources.

* * * * *

### Table of Contents

1.  [Folder Structure](#folder-structure)
2.  [Contributing a New Explainer](#contributing-a-new-explainer)
3.  [Updating an Existing Explainer](#updating-an-existing-explainer)
4.  [Formatting Guidelines](#formatting-guidelines)
5.  [Sample Template](#sample-template)
6.  [Pull Request Process](#pull-request-process)
7.  [Code of Conduct](#code-of-conduct)

* * * * *

### Folder Structure

The `explainers` folder contains subfolders for each explainer topic. Each subfolder is named using kebab-case (e.g., `defi-basics`, `smart-contracts-explained`) and contains:

-   **index.html**: The main content of the explainer in HTML format.
-   **img/** (optional): A directory to store any images used in the explainer. You can also use direct image links in the HTML if you prefer.

* * * * *

### Contributing a New Explainer

If you'd like to add a new explainer:

1.  **Fork the Repository**: Start by forking this repository to your GitHub account.
2.  **Create a New Subfolder**: In the `explainers` folder, create a new subfolder with a descriptive name in kebab-case (e.g., `nft-fundamentals`).
3.  **Create the HTML File**: Inside the new subfolder, create an `index.html` file with your explainer content.
4.  **Add Images (if applicable)**: If you're using images, create an `img/` directory within the subfolder and place your images there. You can also reference images directly using URLs in your HTML.
5.  **Update the Index**: Add an entry for your new explainer to the main `explainers/index.json` file, ensuring it's included in the table of contents.

* * * * *

### Updating an Existing Explainer

To update or improve an existing explainer:

1.  **Find the Relevant Subfolder**: Locate the subfolder containing the explainer you want to update in the `explainers` folder.
2.  **Update the HTML File**: Make the necessary changes to the `index.html` file, ensuring the content is accurate, up-to-date, and well-structured.
3.  **Update Images (if applicable)**: If you are adding, removing, or updating images, make the corresponding changes in the `img/` directory or update the image URLs in your HTML.
4.  **Describe Your Changes**: Provide a clear description of the changes you've made in your pull request, including why the changes were necessary.

* * * * *

### Formatting Guidelines

To ensure consistency and readability:

-   **HTML Structure**: Use proper HTML5 tags and structure to organize your content.
-   **Accessibility**: Make sure your explainer is accessible to all users, including those with disabilities.
-   **Clarity**: Use clear and concise language, avoiding jargon whenever possible.
-   **Images**: If using images, ensure they are relevant, high-quality, and properly attributed (if necessary).
-   **Code Examples**: If including code examples, use appropriate syntax highlighting and formatting.

* * * * *

### Sample Template

Here's a sample template you can adapt for your explainer's `index.html` file:

```html
<h2>Explainer Title</h2>

<p>A concise introduction to the topic.</p>

<h3>Section Heading 1</h3>

<p>Explain a key concept or idea.</p>

<img src="img/relevant-image.jpg" alt="Descriptive alt text">

<h3>Section Heading 2</h3>

<p>Elaborate on another aspect of the topic.</p>

<ul>
    <li>Key point 1</li>
    <li>Key point 2</li>
</ul>

<p>Additional resources or links for further learning.</p>`
```


* * * * *

### Pull Request Process

1.  **Create a Pull Request**: Once you've made your changes, create a pull request (PR) from your fork to this repository's main branch.
2.  **Provide a Description**: In your PR description, include a summary of the changes, along with any relevant context or reasoning.
3.  **Review and Feedback**: A maintainer will review your submission and may request changes or provide feedback.
4.  **Approval and Merge**: Once your PR is approved, it will be merged into the repository.

* * * * *

### Code of Conduct

We are committed to maintaining a positive and inclusive environment for our contributors. Please review our Code of Conduct before contributing to ensure your behavior aligns with our community guidelines.

* * * * *
